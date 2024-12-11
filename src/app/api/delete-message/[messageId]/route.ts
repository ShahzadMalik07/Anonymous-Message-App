import { useParams } from "next/navigation";
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request,  context: { params: { messageId: string } }) {
     const { params } = context;
     const messageId = params.messageId;
     await DbConnect()

     const session = await getServerSession(authOptions)
     const user: User = session?.user as User
     if (!session || !session.user) {
          return Response.json({
               success: false,
               message: "Not Authenticated"
          }, { status: 401 })
     }
     try {
          const updatedResult = await UserModel.updateOne(
               { _id: user._id },
               { $pull: { message: { _id: messageId } } }
          )
          if (updatedResult.modifiedCount === 0) {
               return Response.json({
                    success: false,
                    message: "Message not found or alreday delete"
               }, { status: 404 })


          }
          return Response.json({
               success: true,
               message: "Message Deleted Successfully"
          }, { status: 200 })
     } catch (error) {
          console.log("error deleting")
          return Response.json({
               success: false,
               message: "Error in Deleting "
          }, { status: 500})
     }
}