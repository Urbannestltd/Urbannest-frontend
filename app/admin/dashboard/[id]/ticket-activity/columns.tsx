import {
    formatDate,
    formatDateDash,
    formatDateRegular,
    formatNumber,
} from "@/services/date"
import { Box, Button, Circle, Flex, HStack, Input, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { BiEdit, BiFlag, BiTrash } from "react-icons/bi"
import { BsFillFlagFill } from "react-icons/bs"
import { IoFlag, IoFlagOutline } from "react-icons/io5"
import { MdOutlineChatBubbleOutline } from "react-icons/md"
import { CiSquareRemove } from "react-icons/ci"
import { AiOutlineWarning } from "react-icons/ai"
import { LuCheck, LuPencil, LuX } from "react-icons/lu"
import { Modal } from "@/components/ui/dialog"
import { DeletePopup, FlagMistake } from "./moodal"
import { RebuttalPage, RejectionPage } from "@/app/admin/maintenance-and-issues/[id]/expense-tracking"

export interface ExpenseLog {
    maintenanceRequestId: string
    category: string
    propertyId: string
    unitId: string
    description: string
    date: string
    status: string
    updatedAt: string
    createdAt: string
    amount: number
    id: string
}

export const expenseStatus = [
    {
        text: "LOGGED",
        value: "LOGGED",
        color: "#545F73",
        textColor: "#10B981",
        bg: '',
        border: ''
    },
    {
        text: "FLAGGED AS MISTAKE",
        value: "FLAGGED",
        color: "#9F403D",
        textColor: "#F2C391",
        bg: '',
        border: ''
    },
    {
        text: "PENDING",
        value: "PENDING",
        textColor: "#9F5C3D",
        bg: '#FEC3831A',
        border: '#FEC38333',
        descBg: '#FEC38326'
    },
    {
        text: "REJECTED",
        value: "REJECTED",
        textColor: "#9F403D",
        bg: '#FE89830D',
        border: '#FE898333',
        descBg: '#FE89831A'
    },
    {
        text: "REBUTTAL RECEIVED",
        value: "REBUTTED",
        textColor: "#0F3A70",
        bg: '#83BAFE1A',
        border: '#83BAFE33',
        descBg: '#83BAFE26'
    },
]

export const categoryOptions = [
    { label: "Parts", value: "PARTS" },
    { label: "Supplies", value: "SUPPLIES" },
    { label: "Labor", value: "LABOR" },
    { label: "Equipments", value: "EQUIPMENTS" },
    { label: "Transport Costs", value: "TRANSPORT_COSTS" },
    { label: "Permits", value: "PERMITS" },
]

export const useColumns = (): ColumnDef<ExpenseLog, any>[] => {

    return [
        {
            accessorFn: (row) => row.description,
            id: "description",
            meta: {
                getColSpan: (row: ExpenseLog) =>
                    row.status === "LOGGED" || row.status === "FLAGGED" ? 1 : 2,
            },
            header: () => (
                <Text
                    textTransform={"uppercase"}
                    letterSpacing={"1.1px"}
                    className="satoshi-bold uppercase text-[11px]"
                >
                    Description
                </Text>
            ),
            cell: ({ row }) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.original.status,
                )
                return (
                    <Flex alignItems={color?.value === "LOGGED" || color?.value === "FLAGGED" ? "center" : "top"}>
                        {color?.value === "LOGGED" || color?.value === "FLAGGED" ? (
                            <Circle bgColor={color.color} size={"8px"} mr={2.5} />
                        ) : color?.value === "REBUTTED" ? (
                            <MdOutlineChatBubbleOutline className="mr-2.5 mt-0.5" size={18} color={color.textColor} />
                        ) : color?.value === "REJECTED" ? (
                            <CiSquareRemove className="mr-2.5 mt-0.5" size={18} color={color.textColor} />
                        ) : color?.value === "PENDING" ? (
                            <AiOutlineWarning className="mr-2.5 mt-0.5" size={18} color={color.textColor} />
                        ) : (
                            null
                        )}
                        <Box>
                            <Text className="satoshi-bold">{row.getValue("description")}</Text>
                            {(color?.value !== "LOGGED" && color?.value !== "FLAGGED") ?
                                <Text
                                    fontSize={"12px"}
                                    w={'303px'}
                                    textWrap={'balance'}
                                    fontWeight={"normal"}
                                    color={color?.textColor}
                                    className="satoshi-bold"
                                >
                                    This expense exceeds the assigned budget. A budget approval request has been sent to admin.
                                </Text>
                                : null}
                        </Box>
                    </Flex>
                )
            },
        },
        {
            accessorFn: (row) => row.category,
            id: "category",
            meta: {
                getColSpan: (row: ExpenseLog) =>
                    row.status === "LOGGED" || row.status === "FLAGGED" ? 1 : 0,
            },
            header: () => (
                <Text
                    textTransform={"uppercase"}
                    letterSpacing={"1.1px"}
                    className="satoshi-bold uppercase text-[11px]"
                >
                    category
                </Text>
            ),
            cell: ({ row }) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.original.status,
                )

                return (
                    color?.value === "LOGGED" || color?.value === "FLAGGED" ?
                        <Text
                            bg={"#E1E9EE"}
                            w={"fit"}
                            px={2}
                            py={1}
                            textAlign={"center"}
                            color={"#566166"}
                            textTransform={"capitalize"}
                            rounded={"4px"}
                        >
                            {row.original.category.toLowerCase()}
                        </Text> : null
                )
            },
        },
        {
            accessorFn: (row) => row.date,
            id: "date",
            header: () => (
                <Text
                    textTransform={"uppercase"}
                    letterSpacing={"1.1px"}
                    className="satoshi-bold uppercase text-[11px]"
                >
                    Date
                </Text>
            ),
            cell: ({ row }) => {
                return <Text>{formatDateRegular(row.getValue("date"))}</Text>
            },
        },
        {
            accessorFn: (row) => row.amount,
            id: "amount",
            header: () => (
                <Text
                    textTransform={"uppercase"}
                    textAlign={"end"}
                    minW={"138px"}
                    w={"fit"}
                    letterSpacing={"1.1px"}
                    className="satoshi-bold uppercase text-[11px]"
                >
                    Amount
                </Text>
            ),
            cell: ({ row }) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.original.status,
                )

                return (
                    <Flex direction={"column"} minW={"138px"} w={"fit"} justify={"end"}>
                        <Text className="satoshi-bold" textAlign={"end"}>
                            {formatNumber(row.original.amount)}
                        </Text>
                        <Text
                            color={color?.textColor}
                            textAlign={"end"}
                            className="satoshi-bold"
                        >
                            {color?.text}
                        </Text>
                    </Flex>
                )
            },
        },
        {
            accessorKey: "status",
            header: "",
            cell: ({ row }) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.original.status,
                )
                // const [Flagged, SetFlagged] = useState(false)
                const [rebutted, SetRebutted] = useState(false)
                const [rejected, SetRejected] = useState(false)

                return (
                    <Flex>
                        {color?.value === "LOGGED" || color?.value === "REJECTED" ? (

                            <IoFlagOutline
                                cursor={"pointer"}
                                color="#A9B4B999"
                                size={"15px"}
                            />

                        ) :
                            (color?.value === 'REBUTTED' || color?.value === "PENDING" || color?.value === "FLAGGED") ? <Flex gap={2} direction={'column'}>
                                <Button bg={'#ECFDF5'} color={'#047857'} h={'30px'} fontSize={'12px'} border={'1px solid #D1FAE5'} py={0} rounded={'full'} px={2}>Accept</Button>
                                <HStack>
                                    {color.value === 'PENDING' && <Button onClick={() => SetRebutted(true)} color='#3688EE' fontSize={'12px'} h={'30px'} bg={'#83BAFE1A'} py='0' border={'1px solid #83BAFE26'} rounded={'full'} px={2}>Counter</Button>}
                                    <Button onClick={() => SetRejected(true)} color='#B91C1C' fontSize={'12px'} h={'30px'} bg={'#FEF2F2'} py='0' border={'1px solid #FEE2E2'} rounded={'full'} px={2}>Cancel</Button></HStack>

                            </Flex> : null

                        }
                        {// <Modal size={'sm'} open={Flagged} modalContent={<FlagMistake onClose={() => SetFlagged(false)} />} onOpenChange={SetFlagged} />
                        }
                        <Modal size={'sm'} open={rejected} modalContent={<RejectionPage id={row.original.id} onClose={() => SetRejected(false)} />} onOpenChange={SetRejected} />
                        <Modal size={'sm'} open={rebutted} modalContent={<RebuttalPage id={row.original.id} onClose={() => SetRebutted(false)} />} onOpenChange={SetRebutted} />
                    </Flex>
                )
            },
        },
    ]
    /* return [
         {
             accessorFn: (row) => row.description,
             id: 'description',
             header: () => <Text textTransform={'uppercase'} letterSpacing={"1.1px"}
 
                 className="satoshi-bold uppercase text-[11px]">Description</Text>,
             cell: ({ row }) => {
                 const color = expenseStatus.find((item) => item.value === row.original.status)
                 return <Flex alignItems={'center'}>
                     {(color?.value === "LOGGED" || color?.value === 'FLAGGED') && <Circle bgColor={color.color} size={'8px'} mr={2.5} />}
                     <Text className="satoshi-bold">{row.getValue('description')}</Text>
                 </Flex>
             },
         },
         {
             accessorFn: (row) => row.category,
             id: 'category',
             header: () => <Text textTransform={'uppercase'} letterSpacing={"1.1px"}
 
                 className="satoshi-bold uppercase text-[11px]">category</Text>,
             cell: ({ row }) => <Text bg={'#E1E9EE'} w={'fit'} px={2} py={1} textAlign={'center'} color={'#566166'} textTransform={'capitalize'} rounded={'4px'}>{row.original.category.toLowerCase()}</Text>,
         },
         {
             accessorFn: (row) => row.date,
             id: 'date',
             header: () => <Text textTransform={'uppercase'} letterSpacing={"1.1px"}
 
                 className="satoshi-bold uppercase text-[11px]">Date</Text>,
             cell: ({ row }) => <Text>{formatDateRegular(row.getValue('date'))}</Text>,
         },
         {
             accessorFn: (row) => row.amount,
             id: 'amount',
             header: () => <Text textTransform={'uppercase'} textAlign={'end'} minW={'138px'} w={'fit'} letterSpacing={"1.1px"}
 
                 className="satoshi-bold uppercase text-[11px]">Amount</Text>,
             cell: ({ row }) => {
                 const color = expenseStatus.find((item) => item.value === row.original.status)
                 return (<Flex direction={'column'} minW={'138px'} w={'fit'} justify={'end'}>
                     <Text className="satoshi-bold" textAlign={'end'}>{formatNumber(row.original.amount)}</Text>
                     <Text color={color?.textColor} textAlign={'end'} className="satoshi-bold">{color?.text}</Text>
 
                 </Flex>)
             },
         },
         {
             accessorKey: 'status',
             header: '',
             cell: ({ row }) => {
                 const color = expenseStatus.find((item) => item.value === row.original.status)
                 const [Flagged, SetFlagged] = useState(color?.value === 'FLAGGED')
                 return (
                     (color?.value === 'FLAGGED' || color?.value === 'LOGGED') ? Flagged ? <IoFlag onClick={() =>
                         SetFlagged(!Flagged)} color={'#EA9C4899'} size={'15px'} /> : <IoFlagOutline onClick={() => SetFlagged(!Flagged)} cursor={'pointer'} color="#A9B4B999" size={'15px'} /> : null
                 )
             }
 
         }
     ]*/
}
