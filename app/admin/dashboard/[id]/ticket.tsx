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
    LuCircleX,
    LuFileLock,
    LuLock,
    LuMail,
    LuPackage,
    LuPhone,
    LuShip,
    LuUserSearch,
} from "react-icons/lu"
import { AiFillThunderbolt } from "react-icons/ai"
import { BsChatLeftFill, BsLockFill } from "react-icons/bs"
import { CustomTextarea } from "@/components/ui/custom-fields"
import { useForm } from "react-hook-form"
import { MainButton } from "@/components/ui/button"
import { stat } from "fs"
import { useTicketStore } from "@/store/admin/tickets"
import refreshCheck from "@/app/assets/icons/refresh-check.svg"
import { use, useEffect, useState } from "react"
import { Divider } from "@/components/ui/divider"
import { Avatar } from "@/components/ui/avatar"
import { ImageSlot } from "@/components/ui/image-slot"
import { Modal } from "@/components/ui/dialog"
import { AddMemberModal } from "../../dashboard/[id]/add-modal"
import { property, set } from "lodash"
import { useMutation } from "@tanstack/react-query"
import { sendComment, sendCommentPayload, updateTicketStatus, updateTicketStatusPayload } from "@/services/admin/maintenance"
import toast from "react-hot-toast"
import useAuthStore from "@/store/auth"
import { RiFileList3Line, RiLock2Fill } from "react-icons/ri";
import { ExpenseTracking } from "@/app/admin/maintenance-and-issues/[id]/expense-tracking"
import { TicketActivity } from "./ticket-activity"

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

export const TicketPage = ({ id }: { id: string }) => {
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)
    const loading = useTicketStore((state) => state.isLoadingTicket)
    const { control, handleSubmit, reset, formState } = useForm<{ message: string }>()
    const [showStatus, setShowStatus] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(Ticket?.status)
    const newComment = useTicketStore((state) => state.newComments)
    const setComment = useTicketStore((state) => state.setComments)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        fetchTicket(id)
        setUpdateStatus(Ticket?.status)
    }, [id])

    const Info = [
        {
            label: "Property & Unit",
            value: Ticket?.unit?.name,
            bottom: Ticket?.property?.name,
        },
        {
            label: "Tenant",
            value: Ticket?.tenant?.name,
            bottom: Ticket?.tenant?.phone,
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

    const handleUpdateStatus = (status: string) => {
        if (!user?.id) {
            return
        }
        const payload: updateTicketStatusPayload = {
            id: id,
            data: {
                status: status,
                adminId: user.id
            }
        }
        updateStatusMutation.mutate(payload)
    }

    if (loading) return <Skeleton height={'30vh'} />

    return (
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            <Box w={{ base: 'full', md: "70%" }}>
                <SectionBox w={'full'} mt={8} p={6}>
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
                            {Ticket?.images?.length === 0 && (
                                <ImageSlot
                                    alt="profile"
                                    className="rounded-lg"
                                    boxSize="126px"
                                />
                            )}
                            {Ticket?.images?.map((image) => (
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
                <HStack w={"full"} gap={6} mt={8}>
                    <SectionFlex align={"center"} w={"full"} h={"113px"}>
                        <Center bg={"#2A33480D"} p={3.5} rounded={"full"}>
                            <MdOutlineTimer size={20} />
                        </Center>
                        <Box ml={2}>
                            <Text
                                letterSpacing={"1.1px"}
                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                Time to First Response
                            </Text>
                            {Ticket?.responseMetrics?.timeToFirstResponseMinutes ? <><Text className="satoshi-bold text-lg">{convertMinutes(Ticket?.responseMetrics.timeToFirstResponseMinutes)}</Text>
                                <Flex
                                    align={"center"}
                                    fontSize={"xs"}
                                    className="satoshi-medium"
                                    gap={1}
                                    color={"#16A34A"}
                                >
                                    {" "}
                                    <IoCheckmarkCircleOutline /> Within SLA Target (30m)
                                </Flex></> : <Text className="satoshi-bold text-lg">Not Yet Available</Text>}
                        </Box>
                    </SectionFlex>
                    <SectionFlex align={"center"} w={"full"} h={"113px"}>
                        <Center bg={"#2A33480D"} p={3.5} rounded={"full"}>
                            <MdOutlineAvTimer size={20} />
                        </Center>
                        <Box ml={2}>
                            <Text
                                letterSpacing={"1.1px"}
                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                Time to Resolution
                            </Text>
                            {Ticket?.responseMetrics?.timeToResolutionMinutes ? <>
                                <Flex className=" items-end satoshi-bold text-lg">
                                    <Text>{convertMinutes(Ticket?.responseMetrics.timeToResolutionMinutes)}</Text>
                                    <Text className="text-[#757575] mb-1 ml-2 text-xs">
                                        (Est.)
                                    </Text>
                                </Flex>
                                <Text fontSize={"xs"} className="satoshi-medium">
                                    Current average:
                                </Text></> : <Text className="satoshi-bold text-lg">Not Yet Available</Text>}
                        </Box>
                    </SectionFlex>
                </HStack>
                <TicketActivity id={id} />
            </Box>
            <Box w={{ base: 'full', md: "25%" }}>
                <SectionBox mt={8} p={6} w={"full"}>
                    <Text
                        letterSpacing={"1.1px"}
                        mb={6}
                        className="satoshi-bold uppercase text-[#757575] text-[10px]"
                    >
                        Management Actions
                    </Text>
                    <Modal triggerElement={<MainButton
                        variant="darkGhost"
                        icon={<LuChevronRight />}
                        iconPosition="right"
                        size="lg"
                        className="h-[38px] justify-between  text-lg satoshi-bold"
                    >
                        <Flex align={"center"}>
                            <LuUserSearch className="mr-2" /> Assign / Reassign
                        </Flex>
                    </MainButton>} modalContent={<AddMemberModal />} />
                    <MainButton
                        variant="outline"
                        icon={showStatus ? <LuChevronUp /> : <LuChevronDown />}
                        iconPosition="right"
                        size="lg"
                        onClick={() => setShowStatus(!showStatus)}
                        className="h-[38px] my-3 justify-between rounded-full  text-lg satoshi-bold"
                    >
                        <Flex align={"center"}>
                            <Image src={refreshCheck.src} alt="Update Status Icon" mr={2} />{" "}
                            Update Status
                        </Flex>
                    </MainButton>
                    <Flex animation={'ease-in-out'} mb={3} display={showStatus ? "flex" : "none"}
                        w={'full'}
                        wrap={'wrap'} gap={1}>
                        {Status.map((status) => (
                            <Button
                                alignItems={'center'}
                                fontSize={'12px'}
                                fontWeight={'semibold'}
                                bg={status?.bgColor}
                                border={'1px solid'}
                                borderColor={status?.borderColor}
                                p={1}
                                px={2}
                                mt={2}
                                rounded={'3xl'}
                                w={'fit'}
                                h={'fit'}
                                onClick={() => handleUpdateStatus(status.value)}
                            >
                                {status?.value === updateStatus && <Circle size={'5px'} bg={status?.textColor} mr={1} />}
                                <Text className="capitalize" color={status?.textColor} children={status?.label} />
                            </Button>
                        ))}
                    </Flex>
                    <Divider />
                    <Button
                        w={"full"}
                        mt={2.5}
                        className="satoshi-medium"
                        color={"#DC2626"}
                    >
                        <LuCircleX /> Cancel Ticket
                    </Button>
                </SectionBox>
                <SectionBox mt={8} p={6} w={"full"}>
                    <Text
                        letterSpacing={"1.1px"}
                        mb={6}
                        className="satoshi-bold uppercase text-[#757575] text-[10px]"
                    >
                        Assigned FACILITY MANAGER
                    </Text>
                    <Flex>
                        <Avatar mr={3} size={"sm"} />
                        <Box>
                            <Text className="satoshi-bold text-sm">Alexandru Popescu</Text>
                            <Text className="satoshi-bold text-xs">alexpopescu@gmail.com</Text>

                        </Box>
                    </Flex>
                    <Flex mt={3} gap={2} w={'full'}>
                        <MainButton
                            size="lg"
                            variant="ghost"
                            className="px-1 h-[32px] text-xs"
                            icon={<LuPhone />}
                        >
                            Call
                        </MainButton>
                        <MainButton
                            size="lg"
                            variant="ghost"
                            className="px-1 h-[32px] text-xs"
                            icon={<LuMail />}
                        >
                            Email
                        </MainButton>
                    </Flex>
                </SectionBox>
                <ExpenseTracking />

            </Box>
        </Flex>
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