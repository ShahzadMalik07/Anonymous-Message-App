import UserModel from "@/Model/User";
import DbConnect from "@/lib/DbConnect";

export async function POST(request: Request) {
    await DbConnect()
    try {
        const { username, code } = await request.json()
        const deCodedUsername = decodeURIComponent(username)
        console.log(deCodedUsername)

        const user = await UserModel.findOne({ username: deCodedUsername })
        if (!user) {
          return  Response.json({
                succsess: false,
                message: "user not found"
            })
        }

        const isCodeValid = user?.verifyCode === code
        // "@ts-expect-error"
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()


        if (isCodeValid && isCodeNotExpired) {
            // "@ts-expect-error"
            user.isVerified = true
            await user?.save()

        return    Response.json({
                succsess: true,
                message: "Account Verified successfully"
            }, { status: 200 })

        } else if (!isCodeNotExpired) {
          return  Response.json({
                succsess: false,
                message: "Code has expired, please signup again"
            }, { status: 400 })

        } else {
          return  Response.json({
                succsess: false,
                message: "Incorrect verification code"
            }, { status: 400 })
        }



    } catch (error) {
        
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}