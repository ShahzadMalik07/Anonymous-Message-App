import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function DbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("already connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "")

        connection.isConnected = db.connections[0].readyState
        console.log("db connected")

    } catch (error) {
        console.log("db failed",error)
        process.exit(1)

    }
}

export default DbConnect