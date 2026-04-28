import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dns from "dns"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDB = async () => {
    try {
        console.log(`Connection Initialized: ${process.env.MONGO_URI}`)
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 15000 })
        console.log(`Connected to MongoDB !! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch (e) {
        console.error("Error: ", e)
        process.exit(1)
        throw e
    }
}

export default connectDB