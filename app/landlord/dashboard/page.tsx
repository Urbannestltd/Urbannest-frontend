'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable, EmptyDetails } from "@/components/ui/data-table"
import { SectionFlex } from "@/components/ui/section-box"
import { Box, createListCollection, Flex, HStack, Skeleton, Text } from "@chakra-ui/react"
import { useForm, useWatch } from "react-hook-form"
import { MdOutlineFilterListOff } from "react-icons/md"
import emptyVisitorIcon from "@/app/assets/icons/empty-state-icons/visitor-table.svg"
import { useRouter } from "next/navigation"
import { useColumns } from "./columns"
import { MobileTable } from "./mobile-table"
import { RevenueAnalytics, RevenueProperty } from "./chart"
import { useEffect, useMemo, useState } from "react"
import { RevenueChart, useLandlordDashboardStore } from "@/store/landlord/dashboard"
import { formatCompactCurrency, getFinancialDateRange } from "@/services/date"
import { UnitRevenueChart } from "@/store/landlord/financials"

const isUnit = (data: RevenueChart | UnitRevenueChart): data is UnitRevenueChart => 'unitId' in data;


export default function Dashboard() {
    const { control, resetField } = useForm<{ revenueProperty: string[]; approvalsProperty: string[] }>()
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600
    const selectedRevenueProperty = useWatch({ control, name: 'revenueProperty' })?.[0] ?? 'all'
    const selectedApprovalsProperty = useWatch({ control, name: 'approvalsProperty' })?.[0] ?? 'all'
    const {
        stats,
        revenueChart,
        approvals,
        isLoadingApprovals,
        isLoadingRevenueChart,
        fetchStats,
        fetchRevenueChart,
        fetchApprovals,
    } = useLandlordDashboardStore((state) => state)
    const filter = useMemo(() => {
        return {
            propertyId: selectedRevenueProperty === "all" ? undefined : selectedRevenueProperty,
        }
    }, [selectedRevenueProperty])
    const revenueProperties = revenueChart.map(toRevenueProperty)

    const selectedApprovalPropertyName = revenueProperties.find((property) => property.id === selectedApprovalsProperty)?.name
    const pendingApprovals = selectedApprovalsProperty === 'all'
        ? approvals
        : approvals.filter((approval) => approval.propertyName === selectedApprovalPropertyName)
    const router = useRouter()
    const columns = useColumns()
    const properties = createListCollection({
        items: [
            { value: 'all', label: 'All Properties' },
            ...revenueProperties.map((property) => ({
                value: property.id,
                label: property.name,
            })),
        ]
    })
    const [props, setProps] = useState(properties.items)

    useEffect(() => {
        fetchStats()
        fetchRevenueChart()
        fetchApprovals()
    }, [fetchApprovals, fetchRevenueChart, fetchStats])

    useEffect(() => {
        fetchRevenueChart(filter.propertyId)
    }, [filter.propertyId, fetchRevenueChart])


    /*const onShow = () => {
        fetchRevenueChart(filter.propertyId)
    }
    */

    const CardData: CardData[] = [
        {
            title: "Total Properties",
            data: stats?.totalProperties ?? 0,
            cardColor: "#E8EBEE",
            border: true,
            emptyMessage: 'Across your portfolio'

        },
        {
            title: "Portfolio Occupancy",
            data: `${stats?.occupancyRate ?? 0}%`,
            border: true,
            progress: stats?.occupancyRate ?? 0,
        },
        {
            title: "Revenue(YTD)",
            data: formatCurrency(stats?.revenueCollected ?? 0),
            border: true,
            emptyMessage: 'Collected revenue'

        },
        {
            title: "Pending Approvals",
            data: stats?.pendingApprovalsCount ?? pendingApprovals.length,
            border: true,
            emptyMessage: (stats?.pendingApprovalsCount ?? pendingApprovals.length) > 0 ? 'New tenant applications incoming' : 'No pending applications',
            actionRequired: (stats?.pendingApprovalsCount ?? pendingApprovals.length) > 0


        },
    ]

    const emptyDetails: EmptyDetails = {
        icon: emptyVisitorIcon,
        title: 'No Pending Approvals Yet',
        description: 'You haven’t received any pending approvals yet. When you do, they will appear here.',
    }

    const findProperty = (id: string) => {
        return props.find((property) => property.value === id)?.label
    }

    return (
        < >
            <Flex width={'full'} mt={8}>
                <DashboardCard data={CardData} />
            </Flex>
            <HStack align={'end'} my={11} justify={'start'}>
                <Flex w={{ base: '60%', md: '15%' }}>
                    <CustomSelect width={'full'} name="revenueProperty" collection={properties} control={control} label="Select Property" placeholder="All Property" />
                </Flex>
                <MainButton size='sm' className=" h-[43px]" >Show</MainButton>
            </HStack>
            <Flex
                mt={"45px"}
                direction={{
                    base: "column",
                    md: "row",
                }}
                gap={"27px"}
            >
                <Box w={{ base: 'full', md: '50%' }}>
                    {isLoadingRevenueChart ? (
                        <Skeleton h={"460px"} rounded={"9px"} />
                    ) : (
                        <RevenueAnalytics data={revenueProperties} selectedProperty={{ id: selectedRevenueProperty, name: findProperty(selectedRevenueProperty) ?? 'N/A' }} />)}
                </Box>

                <Box w={{ base: "full", md: "50%" }}>
                    <SectionFlex p={4} align={"center"} mb={4} justifyContent={"space-between"}>
                        <Text className="satoshi-bold">Pending Tenant Approvals</Text>
                        <div className="w-[20%]">
                            {isMobile ? (
                                <Text className="satoshi-bold text-sm text-[#545F73]">
                                    View All
                                </Text>
                            ) : (
                                <HStack>
                                    <CustomSelect
                                        control={control}
                                        name='approvalsProperty'
                                        triggerHeight="29px"
                                        placeholder="All Properties"
                                        collection={properties}
                                    />
                                    {selectedApprovalsProperty !== 'all' ? (
                                        <MdOutlineFilterListOff
                                            cursor={"pointer"}
                                            onClick={() => resetField('approvalsProperty')}
                                        />
                                    ) : null}
                                </HStack>
                            )}
                        </div>
                    </SectionFlex>

                    {isMobile ? (
                        <MobileTable
                            data={pendingApprovals ?? []}
                            tableName="Pending tenant approvals"
                            emptyDetails={emptyDetails}
                        />
                    ) : (
                        <Box mt={{ base: "10px", md: "0px" }} p={0}>
                            <DataTable
                                bgColor="white"
                                my={"0px"}
                                borderRadius={"11px"}
                                miniTableOnclick={() =>
                                    router.push("/landlord/tenant-approvals")
                                }
                                rounded
                                columns={columns}
                                loading={isLoadingApprovals}
                                data={pendingApprovals}
                                miniTable
                                bordered
                                tableName="Pending tenant approvals"
                                emptyDetails={emptyDetails}
                            />
                        </Box>
                    )}
                </Box>
            </Flex>


        </>
    )

}

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₦${Math.round(value / 1000000)}M`
    return `₦${value.toLocaleString()}`
}

const toRevenueProperty = (property: RevenueChart | UnitRevenueChart): RevenueProperty => {
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
