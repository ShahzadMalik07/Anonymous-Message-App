import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import Error from "next/error";




export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await DbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username }
                        ]
                    })
                    if (!user) {
                        throw new Error('No User found with this email' as any)

                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account" as any)

                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user

                        
                    }else{
                        throw new Error("Incorrect password" as any)

                    }

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        })
    ],
    pages:{
        signIn: "/signin"
    },
    callbacks:{
        async jwt({token,user}){
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
                
            }
            return token

        },
        async session({session,token}){
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username
                
            }
            return session

        }
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}