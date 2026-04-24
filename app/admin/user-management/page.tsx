'use client'
import { CardData, DashboardCard } from "@/components/ui/card"
import { Card, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useColumns } from "./columns"
import { useUserStore } from "@/store/admin/user"
import { useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { CustomSelect } from "@/components/ui/custom-fields"
import { useForm } from "react-hook-form"
import { searchUsersFormData } from "@/schema/admin"
import { MainButton } from "@/components/ui/button"
import { LuCalendar, LuDownload } from "react-icons/lu"
import { useRouter } from "next/navigation"
import { getDateRange } from "@/services/date"

export default function Page() {
    const columns = useColumns()
    const users = useUserStore(state => state.users)
    const isLoading = useUserStore(state => state.isLoading)
    const fetchUsers = useUserStore(state => state.fetchUsers)
    const metrics = useUserStore(state => state.metrics)
    const fetchMetrics = useUserStore(state => state.fetchMetrics)
    const { control, watch, getValues } = useForm<searchUsersFormData>()
    const router = useRouter()
    const watchedValues = watch()

    useEffect(() => {
        fetchMetrics()
    }, [])

    useEffect(() => {
        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])

        fetchUsers({
            role: watchedValues.role?.[0] === 'all' ? undefined : watchedValues.role?.[0],
            status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
            createdFrom: startDate,
            createdTo: endDate
        })
    }, [watchedValues.role, watchedValues.status, watchedValues.dateRange])



    const cardData: CardData[] = [
        {
            title: 'Total Users',
            data: metrics?.total ?? 0,
            percentage: '12% from last month'
        },
        {
            title: 'Active',
            data: metrics?.active ?? 0,
            percentage: '12% from last month'
        },
        {
            title: 'Suspended',
            data: metrics?.suspended ?? 0,
            percentage: '12% from last month'
        },
    ]


    return (
        <div>
            <DashboardCard data={cardData} />
            <HStack mt={9} justify={'space-between'} >
                <Flex w={'70%'} gap={5}>
                    <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Roles" label="Role" name='role' collection={roles} />
                    <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Statuses" label="Status" name="status" collection={statuses} />
                    <CustomSelect name='dateRange' control={control} borderColor="#F4F4F4" placeholder="Last 30 Days" icon={LuCalendar} label="Date Range" collection={dateFilter} />
                </Flex>
                <MainButton size='sm' variant='outline' icon={<LuDownload />} type="submit">Export</MainButton>
            </HStack>
            <DataTable data={users} loading={isLoading} onRowClick={(row) => router.push(`/admin/user-management/${row.id}`)} columns={columns} tableName="Users" />
        </div>
    )

}




const roles = createListCollection({
    items: [
        {
            label: 'All',
            value: 'all'
        }, { value: "TENANT", label: "Tenant" },
        { value: 'LANDLORD', label: 'Landlord' },
        { value: 'FACILITY_MANAGER', label: 'Facility Manager' },
        { value: 'ADMIN', label: 'Admin' },
    ]
})

const statuses = createListCollection({
    items: [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Active',
            value: 'ACTIVE'
        },
        {
            label: 'Pending',
            value: 'PENDING'
        },
        {
            label: 'Suspended',
            value: 'closed'
        },

    ]
})

const dateFilter = createListCollection({
    items: [
        {
            label: 'None',
            value: 'all'
        },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'this_week' },
        { label: 'This Month', value: 'this_month' },
        { label: 'This Year', value: 'this_year' },
    ]
})
