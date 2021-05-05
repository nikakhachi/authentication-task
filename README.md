# Authentication Task

An Authentication application built with MERN stack (MongoDB, Express, React, Node);

After authentication token will be stored in cookies and user will be redirected  to the Welcoming Page.

## Written in TypeScript

### Back-end
Express for routing

WebSockets for counting registrated users and informing online users about registration of 4rd user

Data is stored in MongoDB

BcryptJS for hashing passwords

JsonWebToken for generating tokens

cookie-parser for using cookies

express-session for securing cookies

### Front-end

React-Router for routing 

Redux as a state managment (for popups use)

axios and RxJS for fetching data

Private route ('/') accessible only with valid token

Private route contains Welcoming Page.

Formik & Yup for form and form validation

Socket.io-client for bidirectional communication 

## How To Install

Clone the repoitory.
```
$ git clone https://github.com/xnick7x/authentication-task.git
```
Move into the cloned folder
```
$ cd authentication-task
```
Install dependencies
```
$ npm run install-modules
```
Create env file in root directory and add following variables : PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES, NODE_ENV, SESSION_SECRET, SESSION_NAME
```
$ touch config.env
```
To start the front-end as well as the server run this command
```
$ npm run dev
```
#### npm run client : 
for running only front-end

#### npm run server : 
for running only back-end
