"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { verifySchema } from "@/Schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"




const page = () => {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams<{ username: string }>()

  type verifyFormData = z.infer<typeof verifySchema>

  const form = useForm<verifyFormData>({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: verifyFormData) => {

    try {
      const response = await axios.post<ApiResponse>(`/api/verifycode`, {
        username: params.username,
        code: data.code

      })
      toast({
        title: "Success",
        description: response.data.message,
      })
      router.replace("/signin")




    } catch (error) {
      console.error("error in sign up")
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "sign-up Failed",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })

    }

  }

  return (
    <div className="flex items-center justify-center bg-gary-100 min-h-screen">
      <div className="w-full bg-white max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold">Verify Your Account</h1>
          <p className="mb-4" >Enter the verification code sent to your email.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your code here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>




      </div>

    </div>
  )
}

export default page
