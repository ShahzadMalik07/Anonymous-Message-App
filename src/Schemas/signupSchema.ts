import { z } from "zod"

export const usernameValidation = z.
string()
.min(2,"Username must be Atleast 2 characters")
.max(20,"username must be no more than 20")
.regex(/^[a-zA-z0-9_]+$/,"username must not contain special character")

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email"}),
    password:z.string().min(6,{message:"password should not less than 6 character"})
    
})