'use client'
import { MainButton } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageTitle } from "@/components/ui/page-title";
import { SearchInput } from "@/components/ui/search-input";
import { VistorData } from "@/utils/data";
import { Box, Button, CloseButton, Dialog, Flex, HStack, Portal, Tabs } from "@chakra-ui/react";
import { title } from "process";
import { useState } from "react";
import { CgUser, CgUserAdd } from "react-icons/cg";
import { LuUser, LuUserPlus } from "react-icons/lu";
import { useColumns } from "../dashboard/columns";
import { AddVisitorModal } from "./add-visitor-modal";
import { AddVisitorGroupsModal } from "./add-visitor-groups";

export default function Visitors() {
    const [maintenanceFilter, setMaintenanceFilter] = useState("today")
    const [openModal, setOpenModal] = useState(false)
    const columns = useColumns()
    const [SwitchModal, setSwitchModal] = useState(false)
    const setOpen = (open: boolean) => {
        setSwitchModal(open)
        console.log(open)
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
            <Flex mt={8} mb={10} justify={'end'}>
                <MainButton className="place-self-end" icon={<LuUserPlus />} onClick={() => setOpenModal(true)} children="Add Visitor" />
            </Flex>
            <Tabs.Root defaultValue={"walk-in"} variant={"line"}>
                <HStack justify={"space-between"}>
                    <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                        <Tabs.Trigger px={2} value="walk-in">
                            Walk-In Visitors ({VistorData.visitors.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger px={2} ml={3} value="scheduled">
                            Scheduled Visitors
                        </Tabs.Trigger>
                        <Tabs.Indicator shadow={"none"} borderBottom={'1px solid #2A3348'} bg='transparent' fontWeight={"bold"} />
                    </Tabs.List>
                    <SearchInput />
                </HStack>
                <Tabs.Content value="walk-in">
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Walk-in Visitors"
                        columns={columns}
                        data={VistorData.visitors}
                    />
                </Tabs.Content>
                <Tabs.Content value="scheduled">
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Scheduled Visitors"
                        columns={columns}
                        data={[]}
                    />
                </Tabs.Content>
            </Tabs.Root>
            <Dialog.Root open={openModal} onOpenChange={() => { setOpenModal(!openModal); setSwitchModal(false) }}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content mt={40}>
                            <Dialog.CloseTrigger><CloseButton /></Dialog.CloseTrigger>
                            {SwitchModal ? <AddVisitorGroupsModal Submit={() => setOpenModal(false)} /> : <AddVisitorModal Open={setOpen} Submit={() => setOpenModal(false)} />}
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
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
        title: 'Total Vistors',
        data: '09'
    },
    {
        title: 'Total Scheduled',
        data: '08'
    },
    {
        title: 'Total Walk-ins',
        data: '16'
    },
    {
        title: 'Total Cancels',
        data: '13'
    }
]