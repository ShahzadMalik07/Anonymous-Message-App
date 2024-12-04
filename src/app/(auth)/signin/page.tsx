"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { signupSchema } from "@/Schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"



const page = () => {
  const [username, setusername] = useState("")
  const [usernameMessage, setusernameMessage] = useState("")
  const [usernameLoading, setusernameLoading] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 400)
  const { toast } = useToast()
  const router = useRouter()

  const from = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkingUsernameUnique = async () => {
      if (debouncedUsername) {
        setusernameLoading(true)
        setusernameMessage("")
      }
      try {
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
        setusernameMessage(response.data.message)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setusernameMessage(axiosError.response?.data.message ?? "error checking username")

      } finally {
        setusernameLoading(false)
      }


    }
    checkingUsernameUnique()

  }, [debouncedUsername])

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
        

      </div>

    </div>
  )
}

export default page
