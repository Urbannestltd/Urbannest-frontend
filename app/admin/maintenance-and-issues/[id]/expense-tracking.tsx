import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomTextarea } from "@/components/ui/custom-fields"
import { SectionBox } from "@/components/ui/section-box"
import { approveCost, offerRebuttal, offerRebuttalPayload, rejectCost, rejectCostPayload, updateBudget, updateBudgetPayload } from "@/services/admin/maintenance"
import { formatNumber } from "@/services/date"
import { useTicketStore } from "@/store/admin/tickets"
import { cn } from "@/utils/lib"
import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Input,
    InputGroup,
    Text,
} from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoWarningOutline } from "react-icons/io5"
import { LuBan } from "react-icons/lu"
import { TfiBackLeft } from "react-icons/tfi";

const expenseStatus: {
    borderColor: string
    label: string
    value: string
    color: string
    bgColor: string
}[] = [
        {
            label: "Approved",
            value: "APPROVED",
            borderColor: "#BBF7D0",
            bgColor: "#F0FDF4",
            color: "#15803D",
        },
        {
            label: "Rejected",
            value: "REJECTED",
            borderColor: "#FEE2E2",
            bgColor: "#FEF2F2",
            color: "#DC2626",
        },
        {
            label: "Pending Approval",
            value: "PENDING",
            borderColor: "#FED7AA",
            bgColor: "#FFEDD5",
            color: "#C2410C",
        },
        {
            label: "Rebuttal Approval",
            value: "REBUTTED",
            borderColor: "#FDE68A",
            bgColor: "#FFFBEB",
            color: "#B45309",
        }
    ]

export const ExpenseTracking = () => {
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)
    const [rejected, setRejected] = useState(false)
    const [rebuttal, setRebuttal] = useState(false)
    const [EditBudget, setEditBudget] = useState(false)

    const status = expenseStatus.find(
        (status) => status.value === Ticket?.approvalStatus,
    )
    const isPending = status?.value === "PENDING"
    const isRebutted = status?.value === "REBUTTED"
    const isRejected = status?.value === "REJECTED"

    const approvemutate = useMutation({
        mutationFn: () => approveCost(Ticket?.id as string),
        onSuccess: () => {
            fetchTicket(Ticket?.id as string)
        }

    })


    return (
        <>
            {" "}
            {rejected ? (
                <RejectionPage onClose={() => setRejected(false)} />
            ) : rebuttal ? (
                <RebuttalPage onClose={() => setRebuttal(false)} />
            ) : EditBudget ? (
                <EditBudgetPage onClose={() => setEditBudget(false)} />
            ) : (
                <SectionBox mt={8} p={6} w={"298px"}>
                    <HStack mb={6} justify={"space-between"}>
                        <Text
                            letterSpacing={"1.1px"}
                            className="satoshi-bold uppercase text-[#757575] text-[10px]"
                        >
                            Expense TRACKING
                        </Text>
                        <Center
                            bg={status?.bgColor}
                            rounded={"full"}
                            className="text-[10px] satoshi-bold"
                            p={1}
                            px={1}
                            color={status?.color}
                            border={`1px solid ${status?.borderColor}`}
                        >
                            {status?.label}
                        </Center>
                    </HStack>
                    <Box>
                        <HStack justify={"space-between"} px={1} className="text-sm">
                            <Text>Budget Limit</Text>
                            <Text className="satoshi-bold">
                                {formatNumber(Ticket?.budget)}
                            </Text>
                        </HStack>
                        {isRebutted && (
                            <div>
                                <HStack mt={3} justify={"space-between"} px={1} className="text-sm">
                                    <Text>Original Request</Text>
                                    <Text className="satoshi-bold text-[#757575]" textDecoration={'line-through'}>
                                        {formatNumber(Ticket?.quotedCost)}
                                    </Text>
                                </HStack>
                                <HStack
                                    justify={"space-between"}
                                    px={1}
                                    bg={"#FFFBEB80"}
                                    mt={2}
                                    py={1}
                                    rounded={"full"}
                                    className="text-sm"
                                >
                                    <Text
                                        className={"satoshi-medium text-[#78350F]"
                                        }
                                    >
                                        Proposed Rebuttal
                                    </Text>
                                    <Text
                                        color={"#B45309"}
                                        className="satoshi-bold"
                                    >
                                        {formatNumber(Ticket?.quotedCost)}
                                    </Text>
                                </HStack>
                            </div>
                        )}
                        {isPending && <HStack
                            justify={"space-between"}
                            px={1}
                            bg={"#FFFBEB80"}
                            mt={2}
                            py={1}
                            rounded={"full"}
                            className="text-sm"
                        >
                            <Text
                                className={"satoshi-medium text-[#78350F]"
                                }
                            >
                                Request Amount
                            </Text>
                            <Text
                                color={"#B45309"}
                                className="satoshi-bold"
                            >
                                {formatNumber(Ticket?.quotedCost)}
                            </Text>
                        </HStack>}
                        <HStack
                            justify={"space-between"}
                            px={1}
                            bg={"transparent"}
                            mt={2}
                            py={1}
                            rounded={"full"}
                            className="text-sm"
                        >
                            <Text

                            >
                                Expenses Recorded
                            </Text>
                            <Text
                                color={"#2A3348"}
                                className="satoshi-bold"
                            >
                                {formatNumber(Ticket?.quotedCost)}
                            </Text>
                        </HStack>
                    </Box>
                    {Ticket?.budget ? (
                        isPending ? (
                            <Box px={2}>
                                <MainButton
                                    onClick={() => approvemutate.mutate()}
                                    loading={approvemutate.isPending}
                                    variant="darkGhost"
                                    size="lg"
                                    className="h-[40px] w-[120px] mt-2 text-sm"
                                >
                                    Approve Over-Budget
                                </MainButton>
                                <MainButton
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setRebuttal(true)}
                                    className="h-[40px] rounded-full  w-[120px] mt-2 text-sm"
                                >
                                    Send Rebut Amount
                                </MainButton>
                                <Button
                                    width={"full"}
                                    onClick={() => setRejected(true)}
                                    className="satoshi-bold text-[#DC2626] text-sm mt-1"
                                >
                                    Reject Request
                                </Button>
                            </Box>
                        ) : isRebutted ?
                            <MainButton size="lg" variant='outlineGhost' className='bg-transparent mt-2 satoshi-bold h-[40px] text-[#DC2626] border tracking-normal border-[#FECACA]' icon={<TfiBackLeft />}>Recall Rebuttal</MainButton>
                            : isRejected ? null : (
                                <MainButton
                                    onClick={() => setEditBudget(true)}
                                    variant="darkGhost"
                                    size="lg"
                                    className="h-[40px] w-[120px] mt-2 text-sm"
                                >
                                    Edit Budget
                                </MainButton>
                            )
                    ) : (
                        <MainButton
                            onClick={() => setEditBudget(true)}
                            variant="darkGhost"
                            size="lg"
                            className="h-[40px] w-[120px] mt-2 text-sm"
                        >
                            Edit Budget
                        </MainButton>

                        /*<Button
                            border={"2px dashed #F4F4F4"}
                            fontSize={"12px"}
                            mt={3}
                            px={2}
                            w={"full"}
                            letterSpacing={"1.2px"}
                            className="satoshi-bold uppercase"
                            rounded={"12px"}
                            color={"#757575"}
                        >
                            Add Expense Entry
                        </Button>*/
                    )}{" "}
                </SectionBox >
            )}
        </>
    )
}

const RejectionPage = ({ onClose }: { onClose: () => void }) => {
    const { control, handleSubmit } = useForm<{ reason: string }>()
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)

    const mutation = useMutation({
        mutationFn: (data: rejectCostPayload) => rejectCost(data),
        onSuccess: (response) => {
            toast.success(response.message)
            fetchTicket(Ticket?.id as string)
            onClose()
        },
    })

    const onSubmit = (data: { reason: string }) => {
        mutation.mutate({ id: Ticket?.id as string, reason: data.reason })
    }

    return (
        <SectionBox mt={8} p={6} w={"298px"}>
            <Flex color={"#DC2626"}>
                <IoWarningOutline size={16} color="#DC2626" />
                <Text
                    letterSpacing={"1.1px"}
                    textTransform={"uppercase"}
                    fontSize={"11px"}
                    className="satoshi-bold ml-2"
                >
                    Reject Over-Budget Request
                </Text>
            </Flex>
            <SectionBox
                color={"#7F1D1D"}
                bg={"#FEF2F2"}
                fontSize={"14px"}
                mt={2}
                mb={4}
                border={"1px solid #FEE2E2"}
            >
                You are about to reject the request for{" "}
                <Text ml={0.5} className=" inline satoshi-bold">
                    {formatNumber(Ticket?.quotedCost)}
                </Text>
                . This will notify the facility manager and require a revised estimate
                before work can proceed.
            </SectionBox>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Text
                    letterSpacing={"1.1px"}
                    mt={3}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >
                    Reason for Rejection (Optional)
                </Text>
                <CustomTextarea
                    control={control}
                    name="reason"
                    placeholder="Explain why this request is being 
                rejected..."
                />
                <MainButton
                    icon={<LuBan className="mr-5" />}
                    variant="darkGhost"
                    type="submit"
                    size="lg"
                    className="satoshi-bold mt-6 mb-3 h-[40px] bg-[#DC2626] text-white text-sm"
                >
                    Confirm Rejection
                </MainButton>
            </form>

            <MainButton
                onClick={onClose}
                variant="outline"
                size="lg"
                className="satoshi-bold h-[40px] rounded-full text-sm"
            >
                Cancel
            </MainButton>
        </SectionBox>
    )
}

const RebuttalPage = ({ onClose }: { onClose: () => void }) => {
    const { control, handleSubmit } = useForm<{ amount: string; reason: string }>()
    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)

    const mutation = useMutation({
        mutationFn: (data: offerRebuttalPayload) => offerRebuttal(data),
        onSuccess: (response) => {
            toast.success(response.message)
            fetchTicket(Ticket?.id as string)
            onClose()
        }
    })

    const onSubmit = (data: { amount: string; reason: string }) => {
        const payload: offerRebuttalPayload = {
            data: {
                message: data.reason,
                suggestedAmount: Number(data.amount)
            },
            id: Ticket?.id as string
        }
        mutation.mutate(payload)
    }


    return (
        <SectionBox mt={8} p={6} w={"298px"}>
            <HStack justify={"space-between"} align={"center"}>
                <Text
                    letterSpacing={"1.1px"}
                    mt={0}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >
                    Edit / Rebut Amount
                </Text>
                <Center
                    bg={expenseStatus[2].bgColor}
                    rounded={"full"}
                    className="text-[10px] satoshi-bold"
                    py={0}
                    px={1}
                    color={expenseStatus[2].color}
                    border={`1px solid ${expenseStatus[2].borderColor}`}
                >
                    {expenseStatus[2].label}
                </Center>
            </HStack>
            <Box>
                <Text
                    letterSpacing={"1.1px"}
                    mt={3}
                    mb={2}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >
                    Requested Amount
                </Text>
                <Flex
                    bg={"#F5F5F5"}
                    align={"center"}
                    border={"1px solid #F4F4F4"}
                    className="satoshi-bold"
                    rounded={"12px"}
                    fontSize={"sm"}
                    py={2}
                    px={4}
                >
                    <Text fontSize={"xs"} mr={1} color={"#4A4A4A"}>
                        ₦
                    </Text>
                    450
                </Flex>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Box>
                    <Text
                        letterSpacing={"1.1px"}
                        mt={3}
                        mb={2}
                        className="satoshi-bold uppercase text-[#757575] text-[10px]"
                    >
                        Rebuttal Amount
                    </Text>
                    <CustomInput
                        name="amount"
                        control={control}
                        borderColor="#2A3348"
                        rounded="12px"
                        startElement={
                            <Text fontSize={"xs"} ml={1} mr={1} color={"#4A4A4A"}>
                                ₦
                            </Text>
                        }
                    />
                </Box>
                <Text className="satoshi-medium text-[11px] text-[#4A4A4A] p-1">
                    Suggested based on market average for similar repairs.
                </Text>
                <Text
                    letterSpacing={"1.1px"}
                    mt={3}
                    className="satoshi-bold uppercase text-[#757575] text-[10px]"
                >
                    Rebuttal Reason
                </Text>
                <CustomTextarea
                    control={control}
                    name="reason"
                    placeholder="Explain why this request is being 
                rejected..."
                />
                <MainButton
                    variant="darkGhost"
                    size="lg"
                    type='submit'
                    className="satoshi-bold mt-6 mb-3 h-[40px]  text-sm"
                >
                    Send Rebuttal
                </MainButton>
                <MainButton
                    onClick={onClose}
                    variant="outline"
                    size="lg"
                    className="satoshi-bold h-[40px] rounded-full text-sm"
                >
                    Cancel
                </MainButton>
            </form>
        </SectionBox>
    )
}

const EditBudgetPage = ({ onClose }: { onClose: () => void }) => {

    const Ticket = useTicketStore((state) => state.ticket)
    const fetchTicket = useTicketStore((state) => state.fetchTicket)
    const { control, handleSubmit } = useForm<{ amount: string }>({
        defaultValues: {
            amount: Ticket?.budget?.toString()
        }
    })

    const mutation = useMutation({
        mutationFn: (data: updateBudgetPayload) => updateBudget(data),
        onSuccess: (response) => {
            toast.success(response.message)
            fetchTicket(Ticket?.id as string)
            onClose()
        }
    })
    const onSubmit = (data: { amount: string }) => {
        const payload: updateBudgetPayload = {
            id: Ticket?.id as string,
            data: {
                budget: Number(data.amount),
                quotedCost: Ticket?.quotedCost as number ?? 0
            }
        }
        mutation.mutate(payload)

    }
    return (
        <SectionBox mt={8} p={6} w={"298px"}>
            <Text
                letterSpacing={"1.1px"}
                className="satoshi-bold uppercase text-[#757575] text-[10px]"
            >
                Edit Budget
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <Text
                        letterSpacing={"1.1px"}
                        mt={3}
                        mb={2}
                        className="satoshi-bold uppercase text-[#757575] text-[10px]"
                    >
                        budget limit
                    </Text>
                    <CustomInput
                        name="amount"
                        control={control}
                        bg="#F5F5F5"
                        borderColor="#F4F4F4"
                        rounded="12px"
                        value={Ticket?.budget}
                        startElement={
                            <Text fontSize={"xs"} ml={1} mr={1} color={"#4A4A4A"}>
                                ₦
                            </Text>
                        }
                    />
                </Box>
                <HStack
                    justify={"space-between"}
                    px={1}
                    bg={"transparent"}
                    mt={2}
                    mb={2}
                    py={1}
                    rounded={"full"}
                    className="text-sm"
                >
                    <Text
                    >
                        Expenses Recorded
                    </Text>
                    <Text
                        color={"#2A3348"}
                        className="satoshi-bold"
                    >
                        ₦450
                    </Text>
                </HStack>
                <Flex gap={2}>
                    <MainButton
                        variant="darkGhost"
                        size="lg"
                        type='submit'
                        loading={mutation.isPending}
                        className="satoshi-bold h-[33px] text-xs"
                    >
                        Save Changes
                    </MainButton>
                    <MainButton
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                        className="satoshi-bold h-[33px] rounded-full text-xs"
                    >
                        Cancel
                    </MainButton>
                </Flex>
            </form>
        </SectionBox>
    )
}