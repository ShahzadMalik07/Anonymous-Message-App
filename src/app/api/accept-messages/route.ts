import { getServerSession } from "next-auth";
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await DbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })

    }
    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status accepting messages"
            }, { status: 401 })

        }

        return Response.json({
            success: true,
            message: "messages acceptance status update sucessfully ",
            updatedUser
        }, { status: 200 })


    } catch (error) {
        console.log("failed to update user status accepting messages ")
        return Response.json({
            success: false,
            message: "failed to update user status accepting messages"
        })

    }

}

export async function GET(request: Request) {
    await DbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })

    }
    const userId = user?._id

    try {

        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })

        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })

    } catch (error) {
        console.log("failed to update user status accepting messages ")
        return Response.json({
            success: false,
            message: "error in getting accepting messages status"
        },{status:500})

    }
}

