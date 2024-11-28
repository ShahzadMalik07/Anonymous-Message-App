import UserModel from "@/Model/User";
import DbConnect from "@/lib/DbConnect";

export async function GET(request: Request) {
    await DbConnect()
    try {
        const { username, code } = await request.json()
        const deCodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: deCodedUsername })
        if (!user) {
            Response.json({
                succsess: false,
                message: "user not found"
            })
        }

        const isCodeValid = user?.verifyCode == code
        // @ts-ignore: Object is possibly 'null'.
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()


        if (isCodeValid && isCodeNotExpired) {
            // @ts-ignore: Object is possibly 'null'.
            user.isVerified = true
            await user?.save()

            Response.json({
                succsess: true,
                message: "Account Verified successfully"
            }, { status: 200 })

        } else if (!isCodeNotExpired) {
            Response.json({
                succsess: false,
                message: "Code has expired, please signup again"
            }, { status: 400 })

        } else {
            Response.json({
                succsess: false,
                message: "Incorrect verification code"
            }, { status: 400 })
        }



    } catch (error) {
        console.error("Error verifying user ")
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}