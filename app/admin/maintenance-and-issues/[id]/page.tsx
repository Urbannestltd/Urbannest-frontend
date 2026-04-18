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

export default function TicketPage() {
    const params = useParams()
    const id = params?.id as string
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)
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
            value: "N/A",
            bottom: "Downtown District",
        },
        {
            label: "Tenant",
            value: "Alexandru Voinea",
            bottom: "+1 (555) 012-3456",
        },
        {
            label: "Issue Type",
            value: Ticket?.category,
        },
    ]


    const expenseStatus: { borderColor: string, label: string, value: string, color: string, bgColor: string }[] = [
        {
            label: "Approved",
            value: 'APPROVED',
            borderColor: '#BBF7D0',
            bgColor: '#F0FDF4',
            color: '#15803D'
        },
        {
            label: "Rejected",
            value: 'REJECTED',
            borderColor: '#FEE2E2',
            bgColor: '#FEF2F2',
            color: '#DC2626'
        },
        {
            label: "Pending Approval",
            value: 'PENDING',
            borderColor: '#FED7AA',
            bgColor: '#FFEDD5',
            color: '#C2410C'
        }
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
            data: {
                status: status,
                adminId: user.id
            }
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
                senderId: user.id
            }
        }
        postCommentMutation.mutate(payload)
    }


    return (
        <div>
            <PageTitle title="Maintenance & Issues" fontSize={"22px"} />
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/admin/maintenance-and-issues">
                            Maintenance & Issues
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink className="satoshi-medium">
                            {"N/A"}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Flex gap={8}>
                <Box w={"805px"}>
                    <SectionBox w={"805px"} mt={8} p={6}>
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
                                {Ticket?.responseMetrics.timeToFirstResponseMinutes ? <><Text className="satoshi-bold text-lg">{convertMinutes(Ticket?.responseMetrics.timeToFirstResponseMinutes)}</Text>
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
                                {Ticket?.responseMetrics.timeToResolutionMinutes ? <>
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
                    <SectionBox bg={"#F5F5F580"} mt={8} pt={0} px={0}>
                        <Flex p={4}>
                            <PageTitle title="Activity Timeline" fontSize={"16px"} />
                        </Flex>
                        <SectionBox rounded={"none"} border={"none"}>
                            <Timeline.Root variant={"subtle"}>
                                {Ticket?.timeline.map((timeline) => {
                                    return (<Timeline.Item w={"full"}>
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
                                            /* <Timeline.Item>
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
                                             </Timeline.Item> */
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
                <Box>
                    <SectionBox mt={8} p={6} w={"298px"}>
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
                    <SectionBox mt={8} p={6} w={"298px"}>
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
                    <SectionBox mt={8} p={6} w={"298px"}>
                        <HStack mb={6} justify={'space-between'}>
                            <Text
                                letterSpacing={"1.1px"}

                                className="satoshi-bold uppercase text-[#757575] text-[10px]"
                            >
                                Expense TRACKING
                            </Text>
                            <Center bg={expenseStatus[0].bgColor} rounded={'full'} className="text-[10px] satoshi-bold" p={1} px={2} color={expenseStatus[0].color} border={`1px solid ${expenseStatus[0].borderColor}`}>{expenseStatus[0].label}</Center>
                        </HStack>
                        <Box>
                            <HStack justify={'space-between'} className="text-sm">
                                <Text>Budget Limit</Text>
                                <Text className="satoshi-bold">₦250.00</Text>
                            </HStack>
                            <HStack justify={'space-between'} mt={3} className="text-sm">
                                <Text>Expenses Recorded</Text>
                                <Text className="satoshi-bold">₦0.00</Text>
                            </HStack>
                        </Box>
                        <Button border={'2px dashed #F4F4F4'} fontSize={'12px'} mt={3} px={2} w={'full'} letterSpacing={'1.2px'} className="satoshi-bold uppercase" rounded={'12px'} color={'#757575'}>Add Expense Entry</Button>
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