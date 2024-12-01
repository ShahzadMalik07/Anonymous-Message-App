import { getServerSession } from "next-auth";
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:Request){
    await DbConnect()
   const session = await getServerSession(authOptions)
   const user = session?.user

}