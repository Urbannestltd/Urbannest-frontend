"use client"
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { convertMinutes, formatDate, formatDatetoTime } from "@/services/date"
import { TickettData } from "@/utils/data"
import {
    Box,
    Breadcrumb,
    Button,
    Center,
    Circle,
    Flex,
    HStack,
    Image,
    Text,
    Timeline,
} from "@chakra-ui/react"
import { useParams } from "next/navigation"
import image1 from "@/app/assets/images/lease-image.png"
import { MdAttachFile, MdOutlineAvTimer, MdOutlineTimer } from "react-icons/md"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import {
    LuAtSign,
    LuChevronDown,
    LuChevronRight,
    LuChevronUp,
    LuCircleCheckBig,
} from "react-icons/lu"
import { CustomTextarea } from "@/components/ui/custom-fields"
import { useForm } from "react-hook-form"
import { MainButton } from "@/components/ui/button"
import { stat } from "fs"
import refreshCheck from "@/app/assets/icons/refresh-check.svg"
import { use, useEffect, useState } from "react"
import { Divider } from "@/components/ui/divider"
import { Avatar } from "@/components/ui/avatar"
import { ImageSlot } from "@/components/ui/image-slot"
import { Modal } from "@/components/ui/dialog"
import { property, set } from "lodash"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import useAuthStore from "@/store/auth"
import { RiFileList3Line, RiLock2Fill } from "react-icons/ri";
import { useTicketStore } from "@/store/fm/ticket"
import { sendComment, sendCommentPayload, updateTicketPriority, updateTicketPriorityPayload, updateTicketStatus, updateTicketStatusPayload } from "@/services/fm/ticket"
import { BsChatLeftFill } from "react-icons/bs"
import { AiFillThunderbolt } from "react-icons/ai"

const Status = [
    {
        value: 'PENDING',
        label: 'Open',
        bgColor: '#F5F5F5',
        textColor: '#4A4A4A',
        borderColor: '#F4F4F4'
    },
    {
        value: 'IN_PROGRESS',
        label: 'In Progress',
        bgColor: '#EFF6FF',
        textColor: '#1D4ED8',
        borderColor: '#DBEAFE'
    },
    {
        value: 'RESOLVED',
        label: 'Resolved',
        bgColor: '#CFF7D3',
        textColor: '#02542D',
        borderColor: '#D1FAE5'
    },
    {
        value: 'ESCALATED',
        label: 'Escalated',
        bgColor: '#FEE2E2',
        textColor: '#991B1B',
        borderColor: '#FECACA'
    }
]

const Priority = [
    { value: 'LOW', label: 'Low', bg: '#F5F5F5', textColor: '#4A4A4A', borderColor: '#F4F4F4' },
    { value: 'MEDIUM', label: 'Medium', bg: '#FFF7ED', textColor: '#975102', borderColor: '#FFEDD5' },
    { value: 'HIGH', label: 'High', bg: '#FEF2F2', textColor: '#B91C1C', borderColor: '#FEE2E2' },
]

export const TicketPage = ({ id }: { id: string }) => {
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)
    const { control, handleSubmit, reset, formState } = useForm<{ message: string }>()
    const [showStatus, setShowStatus] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(Ticket?.status)
    const [showPriority, setShowPriority] = useState(false)
    const [updatePriority, setUpdatePriority] = useState(Ticket?.priority)
    const newComment = useTicketStore((state) => state.newComments)
    const setComment = useTicketStore((state) => state.setComments)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        fetchTicket(id)
        setUpdateStatus(Ticket?.status)
        setUpdatePriority(Ticket?.priority)
    }, [id])

    const Info = [
        {
            label: "Property & Unit",
            value: Ticket?.unitName,
            bottom: Ticket?.propertyName,
        },
        {
            label: "Tenant",
            value: Ticket?.tenant.name,
            bottom: Ticket?.tenant.phone,
        },
        {
            label: "Issue Type",
            value: Ticket?.category,
        },
    ]



    const status = Status.find((item) => item.value === updateStatus)

    const updateStatusMutation = useMutation({
        mutationFn: (payload: updateTicketStatusPayload) => updateTicketStatus(payload),
        onSuccess: (variables) => {
            toast.success('Status updated successfully')
            setUpdateStatus(variables.data.status)
        }
    })

    const postCommentMutation = useMutation({
        mutationFn: (payload: sendCommentPayload) => sendComment(payload),
        onSuccess: (variables) => {
            toast.success('Comment added successfully')
            reset()
            setComment({
                senderName: user?.name ?? 'N/A',
                isSystemMessage: false,
                timestamp: new Date().toISOString(),
                id: variables.data.senderId,
                message: variables.data.message
            })
        }
    })

    const handleUpdateStatus = (status: string) => {
        if (!user?.id) {
            return
        }
        const payload: updateTicketStatusPayload = {
            id: id,
            data: { status: status },

        }
        updateStatusMutation.mutate(payload)
    }

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




    const updatePriorityMutation = useMutation({
        mutationFn: (payload: updateTicketPriorityPayload) => updateTicketPriority(payload),
        onSuccess: (variables) => {
            toast.success('priority updated successfully')
            setUpdatePriority(variables.data.priority)
        }
    })


    const handleUpdatePriority = (priority: string) => {
        if (!user?.id) {
            return
        }
        const payload: updateTicketPriorityPayload = {
            id: id,
            data: { priority: priority },
        }
        updatePriorityMutation.mutate(payload)
    }



    return (
        <div>
            <Flex gap={8}>
                <Box w={"65%"}>
                    <SectionBox w={"full"} mt={8} p={6}>
                        <HStack justify={"space-between"}>
                            <Box>
                                <HStack>
                                    <Circle size={"8px"} bg={status?.textColor} />
                                    <Text className="satoshi-bold text-sm">{status?.label}</Text>
                                </HStack>
                                <PageTitle
                                    mt={2}
                                    title={Ticket?.subject || "No Subject"}
                                    fontSize={"22px"}
                                />
                            </Box>
                            <Box>
                                <Text
                                    letterSpacing={"1.1px"}
                                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                                >
                                    Created at
                                </Text>
                                <Text className="satoshi-bold text-sm">
                                    {formatDate(Ticket?.dateSubmitted)} •{" "}
                                    {formatDatetoTime(Ticket?.dateSubmitted)}
                                </Text>
                            </Box>
                        </HStack>
                        <HStack mt={6} h={"89px"}>
                            {Info.map((info) => (
                                <SectionBox bg={"#F5F5F5"} p={4} w={"full"} h={"full"}>
                                    <Text
                                        letterSpacing={"1.1px"}
                                        className="satoshi-bold uppercase text-[#757575] text-[10px]"
                                    >
                                        {info.label}
                                    </Text>
                                    <Text className="satoshi-bold text-sm capitalize">
                                        {info.value?.toLowerCase()}
                                    </Text>
                                    {info.bottom && (
                                        <Text className=" text-xs capitalize">{info.bottom}</Text>
                                    )}
                                </SectionBox>
                            ))}
                        </HStack>
                        <Box mt={8}>
                            <Text
                                letterSpacing={"1.1px"}
                                mb={3}
                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                Tenant Description
                            </Text>
                            <SectionBox bg={"#F5F5F5"} p={4} w={"full"} h={"full"}>
                                <Text className="text-sm satoshi-variable-italic">
                                    "{Ticket?.description}"
                                </Text>
                            </SectionBox>
                        </Box>
                        <Box mt={8}>
                            <Text
                                letterSpacing={"1.1px"}
                                mb={3}
                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                Attached Images
                            </Text>
                            <HStack h={'126px'}>
                                {Ticket?.images.length === 0 && (
                                    <ImageSlot
                                        alt="profile"
                                        className="rounded-lg"
                                        boxSize="126px"
                                    />
                                )}
                                {Ticket?.images.map((image) => (
                                    <ImageSlot
                                        src={image}
                                        alt="profile"
                                        className="rounded-lg"
                                        boxSize="126px"
                                    />
                                ))}
                            </HStack>
                        </Box>
                    </SectionBox>
                    <SectionBox bg={"#F5F5F580"} mt={8} pt={0} px={0}>
                        <Flex p={4}>
                            <PageTitle title="Activity Timeline" fontSize={"16px"} />
                        </Flex>
                        <SectionBox rounded={"none"} border={"none"}>
                            <Timeline.Root variant={"subtle"}>
                                {Ticket?.timeline.map((timeline) => {
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
                                {Ticket?.activity.map((activity) => {
                                    if (!activity.isSystemMessage) {
                                        return (
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
                                            </Timeline.Item>)
                                        /* <Timeline.Item w={"full"}>
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
                                     )*/
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
                                {newComment && <Timeline.Item w={"full"}>
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
                                                    "{newComment.message}"
                                                </Timeline.Description>
                                            </Box>
                                            <Text fontSize={"xs"} color={'#92400E'} textStyle="xs">
                                                {formatDate(newComment.timestamp)} • {formatDatetoTime(newComment.timestamp)}
                                            </Text>
                                        </Flex>
                                    </Timeline.Content>
                                </Timeline.Item>}

                            </Timeline.Root>
                        </SectionBox>
                        <Box p={4} py={6}>
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
                    </SectionBox>
                </Box>
                <Box w={{ base: 'full', md: "26%" }}>
                    <SectionBox mt={8} p={6} w={'full'}>
                        <Text
                            letterSpacing={"1.1px"}
                            mb={6}
                            className="satoshi-bold uppercase text-[#757575] text-[10px]"
                        >
                            Management Actions
                        </Text>
                        <MainButton
                            variant="darkGhost"
                            icon={<LuChevronRight />}
                            onClick={() => handleUpdateStatus(status?.value === "IN_PROGRESS" ? "RESOLVED" : status?.value === "RESOLVED" ? "RESOLVED" : "IN_PROGRESS")}
                            loading={updateStatusMutation.isPending}
                            iconPosition="right"
                            disabled={status?.value === "RESOLVED" || status?.value === "ESCALATED"}
                            size="lg"
                            className="h-[38px] justify-between  text-lg satoshi-bold"
                        >
                            <Flex align={"center"}>
                                <LuCircleCheckBig className="mr-2" />Mark {status?.value === "IN_PROGRESS" ? "Resolved" : status?.value === "RESOLVED" ? "Resolved" : "In Progress"}
                            </Flex>
                        </MainButton>
                        <MainButton
                            variant="outline"
                            icon={<LuChevronRight />}
                            iconPosition="right"
                            disabled={status?.value === "PENDING" || status?.value === "ESCALATED"}
                            size="lg"
                            onClick={() => handleUpdateStatus(status?.value === "IN_PROGRESS" ? "PENDING" : status?.value === "RESOLVED" ? "IN_PROGRESS" : "PENDING")}
                            loading={updateStatusMutation.isPending}
                            className="h-[38px] my-3 justify-between rounded-full  text-lg satoshi-bold"
                        >
                            <Flex align={"center"}>
                                <Image src={refreshCheck.src} alt="Update Status Icon" mr={2} />{" "}
                                Mark {status?.value === "IN_PROGRESS" ? "Open" : status?.value === "RESOLVED" ? "In Progress" : "Open"}
                            </Flex>
                        </MainButton>
                        <Divider />
                        <Text
                            letterSpacing={"1.1px"}
                            mb={2}
                            className="satoshi-bold uppercase text-[#757575] text-[10px]"
                        >
                            PRIORITY LEVEL
                        </Text>

                        <Flex animation={'ease-in-out'} mb={3}
                            w={'full'}
                            wrap={'wrap'} gap={1}>
                            {Priority.map((priority) => (
                                <Button
                                    alignItems={'center'}
                                    fontSize={'12px'}
                                    fontWeight={'semibold'}
                                    bg={priority?.bg}
                                    border={'1px solid'}
                                    borderColor={priority?.borderColor}
                                    p={1}
                                    px={2}
                                    mt={2}
                                    rounded={'3xl'}
                                    w={'fit'}
                                    h={'fit'}
                                    onClick={() => handleUpdatePriority(priority.value)}
                                >
                                    {priority?.value === updatePriority && <Circle size={'5px'} bg={priority?.textColor} mr={1} />}
                                    <Text className="capitalize" color={priority?.textColor} children={priority?.label} />
                                </Button>
                            ))}
                        </Flex>
                    </SectionBox>

                </Box>
            </Flex>
        </div>
    )
}

function HighlightText({ text, search = Status.map((status) => status.value) }: { text: string; search?: string[] }) {
    if (!search || search.length === 0) {
        return <>{text}</>;
    }

    const escaped = search.map(word =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                const match = search.find(
                    word => word.toLowerCase() === part.toLowerCase()
                );

                if (match) {
                    const status = Status.find(
                        status => status.value.toLowerCase() === match.toLowerCase()
                    );

                    return (
                        <Flex
                            key={index}
                            alignItems="center"
                            fontSize="12px"
                            fontWeight="semibold"
                            bg={status?.bgColor}
                            border="1px solid"
                            borderColor={status?.borderColor}
                            p={1}
                            px={2}
                            rounded="3xl"
                            w="fit"
                            h="fit"
                        >
                            <Text
                                className="capitalize"
                                color={status?.textColor}
                            >
                                {status?.label}
                            </Text>
                        </Flex>
                    );
                }

                return part
            })}
        </>
    );
}