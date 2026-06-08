import { MainButton } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Divider } from "@/components/ui/divider"
import { SectionFlex } from "@/components/ui/section-box"
import { cn } from "@/utils/lib"
import { Box, Center, Flex, HStack, Text } from "@chakra-ui/react"
import { BiPlusCircle } from "react-icons/bi"
import { useColumns } from "./columns"
import { LogExpense } from "./modaal"
import { useState } from "react"
import { Drawers } from "@/components/ui/drawer"
import { MdOutlineAccountBalanceWallet } from "react-icons/md"
import { Progress } from "@/components/ui/progress-bar"
import { MobileTable } from "./mobile-table"
import EmptyIcon from "@/app/assets/icons/facilty-icons/expense-empty.svg"
import { useTicketStore } from "@/store/fm/ticket"
import { formatNumber } from "@/services/date"

export const ExpenseLogging = ({ id }: { id: string }) => {
    const budget = useTicketStore((state) => state.globalBudget)
    const expenses = useTicketStore((state) => state.expense)
    const fetchExpense = useTicketStore((state) => state.fetchExpenses)
    const columns = useColumns()
    const [open, setOpen] = useState(false)
    const isMobile = window.innerWidth < 600
    const expenseDetail = [
        {
            title: "Assigned Budget",
            data: formatNumber(budget?.budget),
        },
        {
            title: "TOTAL EXPENSES",
            data: formatNumber(budget?.quotedCost),
            className: "border-l border-r h-[40px] border-[##A9B4B933]",
        },
        {
            title: "Remaining",
            data: formatNumber(0),
        },
    ]
    return (
        <Box px={{ base: 4, md: 8 }}>
            <SectionFlex
                w={"full"}
                justify={{ base: "flex-start", md: "center" }}
                bg={"#F0F4F780"}
            >
                {isMobile ? (
                    <Box w={"full"}>
                        <HStack w={"full"} justify={"space-between"}>
                            <Box>
                                <Text
                                    letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#757575] text-[11px]"
                                >
                                    {expenseDetail[1].title}
                                </Text>
                                <Text className="satoshi-bold text-xl">
                                    {expenseDetail[1].data}
                                </Text>
                            </Box>
                            <Drawers
                                placement={{ base: "bottom", md: "end" }}
                                open={open}
                                onOpenChange={setOpen}
                                triggerElement={
                                    <Center bg={"#CAD5ED4D"} p={2} rounded={"sm"}>
                                        <MdOutlineAccountBalanceWallet color="#545F73" />{" "}
                                    </Center>
                                }
                                modalContent={
                                    <LogExpense ticketid={id} onClose={() => setOpen(false)} />
                                }
                            />
                        </HStack>
                        <Progress value={60} my={4} color={"#545F73"} size={"md"} />
                        <HStack justify={"space-between"}>
                            <Box h={"50px"} w={"fit"}>
                                <Text
                                    letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#717C82] text-[11px]"
                                >
                                    {expenseDetail[0].title}:
                                </Text>
                                <Text
                                    letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#717C82] text-[11px]"
                                >
                                    {expenseDetail[0].data}
                                </Text>
                            </Box>
                            <Box h={"50px"} w={"fit"}>
                                <Text
                                    letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#545F73] text-[11px]"
                                >
                                    {expenseDetail[2].title}:
                                </Text>
                                <Text
                                    letterSpacing={"1.1px"}
                                    mb={1}
                                    className="satoshi-bold uppercase text-[#545F73] text-[11px]"
                                >
                                    {expenseDetail[2].data}
                                </Text>
                            </Box>
                        </HStack>
                    </Box>
                ) : (
                    expenseDetail.map((item, index) => (
                        <Box
                            key={index}
                            h={"50px"}
                            w={"full"}
                            className={cn(item.className, "px-12 ")}
                        >
                            <Text
                                letterSpacing={"1.1px"}
                                mb={1}
                                className="satoshi-bold uppercase text-[#757575] text-[11px]"
                            >
                                {item.title}
                            </Text>
                            <Text className="satoshi-bold text-xl">{item.data}</Text>
                        </Box>
                    ))
                )}
                {!isMobile && (
                    <Drawers
                        className="min-w-[450px] w-fit"
                        placement={{ base: "bottom", md: "end" }}
                        open={open}
                        onOpenChange={setOpen}
                        triggerElement={
                            <MainButton
                                size="lg"
                                icon={<BiPlusCircle />}
                                className="h-[40px]"
                            >
                                Log Expense
                            </MainButton>
                        }
                        modalContent={
                            <LogExpense
                                ticketid={id}
                                onClose={() => {
                                    fetchExpense(id)
                                    setOpen(false)
                                }}
                            />
                        }
                    />
                )}
            </SectionFlex>
            {isMobile ? (
                <MobileTable tableName="Expense Log" data={expenses} />
            ) : (
                <DataTable
                    columns={columns}
                    borderedHeader
                    tableName="Expense Logs"
                    headerColor="#ffffff"
                    data={expenses}
                    getRowClassName={(row) => {
                        if (row.status === "REJECTED")
                            return "bg-[#FE89830D] hover:bg-[#FE89830D]  border-l-4 border-t border-[#FE898333]  data-[state=selected]:bg-[#FE89830D] my-4"
                        if (row.status === "PENDING")
                            return "bg-[#FEC3831A] hover:bg-[#FEC3831A] data-[state=selected]:bg-[#FEC3831A] border-l-4 border-t border-[#FEC38333] my-4"
                        if (row.status === "REBUTTED")
                            return "bg-[#83BAFE1A] hover:bg-[#83BAFE1A] border-l-4 border-t border-[#83BAFE33] data-[state=selected]:bg-[#83BAFE1A] my-4"
                        return ""
                    }}
                    emptyDetails={{
                        icon: EmptyIcon,
                        title: "No expenses yet",
                        description:
                            "No expenses have been logged for this ticket yet. Click log expenses to add an expense.",
                    }}
                />
            )}
            <Box bg={"#F5F5F54D"} borderTop={"1px solid #F4F4F4"} p={4} py={6}></Box>
        </Box>
    )
}
