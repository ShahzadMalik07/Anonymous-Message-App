"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/Model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"


type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast()
    const handleDelete = async () => {
        const result = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)
        toast({
            title: result.data.message
        })
        onMessageDelete(message?._id as string)
    }
    return (
        <Card >
            <CardHeader >
                <CardDescription>{message.content}</CardDescription>
                <AlertDialog >
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="h-5 w-5"><X /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>

    )
}

export default MessageCard
