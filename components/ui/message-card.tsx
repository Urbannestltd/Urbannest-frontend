import { Box, Flex, Text } from "@chakra-ui/react"
import { Avatar } from "./avatar"
import { formatDateTime } from "@/services/date"
import { MessageCardProps } from "@/utils/model"
import { InputGroup } from "./input-group"
import { CustomInput } from "./custom-fields"
import { useForm } from "react-hook-form"
import { MdSend } from "react-icons/md";
import { useMutation } from "@tanstack/react-query"
import { getAllMaintenanceRequestsMessages, messageProps, sendMaintenanceMessage, submitMessagePayload } from "@/services/maintenance"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { useMaintenanceStore } from "@/store/maintenance"

interface Message {
    ticketId: string | undefined
    cardData?: MessageCardProps[]
}

export const MessageCard = ({ cardData, ticketId }: Message) => {
    const { control, reset, handleSubmit } = useForm<messageProps>()

    const fetchMaintenanceMessages = useMaintenanceStore((state) => state.fetchMaintenanceMessages)
    const addMessages = useMaintenanceStore((state) => state.addMessage)

    useEffect(() => {
        fetchMaintenanceMessages(ticketId ?? '')
    }, [ticketId])

    const mutation = useMutation({
        mutationFn: (data: submitMessagePayload) => sendMaintenanceMessage(data),
        onSuccess: (response: MessageCardProps, variables) => {
            const newMessage: MessageCardProps = {
                ...response,
                message: variables.payload.message
            }
            addMessages(ticketId ?? '', newMessage)
            reset({
                message: ''
            })
        },

        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const onSubmit = async (data: any) => {
        const payload: submitMessagePayload = {
            payload: {
                message: data.message,
            },
            ticketId: ticketId ?? ''
        }
        mutation.mutate(payload)
    }

    return (
        <Flex direction={'column'} h={'full'} justify={'end'}>
            <Flex direction={'column'} w={'full'} h={'full'} maxH={'500px'} overflowY={'scroll'}>
                {cardData && cardData.map((item) => {
                    if (!item.sender || !item) return null
                    return (
                        <Flex my={2} key={item.id}>
                            <Avatar size={'lg'} name={item.sender.userFullName} />
                            <Box ml={2.5}>
                                <Text my={1} className="satoshi-bold text-[16px]">{item.sender.userFullName}</Text>
                                <Box bg={'white'} w={'80%'} rounded={'5px'} p={'7px'} border={'0.55px solid #EAEAEA'}>
                                    <Text textWrap={'wrap'} w={'full'} className="satoshi-medium text-[17px]">{item.message}</Text>
                                </Box>
                                <Text my={1.5} color={'#767676'} className="satoshi-medium text-[12px]">{formatDateTime(item.createdAt)}</Text>
                            </Box>
                        </Flex>)
                })}
            </Flex>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <InputGroup w={'full'} endElement={<MdSend onClick={handleSubmit(onSubmit)} color='#2A3348' size='20px' />} >
                    <CustomInput
                        name="message"
                        control={control}
                        height='40px'
                        placeholder="Write a comment"
                    />
                </InputGroup>
            </form>
        </Flex>
    )
}