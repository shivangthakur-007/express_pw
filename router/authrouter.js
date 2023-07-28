const express =require('express');
const { signup, signin, user, logout } = require('../controller/authcontroller');
const authrouter=express.Router();
const jwtauth=require('../middleware/middleware')


authrouter.post('/signup', signup)
authrouter.post('/signin', signin)


authrouter.get('/user', jwtauth, user)
authrouter.get('/logout', jwtauth, logout)

module.exports=authrouter;