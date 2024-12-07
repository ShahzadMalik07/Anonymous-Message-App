import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import { Message } from "@/Model/User";

export async function POST(request: Request) {
    await DbConnect()
    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })

        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })

        }

        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "message sent successfully"
        }, { status: 200 })


    } catch (error) {

        console.log("error sending messages", error)
        return Response.json({
            success: false,
            message: "Internal error"
        }, { status: 500 })

    }
}