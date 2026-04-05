import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// })

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        require:[true,'Password is required']
    }
},
{timestamps:true}
)

export const User = mongoose.model('User', userSchema)
// User is name, and userSchema is schema, const User is initialize as User will be used in 
// other modules also
// for mongodb inner working User will be converted to lowercase and plural:
// User -> users
// Todo -> todos
// SubTodo -> subtodos

