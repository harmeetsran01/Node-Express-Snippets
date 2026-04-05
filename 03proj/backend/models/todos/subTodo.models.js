import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    parentTodo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Todo'
    }
},
    {timestamp:true}
)

export const Subtodo = mongoose.model('Subtodo',subTodoSchema)