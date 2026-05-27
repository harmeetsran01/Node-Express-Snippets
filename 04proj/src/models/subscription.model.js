import mongoose,{Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //One who is subscribing, who click subscribe button, /following person/channel
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId, //One to whom 'subscriber' is subscribing,  The user/channel being subscribed to,/follower person/channel
        ref:"User"
    }
},
    {timestamps:true}
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema)