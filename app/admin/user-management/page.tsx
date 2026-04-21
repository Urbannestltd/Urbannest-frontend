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

export default function Page() {
    const columns = useColumns()
    const users = useUserStore(state => state.users)
    const isLoading = useUserStore(state => state.isLoading)
    const fetchUsers = useUserStore(state => state.fetchUsers)
    const { control } = useForm<searchUsersFormData>()
    const router = useRouter()

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <DashboardCard data={cardData} />
            <HStack mt={9} justify={'space-between'} >
                <Flex w={'70%'} gap={5}>
                    <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Properties" label="Property Type" name='role' collection={roles} />
                    <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Statuses" label="Status" name="status" collection={statuses} />
                    <CustomSelect name='dateRange' control={control} borderColor="#F4F4F4" placeholder="Last 30 Days" icon={LuCalendar} label="Date Range" collection={dateFilter} />
                </Flex>
                <MainButton size='sm' variant='outline' icon={<LuDownload />} type="submit">Export</MainButton>
            </HStack>
            <DataTable data={users} loading={isLoading} onRowClick={(row) => router.push(`/admin/user-management/${row.id}`)} columns={columns} tableName="Users" />
        </div>
    )

}

const cardData: CardData[] = [
    {
        title: 'Total Users',
        data: 12,
        percentage: '12% from last month'
    },
    {
        title: 'Active',
        data: 12,
        percentage: '12% from last month'
    },
    {
        title: 'Suspended',
        data: 12,
        percentage: '12% from last month'
    },
]


const roles = createListCollection({
    items: [{ value: "TENANT", label: "Tenant" },
    { value: 'LANDLORD', label: 'Landlord' },
    { value: 'FACILITY_MANAGER', label: 'Facility Manager' },
    ]
})

const statuses = createListCollection({
    items: [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Open',
            value: 'open'
        },
        {
            label: 'Closed',
            value: 'closed'
        },
        {
            label: 'Escalated',
            value: 'escalated'
        }
    ]
})

const dateFilter = createListCollection({
    items: [
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'this_week' },
        { label: 'This Month', value: 'this_month' },
        { label: 'This Year', value: 'this_year' },
    ]
})
