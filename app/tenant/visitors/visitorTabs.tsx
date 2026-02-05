import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Flex, HStack, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useColumns } from "../dashboard/columns";
import { useVistorsStore } from "@/store/visitors";
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'

interface TabProps {
    component?: React.ReactNode;
}

export const VisitorTabs = ({ component }: TabProps) => {
    const columns = useColumns(false)
    const Scheduledcolumns = useColumns(true)
    const visitors = useVistorsStore((state) => state.visitors)
    const fetchVisitors = useVistorsStore((state) => state.fetchVisitors);
    const loadingVisitors = useVistorsStore((state) => state.isLoading)

    useEffect(() => {
        fetchVisitors()
    }, [])

    return (
        <Tabs.Root defaultValue={"walk-in"} variant={"line"}>
            <HStack justify={"space-between"}>
                <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                    <Tabs.Trigger px={2} value="walk-in">
                        Walk-In Visitors ({visitors.length})
                    </Tabs.Trigger>
                    <Tabs.Trigger px={2} ml={3} value="scheduled">
                        Scheduled Visitors ({visitors.length})
                    </Tabs.Trigger>
                    <Tabs.Indicator bg={'transparent'} shadow={"none"} fontWeight={"bold"} />
                </Tabs.List>
                <Flex gap={2}>
                    <SearchInput />
                    {component}
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
                    data={visitors}
                />
            </Tabs.Content>
        </Tabs.Root>
    )
}