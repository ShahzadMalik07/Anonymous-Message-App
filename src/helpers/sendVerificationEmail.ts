import { resend } from "../lib/Resend";
import VerificationEmail from "../../Emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react:VerificationEmail({username, otp:verifyCode}),
          });
        return {success:true, message:"Email sent Successfully"}


    } catch (emailError) {
        console.log("error sending verification email", emailError)
        return {success:false, message:"failed to send verification email"}
    }
}