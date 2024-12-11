"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast, useToast } from "@/hooks/use-toast"
import { messageSchema } from "@/Schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import messages from "@/defaultMessages.json"

const page = () => {
    const { username } = useParams()
    type verifyFormData = z.infer<typeof messageSchema>
    const router = useRouter()
    const [isSendLoading, setIsSendLoading] = useState(false); 
    const [isSuggestLoading, setIsSuggestLoading] = useState(false); 
    const [data, setdata] = useState<string[]>(messages)

    const form = useForm<verifyFormData>({
        resolver: zodResolver(messageSchema),

    })
    type FormValues = {
        message: string;
    };
    const { setValue } = useForm<FormValues>({
        defaultValues: {
            message: "ehlll", // Initial value for the input field
        },

    })

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSendLoading(true)
        try {
            const response = await axios.post(`/api/send-message/`, { username: username, content: data.content })
            toast({
                title: "Message Sent",
                description: response?.data.message
            })
            

        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error sending message",
                description: axiosError.response?.data.message
            })

        } finally {
            setIsSendLoading(false)
        }
    }

    const suggestMessages = async () => {
        setIsSuggestLoading(true)
        const response = await axios.get("/api/suggest-messages")
        const sepratedText = await response?.data?.split("||")
        setdata(sepratedText)
        setIsSuggestLoading(false)



    }
    return (
        <>
            <div className=" flex flex-col space-y-6 items-center justify-center h-full pt-10 w-hcreen">
                <div className="w-screen text-center">
                    <h1 className="text-3xl font-bold">Public Profile Link</h1>
                </div>
                <div className="w-[100%] text-center flex items-center justify-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[50%]">
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Message content"
                                                {...field}


                                            />

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSendLoading} >
                                {isSendLoading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Please Wait </> : "Send Message"}
                            </Button>
                        </form>

                    </Form>
                </div>
            </div>
            <div className="mt-10  h-full w-full flex items-center justify-center">
                <div className="w-[50%] space-y-5">
                    <Button disabled={isSuggestLoading} onClick={() => { suggestMessages() }}>{isSuggestLoading?<><Loader2 className="mr-1 h-4 w-4 animate-spin"/> please wait</>:"Suggest Messages"}</Button>
                    <h2>Click on any messages below to select it.</h2>
                    <div className="border flex flex-col space-y-6 pb-4">
                        <h1 className="text-xl p-2">Messages</h1>
                        <div className="flex flex-col items-center justify-center space-y-5">
                            {data?.map((msg, index) => (<button key={index} onClick={() => form.setValue("content", msg)} className="text-center w-[85%] border p-2" >{msg}</button>))}


                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default page
