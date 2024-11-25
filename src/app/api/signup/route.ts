import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await DbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, {
                status: 400
            })

        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User Already exist with thiss email"
                }, { status: 500 })

            } else {
                const hashedPassword = await bcrypt.hash(password, 100)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newuser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })
            await newuser.save()
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode

        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,

            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully. please verify your Email",

        }, { status: 200 })



    } catch (error) {
        console.log("error registring user", error)
        return Response.json({
            success: false,
            message: "error Registering user"
        }, {
            status: 500
        })
    }

}