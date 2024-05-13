import mongoose from "mongoose"

export const connectToDb = async () => {
    const connection = {
        isConnected: 0
    }
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MongoDB URI is not defined");
        }
        const db = await mongoose.connect(process.env.MONGODB_URI)
        connection.isConnected = db.connections[0].readyState
        connection.isConnected ? console.log('connected') : console.log('not connected')
    } catch (err:any) {
        console.log('not connected')
        throw new Error(err.toString())
    }
}

