
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { convertMinutes, formatDate, formatDatetoTime } from "@/services/date"
import {
    Box,
    Flex,
    HStack,
    Image,
    Tabs,
    Text,
    Timeline,
} from "@chakra-ui/react"
import { MdAttachFile, } from "react-icons/md"
import {
    LuAtSign,
} from "react-icons/lu"
import { CustomTextarea } from "@/components/ui/custom-fields"
import { useForm } from "react-hook-form"
import { MainButton } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import useAuthStore from "@/store/auth"
import { RiFileList3Line, RiLock2Fill } from "react-icons/ri";
import { useTicketStore } from "@/store/fm/ticket"
import { sendComment, sendCommentPayload } from "@/services/fm/ticket"
import { BsChatLeftFill } from "react-icons/bs"
import { AiFillThunderbolt } from "react-icons/ai"
import { HighlightText } from "./ticket"
import { Avatar } from "@/components/ui/avatar"

export const TicketActivity = ({ id }: { id: string }) => {
    const Ticket = useTicketStore((state) => state.ticket)
    const messages = useTicketStore((state) => state.messages)
    const { control, handleSubmit, reset, formState } = useForm<{ message: string }>()
    const newComment = useTicketStore((state) => state.newComments)
    const setComment = useTicketStore((state) => state.setComments)
    const user = useAuthStore((state) => state.user)


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
                attachments: [],
            }
        }
        postCommentMutation.mutate(payload)
    }


    return (
        <SectionBox bg={"#FFFFFF"} mt={8} pt={0} px={0}>
            <Tabs.Root defaultValue={'activity'}>
                <Tabs.List alignContent={'center'} borderBottom={'1px solid #A9B4B91A'}>
                    <Tabs.Trigger px={'32px'} py={'30px'} _selected={{ fontWeight: 700 }} className="satoshi-bold" value={'activity'}>Ticket Chat</Tabs.Trigger>
                    <Tabs.Trigger px={'32px'} py={'30px'} _selected={{ fontWeight: 700 }} className="satoshi-bold" value={'comments'}>Expense Logging</Tabs.Trigger>
                    <Tabs.Trigger px={'32px'} py={'30px'} _selected={{ fontWeight: 700 }} className="satoshi-bold" value={'timeline'}>Budget Approval Status</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={'activity'}>
                    <SectionBox rounded={"none"} border={"none"}>
                        <Timeline.Root variant={"subtle"}>
                            {messages.map((message) => {
                                if (message.isSystemMessage) return <Timeline.Item w={"full"} >
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
                                                    <HighlightText text={message.senderName} />
                                                </Timeline.Title>
                                                <Timeline.Description>
                                                    <HighlightText text={message.message} />
                                                </Timeline.Description>
                                            </Box>
                                            <Text fontSize={"xs"} textStyle="xs">
                                                {formatDate(message.timestamp)} • {formatDatetoTime(message.timestamp)}
                                            </Text>
                                        </Flex>
                                    </Timeline.Content>
                                </Timeline.Item>

                                if (message.senderName === "System Admin") return <Timeline.Item w={"full"}>
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
                                                    "{message.message}"
                                                </Timeline.Description>
                                            </Box>
                                            <Text fontSize={"xs"} color={'#92400E'} textStyle="xs">
                                                {formatDate(message.timestamp)} • {formatDatetoTime(message.timestamp)}
                                            </Text>
                                        </Flex>
                                    </Timeline.Content>
                                </Timeline.Item>

                                return (
                                    <Timeline.Item>
                                        <Timeline.Connector>
                                            <Timeline.Separator border={"1px solid #F4F4F4"} />
                                            <Timeline.Indicator>
                                                <Avatar size={'md'} rounded={'4px'} name={message.senderName} />
                                            </Timeline.Indicator>
                                        </Timeline.Connector>
                                        <Timeline.Content>
                                            <Flex w={"full"} justify={"space-between"}>
                                                <Box>
                                                    <Timeline.Title className="satoshi-bold">
                                                        <HighlightText text={message.senderName} />
                                                    </Timeline.Title>
                                                    <Timeline.Description>
                                                        <HighlightText text={message.message} />
                                                    </Timeline.Description>
                                                </Box>
                                                <Text fontSize={"xs"} textStyle="xs">
                                                    {formatDate(message.timestamp)} • {formatDatetoTime(message.timestamp)}
                                                </Text>
                                            </Flex>
                                        </Timeline.Content>
                                    </Timeline.Item>
                                )
                            })}
                            {/*Ticket?.timeline.map((timeline) => {
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
                            })*/}
                            {Ticket?.activity.map((activity) => {
                                if (!activity.isSystemMessage) {
                                    return (
                                        <></>
                                        /*  <Timeline.Item>
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
                                          </Timeline.Item>)*/

                                    )
                                }
                                return
                                /* <Timeline.Item w={"full"}>
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
                                        {activity.senderName}
                                    </Timeline.Title>
                                    <Timeline.Description>
                                        {activity.message}
                                    </Timeline.Description>
                                </Box>
                                <Text fontSize={"xs"} textStyle="xs">
                                    {activity.timestamp}
                                </Text>
                            </Flex>
                        </Timeline.Content>
                    </Timeline.Item>
                    */

                            })}
                            {newComment.length > 0 && newComment.map((newComments) => <Timeline.Item>
                                <Timeline.Connector>
                                    <Timeline.Separator border={"1px solid #F4F4F4"} />
                                    <Timeline.Indicator>
                                        <Avatar rounded={'4px'} name={newComments.senderName} />
                                    </Timeline.Indicator>
                                </Timeline.Connector>
                                <Timeline.Content>
                                    <Flex w={"full"} justify={"space-between"}>
                                        <Box>
                                            <Timeline.Title className="satoshi-bold">
                                                <HighlightText text={newComments.senderName} />
                                            </Timeline.Title>
                                            <Timeline.Description>
                                                <HighlightText text={newComments.message} />
                                            </Timeline.Description>
                                        </Box>
                                        <Text fontSize={"xs"} textStyle="xs">
                                            {formatDate(newComments.timestamp)} • {formatDatetoTime(newComments.timestamp)}
                                        </Text>
                                    </Flex>
                                </Timeline.Content>
                            </Timeline.Item>)}

                        </Timeline.Root>
                    </SectionBox>
                </Tabs.Content >

            </Tabs.Root >


            <Box bg={'#F5F5F54D'} borderTop={'1px solid #F4F4F4'} p={4} py={6}>
                <form onSubmit={handleSubmit(onSubmitMessage)}>
                    <CustomTextarea
                        control={control}
                        name="message"
                        borderColor="#F4F4F4"
                        placeholder="Write a message to the facility manager..."
                    />
                    <HStack mt={8} justify={"space-between"}>
                        <Flex gap={4}>
                            <MdAttachFile cursor={"pointer"} color="#4A4A4A" size={20} />
                            <LuAtSign cursor={"pointer"} color="#4A4A4A" size={20} />
                        </Flex>
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
                </form>
            </Box>
        </SectionBox >
    )
}