'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { searchMaintenanceFormData } from "@/schema/admin"
import { createListCollection, Flex, HStack } from "@chakra-ui/react"
import { use } from "react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload } from "react-icons/lu"
import { useTicketColumns } from "../dashboard/[id]/ticket-columns"
import { TickettData } from "@/utils/data"

export default function Maintenance() {
    const { control } = useForm<searchMaintenanceFormData>()
    const columns = useTicketColumns()
    return (
        <div>
            <PageTitle mb={6} title="Maintenance & Issues" />
            <DashboardCard data={cardData} />
            <form>
                <HStack mt={9} justify={'space-between'} >
                    <Flex w={'70%'} gap={5}>
                        <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Properties" label="Property Type" name='property' collection={propertyTypes} />
                        <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Statuses" label="Status" name="status" collection={statuses} />
                        <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Priorities" label="Priority" name="priority" collection={Priorities} />
                        <CustomSelect control={control} borderColor="#F4F4F4" placeholder="All Types" label="Issue Type" name="issue" collection={IssueType} />
                        <CustomSelect name='dateRange' control={control} borderColor="#F4F4F4" placeholder="Last 30 Days" icon={LuCalendar} label="Date Range" collection={dateFilter} />
                    </Flex>
                    <MainButton size='sm' variant='outline' icon={<LuDownload />} type="submit">Export</MainButton>
                </HStack>
            </form>
            <DataTable data={TickettData} tableName="Tickets" columns={columns} />

        </div>
    )
}

const cardData: CardData[] = [
    {
        title: "Avg. Response Time",
        data: '14m 22s',
        percentage: '14%',
    },
    {
        title: 'High Priority Open',
        data: 8,
        tinyText: 'Current'
    },
    {
        title: 'Weekly Completion',
        data: '92%',
        tinyText: 'Target 95%'
    },
    {
        title: 'Maintenance Cost (MTD)',
        data: '$12,480',
        tinyText: 'Est.'
    }
]

const propertyTypes = createListCollection({
    items: [
        {
            label: 'All Properties',
            value: 'all'
        },
        {
            label: 'Residential',
            value: 'residential'
        },
        {
            label: 'Commercial',
            value: 'commercial'
        }

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

const Priorities = createListCollection({
    items: [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'High',
            value: 'high'
        },
        {
            label: 'Medium',
            value: 'medium'
        },
        {
            label: 'Low',
            value: 'low'
        }
    ]
})

const IssueType = createListCollection({
    items: [
        {
            label: 'Plumbing',
            value: 'plumbing'
        },
        {
            label: 'Electrical',
            value: 'electrical'
        },
        {
            label: 'HVAC',
            value: 'hvac'
        },
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
