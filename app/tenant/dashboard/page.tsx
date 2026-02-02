"use client"
import { PageTitle } from "@/components/ui/page-title"
import { Box, Button, Flex, HStack, Skeleton, SkeletonText, Tabs, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
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

export default function TenantDashboard() {
    const [maintenanceFilter, setMaintenanceFilter] = useState("7days")
    const columns = useColumns(false)
    const Scheduledcolumns = useColumns(true)
    const [openModal, setOpenModal] = useState(false)
    const [SwitchModal, setSwitchModal] = useState(false)
    const lease = useLeaseStore((state) => state.lease);
    const loading = useLeaseStore((state) => state.isLoading);
    const fetchLease = useLeaseStore((state) => state.fetchLease);
    const visitors = useVistorsStore((state) => state.visitors)
    const fetchVisitors = useVistorsStore((state) => state.fetchVisitors);
    const loadingVisitors = useVistorsStore((state) => state.isLoading)


    useEffect(() => {
        fetchLease()
        fetchVisitors()
    }, [])
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
                <Flex mt={3} mb={8} w={"full"} align={"center"} justify="start">
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
                        h={"116px"}
                        rounded={"8px"}
                        bgColor={"#2A3348"}
                    >
                        <Box className="z-50">
                            {loading ? <SkeletonText w={'200px'} noOfLines={1} mb={1} /> : <Text mb={1} className="satoshi-bold text-2xl">
                                {formatNumber(lease?.contract.rentAmount)}
                            </Text>}
                            <HStack mb={2} justify={"space-between"} fontSize={"12px"}>
                                <Text className="satoshi-bold">Rent Expiry Date:</Text>
                                {loading ? <SkeletonText w={'60px'} noOfLines={1} /> : <Text>{formatDateDash(lease?.contract.endDate)}</Text>}
                            </HStack>
                            <Progress value={80} size="lg" />
                        </Box>
                    </Box>
                </Flex>
                <Modal size={'xl'} triggerContent={'Submit Request'} modalContent={<TenantMaintenanceModal />} />
            </Box>
            <Box mt={10}>
                <PageTitle mb={4} title="Visitor’s Today" />
                <Tabs.Root defaultValue={"walk-in"} variant={"line"}>
                    <HStack justify={"space-between"}>
                        <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                            <Tabs.Trigger px={2} value="walk-in">
                                Walk-In Visitors ({visitors.length})
                            </Tabs.Trigger>
                            <Tabs.Trigger px={2} ml={3} value="scheduled">
                                Scheduled Visitors
                            </Tabs.Trigger>
                            <Tabs.Indicator bg={'transparent'} shadow={"none"} fontWeight={"bold"} />
                        </Tabs.List>
                        <Flex gap={2}>
                            <SearchInput />
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
                                triggerIcon={<LuUser />}
                            />
                        </Flex>
                    </HStack>
                    <Tabs.Content value="walk-in">
                        <DataTable
                            headerColor="#FFFFFF"
                            my={1}
                            tableName="Walk-in Visitors"
                            loading={loadingVisitors}
                            pagination={{ currentPage: 1, pageSize: 10, total: visitors.length, totalPages: Math.ceil(visitors.length / 10) }}
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
                            loading={loadingVisitors}
                            emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}
                            columns={Scheduledcolumns}
                            data={[]}
                        />
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Box>
    )
}

const MaintenanceFilter = [
    {
        label: "7 Days",
        value: "7days",
    },
    {
        label: "15 Days",
        value: "15days",
    },
    {
        label: "30 Days",
        value: "30days",
    },
]

const CardData = [
    {
        title: "Active Request",
        data: "09",
    },
    {
        title: "Completed Requests",
        data: "08",
    },
    {
        title: "Total Requests",
        data: "16",
    },
]
