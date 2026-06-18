'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable, EmptyDetails } from "@/components/ui/data-table"
import { SectionFlex } from "@/components/ui/section-box"
import { Box, createListCollection, Flex, HStack, Text } from "@chakra-ui/react"
import { useForm, useWatch } from "react-hook-form"
import { MdOutlineFilterListOff } from "react-icons/md"
import emptyVisitorIcon from "@/app/assets/icons/empty-state-icons/visitor-table.svg"
import { useRouter } from "next/navigation"
import { useColumns } from "./columns"
import { TenantApprovalsList } from "@/utils/data"
import { MobileTable } from "./mobile-table"
import { RevenueAnalytics, revenueProperties } from "./chart"

export default function Dashboard() {
    const { control, resetField } = useForm<{ revenueProperty: string[]; approvalsProperty: string[] }>()
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600
    const selectedRevenueProperty = useWatch({ control, name: 'revenueProperty' })?.[0] ?? 'all'
    const selectedApprovalsProperty = useWatch({ control, name: 'approvalsProperty' })
    const selectedProperties = selectedRevenueProperty === 'all'
        ? revenueProperties
        : revenueProperties.filter((property) => property.id === selectedRevenueProperty)
    const selectedPropertyName = selectedProperties[0]?.name
    const pendingApprovals = selectedRevenueProperty === 'all'
        ? TenantApprovalsList
        : TenantApprovalsList.filter((approval) => approval.propertyName === selectedPropertyName)
    const totalCollectedRevenue = selectedProperties.reduce((total, property) => total + property.collectedRevenue, 0)
    const averageOccupancy = selectedProperties.length
        ? Math.round(selectedProperties.reduce((total, property) => total + property.value, 0) / selectedProperties.length)
        : 0
    const router = useRouter()
    const columns = useColumns()

    const CardData: CardData[] = [
        {
            title: "Total Properties",
            data: selectedProperties.length,
            cardColor: "#E8EBEE",
            border: true,
            emptyMessage: selectedRevenueProperty === 'all' ? 'Across your portfolio' : selectedPropertyName

        },
        {
            title: "Portfolio Occupancy",
            data: `${averageOccupancy}%`,
            border: true,
            progress: averageOccupancy,
        },
        {
            title: "Revenue(YTD)",
            data: formatCurrency(totalCollectedRevenue),
            border: true,
            emptyMessage: 'Collected revenue'

        },
        {
            title: "Pending Approvals",
            data: pendingApprovals.length,
            border: true,
            emptyMessage: pendingApprovals.length > 0 ? 'New tenant applications incoming' : 'No pending applications',
            actionRequired: pendingApprovals.length > 0


        },
    ]

    const emptyDetails: EmptyDetails = {
        icon: emptyVisitorIcon,
        title: 'No Pending Approvals Yet',
        description: 'You haven’t received any pending approvals yet. When you do, they will appear here.',
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
                <MainButton size='sm' className=" h-[43px]" onClick={() => { }}>Show</MainButton>
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
                    <RevenueAnalytics selectedPropertyId={selectedRevenueProperty} />
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
                                    {selectedApprovalsProperty?.length > 0 ? (
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

const properties = createListCollection({
    items: [
        { value: 'all', label: 'All Properties' },
        ...revenueProperties.map((property) => ({
            value: property.id,
            label: property.name,
        })),
    ]
})

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₦${Math.round(value / 1000000)}M`
    return `₦${value.toLocaleString()}`
}
