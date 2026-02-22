import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Box, Flex, HStack, Menu, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useColumns } from "../dashboard/columns";
import { useVistorsStore, Visitor } from "@/store/visitors";
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'
import { LuEllipsisVertical } from "react-icons/lu";
import Image from "next/image";
import { formatDateDash, formatDatetoTime } from "@/services/date";
import { Paginator } from "@/components/ui/paginator";
import { useDashboardStore } from "@/store/dashboard";
import { usePathname } from "next/navigation";

interface TabProps {
    list?: Visitor[]
    component?: React.ReactNode;
}

export const VisitorTabs = ({ component }: TabProps) => {
    const columns = useColumns(false)
    const Scheduledcolumns = useColumns(true)
    const visitors = useVistorsStore((state) => state.visitors)
    const fetchVisitors = useVistorsStore((state) => state.fetchVisitors);
    const loadingVisitors = useVistorsStore((state) => state.isLoading)
    const dashboard = useDashboardStore((state) => state.dashboard)
    const isLoading = useDashboardStore((state) => state.isLoading)
    const isMobile = window.innerWidth < 700
    const pathname = usePathname();
    const isDashboard = pathname?.includes("dashboard")


    return (
        <Tabs.Root defaultValue={"walk-in"} variant={"line"}>
            {isMobile && <Flex mb={4} gap={2}>
                <SearchInput />
                {component}
            </Flex>}
            <HStack justify={"space-between"}>
                <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                    <Tabs.Trigger px={2} value="walk-in">
                        Walk-In Visitors ({isDashboard ? dashboard?.visitorsToday.walkInCount : 0})
                    </Tabs.Trigger>
                    <Tabs.Trigger px={2} ml={3} value="scheduled">
                        Scheduled Visitors ({isDashboard ? dashboard?.visitorsToday.scheduledCount : visitors.length})
                    </Tabs.Trigger>
                    <Tabs.Indicator bg={'transparent'} shadow={"none"} fontWeight={"bold"} />
                </Tabs.List>
                {!isMobile && <Flex gap={2}>
                    <SearchInput />
                    {component}
                </Flex>}
            </HStack>
            <Tabs.Content value="walk-in">
                {isMobile ? <MobileTable rows={[]} /> :
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Walk-in Visitors"
                        loading={isLoading || loadingVisitors}
                        pagination={{ currentPage: 1, pageSize: 10, total: visitors.length, totalPages: Math.ceil(visitors.length / 10) }}
                        emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}
                        columns={columns}
                        data={[]}
                    />}
            </Tabs.Content>
            <Tabs.Content value="scheduled">
                {isMobile ? <MobileTable rows={visitors} isScheduled /> : <DataTable
                    headerColor="#FFFFFF"
                    my={1}
                    tableName="Scheduled Visitors"
                    loading={isLoading || loadingVisitors}
                    emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}
                    columns={Scheduledcolumns}
                    data={isDashboard ? dashboard?.visitorsToday.list ?? [] : visitors}
                />}
            </Tabs.Content>
        </Tabs.Root>
    )
}

export const MobileTable = ({ rows, isScheduled }: { rows: Visitor[], isScheduled?: boolean }) => {
    const Status = [
        {
            value: 'UPCOMING',
            label: 'Upcoming',
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
        }
    ]

    const pageSize = 10;
    const totalPages = Math.ceil((rows?.length ?? 0) / pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() =>
        rows?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [],
        [rows, currentPage, pageSize]
    );


    const tableData = (currentData ?? []);

    if (!rows) return (<div className='flex flex-col items-center justify-center space-y-6'>
        <div className='flex items-center justify-center'>
            <Image src={EmptyTableIcon} alt="" />
        </div>

        <div className='flex flex-col items-center justify-center space-y-2'>
            <h4 className='text-xl font-bold text-[#303030]'>No Visitors yet</h4>
            <p className='text-sm font-medium text-[#6A6C88]'>
                Visitors you add will appear here for easy access and entry tracking.
            </p>
        </div>
    </div>)
    return (
        <Box>
            {tableData?.map((row) => {
                const status = Status.find((status) => status.value === (row?.status ?? 'CHECKED_IN'))

                return <Box p={4} rounded={'lg'} my={4} border={'1.7px solid #F4F4F4'}>
                    <HStack justify={'space-between'} my={3}>
                        <Box>
                            <Text className="satoshi-bold text-sm capitalize">{row?.visitorName}{row.isGroupInvite && ` (${row.groupName})`}</Text>
                            <Text className="satoshi-medium text-sm">{row?.visitorPhone}</Text>
                        </Box>
                        <Flex gap={1}>
                            <Flex
                                alignItems={'center'}
                                fontSize={'14px'}
                                fontWeight={'semibold'}
                                bg={status?.bgColor}
                                p={1}
                                px={4}
                                rounded={'3xl'}
                                justify={'center'}
                                w={'fit'}
                            >
                                <Text className="capitalize" color={status?.textColor} children={status?.label || row?.status} />
                            </Flex>
                            <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical cursor={'pointer'} />
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.ItemGroup gap={3}>
                                            <Menu.Item mb={2} cursor={'pointer'} value="save-visitor" >Save as Visitor</Menu.Item>
                                            <Menu.Item my={2} cursor={'pointer'} value="view-details">View Details</Menu.Item>
                                            <Menu.Item my={2} cursor={'pointer'} value="revoke-access">Revoke Access</Menu.Item>
                                        </Menu.ItemGroup>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                        </Flex>
                    </HStack>
                    <HStack justify={'space-between'} my={3}>
                        <Text className="satoshi-bold text-sm">Frequency:</Text>
                        <Text className="satoshi-medium text-sm" >{row?.frequency}</Text>
                    </HStack>
                    {isScheduled &&
                        <HStack justify={'space-between'} my={3}>
                            <Text className="satoshi-bold text-sm">Expected:</Text>
                            <Text className="satoshi-medium text-sm" >{formatDateDash(row.date)} | {formatDatetoTime(row.date)}</Text>
                        </HStack>}
                    <HStack justify={'space-between'} my={3}>
                        <Text className="satoshi-bold text-sm">Time in:</Text>
                        <Text className="satoshi-medium text-sm" >{row.checkInTime === '-' ? '-' : formatDatetoTime(row?.checkInTime)}</Text>
                    </HStack>
                    <HStack justify={'space-between'} my={3}>
                        <Text className="satoshi-bold text-sm">Time out:</Text>
                        <Text className="satoshi-medium text-sm" >{row.checkOutTime === '-' ? '-' : formatDatetoTime(row?.checkOutTime)}</Text>
                    </HStack>
                </Box>
            })}
            <Paginator
                current={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
            />
        </Box>)
}