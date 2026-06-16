import { Box, Button, Flex, Input, Text } from "@chakra-ui/react"
import { categoryOptions, ExpenseLog, expenseStatus } from "./columns"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatDate, formatNumber } from "@/services/date"
import { useState } from "react"
import { IoFlag, IoFlagOutline } from "react-icons/io5"
import { DeletePopup, FlagMistake } from "./modaal"
import { Modal } from "@/components/ui/dialog"
import { LuCheck, LuPencil, LuX } from "react-icons/lu"
import { BiTrash } from "react-icons/bi"
import Image from "next/image"
import EmptyIcon from '@/app/assets/icons/facilty-icons/expense-empty.svg'
import { useMutation } from "@tanstack/react-query"
import { acceptExpenseRebuttal, acceptExpenseRebuttalPayload, cancelExpense, cancelExpensePayload, editExpense, editExpensePayload } from "@/services/fm/ticket"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useTicketStore } from "@/store/fm/ticket"

export const MobileTable = ({ data, tableName, ticketId }: { data: ExpenseLog[], tableName: string, ticketId: string }) => {
    const [isFlagged, setIsFlagged] = useState<{ id: string, ticketId: string } | null>(null)
    const [Delete, setDelete] = useState<{ id: string, ticketId: string } | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<Partial<ExpenseLog>>({})
    const fetchExpense = useTicketStore((state) => state.fetchExpenses)

    const startEdit = (row: ExpenseLog) => {
        setEditingId(row.id)
        setEditValues({ description: row.description, category: row.category, date: row.date, amount: row.amount })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValues({})
    }

    const editMutation = useMutation({
        mutationFn: (data: editExpensePayload) => editExpense(data),
        onSuccess: () => {
            fetchExpense(ticketId)
            setEditingId(null)
            setEditValues({})
            toast.success('Expense updated successfully')
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to edit expense')
        }
    })

    const saveEdit = (row: ExpenseLog) => {
        editMutation.mutate({
            id: row.id,
            ticketId: row.maintenanceRequestId,
            data: {
                date: editValues.date ?? '',
                amount: editValues.amount ?? 0,
                category: editValues.category ?? '',
                description: editValues.description ?? '',
            },
        })
    }

    const emptyDetails = {
        icon: EmptyIcon,
        title: 'No expense yet',
        description: 'No expenses have been logged for this ticket yet. Click log expenses to add an expense.'
    }

    const acceptRebutMutation = useMutation({
        mutationFn: (data: acceptExpenseRebuttalPayload) => acceptExpenseRebuttal(data),
        onSuccess: () => {
            fetchExpense(ticketId)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to delete expense')
        }
    })

    const cancelMututation = useMutation({
        mutationFn: (data: cancelExpensePayload) => cancelExpense(data),
        onSuccess: () => {
            fetchExpense(ticketId)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to delete expense')
        }
    })

    const onSubmit = (data: acceptExpenseRebuttalPayload) => {
        acceptRebutMutation.mutate(data)
    }

    const handleCancel = (data: cancelExpensePayload) => {
        cancelMututation.mutate(data)
    }

    return (
        <Box>
            {data.length === 0 && <div className='flex flex-col items-center justify-center my-16 space-y-6'>
                <div className='flex items-center justify-center'>
                    {emptyDetails?.icon ? <Image src={emptyDetails?.icon} width={40} height={40} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
                </div>

                <div className='flex flex-col items-center justify-center space-y-2'>
                    <h4 className='text-xl satoshi-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                    <p className='text-sm text-center satoshi-medium text-[#6A6C88]'>
                        {emptyDetails?.description || `No ${tableName} found`}
                    </p>
                </div>
            </div>}
            {data.map((row) => {
                const color = expenseStatus.find(
                    (item) => item.value === row.status,
                )
                if (color?.value === 'REJECTED' || color?.value === "REBUTTED" || color?.value === "PENDING") {
                    const isEditing = editingId === row.id
                    return (
                        <SectionBox my={4} key={row.id} p={0} bg={color.bg} border={`1px solid ${color.border}`} className="border-b border-[#D9D9D9]">
                            {isEditing ? (
                                <Flex direction={'column'} gap={2} p={4}>
                                    <Input
                                        value={editValues.description ?? ''}
                                        onChange={(e) => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Description"
                                        size="sm"
                                        borderColor={'#A9B4B9'}
                                        rounded={'6px'}
                                        fontSize={'14px'}
                                    />
                                    <select
                                        value={editValues.category ?? ''}
                                        onChange={(e) => setEditValues((prev) => ({ ...prev, category: e.target.value }))}
                                        style={{ border: '1px solid #A9B4B9', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', color: '#566166', background: '#fff', width: '100%' }}
                                    >
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <Flex gap={2}>
                                        <Input
                                            type="date"
                                            value={editValues.date ?? ''}
                                            onChange={(e) => setEditValues((prev) => ({ ...prev, date: e.target.value }))}
                                            size="sm"
                                            borderColor={'#A9B4B9'}
                                            rounded={'6px'}
                                            fontSize={'14px'}
                                        />
                                        <Input
                                            type="number"
                                            value={editValues.amount ?? ''}
                                            onChange={(e) => setEditValues((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                                            size="sm"
                                            borderColor={'#A9B4B9'}
                                            rounded={'6px'}
                                            fontSize={'14px'}
                                            textAlign={'end'}
                                        />
                                    </Flex>
                                    <Flex gap={3} mt={1}>
                                        <LuCheck
                                            color={editMutation.isPending ? '#A9B4B9' : '#047857'}
                                            size={22}
                                            cursor={editMutation.isPending ? 'not-allowed' : 'pointer'}
                                            onClick={editMutation.isPending ? undefined : () => saveEdit(row)}
                                        />
                                        <LuX color="#B91C1C" size={22} cursor="pointer" onClick={cancelEdit} />
                                    </Flex>
                                </Flex>
                            ) : (
                                <Flex justify={'space-between'} p={4} align={'center'}>
                                    <Box>
                                        <Text className="satoshi-bold text-base">
                                            {row?.description}
                                        </Text>
                                        <Flex className=" text-[#717C82] text-xs">{formatDate(row?.date)} • <Text color={color?.textColor} ml={1} className="satoshi-bold">{color?.text}</Text></Flex>
                                        {color?.value === 'REBUTTED' ? <Flex gap={2} mt={2}>
                                            <Button bg={'#ECFDF5'} color={'#047857'} h={'30px'} fontSize={'12px'} loading={acceptRebutMutation.isPending} onClick={() => onSubmit({ id: row.id, ticketId: row.maintenanceRequestId })} border={'1px solid #D1FAE5'} py={0} rounded={'full'} px={2}>Accept</Button>
                                            <Button color='#B91C1C' fontSize={'12px'} h={'30px'} bg={'#FEF2F2'} py='0' loading={cancelMututation.isPending} onClick={() => handleCancel({ id: row.id, ticketId: row.maintenanceRequestId })} border={'1px solid #FEE2E2'} rounded={'full'} px={2}>Cancel</Button>
                                        </Flex> : null}
                                    </Box>
                                    <Flex direction={'column'} align={'end'}>
                                        <Text className="satoshi-bold" mb={1} textAlign={"end"}>
                                            {formatNumber(row.amount)}
                                        </Text>
                                        <Flex>
                                            {(color?.value === "REJECTED" || color?.value === "PENDING") &&
                                                <Flex>
                                                    <LuPencil
                                                        color="#A9B4B9"
                                                        size={18}
                                                        cursor={'pointer'}
                                                        className="mr-2"
                                                        onClick={() => startEdit(row)}
                                                    />
                                                    <BiTrash color="#B91C1C" size={18} onClick={() => setDelete({ id: row.id, ticketId: row.maintenanceRequestId })} cursor={'pointer'} />
                                                </Flex>
                                            }
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )}
                            {!isEditing && (
                                <Box bg={color.descBg} color={color.textColor} fontSize={'13px'} p={4}>
                                    This expense exceeds the assigned budget. A budget approval
                                    request has been sent to admin.
                                </Box>
                            )}
                        </SectionBox>
                    )

                }
                return (
                    <SectionFlex my={4} key={row.id} justify={'space-between'} align={'center'} className="border-b border-[#D9D9D9]">
                        <Box
                        >
                            <Text className="satoshi-bold text-base">
                                {row?.description}
                            </Text>
                            <Flex className=" text-[#717C82] text-xs">{formatDate(row?.date)} • <Text color={color?.textColor} ml={1} className="satoshi-bold">{color?.text}</Text></Flex>
                            <Text
                                bg={"#E1E9EE"}
                                w={"fit"}
                                px={2}
                                py={1}
                                mt={2}
                                textAlign={"center"}
                                className=" text-xs"
                                color={"#566166"}
                                textTransform={"capitalize"}
                                rounded={"4px"}
                            >
                                {row.category.toLowerCase()}
                            </Text>
                        </Box>
                        <Flex direction={'column'} align={'end'}>
                            <Text className="satoshi-bold" mb={1} textAlign={"end"}>
                                {formatNumber(row.amount)}
                            </Text>
                            {color?.value === "FLAGGED" ? (
                                <IoFlag
                                    color={"#EA9C4899"}
                                    size={"15px"}
                                />
                            ) : (
                                <IoFlagOutline
                                    onClick={() => setIsFlagged({ id: row.id, ticketId: row.maintenanceRequestId })}
                                    cursor={"pointer"}
                                    color="#A9B4B999"
                                    size={"15px"}
                                />
                            )}
                        </Flex>
                    </SectionFlex>
                )
            })}
            <Modal className="w-[90%]" size={'xs'} open={isFlagged !== null} modalContent={<FlagMistake id={isFlagged?.id as string} ticketId={isFlagged?.ticketId as string} onClose={() => setIsFlagged(null)} />} onOpenChange={(open) => open ? setIsFlagged(isFlagged) : setIsFlagged(null)} />
            <Modal className="w-[90%]" size={'xs'} open={Delete !== null} modalContent={<DeletePopup id={Delete?.id as string} ticketId={Delete?.ticketId as string} onClose={() => setDelete(null)} />} onOpenChange={(open) => open ? setDelete(Delete) : setDelete(null)} />

        </Box>


    )
}