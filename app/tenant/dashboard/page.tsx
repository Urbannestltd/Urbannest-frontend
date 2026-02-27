"use client"
import { PageTitle } from "@/components/ui/page-title"
import { Box, Button, Flex, HStack, Skeleton, SkeletonText, Tabs, Text } from "@chakra-ui/react"
import { use, useEffect, useState } from "react"
import { DashboardCard } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress-bar"
import { SearchInput } from "@/components/ui/search-input"
import { LuUser } from "react-icons/lu"
import { useColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ellipsisbg from "@/app/assets/images/ellipse-bg.svg"
import { AddVisitorModal } from "../visitors/add-visitor-modal"
import { AddVisitorGroupsModal } from "../visitors/add-visitor-groups"
import { useLeaseStore } from "@/store/lease"
import { formatDateDash, formatNumber } from "@/services/date"
import { Modal } from "@/components/ui/dialog"
import { useVistorsStore } from "@/store/visitors"
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'
import { TenantMaintenanceModal } from "../maintenance/modal"
import { useMaintenanceStore } from "@/store/maintenance"
import { VisitorTabs } from "../visitors/visitor-tabs"
import { useDashboardStore } from "@/store/dashboard"

export default function TenantDashboard() {
    const [maintenanceFilter, setMaintenanceFilter] = useState(7)
    const [openModal, setOpenModal] = useState(false)
    const [SwitchModal, setSwitchModal] = useState(false)
    const lease = useLeaseStore((state) => state.lease);
    const loading = useLeaseStore((state) => state.isLoading);
    const fetchLease = useLeaseStore((state) => state.fetchLease);
    const loadingVisitors = useVistorsStore((state) => state.isLoading)
    const fetchMaintenance = useMaintenanceStore((state) => state.fetchMaintenance)
    const dashboard = useDashboardStore((state) => state.dashboard)
    const fetchDashboard = useDashboardStore((state) => state.fetchDashboard)

    useEffect(() => {
        fetchLease()
        fetchDashboard(7)
        fetchMaintenance()
    }, [])

    const CardData = [
        {
            title: "Active Request",
            data: dashboard?.maintenance.active ?? 0,
        },
        {
            title: "Completed Requests",
            data: dashboard?.maintenance.completed ?? 0,
        },
        {
            title: "Total Requests",
            data: dashboard?.maintenance.total ?? 0,
        },
    ]

    const setOpen = (open: boolean) => {
        setSwitchModal(open)
        console.log(open)
    }
    return (
        <Box>
            <Box mt={7}>
                <PageTitle title="Maintenance Overview" mb={"14px"} />
                <HStack>
                    {MaintenanceFilter.map((item) => (
                        <Button
                            key={item.value}
                            onClick={() => { setMaintenanceFilter(item.value); fetchDashboard(item.value) }}
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
                <Flex mt={3} mb={8} w={"full"} maxW={'99%'} overflowX={'scroll'} align={"center"} justify="start">
                    <DashboardCard data={CardData} />
                    <Box
                        ml={4}
                        className="relative"
                        bgImage={`url('${ellipsisbg.src}')`}
                        bgSize={"contain"}
                        backgroundPosition={"right"}
                        bgRepeat={"no-repeat"}
                        zIndex={"initial"}
                        p={6}
                        color={"white"}
                        w={"45%"}
                        minW={'300px'}
                        h={"116px"}
                        rounded={"8px"}
                        bgColor={"#2A3348"}
                    >
                        <Box>
                            {loading ? <SkeletonText w={'200px'} noOfLines={1} mb={1} /> : <Text mb={1} className="satoshi-bold text-2xl">
                                {formatNumber(dashboard?.lease.amount)}
                            </Text>}
                            <HStack mb={2} justify={"space-between"} fontSize={"12px"}>
                                <Text className="satoshi-bold">Rent Expiry Date:</Text>
                                {loading ? <SkeletonText w={'60px'} noOfLines={1} /> : <Text>{formatDateDash(dashboard?.lease.expiryDate)}</Text>}
                            </HStack>
                            <Progress value={dashboard?.lease.progressPercentage} size="lg" />
                        </Box>
                    </Box>
                </Flex>
                <Modal size={'xl'} triggerContent={'Add Request'} modalContent={<TenantMaintenanceModal />} />
            </Box>
            <Box mt={10}>
                <PageTitle mb={4} title="Visitor’s Today" />
                <VisitorTabs
                    component={<Modal
                        open={openModal}
                        onOpenChange={() => { setOpenModal(!openModal); setSwitchModal(false) }}
                        modalContent={
                            SwitchModal ? (
                                <AddVisitorGroupsModal Open={setOpen} unitid={lease?.property.unitId || ''} Submit={() => setOpenModal(false)} />
                            ) : (
                                <AddVisitorModal
                                    Open={setOpen}
                                    Submit={() => setOpenModal(false)}
                                />
                            )
                        }
                        triggerContent="Add Visitor"
                        triggerIcon={<LuUser />}
                    />} />

            </Box>
        </Box>
    )
}

const MaintenanceFilter = [
    {
        label: "7 Days",
        value: 7,
    },
    {
        label: "15 Days",
        value: 15,
    },
    {
        label: "30 Days",
        value: 30,
    },
]

