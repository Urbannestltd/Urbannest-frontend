import { DataTable } from "@/components/ui/data-table";
import { Box, Flex, HStack, Stack, Tabs, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/visitor-table.svg'
import Image from "next/image";
import { formatDatetoTime, formatNumber } from "@/services/date";
import { Paginator } from "@/components/ui/paginator";
import { ApprovalActions, TenantApprovalStatus, useColumns } from "./columns";
import { Approvals, useApprovalsStore } from "@/store/landlord/approvals";

interface TabProps {
    list?: Approvals[]
    component?: React.ReactNode;
    search?: string;
    onSearchChange?: (val: string) => void;
    onSearch?: (val: string) => void;
}

const DummyData: Approvals[] = [
    {
        leadId: "string",
        applicantName: "string",
        propertyId: "string",
        propertyName: "string",
        unitId: "string",
        unitName: "string",
        annualRent: 0,
        agentId: "string",
        agentName: "string",
        dateForwarded: "2026-06-20T23:39:17.959Z",
        outcome: 'PENDING',
        decidedAt: "2026-06-20T23:39:17.959Z",
        rejectionReason: "string",
    }
]

export const ApprovalsTabs = ({ component, search = '', onSearchChange, onSearch }: TabProps) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600
    const columns = useColumns()
    const { pendingApprovals, approvalHistory, isLoadingPendingApprovals, isLoadingApprovalHistory } = useApprovalsStore((state) => state)

    return (
        <Tabs.Root defaultValue={"pending"} variant={"line"}>
            <VStack mt={4} align={'start'} justify={'start'}>
                <Tabs.List borderBottom={"1px solid #D9D9D9"}>
                    <Tabs.Trigger px={2} value="pending">
                        Pending ({pendingApprovals.length ?? 0})
                    </Tabs.Trigger>
                    <Tabs.Trigger px={2} ml={3} value="history">
                        History ({approvalHistory.length ?? 0})
                    </Tabs.Trigger>
                    <Tabs.Indicator bg={'white'} shadow={"none"} fontWeight={"bold"} />
                </Tabs.List>
                {!isMobile && (component)}
            </VStack>
            <Tabs.Content value="pending">
                {isMobile ? <MobileTable rows={pendingApprovals} /> :
                    <DataTable
                        headerColor="#FFFFFF"
                        my={1}
                        tableName="pending tenant approvals"
                        loading={isLoadingPendingApprovals}
                        pagination={{ currentPage: 1, pageSize: 10, total: pendingApprovals.length, totalPages: Math.ceil(pendingApprovals.length / 10) }}
                        emptyDetails={{ icon: EmptyTableIcon, title: 'No Tenants Yet', description: 'No tenants have been submitted to your property yet. An agent will assign forward tenants to you.' }}
                        columns={columns}
                        data={DummyData}
                    />}
            </Tabs.Content>
            <Tabs.Content value="history">
                {isMobile ? <MobileTable rows={approvalHistory} /> : <DataTable
                    headerColor="#FFFFFF"
                    my={1}
                    tableName="history tenant approvals"
                    loading={isLoadingApprovalHistory}
                    emptyDetails={{ icon: EmptyTableIcon, title: 'No Tenants Yet', description: 'No tenants have been submitted to your property yet. An agent will assign forward tenants to you.' }}
                    columns={columns}
                    data={approvalHistory}
                />}
            </Tabs.Content>
        </Tabs.Root>
    )
}



export const MobileTable = ({ rows }: { rows: (Approvals)[] }) => {

    const pageSize = 10;
    const totalPages = Math.ceil((rows?.length ?? 0) / pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() =>
        rows?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [],
        [rows, currentPage, pageSize]
    );

    const tableData = (currentData ?? []);

    if (!rows || rows.length === 0) {
        return (<div className='flex flex-col my-7 pb-10 items-center justify-center space-y-6'>
            <div className='flex items-center justify-center'>
                <Image src={EmptyTableIcon} alt="" />
            </div>

            <div className='flex flex-col items-center justify-center space-y-2'>
                <h4 className='text-xl font-bold text-[#303030]'>No Tenants Yet</h4>
                <p className='text-sm text-center font-medium text-[#6A6C88]'>
                    No tenants have been submitted to your property yet. An agent will assign forward tenants to you.
                </p>
            </div>
        </div>)
    }
    return (
        <Box>
            {tableData?.map((row) => {
                const visitor = row
                const status = TenantApprovalStatus.find((status) => status.value === row?.outcome)
                return <Box p={4} rounded={'lg'} my={4} border={'1.7px solid #F4F4F4'}>
                    <HStack justify={'space-between'} my={3}>
                        <Box>
                            <Text className="satoshi-bold text-sm capitalize">{row?.propertyName}</Text>
                            <Text className="text-[#757575] text-sm">{row?.unitName}</Text>
                        </Box>
                        <Flex gap={1}>
                            <Flex
                                alignItems={'center'}
                                fontSize={'14px'}
                                fontWeight={'semibold'}
                                bg={status?.bgColor ?? TenantApprovalStatus[2].bgColor}
                                p={1}
                                px={4}
                                rounded={'3xl'}
                                justify={'center'}
                                w={'fit'}
                            >
                                <Text className="capitalize" color={status?.color ?? TenantApprovalStatus[2].color} children={status?.label || row?.outcome} />
                            </Flex>

                        </Flex>
                    </HStack>
                    <Flex justify={'space-between'}>

                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Tenant Name</Text>
                            <Text className="satoshi-medium text-sm" >{row?.applicantName}</Text>
                        </Stack>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Annual Rent</Text>
                            <Text className="satoshi-medium text-sm" >{formatNumber(row?.annualRent)}</Text>
                        </Stack>
                    </Flex>
                    <Flex justify={'space-between'}>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Time in/Out</Text>
                            <Text className="satoshi-medium text-sm" >{formatDatetoTime(row.dateForwarded)}</Text>
                        </Stack>
                        <Stack width={'full'} my={3}>
                            <Text className="text-[13px] text-[#9CA3AF]">Access Type</Text>
                            <ApprovalActions approval={row} />
                        </Stack>
                    </Flex>
                </Box>
            })}
            <Paginator
                current={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
            />
        </Box>)
}