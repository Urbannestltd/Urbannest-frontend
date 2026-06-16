import { SectionBox, } from "@/components/ui/section-box"
import { formatDate, formatDatetoTime } from "@/services/date"
import {
    Box,
    Center,
    Flex,
    HStack,
    Skeleton,
    Text,
    Timeline,
} from "@chakra-ui/react"
import { MdAttachFile, MdOutlineChatBubbleOutline, } from "react-icons/md"
import {
    LuAtSign,
    LuLock,
} from "react-icons/lu"
import { CustomTextarea } from "@/components/ui/custom-fields"
import { useForm } from "react-hook-form"
import { MainButton } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import useAuthStore from "@/store/auth"
import { RiChatOffLine, RiFileList3Line, RiLock2Fill } from "react-icons/ri";
import { HighlightText } from "../ticket"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import { useTicketStore } from "@/store/admin/tickets"
import { sendComment, sendCommentPayload } from "@/services/admin/maintenance"
import { BsChatLeftFill } from "react-icons/bs"
export const Timelines = ({ id, tableName }: { id: string, tableName?: string }) => {
    const Ticket = useTicketStore((state) => state.ticket)

    const { control, handleSubmit, reset, formState } = useForm<{ message: string }>()
    const newComment = useTicketStore((state) => state.newComments)
    const setComment = useTicketStore((state) => state.setComments)
    const user = useAuthStore((state) => state.user)

    const emptyDetails = {
        icon: '',
        title: 'No messages yet',
        description: 'You haven’t received any messages from the tenant yet. Check back later',
    }

    const postCommentMutation = useMutation({
        mutationFn: (payload: sendCommentPayload) => sendComment(payload),
        onSuccess: (variables) => {
            toast.success('Comment added successfully')
            reset({
                message: ''
            })
            setComment({
                senderName: user?.name ?? 'N/A',
                isSystemMessage: false,
                timestamp: new Date().toISOString(),
                id: variables.data.senderId,
                message: variables.data.message
            })
        }
    })

    const onSubmitMessage = async (data: { message: string }) => {
        if (!user?.id) {
            return
        }
        const payload: sendCommentPayload = {
            id: id,
            data: {
                message: data.message,
                senderId: user.id
            }
        }
        postCommentMutation.mutate(payload)
    }


    return (
        <>
            {Ticket?.timeline && Ticket?.timeline?.length <= 0 ?
                <div className='flex flex-col items-center justify-center my-16 space-y-6'>
                    <div className='flex items-center justify-center'>
                        <Center p={3} bg={'#F5F5F5'} rounded={'full'}><RiChatOffLine color="#757575" size={25} /></Center>
                    </div>

                    <div className='flex flex-col items-center justify-center w-[290px] space-y-2'>
                        <h4 className='text-xl satoshi-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                        <p className='text-sm text-center satoshi-medium text-[#6A6C88]'>
                            {emptyDetails?.description || `No ${tableName} found`}
                        </p>
                    </div>
                </div> :
                <SectionBox rounded={"none"} border={"none"}>
                    <Timeline.Root variant={"subtle"}>
                        {Ticket?.timeline?.map((timeline) => {
                            return (<Timeline.Item w={"full"} >
                                <Timeline.Connector>
                                    <Timeline.Separator border={"1px solid #F4F4F4"} />
                                    <Timeline.Indicator bg={"#F5F5F5"}>
                                        <RiFileList3Line />
                                    </Timeline.Indicator>
                                </Timeline.Connector>
                                <Timeline.Content w={"full"}>
                                    <Flex w={"full"} justify={"space-between"}>
                                        <Box>
                                            <Timeline.Title className="satoshi-bold">
                                                <HighlightText text={timeline.event} />
                                            </Timeline.Title>
                                            <Timeline.Description>
                                                <HighlightText text={timeline.event} />
                                            </Timeline.Description>
                                        </Box>
                                        <Text fontSize={"xs"} textStyle="xs">
                                            {formatDate(timeline.timestamp)} • {formatDatetoTime(timeline.timestamp)}
                                        </Text>
                                    </Flex>
                                </Timeline.Content>
                            </Timeline.Item>)
                        })}
                        {Ticket?.activity?.map((activity) => {
                            if (!activity.isSystemMessage) {
                                if (activity.senderName === 'System Admin') {
                                    return (
                                        <Timeline.Item w={"full"}>
                                            <Timeline.Connector>
                                                <Timeline.Separator border={"1px solid #F4F4F4"} />
                                                <Timeline.Indicator bg={"#F5F5F5"}>
                                                    <RiLock2Fill color="#D97706" />
                                                </Timeline.Indicator>
                                            </Timeline.Connector>
                                            <Timeline.Content w={"full"}>
                                                <Flex w={"full"} border={`1px solid #FDE68A`} rounded={'12px'} bg={'#FFFBEB80'} p={4} justify={"space-between"}>
                                                    <Box>
                                                        <Timeline.Title color={'#78350F'} className="satoshi-bold">
                                                            Internal Note
                                                        </Timeline.Title>
                                                        <Timeline.Description color={'#92400E'} className="satoshi-variable-italic">
                                                            "{activity.message}"
                                                        </Timeline.Description>
                                                    </Box>
                                                    <Text fontSize={"xs"} color={'#92400E'} textStyle="xs">
                                                        {formatDate(activity.timestamp)} • {formatDatetoTime(activity.timestamp)}
                                                    </Text>
                                                </Flex>
                                            </Timeline.Content>
                                        </Timeline.Item>
                                    )
                                }
                                return (
                                    <Timeline.Item w={"full"}>
                                        <Timeline.Connector>
                                            <Timeline.Separator border={"1px solid #F4F4F4"} />
                                            <Timeline.Indicator bg={"#F5F5F5"}>
                                                <BsChatLeftFill />
                                            </Timeline.Indicator>
                                        </Timeline.Connector>
                                        <Timeline.Content w={"full"}>
                                            <Flex w={"full"} justify={"space-between"}>
                                                <Box>
                                                    <Timeline.Title className="satoshi-bold">
                                                        {activity.senderName}
                                                    </Timeline.Title>
                                                    <Timeline.Description>
                                                        {activity.message}
                                                    </Timeline.Description>
                                                </Box>
                                                <Text fontSize={"xs"} textStyle="xs">
                                                    {formatDate(activity.timestamp)} • {formatDatetoTime(activity.timestamp)}
                                                </Text>
                                            </Flex>
                                        </Timeline.Content>
                                    </Timeline.Item>
                                )
                            }
                            return
                            /* 
         
                                    <Timeline.Item>
                                        <Timeline.Connector>
                                            <Timeline.Separator border={"1px solid #F4F4F4"} />
                                            <Timeline.Indicator bg={"#F5F5F5"}>
                                                <BsChatLeftFill />
                                            </Timeline.Indicator>
                                        </Timeline.Connector>
                                        <Timeline.Content>
                                            <SectionFlex justify={"space-between"} p={2} bg={"#F5F5F5"}>
                                                <Box>
                                                    <Timeline.Title className="satoshi-bold" textStyle="sm">
                                                        First Response{" "}
                                                    </Timeline.Title>
                                                    <Timeline.Description fontSize={"13px"} w={"70%"}>
                                                        "{activity.message}"
                                                    </Timeline.Description>
                                                    <Flex
                                                        fontSize={"2xs"}
                                                        mt={2}
                                                        className="satoshi-bold uppercase"
                                                        color={"#2A3348"}
                                                        letterSpacing={"0.5px"}
                                                        align={"center"}
                                                    >
                                                        <AiFillThunderbolt />
                                                        Response time: {activity.timestamp}
                                                    </Flex>
                                                </Box>
                                                <Text fontSize={"xs"} textStyle="xs">
                                                    {formatDate(activity.timestamp)} • {formatDatetoTime(activity.timestamp)}
                                                </Text>
                                            </SectionFlex>
                                        </Timeline.Content>
                                    </Timeline.Item>
        */

                        })}
                        {newComment && newComment.map((newComments, index) => <Timeline.Item w={"full"}>
                            <Timeline.Connector>
                                <Timeline.Separator border={"1px solid #F4F4F4"} />
                                <Timeline.Indicator bg={"#F5F5F5"}>
                                    <RiLock2Fill color="#D97706" />
                                </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content w={"full"}>
                                <Flex w={"full"} border={`1px solid #FDE68A`} rounded={'12px'} bg={'#FFFBEB80'} p={4} justify={"space-between"}>
                                    <Box>
                                        <Timeline.Title color={'#78350F'} className="satoshi-bold">
                                            Internal Note
                                        </Timeline.Title>
                                        <Timeline.Description color={'#92400E'} className="satoshi-variable-italic">
                                            "{newComments.message}"
                                        </Timeline.Description>
                                    </Box>
                                    <Text fontSize={"xs"} color={'#92400E'} textStyle="xs">
                                        {formatDate(newComments.timestamp)} • {formatDatetoTime(newComments.timestamp)}
                                    </Text>
                                </Flex>
                            </Timeline.Content>
                        </Timeline.Item>)}

                    </Timeline.Root>
                </SectionBox>}
            <Box bg={'#F5F5F54D'} borderTop={'1px solid #F4F4F4'} p={4} py={6}>
                {Ticket?.status !== 'RESOLVED' ? <form onSubmit={handleSubmit(onSubmitMessage)}>
                    <CustomTextarea
                        control={control}
                        name="message"
                        borderColor="#F4F4F4"
                        placeholder="Write a message..."
                        textareaProps={{
                            onKeyDown: (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(onSubmitMessage)()
                                }
                            }
                        }}
                    />
                    <HStack mt={8} justify={'end'}>
                        <MainButton
                            variant="darkGhost"
                            size="sm"
                            className="h-[38px] uppercase text-xs satoshi-bold"
                            type="submit"
                            disabled={!formState.isValid}
                            loading={postCommentMutation.isPending}
                        >
                            Send Note
                        </MainButton>
                    </HStack>
                </form> :
                    <Flex>
                        <Center boxSize={14} rounded={'12px'} bg={'#F5F5F5'} mr={4}><LuLock color="#4A4A4A" size={20} /></Center>
                        <Box color={'#2A3439'}>
                            <Text className="satoshi-medium">Communication Channel Locked</Text>
                            <Text fontSize={'14px'}>This ticket has been finalized. New messages and photo attachments are disabled for all participants.</Text>
                        </Box>

                    </Flex>}
            </Box>
        </>
    )
}