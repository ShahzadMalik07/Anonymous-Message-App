import { getServerSession } from "next-auth";
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET() {
    await DbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })

    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', message: { $push: '$message' } } },
        ]).exec();
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })

        }
        return Response.json({
            succsess: true,
            messages: user[0].message
        }, { status: 200 })


    } catch (error) {
        console.log("unexpected error", error)
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 500 })
    }

}