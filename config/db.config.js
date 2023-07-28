const mongoose=require('mongoose')
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://thakurshivang579:57575751@cluster0.aj8hrur.mongodb.net/'

const databaseconnect= async()=>{
    mongoose.connect(MONGO_URI)
    .then((conn)=>console.log(`connected to DB: ${conn.connection.host}`))
    .catch((err)=>console.log(err.message))
}

module.exports=databaseconnect;
