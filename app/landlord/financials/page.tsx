"use client"

import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatNumber, getDateRange, getFinancialDateRange } from "@/services/date"
import { useLandlordFinancialsStore } from "@/store/landlord/financials"
import type { revenueChart, revenueShare, UnitRevenueChart } from "@/store/landlord/financials"
import { usePropertyStore } from "@/store/landlord/properties"
import { Box, Center, createListCollection, Flex, HStack, Skeleton, Text } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu"
import { MdOutlineFilterListOff, MdRefresh } from "react-icons/md"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import emptyTableIcon from "@/app/assets/icons/empty-state-icons/properties-empty.svg"
import { RevenueAnalytics, RevenueProperty } from "../dashboard/chart"
import { useColumns, useFinancialsColumns } from "./columns"
import { SearchInput } from "@/components/ui/search-input"

type FinancialFilterForm = {
    property: string[]
    dateRange: string[]
    status: string[]
    type: string[]
}

type RevenueShareLegendItem = revenueShare & {
    label: string
    color: string
}


const REVENUE_SHARE_COLORS = ["#2A3348", "#545F73", "#A9B4B9", "#C7CDD2", "#E1E5E8"]

const isUnit = (data: revenueChart | UnitRevenueChart): data is UnitRevenueChart => 'unitId' in data;

export default function LandlordFinancials() {
    const { control, reset, watch } = useForm<FinancialFilterForm>()
    const selectedProperty = useWatch({ control, name: "property" })?.[0] ?? "all"
    const selectedDateRange = useWatch({ control, name: "dateRange" })?.[0] ?? "last_30_days"
    const columns = useColumns()
    const transactCol = useFinancialsColumns()
    const properties = usePropertyStore((state) => state.properties)
    const formValues = watch()
    const fetchProperties = usePropertyStore((state) => state.fetchProperties)
    const {
        summary,
        revenueChart,
        revenueShare,
        arrears,
        transactions,
        loadingSummary,
        loadingRevenueChart,
        loadingRevenueShare,
        loadingArrears,
        loadingTransactions,
        exportingTransactions,
        fetchSummary,
        fetchRevenueChart,
        fetchRevenueShare,
        fetchArrears,
        fetchTransactions,
        exportTransactions,
    } = useLandlordFinancialsStore((state) => state)
    const filter = useMemo(() => {
        const { startDate, endDate } = getFinancialDateRange(selectedDateRange)

        return {
            propertyId: selectedProperty === "all" ? undefined : selectedProperty,
            startDate,
            endDate,
        }
    }, [selectedDateRange, selectedProperty])
    const propertyOptions = createListCollection({
        items: [
            { label: "All Properties", value: "all" },
            ...properties.map((property) => ({ label: property.name, value: property.id })),
        ],
    })
    const selectedRevenueChart = revenueChart
    const revenueProperties = selectedRevenueChart.map(toRevenueProperty)
    const occupancyProgress = summary?.totalUnitsCount
        ? Math.round((summary.activeLeasesCount / summary.totalUnitsCount) * 100)
        : 0
    const cardData: CardData[] = [
        {
            title: "Total Revenue Collected (YTD)",
            data: formatNumber(summary?.totalRevenueCollected ?? 0),
            border: true,
        },
        {
            title: "Total Outstanding Rent",
            data: formatNumber(summary?.totalOutstandingRent ?? 0),
            titleColor: "#9F403D",
            border: true,
        },
        {
            title: "Portfolio Occupancy",
            data: `${summary?.activeLeasesCount ?? 0}/${summary?.totalUnitsCount ?? 0} Units`,
            progress: occupancyProgress,
            border: true,
        },
    ]

    useEffect(() => {
        fetchProperties()
    }, [fetchProperties])

    useEffect(() => {
        fetchSummary(filter)
        fetchRevenueChart(filter)
        fetchRevenueShare(filter)
        fetchArrears(filter)
        fetchTransactions(filter)
    }, [fetchArrears, fetchRevenueChart, fetchRevenueShare, fetchSummary, filter, fetchTransactions])

    const handleExport = async () => {
        try {
            await exportTransactions(filter)
            toast.success("Transactions exported successfully")
        } catch {
            toast.error("Unable to export transactions")
        }
    }

    const handleAddExpense = () => {
        toast.error("Expense creation is not available for landlord financials yet")
    }

    const findProperty = (id: string) => {
        return propertyOptions.items.find((property) => property.value === id)?.label
    }


    return (
        <Box>

            <PageTitle title="Financials" mt={4} mb={4} fontSize={"24px"} />


            {loadingSummary ? (
                <Skeleton h={"118px"} rounded={"8px"} />
            ) : (
                <DashboardCard fourcolumn={false} data={cardData} />
            )}

            <HStack my={9} align={"end"} justify={"space-between"} gap={4} flexWrap={"wrap"}>
                <Flex align={'center'} gap={5} w={{ base: "full", md: "35%" }}>
                    <CustomSelect
                        control={control}
                        borderColor="#F4F4F4"
                        label="Select Property"
                        name="property"
                        placeholder="All Properties"
                        collection={propertyOptions}
                        width={"full"}
                    />
                    <CustomSelect
                        control={control}
                        borderColor="#F4F4F4"
                        icon={LuCalendar}
                        label="Date Range"
                        name="dateRange"
                        placeholder="Last 30 Days"
                        collection={dateFilter}
                        width={"full"}
                    />
                    <div>
                        {(selectedProperty !== "all" || selectedDateRange !== "last_30_days") ? (
                            <MdOutlineFilterListOff cursor={"pointer"} size={18} className="mt-4" onClick={() => reset()} />
                        ) : null}
                    </div>
                </Flex>


            </HStack>


            <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                <Box w={{ base: "full", lg: "50%" }}>
                    {loadingRevenueChart ? (
                        <Skeleton h={"460px"} rounded={"9px"} />
                    ) : (
                        <RevenueAnalytics data={revenueProperties} selectedProperty={{ id: selectedProperty, name: findProperty(selectedProperty) ?? "" }} />
                    )}
                </Box>
                <Box w={{ base: "full", lg: "50%" }}>
                    <RevenueShareChart data={revenueShare} loading={loadingRevenueShare} />
                </Box>
            </Flex>

            <SectionFlex mt={9} align={"center"} justify={"space-between"}>
                <Text color={"#303030"} fontSize={"18px"} className="satoshi-bold">
                    Top Arrears & Deficits
                </Text>
                <Box w={{ base: "160px", md: "180px" }}>
                    <CustomSelect
                        control={control}
                        name="property"
                        triggerHeight="29px"
                        placeholder="All Properties"
                        collection={propertyOptions}
                    />
                </Box>
            </SectionFlex>

            <DataTable
                data={arrears}
                loading={loadingArrears}
                tableName="Arrears"
                emptyDetails={{
                    icon: emptyTableIcon,
                    title: 'No Deficits Yet',
                    description: 'All rent balances are up to date. Outstanding or overdue payments across your properties will appear here.'
                }}
                columns={columns}
                bgColor="white"
                bordered
                rounded
            />
            <SectionFlex mt={9} align={"center"} justify={"space-between"}>
                <Text color={"#303030"} fontSize={"18px"} className="satoshi-bold">
                    Transaction History
                </Text>
                <Flex align={'center'} gap={5}>
                    <SearchInput placeholder="Search" width={'400px'} />
                    <Flex gap={2} align={'center'}>
                        <Flex>
                            <CustomSelect name='dateRange' control={control} icon={LuCalendar} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="Today" collection={dateFilter} />
                        </Flex>
                        <Flex>
                            <CustomSelect name='type' control={control} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="Payment Types" collection={paymentFilter} />
                        </Flex>
                        <Flex>
                            <CustomSelect name='status' control={control} size={'xs'} triggerHeight='20px' width={'fit'} placeholder="Status" collection={statusFilter} />
                        </Flex>
                        {formValues.type?.length > 0 || formValues.dateRange?.length > 0 || formValues.property?.length > 0 || formValues.status?.length > 0 ?
                            <MdOutlineFilterListOff cursor={'pointer'} onClick={() => reset()} /> : null}
                        <MdRefresh color="#94A3B8" className=" size-4" />
                    </Flex>
                </Flex>
            </SectionFlex>
            <Flex w={{ base: "full" }} my={4} gap={2} justify={"end"}>
                <MainButton
                    size='sm'
                    variant="outline"
                    onClick={handleExport}
                    loading={exportingTransactions}
                    loadingText="Exporting"
                    className="h-[41px]"
                    icon={<LuDownload />}
                >
                    Export
                </MainButton>
            </Flex>

            <DataTable
                data={transactions}
                loading={loadingTransactions}
                emptyDetails={{
                    icon: emptyTableIcon,
                    title: 'No Transactions Yet',
                    description: 'Transaction records will appear here once rent payments are recorded for your properties'
                }}
                tableName="Transactions"
                columns={transactCol}
                bgColor="white"
                bordered
                rounded

            />
        </Box>
    )
}

const RevenueShareChart = ({ data, loading }: { data: revenueShare[]; loading: boolean }) => {
    const chartData = getRevenueShareData(data)

    return (
        <SectionBox h={"full"} minH={"460px"} p={{ base: 5, md: 8 }}>
            <PageTitle title="Revenue Share Contribution" fontSize={'22px'} subFontSize={'16px'} spacing={0} subText=" Portfolio distribution by property" />
            {loading ? (
                <Skeleton h={"320px"} mt={10} rounded={"8px"} />
            ) : chartData.length === 0 ? (
                <Center h={"320px"}>
                    <Text color={"#6C7278"} className="satoshi-medium">No revenue share data available</Text>
                </Center>
            ) : (
                <>
                    <Box h={"210px"} mt={7} position={"relative"}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="revenuePercentage"
                                    nameKey="label"
                                    innerRadius={65}
                                    outerRadius={82}
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {chartData.map((entry) => (
                                        <Cell key={entry.propertyId} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <Center position={"absolute"} inset={0} direction={"column"}>
                            <div className="flex flex-col justify-center">
                                <Text color={"#2B3338"} fontSize={"30px"} textAlign={'center'} lineHeight={"30px"} className="satoshi-bold">100%</Text>
                                <Text color={"#6C7278"} fontSize={"10px"} textAlign={'center'} textTransform={"uppercase"}>Portfolio</Text>
                            </div>
                        </Center>
                    </Box>

                    <Box mt={5}>
                        {chartData.map((item) => (
                            <HStack key={item.propertyId} justify={"space-between"} my={3}>
                                <HStack>
                                    <Box boxSize={"9px"} rounded={"full"} bg={item.color} />
                                    <Text color={"#303030"} fontSize={"14px"}>{item.label}</Text>
                                </HStack>
                                <Text color={"#2B3338"} fontSize={"14px"} className="satoshi-bold">
                                    {Math.round(item.revenuePercentage)}%
                                </Text>
                            </HStack>
                        ))}
                    </Box>
                </>
            )}
        </SectionBox>
    )
}

const getRevenueShareData = (data: revenueShare[]): RevenueShareLegendItem[] => {
    if (data.length <= 3) {
        return data.map((item, index) => ({
            ...item,
            label: item.propertyName,
            color: REVENUE_SHARE_COLORS[index] ?? REVENUE_SHARE_COLORS[0],
        }))
    }

    const topProperties = data.slice(0, 2)
    const otherProperties = data.slice(2)
    const otherRevenue = otherProperties.reduce((total, item) => total + item.revenueAmount, 0)
    const otherPercentage = otherProperties.reduce((total, item) => total + item.revenuePercentage, 0)

    return [
        ...topProperties.map((item, index) => ({
            ...item,
            label: item.propertyName,
            color: REVENUE_SHARE_COLORS[index] ?? REVENUE_SHARE_COLORS[0],
        })),
        {
            propertyId: "other-properties",
            propertyName: "Other Properties",
            label: "Other Properties",
            revenueAmount: otherRevenue,
            revenuePercentage: otherPercentage,
            color: REVENUE_SHARE_COLORS[2],
        },
    ]
}

const toRevenueProperty = (property: revenueChart | UnitRevenueChart): RevenueProperty => {

    const expectedRevenue = isUnit(property) ? property.expectedRent : property.expectedRevenue
    const collectedRevenue = isUnit(property) ? property.collectedRent : property.collectedRevenue
    const value = expectedRevenue > 0 ? Math.round((collectedRevenue / expectedRevenue) * 100) : 0

    return {
        id: isUnit(property) ? property.unitId : property.propertyId,
        name: isUnit(property) ? property.unitName : property.propertyName,
        expectedRevenue,
        collectedRevenue,
        totalAmount: formatCompactCurrency(expectedRevenue),
        collectedAmount: formatCompactCurrency(collectedRevenue),
        value,
    }
}

const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) return `₦${Math.round(value / 1000000)}M`
    if (value >= 1000) return `₦${Math.round(value / 1000)}K`
    return formatNumber(value)
}


const dateFilter = createListCollection({
    items: [
        { label: "Last 30 Days", value: "last_30_days" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "This Year", value: "this_year" },
    ],
})


const paymentFilter = createListCollection({
    items: [
        { label: 'Rent', value: 'RENT' },
        { label: 'Maintenance', value: 'UTILITY_TOKEN' },
        { label: 'Utility', value: 'UTILITY_BILL' },
        { label: 'Service', value: 'SERVICE_CHARGE' }
    ]
})

const statusFilter = createListCollection({
    items: [
        { label: 'Paid', value: 'PAID' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Overdue', value: 'OVERDUE' },
        { label: 'Failed', value: 'FAILED' },
    ]
})