import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    content:{
        type:String,
        require:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },  
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    subTodos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Subtodo'
        }
    ]
    // Arrays of subtodos
},{
    timestamps:true
})

export const Todo = mongoose.model('Todo', todoSchema)