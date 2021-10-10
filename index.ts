import * as Hapi from '@hapi/hapi';
import { Server, ResponseToolkit, Request} from 'hapi';
import {v4 as uuidv4} from 'uuid';


const init = async () => {
    const server: Server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });



    class User {
        id: string;
        username: string;

        constructor(username: string) {
            this.id = uuidv4();
            this.username = username;
        }
        viewsCount: number = 0;
        followings: User[] = [];

        public list() {
            return {
                id: this.id,
                username: this.username,
                viewsCount: this.viewsCount,
            };
        }
        public view() {
            this.viewsCount++;
            return this;
        }
        public follow(user: User) {
            this.followings.push(user);
            return this;
        }
        public unfollow(id: string) {
            console.log(id);
            console.log(this.followings);
            this.followings = this.followings.filter(follow => follow.id != id);
            console.log(this.followings);
            return this;
        }
    }

    let allUsers: User[] = [
        new User('Username1'),
        new User('Username2'),
    ];


    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {

            return `
            <h3>Get All</h3>
            <a href="${server.info.uri}/users"><p>GET ${server.info.uri}/users </p></a>
            <hr>
            <h3>Get One</h3>
            <a href="${server.info.uri}/users/${allUsers[0].id}"><p>GET ${server.info.uri}/users/${allUsers[0].id} </p></a>
            <hr>
            <h3>Create</h3>
            <a href="${server.info.uri}/createUser"><p>POST ${server.info.uri}/users</p>
            <p style="padding-left: 50px;">{ username: Username3 }</p>
            </a>
            <hr>
            <h3>View</h3>
            <a href="${server.info.uri}/updateUserView/${allUsers[0].id}"><p>PUT ${server.info.uri}/users/${allUsers[0].id}</p>
            <p style="padding-left: 50px;">{ action: view }</p>
            </a>
            <hr>
            <h3>Follow</h3>
            <a href="${server.info.uri}/updateUserFollow/${allUsers[0].id}"><p>PUT ${server.info.uri}/users/${allUsers[0].id}</p>
            <p style="padding-left: 50px;">{ action: follow, followId: ${allUsers[1].id} }</p>
            </a>
            <hr>
            <h3>Unfollow</h3>
            <a href="${server.info.uri}/updateUserUnfollow/${allUsers[0].id}"><p>PUT ${server.info.uri}/users/${allUsers[0].id}</p>
            <p style="padding-left: 50px;">{ action: unfollow, followId: ${allUsers[1].id} }</p>
            </a>
            `;
        }
    })
    server.route({
        method: 'GET',
        path: '/createUser',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const newUser: User = new User('Username3');
            allUsers.push(newUser);
            return newUser;
        }
    })
    server.route({
        method: 'GET',
        path: '/updateUserView/{id}',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const id: string = request.params.id;
            const selectUser: User = allUsers.find(user => user.id === id);
            
            return selectUser.view();
        }
    })
    server.route({
        method: 'GET',
        path: '/updateUserFollow/{id}',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const id: string = request.params.id;
            const selectUser: User = allUsers.find(user => user.id === id);
            const followUser: User = allUsers[1];
            const existingfollow: User = selectUser.followings.find(user => user.id === followUser.id);

            if (existingfollow) {
                return `User with ID: ${id} is already following User with ID: ${followUser.id}.`
            } else {
                return selectUser.follow(followUser);
            }
        }
    })
    server.route({
        method: 'GET',
        path: '/updateUserUnfollow/{id}',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const id: string = request.params.id;
            const selectUser: User = allUsers.find(user => user.id === id);
            const followUser: User = allUsers[1];
            const existingfollow: User = selectUser.followings.find(user => user.id === followUser.id);

            if (!existingfollow) {
                return `User with ID: ${id} is not following User with ID: ${followUser.id}.`
            } else {
                return selectUser.unfollow(followUser.id);
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/users',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            type userRes = {
                username: string;
            }
            const allUsersRes: userRes[] = allUsers.map(user => {
                return user.list();
            })
            return allUsersRes;
        }
    })

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const id: string = request.params.id;
            const selectUser: User = allUsers.find(user => user.id === id);
            if (selectUser) {
                return selectUser;
            } else {
                return `User with ID: ${id} does not exist.`
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/users',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            type userInput = {
                username: string;
            }

            const input: userInput = request.payload as userInput;
            const newUser: User = new User(input.username);
            if(!input.username) {
                return `Username is required.`
            } else {
                allUsers.push(newUser);
                return newUser;
            }

        }
    })

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            const id: string = request.params.id;
            type payload = {
                action: string;
                followId?: string;
            }

            const input: payload = request.payload as payload;
            const selectUser: User = allUsers.find(user => user.id === id);
            if(!selectUser) {
                return `User with ID: ${id} does not exist.`
            }

            if (input.action == 'view') {
                return selectUser.view();
            } else if (input.action == 'follow') {
                const followUser: User = allUsers.find(user => user.id === input.followId);
                const existingfollow: User = selectUser.followings.find(user => user.id === input.followId);

                if(!input.followId) {
                    return `followId is required for action follow.`
                } else if (!followUser){
                    return `Unable to follow User with ID: ${followUser.id} because it does not exist.`
                } else if (existingfollow) {
                    return `User with ID: ${id} is already following User with ID: ${followUser.id}.`
                } else {
                    return selectUser.follow(followUser);
                }

            } else if (input.action == 'unfollow') {
                const followUser: User = allUsers.find(user => user.id === input.followId)
                const existingfollow: User = selectUser.followings.find(user => user.id === input.followId)

                if(!input.followId) {
                    return `followId is required for action unfollow.`
                } else if (!followUser){
                    return `Unable to unfollow User with ID: ${id} because it does not exist.`
                }  else if (!existingfollow) {
                    return `User with ID: ${id} is not following User with ID: ${followUser.id}.`
                } else {
                    return selectUser.unfollow(followUser.id);
                }
            } else {
                return `The following actions are required: view, follow, unfollow`;
            }
        }
    })

    await server.start().then();
    console.log(`Server running on ${server.info.uri}`)
};


process.on('unhandledRejection', (err) => {
    return err;
})
init();