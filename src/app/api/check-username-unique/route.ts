import DbConnect from "@/lib/DbConnect";
import zod from "zod"
import UserModel from "@/Model/User";
import { usernameValidation } from "@/Schemas/signupSchema"

const usernameQuerySchema = zod.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await DbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = { username: searchParams.get("username") }


        const result = usernameQuerySchema.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(",") : "invalid query param"
            }, { status: 400 })
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Sorry, Username already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message:"Username is available"
        },{status:200}) 


    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })

    }

}