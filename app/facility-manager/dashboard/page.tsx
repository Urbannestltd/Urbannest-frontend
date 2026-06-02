'use client'
import { CardData, DashboardCard } from "@/components/ui/card";
import { Box, createListCollection, Flex, HStack, Tabs, Text } from "@chakra-ui/react";
import PropertiesIcon from "@/app/assets/icons/facilty-icons/properties-managed.svg"
import OpenTickets from "@/app/assets/icons/facilty-icons/open-tickets.svg"
import PendingBudget from "@/app/assets/icons/facilty-icons/pending-budget.svg"
import UpcomingVisitors from "@/app/assets/icons/facilty-icons/upcoming-visitors.svg"
import { SectionBox, SectionFlex } from "@/components/ui/section-box";
import { useForm } from "react-hook-form";
import { CustomSelect } from "@/components/ui/custom-fields";
import { DataTable } from "@/components/ui/data-table";
import { TickettData, VistorData } from "@/utils/data";
import { useColumns, useVisitorColumns } from "./columns";
import { MobileTable, MobileTableVisitor } from "./mobile-table";
import emptyVisitorIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'
import emptyTicketIcon from '@/app/assets/icons/facilty-icons/ticket-empty.svg'
import { useFMDashboardStore } from "@/store/fm/dashboard";
import { stat } from "fs";
import { useEffect } from "react";
import { it } from "zod/v4/locales";
import { useRouter } from "next/navigation";
import { MdOutlineFilterListOff, MdRefresh } from "react-icons/md";

export default function Dashboard() {
    const { control, watch, reset } = useForm<{ priority: [string], visitorType: [string] }>()
    const columns = useColumns()
    const router = useRouter()
    const visitorColumns = useVisitorColumns()
    const { summary, visitors, tickets, fetchSummary, fetchVisitors, fetchTickets, isLoadingSummary, isLoadingVisitors, isLoadingTickets, errorLoadingSummary, errorLoadingVisitors, errorLoadingTickets } = useFMDashboardStore(state => state)
    const isMobile = window.innerWidth < 600
    const formValues = watch()

    useEffect(() => {
        fetchSummary()
        fetchVisitors()
        fetchTickets()
    }, [])

    useEffect(() => {
        fetchTickets(formValues.priority?.[0])
    }, [formValues.priority])

    useEffect(() => {
        fetchVisitors(formValues.visitorType?.[0])
    }, [formValues.visitorType])

    const CardData: CardData[] = [
        {
            title: "Properties Managed",
            data: summary?.propertiesManaged || 0,
            icon: PropertiesIcon,
            new: 2,
            cardColor: '#E8EBEE',
            border: true,
            newColor: '#2A3348'
        },
        {
            title: "Open Tickets",
            data: summary?.openTickets || 0,
            border: true,
            icon: OpenTickets,
        },
        {
            title: "Pending Budget",
            data: summary?.pendingBudgetApprovals || 0,
            border: true,
            icon: PendingBudget,
        },
        {
            title: "Upcoming Visitors",
            data: summary?.todayVisitorCount || 0,
            border: true,
            icon: UpcomingVisitors,
        }
    ]
    const WalkinVisitors = (visitors ?? []).filter((item) => item.isWalkIn)
    const ScheduledVisitors = (visitors ?? []).filter((item) => !item.isWalkIn)
    return (
        <Box mt={'45px'} p={2}>
            <DashboardCard data={CardData} />
            <Flex mt={'45px'} direction={{
                base: 'column', md: 'row'
            }} gap={'27px'}>
                <Box w={{ base: 'full', md: '50%' }}>
                    <SectionFlex align={'center'} justifyContent={'space-between'}>
                        <Text className="satoshi-bold">Recent Tickets</Text>
                        <div className="w-[20%]">
                            {isMobile ? <Text className="satoshi-bold text-sm text-[#545F73]">View All</Text> : <HStack>

                                <CustomSelect control={control} name='priority' triggerHeight="32px" placeholder="Priority" collection={priorityFilter} />
                                {formValues.priority?.length > 0 ?
                                    <MdOutlineFilterListOff cursor={'pointer'} onClick={() => reset({ priority: [] })} /> : null}

                            </HStack>
                            }</div>
                    </SectionFlex>
                    {isMobile ? <MobileTable data={tickets} loading={isLoadingTickets} emptyDetails={{ icon: emptyTicketIcon.src, title: 'No open tickets', description: 'Maintenance tickets will appear here once requests are submitted.' }} /> : <Box rounded={4} mt={'30px'} p={0}>
                        <DataTable my={'0px'} miniTableOnclick={() => router.push('/facility-manager/maintenance-and-issues')} onRowClick={(row) => router.push(`/facility-manager/maintenance-and-issues/${row.id}`)} rounded headerColor="#000000" miniTable tableName="tickets" loading={isLoadingTickets} emptyDetails={{ icon: emptyTicketIcon, title: 'No open tickets', description: 'Maintenance tickets will appear here once requests are submitted.' }} bordered borderRadius={'11px'} columns={columns} data={tickets} />
                    </Box>}
                </Box>
                <Box w={{ base: 'full', md: '50%' }}>

                    <SectionFlex align={'center'} justifyContent={'space-between'}>
                        <Text className="satoshi-bold">Today’s Visitors</Text>
                        <div className="w-[20%]">

                            {isMobile ? <Text className="satoshi-bold text-sm text-[#545F73]">View All</Text> : <HStack>
                                <CustomSelect control={control} name='visitorType' triggerHeight="32px" placeholder="All Types" collection={visitorTypeFilter} />
                                {formValues.visitorType?.length > 0 ?
                                    <MdOutlineFilterListOff cursor={'pointer'} onClick={() => reset({ priority: [] })} /> : null}
                            </HStack>}
                        </div>
                    </SectionFlex>
                    <Tabs.Root defaultValue={"walk-in"} mt={'30px'} color={'#303030'} variant={"line"}>
                        <Tabs.List w={{ base: 'full', md: '55%' }} borderBottom={"1px solid #D9D9D9"}>
                            <Tabs.Trigger textWrap={'nowrap'} _selected={{ fontWeight: 'bold', borderBottom: "2px solid #303030" }} px={2} value="walk-in">
                                Walk-In Visitors ({WalkinVisitors.length})
                            </Tabs.Trigger>
                            <Tabs.Trigger textWrap={'nowrap'} _selected={{ fontWeight: 'bold', borderBottom: "2px solid #303030" }} px={2} ml={3} value="scheduled">
                                Scheduled Visitors ({ScheduledVisitors.length})
                            </Tabs.Trigger>
                            <Tabs.Indicator bg={'transparent'} color={'#303030'} shadow={"none"} fontWeight={"bold"} />
                        </Tabs.List>
                        <Tabs.Content value="walk-in">
                            {isMobile ? (<MobileTableVisitor data={WalkinVisitors ?? []} loading={isLoadingVisitors} tableName="visitors" emptyDetails={{ icon: emptyVisitorIcon.src, title: 'No visitors today', description: 'Visitors your tenants add will appear here for easy access and entry tracking.', }} />) : <Box mt={{ base: '10px', md: '0px' }} p={0}>
                                <DataTable my={'0px'} borderRadius={'11px'} rounded columns={visitorColumns} data={WalkinVisitors ?? []} loading={isLoadingVisitors} miniTable bordered tableName="visitors" emptyDetails={{ icon: emptyVisitorIcon, title: 'No visitors today', description: 'Visitors your tenants add will appear here for easy access and entry tracking.', }} />
                            </Box>}
                        </Tabs.Content>
                        <Tabs.Content value="scheduled">
                            {isMobile ? (<MobileTableVisitor tableName="visitors" emptyDetails={{ icon: emptyVisitorIcon.src, title: 'No visitors today', description: 'Visitors your tenants add will appear here for easy access and entry tracking.', }} data={ScheduledVisitors ?? []} loading={isLoadingVisitors} />) : <Box mt={{ base: '10px', md: '0px' }} p={0}>
                                <DataTable my={'0px'} miniTable bordered rounded tableName="visitors" emptyDetails={{ icon: emptyVisitorIcon, title: 'No visitors today', description: 'Visitors your tenants add will appear here for easy access and entry tracking.', }} borderRadius={'11px'} columns={visitorColumns} data={ScheduledVisitors ?? []} loading={isLoadingVisitors} />
                            </Box>}

                        </Tabs.Content>
                    </Tabs.Root>

                </Box>
            </Flex >
        </Box >
    )
}

const priorityFilter = createListCollection({
    items: [
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
    ]
})

const visitorTypeFilter = createListCollection({
    items: [
        { label: 'Recurring', value: 'RECURRING' },
        { label: 'One Off', value: 'ONE_OFF' },
        { label: 'Inspection', value: 'ONE_OFF_AGENT' },
        { label: 'Whole Day', value: 'WHOLE_DAY' },
        { label: 'Request', value: 'REQUEST' },
    ]
})