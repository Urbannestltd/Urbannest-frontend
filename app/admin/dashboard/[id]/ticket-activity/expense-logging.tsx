import { MainButton } from "@/components/ui/button";
import { CustomEditable, CustomInput } from "@/components/ui/custom-fields";
import { DataTable } from "@/components/ui/data-table";
import { SectionFlex } from "@/components/ui/section-box";
import { updateBudget, updateBudgetPayload } from "@/services/admin/maintenance";
import { cn } from "@/utils/lib";
import { Box, Center, Flex, HStack, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { BiPlusCircle } from "react-icons/bi";
import { useColumns } from "./columns";
import { LogExpense } from "./moodal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { Progress } from "@/components/ui/progress-bar";
import { MobileTable } from "./mobile-table";
import EmptyIcon from '@/app/assets/icons/facilty-icons/expense-empty.svg'
import { Expensee, useTicketStore } from "@/store/admin/tickets";
import { formatNumber } from "@/services/date";
import { Modal } from "@/components/ui/dialog";
import toast from "react-hot-toast";

export const ExpenseLogging = ({ id }: { id: string }) => {
    const ticket = useTicketStore(state => state.ticket)
    const fetchTicket = useTicketStore(state => state.fetchTicket)
    //const expenses = useTicketStore(state => state.expense)
    const columns = useColumns()
    const [open, setOpen] = useState(false)
    const [editBudget, setEditBudget] = useState(false)
    const isMobile = window.innerWidth < 600

    const { control, handleSubmit, reset } = useForm<{ amount: string }>({
        defaultValues: { amount: ticket?.budget?.toString() }
    })

    const budgetMutation = useMutation({
        mutationFn: (data: updateBudgetPayload) => updateBudget(data),
        onSuccess: (response) => {
            toast.success(response.message)
            fetchTicket(id)
            setEditBudget(false)
        }
    })

    const onSaveBudget = (data: { amount: string }) => {
        budgetMutation.mutate({
            id,
            data: {
                budget: Number(data.amount),
                quotedCost: ticket?.quotedCost as number ?? 0
            }
        })
    }

    const handleCancelEdit = () => {
        reset({ amount: ticket?.budget?.toString() })
        setEditBudget(false)
    }

    const expenseDetail = [
        {
            title: 'Assigned Budget',
            data: formatNumber(ticket?.budget)
        },
        {
            title: 'TOTAL EXPENSES',
            data: formatNumber(ticket?.quotedCost),
            className: 'border-l border-r h-[40px] border-[##A9B4B933]'
        },
        {
            title: 'Remaining',
            data: formatNumber(0)
        }
    ]
    return <Box px={{ base: 4, md: 8 }}>
        <form onSubmit={handleSubmit(onSaveBudget)}>
            <SectionFlex w={'full'} justify={{ base: 'flex-start', md: 'center' }} bg={'#F0F4F780'}>
                {isMobile ?
                    <Box w={'full'}>
                        <HStack w={'full'} justify={'space-between'}>
                            <Box>
                                <Text letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#757575] text-[11px]"
                                >{expenseDetail[1].title}</Text>
                                <Text className="satoshi-bold text-xl">{expenseDetail[1].data}</Text>
                            </Box>
                            <Modal open={open} onOpenChange={setOpen} triggerElement={<Center bg={'#CAD5ED4D'} p={2} rounded={'sm'}><MdOutlineAccountBalanceWallet color="#545F73" /> </Center>} modalContent={<LogExpense ticketid={id} onClose={() => setOpen(false)} />} />
                        </HStack>
                        <Progress value={60} my={4} color={'#545F73'} size={'md'} />
                        <HStack justify={'space-between'}>
                            <Box
                                h={"50px"}
                                w={'fit'}
                            >
                                <Text letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#717C82] text-[11px]"
                                >{expenseDetail[0].title}:</Text>
                                <Text letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#717C82] text-[11px]"
                                >{expenseDetail[0].data}</Text>
                            </Box>
                            <Box
                                h={"50px"}
                                w={'fit'}
                            >
                                <Text letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#545F73] text-[11px]"
                                >{expenseDetail[2].title}:</Text>
                                <Text letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#545F73] text-[11px]"
                                >{expenseDetail[2].data}</Text>
                            </Box>

                        </HStack>

                    </Box>
                    :
                    <>
                        {expenseDetail.map((item, index) => (
                            <Flex
                                justify={'center'}
                                key={index}
                                h={"50px"}
                                w={'full'}
                                className={cn(item.className)}
                            >
                                {index === 0 && editBudget ? (
                                    <div className="w-full px-2">
                                        <Text letterSpacing={"1.1px"}
                                            mb={1}
                                            className="satoshi-bold uppercase text-[#757575] text-[11px]"
                                        >{item.title}</Text>
                                        <CustomEditable
                                            textBold
                                            currency
                                            textSize={'18px'}
                                            textAlign="start"
                                            name="amount"
                                            control={control}
                                            width={'100%'}

                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Text letterSpacing={"1.1px"}
                                            mb={1}
                                            className="satoshi-bold uppercase text-[#757575] text-[11px]"
                                        >{item.title}</Text>
                                        <Text className="satoshi-bold text-xl">{item.data}</Text>
                                    </div>
                                )}
                            </Flex>
                        ))}
                    </>
                }
                {!isMobile && (
                    editBudget ? (
                        <HStack gap={2} w={'30%'} flexShrink={0}>
                            <MainButton
                                size='lg'
                                type='submit'
                                loading={budgetMutation.isPending}
                                className="h-[40px] rounded-full text-xs"
                            >
                                Save Changes
                            </MainButton>
                            <MainButton
                                size='lg'
                                variant='outline'
                                onClick={handleCancelEdit}
                                className="h-[40px] rounded-full text-xs"
                            >
                                Cancel
                            </MainButton>
                        </HStack>
                    ) : (
                        <MainButton size='lg' icon={<BiPlusCircle />} onClick={() => setEditBudget(true)} className="h-[40px]">Edit Budget</MainButton>
                    )
                )}
            </SectionFlex>
        </form>
        {isMobile ?
            <MobileTable tableName="Expense Log" data={ticket?.expenses as Expensee[]} /> : <DataTable
                columns={columns}
                borderedHeader
                headerColor="#ffffff"
                data={ticket?.expenses as Expensee[]}
                getRowClassName={(row) => {
                    if (row.status === 'REJECTED') return 'bg-[#FE89830D] hover:bg-[#FE89830D]  border-l-4 border-t border-[#FE898333]  data-[state=selected]:bg-[#FE89830D] my-4'
                    if (row.status === 'PENDING') return 'bg-[#FEC3831A] hover:bg-[#FEC3831A] data-[state=selected]:bg-[#FEC3831A] border-l-4 border-t border-[#FEC38333] my-4'
                    if (row.status === 'REBUTTED') return 'bg-[#83BAFE1A] hover:bg-[#83BAFE1A] border-l-4 border-t border-[#83BAFE33] data-[state=selected]:bg-[#83BAFE1A] my-4'
                    return ''
                }}
                emptyDetails={{
                    icon: EmptyIcon,
                    title: 'No expenses yet',
                    description: 'No expenses have been logged for this ticket yet. Click log expenses to add an expense.'
                }}
            />}
        <Box bg={'#F5F5F54D'} borderTop={'1px solid #F4F4F4'} p={4} py={6}>

        </Box>

    </Box>;
};