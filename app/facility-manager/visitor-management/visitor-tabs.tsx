import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Box, Center, Flex, HStack, Menu, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'
import { LuEllipsisVertical } from "react-icons/lu";
import Image from "next/image";
import { formatDateDash, formatDatetoTime } from "@/services/date";
import { Paginator } from "@/components/ui/paginator";
import { usePathname } from "next/navigation";
import { useColumns } from "./columns";
import { Modal } from "@/components/ui/dialog";
import { ApproveRequestModal, RejectRequestModal, RescheduleRequestModal } from "./modal";
import { useVisitorStore, Visitor } from "@/store/fm/visitor";

interface TabProps {
    list?: Visitor[]
    component?: React.ReactNode;
    search?: string;
    onSearchChange?: (val: string) => void;
    onSearch?: (val: string) => void;
}

export const VisitorTabs = ({ component, search = '', onSearchChange, onSearch }: TabProps) => {
    const columns = useColumns(false)
    const Scheduledcolumns = useColumns(true)
    const visitors = useVisitorStore((state) => state.visitors)
    const loadingVisitors = useVisitorStore((state) => state.isLoading)
    const isMobile = window.innerWidth < 700
    const pathname = usePathname();


    return (
        <Tabs.Root defaultValue={"walk-in"} variant={"line"}>

            <HStack mt={4} justify={"space-between"}>
                <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                    <Tabs.Trigger px={2} value="walk-in">
                        Walk-In Visitors (0)
                    </Tabs.Trigger>
                    <Tabs.Trigger px={2} ml={3} value="scheduled">
                        Scheduled Visitors ({visitors.length ?? 0})
                    </Tabs.Trigger>
                    <Tabs.Indicator bg={'white'} shadow={"none"} fontWeight={"bold"} />
                </Tabs.List>
                {!isMobile && <Flex gap={2}>
                    <SearchInput
                        value={search}
                        onChange={onSearchChange ?? (() => {})}
                        onSearch={onSearch ?? (() => {})}
                        placeholder=""
                        width={"full"}
                    />
                    {component}
                </Flex>}
            </HStack>
            <Tabs.Content value="walk-in">
                {isMobile ? <MobileTable rows={[]} /> :
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="Walk-in Visitors"
                        loading={loadingVisitors}
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
                    loading={loadingVisitors}
                    emptyDetails={{ icon: EmptyTableIcon, title: 'No Visitors yet', description: 'Visitors you add will appear here for easy access and entry tracking.' }}
                    columns={Scheduledcolumns}
                    data={visitors}
                />}
            </Tabs.Content>
        </Tabs.Root>
    )
}

export const MobileTable = ({ rows, isScheduled }: { rows: Visitor[], isScheduled?: boolean }) => {
    const Status = [
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
    ]

    const Type = [
        {
            value: 'ONE_OFF_AGENT',
            label: 'Request',
            bgColor: '#FFFBEB',
            borderColor: '#EBFFEE',
            textColor: '#BF6A02'
        },
        {
            value: 'ONE_OFF_AGENT_APPROVED',
            label: 'Inspection',
            bgColor: '#EBFFEE',
            borderColor: '#FFFBEB',
            textColor: '#14AE5C'
        },
        {
            value: 'ONE_OFF',
            label: 'One Off',
            bgColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            textColor: '#4A4A4A'
        },
        {
            value: 'WHOLE_DAY',
            label: 'Whole Day',
            bgColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            textColor: '#4A4A4A'
        },
        {
            value: 'RECURRING',
            label: 'Recurring',
            bgColor: '#FFFBEB',
            borderColor: '#EBFFEE',
            textColor: '#BF6A02'
        },
    ]

    const pageSize = 10;
    const totalPages = Math.ceil((rows?.length ?? 0) / pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() =>
        rows?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [],
        [rows, currentPage, pageSize]
    );

    const [approve, setApprove] = useState(false)
    const [reject, setReject] = useState(false)
    const [reschedule, setReschedule] = useState(false)



    const tableData = (currentData ?? []);

    if (!rows || rows.length === 0) {
        return (<div className='flex flex-col my-7 pb-10 items-center justify-center space-y-6'>
            <div className='flex items-center justify-center'>
                <Image src={EmptyTableIcon} alt="" />
            </div>

            <div className='flex flex-col items-center justify-center space-y-2'>
                <h4 className='text-xl font-bold text-[#303030]'>No Visitors yet</h4>
                <p className='text-sm text-center font-medium text-[#6A6C88]'>
                    Visitors you add will appear here for easy access and entry tracking.
                </p>
            </div>
        </div>)
    }
    return (
        <Box>
            {tableData?.map((row) => {
                const status = Status.find((status) => status.value === (row?.rawStatus ?? 'CHECKED_IN'))
                const type = Type.find((type) => type.value === row?.frequency)

                return <Box p={4} rounded={'lg'} my={4} border={'1.7px solid #F4F4F4'}>
                    <HStack justify={'space-between'} my={3}>
                        <Box>
                            <Text className="satoshi-bold text-sm capitalize">{row?.propertyName}{/*row.isGroupInvite && ` (${row.groupName})`*/}</Text>
                            <Text className="text-[#757575] text-sm">{row?.unitName}</Text>
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
                                <Text className="capitalize" color={status?.textColor} children={status?.label || row?.rawStatus} />
                            </Flex>
                            {(row.canApprove || row.canReject || row.canReschedule) && <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical cursor={'pointer'} />
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.ItemGroup gap={3}>
                                            {row.canApprove && <Menu.Item onClick={() => setApprove(true)} value="approve">Approve Request</Menu.Item>}
                                            {row.canReject && <Menu.Item onClick={() => setReject(true)} value="reject">Reject Request</Menu.Item>}
                                            {row.canReschedule && <Menu.Item onClick={() => setReschedule(true)} value="reschedule">Reschedule Visit</Menu.Item>}
                                        </Menu.ItemGroup>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>}
                        </Flex>
                    </HStack>
                    <Flex justify={'space-between'}>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Visitor Name</Text>
                            <Text className="satoshi-medium text-sm" >{row?.visitorName}</Text>
                        </Stack>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Tenant Name</Text>
                            <Text className="satoshi-medium text-sm" >{row?.tenantName}</Text>
                        </Stack>
                    </Flex>
                    <Flex justify={'space-between'}>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Access Type</Text>
                            <Center w={'fit'} py={0.5} bg={type?.bgColor} rounded={'full'} px={2} border={`1px solid ${type?.borderColor}`}>
                                <Text className="capitalize satoshi-bold text-sm " color={type?.textColor} children={type?.label} />
                            </Center>
                        </Stack>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Time in/Out</Text>
                            <Text className="satoshi-medium text-sm" >{row.visitDate === '-' ? '-' : formatDatetoTime(row?.visitDate)}/{row.proposedDate === '-' ? '-' : formatDatetoTime(row?.proposedDate)}</Text>
                        </Stack>
                    </Flex>
                    {isScheduled &&
                        <Stack my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Expected</Text>
                            <Text className="satoshi-medium text-sm" >{formatDateDash(row.visitDate)} | {formatDatetoTime(row.visitDate)}</Text>
                        </Stack>}
                    <Modal open={approve} onOpenChange={setApprove} size={'xs'} modalContent={<ApproveRequestModal agentData={{ name: row.agentName, unit: row.unitName }} id={row.id} onClose={() => { setApprove(false) }} />} />
                    <Modal open={reject} onOpenChange={setReject} size={'xs'} modalContent={<RejectRequestModal id={row.id} onClose={() => { setReject(false) }} />} />
                    <Modal open={reschedule} onOpenChange={setReschedule} size={'sm'} modalContent={<RescheduleRequestModal proposedDate={row.proposedDate} id={row.id} onClose={() => { setReschedule(false) }} />} />


                </Box>
            })}
            <Paginator
                current={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
            />
        </Box>)
}