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
import { useLeaseStore } from "@/store/lease"
import { VisitorTabs } from "./visitorTabs"

export default function Visitors() {
    const [maintenanceFilter, setMaintenanceFilter] = useState("today")
    const [openModal, setOpenModal] = useState(false)
    const [SwitchModal, setSwitchModal] = useState(false)
    const visitors = useVistorsStore((state) => state.visitors)
    const fetchVisitors = useVistorsStore((state) => state.fetchVisitors);
    const unitId = useLeaseStore((state) => state.lease?.property.unitId);
    const fetchLease = useLeaseStore((state) => state.fetchLease);

    useEffect(() => {
        fetchVisitors()
        fetchLease()
    })
    const visitorDashboard = [
        {
            title: "Total Vistors",
            data: visitors.length,
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
            data: 0,
        },
    ]
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
                            <AddVisitorGroupsModal unitid={unitId ?? ''} Submit={() => setOpenModal(false)} />
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
            <VisitorTabs />
        </>
    )
}

const visitorFilter = [
    { label: "Today", value: "today" },
    { label: "Last Week", value: "last-week" },
    { label: "Last Month", value: "last-month" },
]


