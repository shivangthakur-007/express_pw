const express = require('express')
const app=express();

const authrouter=require('./router/authrouter.js')
const connectdb=require('./config/db.config.js')
const cookieParser = require('cookie-parser');
const cors=require('cors')


app.use(express.json()); //ye btayega ki parse hoke ayega
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))
app.use(cookieParser());
app.use('/api/auth', authrouter)

connectdb();
app.use('/',(req, res)=>{
    res.status(200).json({
        data :' JWT auth-server Updated'
    })
})

module.exports=app;