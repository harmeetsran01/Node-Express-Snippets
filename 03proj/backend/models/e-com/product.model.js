import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description:{
    type:String,
    required:true
    },
    productImage:{
        type:String       
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    
},{
    timestamps:true
})

export const Product = mongoose.model('Product',productSchema)