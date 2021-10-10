Hapi Typescript Server

To Run Server:

npm install
node run start

All data uses ephermal storage.

The Following routes are use:

<h3>Get All</h3>
<a href="localhost:3000/users"><p>GET localhost:3000/users </p></a>
<hr>
<h3>Get One</h3>
<a href="localhost:3000/users/{id}"><p>GET localhost:3000/users/{id} </p></a>
<hr>
<h3>Create</h3>
<a href="localhost:3000/createUser"><p>POST localhost:3000/users</p>
<p style="padding-left: 50px;">{ username: Username3 }</p>
</a>
<hr>
<h3>View</h3>
<a href="localhost:3000/updateUserView/{id}"><p>PUT localhost:3000/users/{id}</p>
<p style="padding-left: 50px;">{ action: view }</p>
</a>
<hr>
<h3>Follow</h3>
<a href="localhost:3000/updateUserFollow/{id}"><p>PUT localhost:3000/users/{id}</p>
<p style="padding-left: 50px;">{ action: follow, followId: {id} }</p>
</a>
<hr>
<h3>Unfollow</h3>
<a href="localhost:3000/updateUserUnfollow/{id}"><p>PUT localhost:3000/users/{id}</p>
<p style="padding-left: 50px;">{ action: unfollow, followId: {id} }</p>
</a>