"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import  { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signinSchema } from "@/Schemas/signinSchema"
import { signIn } from "next-auth/react"
import Link from "next/link"



const Page = () => {
  
  const [isSubmitting, setisSubmitting] = useState(false)

 
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setisSubmitting(true)
    try {
   const result =  await signIn("credentials",{
      redirect:false,
      email: data.email,
      password: data.password
     })
      if (result?.error) {
        toast({
          title: "Login Failed ",
          description:"incorrect username or password",
          variant:"destructive"
        })

      }
      if (result?.url) {
        router.replace("/dashboard")
        
      }
      setisSubmitting(false)
    } catch (error) {
      console.error("error in sign up")
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast({
        title: "sign-up Failed",
        description: errorMessage,
        variant: "destructive"
      })
      setisSubmitting(false)

    }

  }

  return (
    <div className="flex items-center justify-center bg-gary-100 min-h-screen">
      <div className="w-full bg-white max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-3xl">Join Random/Anonymous Messages</h1>
          <p className="mb-4" >Sign in for starting your new experience</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<>
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                Plesae wait

              </>) : ("Sign-in")}
            </Button>
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}

export default Page
