"use client"
import { CustomSelect } from "@/components/ui/custom-fields"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { searchMaintenanceFormData } from "@/schema/admin"
import { createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuCalendar, LuDownload } from "react-icons/lu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { convertMinutes, getDateRange } from "@/services/date"
import { MdOutlineFilterListOff } from "react-icons/md"
import { useTicketColumns } from "../properties/[id]/ticket-columns"
import { useTicketStore } from "@/store/fm/ticket"
import emptyTicketIcon from "@/app/assets/icons/facilty-icons/ticket-empty.svg"
import { CardData, DashboardCard } from "@/components/ui/card"
import { MobileTable } from "../properties/[id]/ticket-mobile-table"

export default function Maintenance() {
    const { control, watch, getValues, reset } =
        useForm<searchMaintenanceFormData>()
    const columns = useTicketColumns()
    const tickets = useTicketStore((state) => state.tickets)
    const metrics = useTicketStore((state) => state.metrics)
    const fetchAllTickets = useTicketStore((state) => state.fetchAllTickets)
    const fetchMetrics = useTicketStore((state) => state.fetchMetrics)
    const isLoading = useTicketStore((state) => state.isLoading)
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState(false)
    const watchedValues = watch()
    const [notFound, setNotFound] = useState(false)
    const isMobile = window.innerWidth < 600

    useEffect(() => {
        fetchMetrics()
    }, [])

    useEffect(() => {
        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
        fetchAllTickets({
            propertyType:
                watchedValues.property?.[0] === "all"
                    ? undefined
                    : watchedValues.property?.[0],
            status:
                watchedValues.status?.[0] === "all"
                    ? undefined
                    : watchedValues.status?.[0],
            category:
                watchedValues.issue?.[0] === "all"
                    ? undefined
                    : watchedValues.issue?.[0],
            priority:
                watchedValues.priority?.[0] === "all"
                    ? undefined
                    : watchedValues.priority?.[0],
            dateFrom: startDate,
            dateTo: endDate,
        })
    }, [
        watchedValues.status,
        watchedValues.dateRange,
        watchedValues.priority,
        watchedValues.issue,
        watchedValues.property,
    ])

    const cardData: CardData[] = [
        {
            title: "Avg. Response Time",
            data: convertMinutes(metrics?.avgResponseMinutes ?? 0),
        },
        {
            title: "High Priority Open",
            data: metrics?.highPriorityOpenCount ?? 0,
            tinyText: "Current",
        },
        {
            title: "Weekly Completion",
            data: metrics?.weeklyResolutionRate ?? 0,
            tinyText: "Target 95%",
        },
    ]

    return (
        <div>
            <PageTitle mb={6} title="Maintenance & Issues" />
            <DashboardCard data={cardData} />

            <form>
                <HStack mt={9} w={'full'} align={"center"} justify={"space-between"}>
                    <Flex w={"70%"} gap={5}>
                        <CustomSelect
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="All Properties"
                            label="Property Type"
                            name="property"
                            collection={propertyTypes}
                        />
                        <CustomSelect
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="All Statuses"
                            label="Status"
                            name="status"
                            collection={statuses}
                        />
                        <CustomSelect
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="All Priorities"
                            label="Priority"
                            name="priority"
                            collection={Priorities}
                        />
                        <CustomSelect
                            control={control}
                            borderColor="#F4F4F4"
                            placeholder="All Types"
                            label="Issue Type"
                            name="issue"
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
                    </Flex>
                    <Flex w={"25%"} justify={"center"} align={"center"} gap={2}>
                        {watchedValues.dateRange?.length > 0 ||
                            watchedValues.issue?.length > 0 ||
                            watchedValues.priority?.length > 0 ||
                            watchedValues.status?.length > 0 ||
                            watchedValues.property?.length > 0 ? (
                            <MdOutlineFilterListOff
                                cursor={"pointer"}
                                size={15}
                                onClick={() => reset()}
                            />
                        ) : null}
                    </Flex>
                </HStack>
            </form>
            {isMobile ? (
                <MobileTable
                    data={tickets}
                    tableName="Tickets"
                    onRowClick={(row) =>
                        router.push(`/facility-manager/maintenance-and-issues/${row.id}`)
                    }
                    emptyDetails={{
                        icon: emptyTicketIcon.src,
                        title: "No tickets found",
                        description:
                            "We couldn’t found any maintenance tickets that match your search.",
                    }}
                />
            ) : (
                <DataTable
                    data={tickets}
                    loading={isLoading}
                    tableName="Tickets"
                    onRowClick={(row) =>
                        router.push(`/facility-manager/maintenance-and-issues/${row.id}`)
                    }
                    emptyDetails={{
                        icon: emptyTicketIcon,
                        title: "No tickets",
                        description:
                            "Maintenance tickets will appear here once requests are submitted.",
                    }}
                    columns={columns}
                />
            )}
        </div>
    )
}

const propertyTypes = createListCollection({
    items: [
        {
            label: "All Properties",
            value: "all",
        },
        {
            label: "Residential",
            value: "RESIDENTIAL",
        },
        {
            label: "Commercial",
            value: "COMMERCIAL",
        },
    ],
})

const statuses = createListCollection({
    items: [
        {
            label: "All",
            value: "all",
        },
        {
            label: "Open",
            value: "PENDING",
        },
        {
            label: "In Progress",
            value: "IN_PROGRESS",
        },
        {
            label: "Closed",
            value: "RESOLVED",
        },
        {
            label: "Escalated",
            value: "ESCALATED",
        },
    ],
})

const Priorities = createListCollection({
    items: [
        {
            label: "All",
            value: "all",
        },
        {
            label: "High",
            value: "HIGH",
        },
        {
            label: "Medium",
            value: "MEDIUM",
        },
        {
            label: "Low",
            value: "LOW",
        },
    ],
})

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
