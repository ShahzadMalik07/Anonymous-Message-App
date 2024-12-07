"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { signupSchema } from "@/Schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"



const page = () => {
  const [username, setusername] = useState("")
  const [usernameMessage, setusernameMessage] = useState("")
  const [usernameLoading, setusernameLoading] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debounced = useDebounceCallback(setusername, 400)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkingUsernameUnique = async () => {
      if (username) {
        setusernameLoading(true)
        setusernameMessage("")
      }
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        setusernameMessage(response.data.message)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setusernameMessage(axiosError.response?.data.message ?? "error checking username")

      } finally {
        setusernameLoading(false)
      }


    }
    checkingUsernameUnique()

  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post("/api/signup", data)
      if (response.data) {
        toast({
          title: "success",
          description: response.data.message
        })

      }
      router.replace(`/verify/${username}`)
      setisSubmitting(false)
    } catch (error) {
      console.error("error in sign up")
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
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
          <h1 className="mb-6 text-4xl">Join Random Message</h1>
          <p className="mb-4" >Sign up for starting your new expirence</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}

                    />
                   
                  </FormControl>
                  {usernameLoading && <Loader2 className="animate-spin"/>}
                  {!usernameLoading && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

              </>) : ("Signup")}
            </Button>
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}

export default page
