"use client"
import { DashboardCard } from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import {
    Box,
    Button,
    createListCollection,
    Flex,
    HStack,
    Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { LuCalendar, LuUserPlus } from "react-icons/lu"
import { Modal } from "@/components/ui/dialog"
import { VisitorTabs } from "./visitor-tabs"
import { useVisitorStore } from "@/store/fm/visitor"
import { BiSlider } from "react-icons/bi"
import { CustomSelect } from "@/components/ui/custom-fields"
import { SearchInput } from "@/components/ui/search-input"
import { useForm } from "react-hook-form"
import { VisitorFilterFormData } from "@/schema/fm"
import { getDateRange } from "@/services/date"
import { SectionBox } from "@/components/ui/section-box"
import { AddWalkins, CheckIn } from "./add-walkins"

export default function VisitorManagement() {
    const [maintenanceFilter, setMaintenanceFilter] = useState('TODAY')
    const [openModal, setOpenModal] = useState(false)
    const [openWalkinModal, setOpenWalkinModal] = useState(false)
    const [search, setSearch] = useState("")
    const visitors = useVisitorStore((state) => state.visitors)
    const loading = useVisitorStore((state) => state.isLoading)
    const fetchVisitors = useVisitorStore((state) => state.fetchVisitors);
    const fetchWalkins = useVisitorStore((state) => state.fetchWalkins);
    const isMobile = window.innerWidth < 600
    const { control, watch } = useForm<VisitorFilterFormData>()
    const watchedValues = watch()

    const [notFound, setNotFound] = useState(false)

    const hasActiveFilter = !!(
        search ||
        (watchedValues.status?.[0] && watchedValues.status[0] !== "all") ||
        (watchedValues.accessType?.[0] && watchedValues.accessType[0] !== "all") ||
        (watchedValues.property?.[0] && watchedValues.property[0] !== "all") ||
        (watchedValues.dateRange?.[0] && watchedValues.dateRange[0] !== "all")
    )


    useEffect(() => {
        const timer = setTimeout(
            () => {
                const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                fetchVisitors({
                    search,
                    status:
                        watchedValues.status?.[0] === "all"
                            ? undefined
                            : watchedValues.status?.[0],
                    type:
                        watchedValues.accessType?.[0] === "all"
                            ? undefined
                            : watchedValues.accessType?.[0],
                    dateFrom: startDate,
                    dateTo: endDate,
                    propertyId: watchedValues.property?.[0] === "all" ? undefined : watchedValues.property?.[0],
                })
                fetchWalkins({
                    search,
                    status:
                        watchedValues.status?.[0] === "all"
                            ? undefined
                            : watchedValues.status?.[0],
                    type:
                        watchedValues.accessType?.[0] === "all"
                            ? undefined
                            : watchedValues.accessType?.[0],
                    dateFrom: startDate,
                    dateTo: endDate,
                    propertyId: watchedValues.property?.[0] === "all" ? undefined : watchedValues.property?.[0],
                })
            },
            search ? 100 : 0,
        )

        return () => clearTimeout(timer)
    }, [
        watchedValues.accessType,
        watchedValues.status,
        watchedValues.property,
        search,
    ])

    useEffect(() => {
        if (!loading) {
            setNotFound(hasActiveFilter && visitors.length === 0)
        }
    }, [loading, visitors, hasActiveFilter])


    useEffect(() => {
        fetchVisitors()
        fetchWalkins()
    }, [])

    const visitorDashboard = [
        {
            title: "Total Vistors",
            data: 0,
        },
        {
            title: "Total Scheduled",
            data: 0,
        },
        {
            title: "Total Walk-ins",
            data: 0,
        },
        {
            title: "Total Cancels",
            data: 0,
        },
    ]

    return (
        <>
            <PageTitle mt={7} title="Visitor Management" />
            <HStack my={5}>
                {visitorFilter.map((item) => (
                    <Button
                        key={item.value}
                        onClick={() => { setMaintenanceFilter(item.value); fetchVisitors() }}
                        w={"72px"}
                        h={"30px"}
                        rounded={"full"}
                        fontSize={"12px"}
                        className={`${maintenanceFilter === item.value
                            ? "bg-[#F9EBD1]"
                            : "border border-[#757575]"
                            }`}
                    >
                        {item.label}
                    </Button>
                ))}
            </HStack>
            <DashboardCard newMobile={isMobile} data={visitorDashboard} />
            {isMobile ? (
                <SectionBox bg={'#F2F4F4'} mt={4} w={"full"}>
                    <HStack justify={"space-between"} w={"full"} mb={4}>
                        <Text className="satoshi-bold text-sm">Quick Filters</Text>
                        <BiSlider color="#5A6061" />
                    </HStack>
                    <HStack w={"full"} mb={4}>
                        <CustomSelect
                            name="property"
                            control={control}
                            borderColor="transparent"
                            size={"xs"}
                            triggerHeight="20px"
                            width={"full"}
                            placeholder="All Types"
                            collection={propertyTypes}
                        />
                        <CustomSelect
                            name='status'
                            control={control}
                            borderColor="transparent"
                            size={"xs"}
                            triggerHeight="20px"
                            width={"full"}
                            placeholder="All Statuses"
                            collection={statuses}
                        />
                    </HStack>
                    <SearchInput value={search} onChange={setSearch} onSearch={(val) => {
                        const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                        fetchVisitors({
                            search,
                            propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                            status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
                            type: watchedValues.accessType?.[0] === 'all' ? undefined : watchedValues.accessType?.[0],
                            dateFrom: startDate,
                            dateTo: endDate
                        })
                        fetchWalkins({
                            search,
                            propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                            status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
                            type: watchedValues.accessType?.[0] === 'all' ? undefined : watchedValues.accessType?.[0],
                            dateFrom: startDate,
                            dateTo: endDate
                        })
                    }} placeholder="" width={"full"} />
                    {" "}
                </SectionBox>
            ) : (<>
                <Flex w={"70%"} mt={6} gap={5}>
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
                        placeholder="All Types"
                        label="Access Type"
                        name="accessType"
                        collection={Priorities}
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
            </>)}

            <VisitorTabs
                component={
                    <Flex w={'100%'} gap={2}><Modal
                        open={openModal}
                        onOpenChange={setOpenModal}
                        modalContent={
                            <AddWalkins
                                onClose={() => { fetchWalkins(); setOpenModal(false) }}
                            />
                        }
                        triggerContent="Add Walk In"
                        triggerVariant='outline'
                        triggerSize='lg'
                    /><Modal
                            size={'cover'}
                            className="w-[600px] h-fit"
                            open={openWalkinModal}
                            onOpenChange={setOpenWalkinModal}
                            modalContent={
                                <CheckIn
                                    onWalkIn={() => { setOpenWalkinModal(false); setOpenModal(true) }}
                                    onClose={() => { fetchVisitors(); setOpenWalkinModal(false) }}
                                />
                            }
                            triggerContent="Add Check In"

                            triggerSize='lg'
                        /></Flex>}
                search={search}
                onSearchChange={setSearch}
                onSearch={(val) => {
                    const { startDate, endDate } = getDateRange(watchedValues.dateRange?.[0])
                    fetchVisitors({
                        search: val,
                        status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
                        type: watchedValues.accessType?.[0] === 'all' ? undefined : watchedValues.accessType?.[0],
                        propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                        dateFrom: startDate,
                        dateTo: endDate,
                    })
                    fetchWalkins({
                        search: val,
                        status: watchedValues.status?.[0] === 'all' ? undefined : watchedValues.status?.[0],
                        type: watchedValues.accessType?.[0] === 'all' ? undefined : watchedValues.accessType?.[0],
                        propertyId: watchedValues.property?.[0] === 'all' ? undefined : watchedValues.property?.[0],
                        dateFrom: startDate,
                        dateTo: endDate,
                    })
                }}
            />
        </>
    )
}

const visitorFilter = [
    { label: "Today", value: "TODAY" },
    { label: "Last Week", value: "LAST_WEEK" },
    { label: "Last Month", value: "LAST_MONTH" },
]



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
            value: 'UPCOMING',
            label: 'Not Arrived',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        },
        {
            value: 'CHECKED_IN',
            label: 'Checked In',
            bgColor: '#D8E9F9',
            textColor: '#1976D2'
        },
        {
            value: 'CHECKED_OUT',
            label: 'Checked Out',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        },
        {
            value: 'PENDING',
            label: 'Pending',
            bgColor: '#FFFBEB',
            textColor: '#BF6A02'
        },
        {
            value: 'RESCHEDULED',
            label: 'Rescheduled',
            bgColor: '#FFFBEB',
            textColor: '#BF6A02'
        },
        {
            value: 'REJECTED',
            label: 'Rejected',
            bgColor: '#FEF2F2',
            textColor: '#B91C1C'
        }
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
