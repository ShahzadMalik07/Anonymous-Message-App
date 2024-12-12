"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,

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
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"


type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast()
    const handleDelete = async () => {
        try {
            const result = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: result.data.message
            })
            onMessageDelete(message._id as string)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }

    }
    return (
        <Card >
            <CardHeader >
                <CardDescription className="text-bold text-xl">{message.content}</CardDescription>
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
