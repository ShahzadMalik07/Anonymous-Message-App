import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await DbConnect()
    try {
       const {username, email, password} = await request.json()
       const existingUserByUsername = await UserModel.findOne({
        username,
        isVerified:true
       })
       if (existingUserByUsername) {
        return Response.json({
            success:false,
            message:"Username already taken"
        },{
            status:400
        })
        
       }

    } catch (error) {
        console.log("error registring user", error)
        return Response.json({
            success:false,
            message:"error Registering user"
        },{
            status:500
        })
    }

}