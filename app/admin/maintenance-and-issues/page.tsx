'use client'
import { MainButton } from "@/components/ui/button"
import { CardData, DashboardCard } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { searchMaintenanceFormData } from "@/schema/admin"
import { createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload } from "react-icons/lu"
import { useTicketColumns } from "../dashboard/[id]/ticket-columns"
import { TickettData } from "@/utils/data"
import { useRouter } from "next/navigation"
import { useTicketStore } from "@/store/admin/tickets"
import { use, useEffect, useState } from "react"
import { format } from "path"
import { convertMinutes, formatDateTime, formatNumber, getDateRange } from "@/services/date"
import { AddBudget } from "./add-budget"
import { Drawers } from "@/components/ui/drawer"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { exportTickets, filter } from "@/services/admin/maintenance"

export default function Maintenance() {
    const { control, watch, getValues } = useForm<searchMaintenanceFormData>()
    const columns = useTicketColumns()
    const tickets = useTicketStore(state => state.tickets)
    const fetchAllTickets = useTicketStore(state => state.fetchAllTickets)
    const fetchBudget = useTicketStore(state => state.fetchBudget)

    const metrics = useTicketStore(state => state.metrics)
    const fetchMetrics = useTicketStore(state => state.fetchMetrics)
    const isLoading = useTicketStore(state => state.isLoading)
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState(false)
    const watchedValues = watch()

    useEffect(() => {
        fetchMetrics()
        fetchBudget()
    }, [])

    useEffect(() => {
        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
        fetchAllTickets({
            propertyType: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
            status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
            category: watchedValues.issue?.[0] === 'all' ? undefined : watchedValues.issue?.[0],
            priority: watchedValues.priority?.[0] === 'all' ? undefined : watchedValues.priority?.[0],
            dateFrom: startDate,
            dateTo: endDate
        })
    }, [watchedValues.status, watchedValues.dateRange, watchedValues.priority, watchedValues.issue, watchedValues.property])

    const cardData: CardData[] = [
        {
            title: "Avg. Response Time",
            data: convertMinutes(metrics?.avgResponseTimeMinutes ?? 0),
            percentage: '14%',
        },
        {
            title: 'High Priority Open',
            data: metrics?.highPriorityOpenCount ?? 0,
            tinyText: 'Current'
        },
        {
            title: 'Weekly Completion',
            data: metrics?.weeklyCompletionPercent ?? 0,
            tinyText: 'Target 95%'
        },
        {
            title: 'Maintenance Cost (MTD)',
            data: formatNumber(metrics?.maintenanceCostEstimate),
            tinyText: 'Est.'
        }
    ]

    const mutation = useMutation({
        mutationFn: (data?: filter) => {
            return exportTickets(data)
        },
        onSuccess: () => {
            toast.success('Expenses exported successfully')
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const exportTicketFile = () => {
        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])

        const payload: filter = {
            propertyType: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
            status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
            category: watchedValues.issue?.[0] === 'all' ? undefined : watchedValues.issue?.[0],
            priority: watchedValues.priority?.[0] === 'all' ? undefined : watchedValues.priority?.[0],
            dateFrom: startDate,
            dateTo: endDate
        }
        mutation.mutate(payload)
    }


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
                    <Flex w={'25%'} gap={2}>
                        <MainButton size='lg' onClick={exportTicketFile} variant='outline' icon={<LuDownload />} type="submit">Export</MainButton>
                        <Drawers open={openDrawer} onOpenChange={setOpenDrawer} triggerContent="Set Budget" className="w-[350px] py-2 px-5" modalContent={<AddBudget onClose={() => { setOpenDrawer(false); fetchBudget() }} />} triggerSize='lg' />
                    </Flex>
                </HStack>
            </form>
            <DataTable data={tickets} loading={isLoading} tableName="Tickets" onRowClick={(row) => router.push(`/admin/maintenance-and-issues/${row.id}`)} columns={columns} />

        </div>
    )
}



const propertyTypes = createListCollection({
    items: [
        {
            label: 'All Properties',
            value: 'all'
        },
        {
            label: 'Residential',
            value: 'RESIDENTIAL'
        },
        {
            label: 'Commercial',
            value: 'COMMERCIAL'
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
            value: 'PENDING'
        },
        {
            label: 'In Progress',
            value: 'IN_PROGRESS'
        },
        {
            label: 'Closed',
            value: 'RESOLVED'
        },
        {
            label: 'Escalated',
            value: 'ESCALATED'
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
            value: 'HIGH'
        },
        {
            label: 'Medium',
            value: 'MEDIUM'
        },
        {
            label: 'Low',
            value: 'LOW'
        }
    ]
})

const IssueType = createListCollection({
    items: [
        {
            label: 'All',
            value: 'all'
        },
        { value: 'ELECTRICAL', label: 'Electrical', },
        { value: 'PLUMBING', label: 'Plumbing' },
        { value: 'SECURITY', label: 'Security' },
        { value: 'CLEANING', label: 'Cleaning' },
        { value: 'HVAC', label: 'HVC/AC' },
        { value: 'BUILDING', label: 'Building (Walls, Doors, Windows, Ceiling)' },
        { value: 'SAFETY', label: 'Safety & Security' },
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
