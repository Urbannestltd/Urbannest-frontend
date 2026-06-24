"use client"
import { CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { Box, createListCollection, Flex, HStack, Skeleton, Text } from "@chakra-ui/react"
import { useForm, useWatch } from "react-hook-form"
import { LuCalendar } from "react-icons/lu"
import { useEffect } from "react"
import { convertMinutes, formatCompactCurrency, formatNumber } from "@/services/date"
import { MdOutlineFilterListOff } from "react-icons/md"
import { CardData, DashboardCard } from "@/components/ui/card"
import { useMaintenanceStore } from "@/store/landlord/maintenance"
import { MaintenanceFilterFormData } from "@/schema/landlord"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartMobile } from "./chart-mobile"
import { BiSlider } from "react-icons/bi"

export type MaintenanceChartItem = {
    propertyId: string
    propertyName: string
    ticketCount: number
    totalCost: number
}

type MaintenanceDistributionItem = MaintenanceChartItem & {
    scaledCost: number
    scaledTicketCount: number
}

type ChartLabelProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    value?: number | string
}

type MaintenanceDistributionTooltipProps = {
    active?: boolean
    payload?: {
        payload?: MaintenanceDistributionItem
    }[]
    label?: string
}

export default function Maintenance() {
    const { control, reset } =
        useForm<MaintenanceFilterFormData>()
    const { maintenance, isLoading, fetchMaintenance } = useMaintenanceStore((state) => state)
    const issueType = useWatch({ control, name: 'issueType' })
    const dateRange = useWatch({ control, name: 'dateRange' })
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

    useEffect(() => {
        fetchMaintenance({
            category:
                issueType?.[0] === "all"
                    ? undefined
                    : issueType?.[0],
        })
    }, [
        dateRange,
        issueType,
        fetchMaintenance,
    ])

    const cardData: CardData[] = [
        {
            title: "Open Tickets",
            data: maintenance?.openTickets ?? 0,
        },
        {
            title: "Avg. Response Time",
            data: convertMinutes(maintenance?.avgResolutionDays ?? 0),
            percentage: "12%",
        },
        {
            title: "Maintenance Cost (MTD)",
            data: formatNumber(maintenance?.totalExpenses ?? 0),
            tinyText: "Est",
        },
    ]
    const chartData = getMaintenanceDistributionData(maintenance?.chart ?? [])

    return (
        <div>
            <PageTitle mb={6} title="Maintenance & Issues" />
            <DashboardCard newMobile fourcolumn={false} data={cardData} />
            {isMobile ? <SectionFlex
                justify={"space-between"}
                bg={{ base: "#F2F4F4", md: "white" }}
                mt={9}
            > <Box w={"full"}>
                    <HStack justify={"space-between"} w={"full"} mb={4}>
                        <Text className="satoshi-bold text-sm">Quick Filters</Text>
                        <BiSlider color="#5A6061" />
                    </HStack>
                    <HStack w={"full"} mb={4}>
                        <CustomSelect
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="All Types"
                            label="Issue Type"
                            name='issueType'
                            collection={IssueType}
                        />
                        <CustomSelect
                            name="dateRange"
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="Last 30 Days"
                            icon={LuCalendar}
                            label="Date Range"
                            collection={dateFilter}
                        />
                    </HStack>
                </Box></SectionFlex> :
                <form>
                    <HStack mt={9} w={'full'} align={"center"}>
                        <Flex w={"30%"} gap={5}>

                            <CustomSelect
                                control={control}
                                width={'full'}
                                borderColor="#F4F4F4"
                                placeholder="All Types"
                                label="Issue Type"
                                name='issueType'
                                collection={IssueType}
                            />
                            <CustomSelect
                                name="dateRange"
                                control={control}
                                width={'full'}
                                borderColor="#F4F4F4"
                                placeholder="Last 30 Days"
                                icon={LuCalendar}
                                label="Date Range"
                                collection={dateFilter}
                            />
                        </Flex>
                        <Flex w={"5%"} justify={"center"} align={"center"} gap={2}>
                            {dateRange?.length > 0 ||
                                issueType?.length > 0 ? (
                                <MdOutlineFilterListOff
                                    cursor={"pointer"}
                                    size={15}
                                    onClick={() => reset()}
                                />
                            ) : null}
                        </Flex>
                    </HStack>
                </form>}

            {isMobile ? <ChartMobile visibleProperties={chartData} loading={isLoading} /> : <MaintenanceDistributionChart data={chartData} loading={isLoading} />}
        </div >
    )
}

const getMaintenanceDistributionData = (
    data: MaintenanceChartItem[],
): MaintenanceDistributionItem[] => {
    const maxCost = Math.max(...data.map((item) => item.totalCost), 0)
    const maxTickets = Math.max(...data.map((item) => item.ticketCount), 0)

    return data.map((item) => ({
        ...item,
        scaledCost: maxCost ? (item.totalCost / maxCost) * 100 : 0,
        scaledTicketCount: maxTickets ? (item.ticketCount / maxTickets) * 100 : 0,
    }))
}

const MaintenanceDistributionChart = ({
    data,
    loading,
}: {
    data: MaintenanceDistributionItem[]
    loading: boolean
}) => {
    return (
        <SectionBox mt={8} p={{ base: 4, md: 8 }} rounded={'9px'}>
            <Flex
                align={{ base: 'flex-start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                justify={'space-between'}
            >
                <Box>
                    <Text color={'#2B3338'} fontSize={{ base: '20px', md: '26px' }} className="satoshi-bold">
                        Portfolio Maintenance Distribution
                    </Text>
                    <Text color={'#6C7278'} fontSize={{ base: '14px', md: '16px' }} mt={1}>
                        Comparative analysis of operational costs versus ticket volume per asset.
                    </Text>
                </Box>
                <HStack color={'#2B3338'} fontSize={{ base: '12px', md: '14px' }} gap={6}>
                    <HStack gap={2}>
                        <Box boxSize={'14px'} bg={'#2A3348'} rounded={'full'} />
                        <Text>Cost (₦ NGN)</Text>
                    </HStack>
                    <HStack gap={2}>
                        <Box boxSize={'14px'} bg={'#E9EAEC'} rounded={'full'} />
                        <Text>Volume (Tickets)</Text>
                    </HStack>
                </HStack>
            </Flex>

            <Box borderTop={'1px solid #ECEFF1'} mt={{ base: 6, md: 10 }} pt={{ base: 4, md: 8 }}>
                {loading ? (
                    <Skeleton h={{ base: '280px', md: '420px' }} w={'full'} />
                ) : data.length === 0 ? (
                    <Flex h={'280px'} align={'center'} justify={'center'}>
                        <Text color={'#6C7278'} className="satoshi-medium">No maintenance distribution data available</Text>
                    </Flex>
                ) : (
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart
                            data={data}
                            barGap={8}
                            barCategoryGap="22%"
                            margin={{ top: 45, right: 12, left: 12, bottom: 8 }}
                        >
                            <CartesianGrid vertical={false} stroke="#ECEFF1" />
                            <XAxis
                                dataKey="propertyName"
                                axisLine={{ stroke: '#E1E6EA' }}
                                tickLine={false}
                                interval={0}
                                tick={{ fill: '#2B3338', fontSize: 13, fontWeight: 700 }}
                                height={52}
                            />
                            <YAxis hide domain={[0, 110]} />
                            <Tooltip cursor={{ fill: 'transparent' }} content={<MaintenanceDistributionTooltip />} />
                            <Bar dataKey="scaledCost" fill="#2A3348" radius={[2, 2, 0, 0]} maxBarSize={46} minPointSize={20}>
                                <LabelList dataKey="totalCost" content={<CostLabel />} />
                            </Bar>
                            <Bar dataKey="scaledTicketCount" fill="#E9EAEC" radius={[2, 2, 0, 0]} maxBarSize={46} minPointSize={20}>
                                <LabelList dataKey="ticketCount" content={<TicketLabel />} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </SectionBox>
    )
}

const CostLabel = ({ x, y, width, value }: ChartLabelProps) => {
    if (value === undefined || value === null) return null

    const labelX = Number(x ?? 0) + Number(width ?? 0) / 2
    const labelY = Number(y ?? 0) - 12

    return (
        <text
            x={labelX}
            y={labelY}
            fill="#2B3338"
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="satoshi-bold"
        >
            {formatCompactCurrency(Number(value))}
        </text>
    )
}

const TicketLabel = ({ x, y, width, value }: ChartLabelProps) => {
    if (value === undefined || value === null) return null

    const labelX = Number(x ?? 0) + Number(width ?? 0) / 2
    const labelY = Number(y ?? 0) - 12

    return (
        <text
            x={labelX}
            y={labelY}
            fill="#2B3338"
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="satoshi-bold"
        >
            {value}
        </text>
    )
}

const MaintenanceDistributionTooltip = ({ active, payload, label }: MaintenanceDistributionTooltipProps) => {
    if (!active || !payload?.length) return null

    const item = payload[0]?.payload
    if (!item) return null

    return (
        <Box bg={'white'} border={'1px solid #ECEFF1'} rounded={'8px'} p={3} shadow={'md'}>
            <Text color={'#2B3338'} fontSize={'14px'} className="satoshi-bold">{label}</Text>
            <Text color={'#5A6061'} fontSize={'13px'} mt={1}>Cost: {formatNumber(item.totalCost)}</Text>
            <Text color={'#5A6061'} fontSize={'13px'}>Volume: {item.ticketCount} tickets</Text>
        </Box>
    )
}



const IssueType = createListCollection({
    items: [
        {
            label: "All",
            value: "all",
        },
        { value: "ELECTRICAL", label: "Electrical" },
        { value: "PLUMBING", label: "Plumbing" },
        { value: "SECURITY", label: "Security" },
        { value: "CLEANING", label: "Cleaning" },
        { value: "HVAC", label: "HVC/AC" },
        { value: "BUILDING", label: "Building (Walls, Doors, Windows, Ceiling)" },
        { value: "SAFETY", label: "Safety & Security" },
    ],
})

const dateFilter = createListCollection({
    items: [
        {
            label: "None",
            value: "all",
        },
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "This Year", value: "this_year" },
    ],
})
