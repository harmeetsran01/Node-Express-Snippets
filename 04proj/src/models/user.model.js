import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//jwt is bear token, processed token used to identify and provide data to token
//access token is short lived, refresh token is long lived, NOT STORED IN DB
//access token is used to access the protected routes
//refresh token is used to generate new access token, STORED IN DB
//token stored in env

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        trim: true
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is Required'],
        trim: true,
        index: true
    },
    avatar: {
        type: String, // Cloudinary URL
        required: true,
        trim: true
    },
    avatarPublicId: {
        type: String,
        required: true
    },
    coverImage: {
        type: String, // Cloudinary URL
        required: true,
        trim: true
    },
    coverImagePublicId: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

// Pre hook provided by mongoose, read docs for more : which is used to done some work before the operation
// here we are using it to hash the password before saving
// pre("save",) : save is operation which is done, again read docs for more
// ()=>{} is not used as this reference will not be used
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

// Instance method : used to perform some operation on the instance of the model
// here we are using it to compare the password
//schema.methods.methodName = function(){
// do something
//}
userSchema.methods.isPasswordCorrect = async function (password) {
    //here the given password  coming from the form is raw, then bcrypt compare compares the password with hash one by hashing the raw password
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = async function () {
    // below line is used to create token, passing data/obj is called PAYLOAD
    //jwt.sign(payload,secretKey,options)
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }, process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    // refresh token is not change very often, therefore no need to enter much info
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)