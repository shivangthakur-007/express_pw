const mongoose=require('mongoose')
const {Schema}=mongoose;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const userschema = new Schema({
    name:{
        type: String,
        required: [true, 'User name is required'],
        minlength:[5, 'name must be at least 5 char'],
        maxlength:[50, 'name must be at less than 50 char'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        unique:[true, 'already existed']
    },
    password: {
        type : String,
        select: false,
    },
    forgetpasswordtoken: {
        type: String,
    },
    forpasswordexpirydate: {
        type: Date,
    },
    
},{
    timestamps: true
    });

    userschema.pre('save', async function (next){
        // if password is not modified than do not hash it.
        if(!this.isModified('password')) return next();
        this.password=await bcrypt.hash(this.password, 10);
        return next();
    })

userschema.methods = {
    jwttoken() {
        return JWT.sign(
            {id: this._id, email: this.email},
            process.env.SECRET,
            {expiresIn: '24h'}
        );
    }
}

const usermodel=mongoose.model('user', userschema)

module.exports=usermodel