"use client"
import { DashboardCard } from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import {
    Button,
    Flex,
    HStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { LuUserPlus } from "react-icons/lu"
import { Modal } from "@/components/ui/dialog"
import { VisitorTabs } from "./visitor-tabs"
import { useVisitorStore } from "@/store/fm/visitor"

export default function VisitorManagement() {
    const [maintenanceFilter, setMaintenanceFilter] = useState('TODAY')
    const [openModal, setOpenModal] = useState(false)
    const [SwitchModal, setSwitchModal] = useState(false)
    const visitors = useVisitorStore((state) => state.visitors)
    const fetchVisitors = useVisitorStore((state) => state.fetchVisitors);

    useEffect(() => {
        fetchVisitors()
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
            <Flex mt={3} mb={8} w={"full"} maxW={'99%'} overflowX={'scroll'} align={"center"} justify="start"><DashboardCard data={visitorDashboard} /> </Flex>
            <Flex mt={8} mb={10} justify={{ base: 'start', md: "end" }}>

            </Flex>
            <VisitorTabs />
        </>
    )
}

const visitorFilter = [
    { label: "Today", value: "TODAY" },
    { label: "Last Week", value: "LAST_WEEK" },
    { label: "Last Month", value: "LAST_MONTH" },
]


