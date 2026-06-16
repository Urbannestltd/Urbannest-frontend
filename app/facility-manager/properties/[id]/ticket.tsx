"use client"
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { convertMinutes, formatDate, formatDatetoTime } from "@/services/date"
import { TickettData } from "@/utils/data"
import {
    Box,
    Button,
    Center,
    Circle,
    Flex,
    Grid,
    HStack,
    Image,
    Skeleton,
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
import { TicketActivity } from "./ticket-activity/ticket-activity"
import { FaPlay } from "react-icons/fa"
import { TbRotateDot } from "react-icons/tb"
import { AxiosError } from "axios"

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
    const { ticket, fetchTicket, isLoadingTicket } = useTicketStore((state) => state)
    const fetchMessages = useTicketStore((state) => state.fetchMessages)
    const { control, handleSubmit, reset, formState } = useForm<{ message: string }>()
    const [showStatus, setShowStatus] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(ticket?.status)
    const [showPriority, setShowPriority] = useState(false)
    const [updatePriority, setUpdatePriority] = useState(ticket?.priority)
    const newComment = useTicketStore((state) => state.newComments)
    const setComment = useTicketStore((state) => state.setComments)
    const user = useAuthStore((state) => state.user)
    const fetchBudget = useTicketStore((state) => state.fetchBudget)
    const fetchExpenses = useTicketStore((state) => state.fetchExpenses)

    useEffect(() => {
        fetchTicket(id)
        fetchMessages(id)
        fetchBudget(id)
        fetchExpenses(id)
        setUpdateStatus(ticket?.status)
        setUpdatePriority(ticket?.priority)
    }, [id])

    useEffect(() => {
        if (ticket?.status) setUpdateStatus(ticket.status)
        if (ticket?.priority) setUpdatePriority(ticket.priority)
    }, [ticket?.status, ticket?.priority])

    const Info = [
        {
            label: "Property & Unit",
            value: ticket?.unitName,
            bottom: ticket?.propertyName,
        },
        {
            label: "Tenant",
            value: ticket?.tenant.name,
            bottom: ticket?.tenant.phone,
        },
        {
            label: "Issue Type",
            value: ticket?.category,
        },
    ]



    const status = Status.find((item) => item.value === updateStatus)

    const updateStatusMutation = useMutation({
        mutationFn: (payload: updateTicketStatusPayload) => updateTicketStatus(payload),
        onSuccess: (variables) => {
            toast.success('Status updated successfully')
            fetchTicket(id)
            setUpdateStatus(variables.data.status)

        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to update status')
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




    const updatePriorityMutation = useMutation({
        mutationFn: (payload: updateTicketPriorityPayload) => updateTicketPriority(payload),
        onSuccess: (variables) => {
            toast.success('priority updated successfully')
            fetchTicket(id)
            setUpdatePriority(variables.data.priority)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to update priority')
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

    if (isLoadingTicket) { return <Skeleton mt={4} rounded={'lg'} height={"30vh"} /> }

    else
        return (
            <div className="w-full">
                <Flex direction={{ base: 'column', md: 'row' }} w={'full'} gap={8}>
                    <Box w={{ base: 'full', md: "65%" }}>
                        <SectionBox w={"full"} mt={8} p={6}>
                            <HStack justify={"space-between"}>
                                <Box>
                                    <HStack>
                                        <Circle size={"8px"} bg={status?.textColor} />
                                        <Text className="satoshi-bold text-sm">{status?.label}</Text>
                                    </HStack>
                                    <PageTitle
                                        mt={2}
                                        title={ticket?.subject || "No Subject"}
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
                                        {formatDate(ticket?.dateSubmitted)} •{" "}
                                        {formatDatetoTime(ticket?.dateSubmitted)}
                                    </Text>
                                </Box>
                            </HStack>
                            <Grid gap={{ base: 3, md: 4 }} templateColumns={{ base: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }} mt={6} h={{ base: "auto", md: "89px" }}>
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
                            </Grid>
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
                                        "{ticket?.description}"
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
                                    {ticket?.images.length === 0 && (
                                        <ImageSlot
                                            alt="profile"
                                            className="rounded-lg"
                                            boxSize="126px"
                                        />
                                    )}
                                    {ticket?.images.map((image) => (
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
                        <TicketActivity id={id} />
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
                                disabled={status?.value === "RESOLVED" || status?.value === "ESCALATED" || updateStatusMutation.isPending}
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
                                disabled={status?.value === "PENDING" || status?.value === "ESCALATED" || updateStatusMutation.isPending}
                                size="lg"
                                onMouseDown={(e) => { e.preventDefault(); handleUpdateStatus(status?.value === "IN_PROGRESS" ? "PENDING" : status?.value === "RESOLVED" ? "IN_PROGRESS" : "PENDING") }}
                                loading={updateStatusMutation.isPending}
                                className="h-[38px] my-3 justify-between rounded-full  text-lg satoshi-bold"
                            >
                                <Flex align={"center"}>
                                    {status?.value === 'IN_PROGRESS' ? <FaPlay className="mr-2" /> : <TbRotateDot size={18} className="mr-2 rotate-180"
                                    />}{" "}
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

export function HighlightText({ text, search = Status.map((status) => status.value) }: { text: string; search?: string[] }) {
    if (!search || search.length === 0) {
        return <>{text}</>;
    }

    const escaped = search.map(word =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts = text.split(regex);

    return (
        <Flex gap={1} align={'center'}>
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
        </Flex>
    );
}