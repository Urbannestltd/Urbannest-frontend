"use client"
import { DashboardCard } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import {
    Button,
    Flex,
    HStack,
    Tabs,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { LuUserPlus } from "react-icons/lu"
import { useColumns } from "../dashboard/columns"
import { AddVisitorModal } from "./add-visitor-modal"
import { AddVisitorGroupsModal } from "./add-visitor-groups"
import { Modal } from "@/components/ui/dialog"
import { useVistorsStore } from "@/store/visitors"
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'

export default function Visitors() {
    const [maintenanceFilter, setMaintenanceFilter] = useState("today")
    const [openModal, setOpenModal] = useState(false)
    const columns = useColumns(false)
    const scheduledColumns = useColumns(false)
    const [SwitchModal, setSwitchModal] = useState(false)
    const visitors = useVistorsStore((state) => state.visitors)
    const fetchVisitors = useVistorsStore((state) => state.fetchVisitors);

    useEffect(() => {
        fetchVisitors()
    })
    const setOpen = (open: boolean) => {
        setSwitchModal(open)
    }
    return (
        <>
            <PageTitle mt={7} title="Visitor Management" />
            <HStack my={5}>
                {visitorFilter.map((item) => (
                    <Button
                        key={item.value}
                        onClick={() => setMaintenanceFilter(item.value)}
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
            <DashboardCard data={visitorDashboard} />
            <Flex mt={8} mb={10} justify={"end"}>
                <Modal
                    open={openModal}
                    onOpenChange={() => { setOpenModal(!openModal); setSwitchModal(false) }}
                    modalContent={
                        SwitchModal ? (
                            <AddVisitorGroupsModal Submit={() => setOpenModal(false)} />
                        ) : (
                            <AddVisitorModal
                                Open={setOpen}
                                Submit={() => setOpenModal(false)}
                            />
                        )
                    }
                    triggerContent="Add Visitor"
                    triggerIcon={<LuUserPlus />}
                />
            </Flex>
            <Tabs.Root defaultValue={"walk-in"} variant={"line"}>
                <HStack justify={"space-between"}>
                    <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                        <Tabs.Trigger px={2} value="walk-in">
                            Walk-In Visitors ({visitors.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger px={2} ml={3} value="scheduled">
                            Scheduled Visitors
                        </Tabs.Trigger>
                        <Tabs.Indicator
                            shadow={"none"}
                            borderBottom={"1px solid #2A3348"}
                            bg="transparent"
                            fontWeight={"bold"}
                        />
                    </Tabs.List>
                    <SearchInput />
                </HStack>
                <Tabs.Content value="walk-in">
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Walk-in Visitors"
                        emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}

                        columns={columns}
                        data={visitors}
                    />
                </Tabs.Content>
                <Tabs.Content value="scheduled">
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Scheduled Visitors"
                        emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}

                        columns={scheduledColumns}
                        data={[]}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </>
    )
}

const visitorFilter = [
    { label: "Today", value: "today" },
    { label: "Last Week", value: "last-week" },
    { label: "Last Month", value: "last-month" },
]

const visitorDashboard = [
    {
        title: "Total Vistors",
        data: "09",
    },
    {
        title: "Total Scheduled",
        data: "08",
    },
    {
        title: "Total Walk-ins",
        data: "16",
    },
    {
        title: "Total Cancels",
        data: "13",
    },
]
