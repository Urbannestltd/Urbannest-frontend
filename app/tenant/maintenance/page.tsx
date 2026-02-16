'use client'
import { DataTable } from "@/components/ui/data-table";
import { PageTitle } from "@/components/ui/page-title";
import { Box, Flex, HStack, Menu, Stack, Text } from "@chakra-ui/react";
import { useColumns } from "./columns";
import { TenantMaintenanceModal } from "./modal";
import { Modal } from "@/components/ui/dialog";
import { useMaintenanceStore } from "@/store/maintenance";
import { useEffect, useMemo, useState } from "react";
import { MaintenaceResponse } from "@/services/maintenance";
import EmptyTableIcon from '@/app/assets/icons/empty-state-icons/maintenance-table.svg'
import { LuEllipsisVertical } from "react-icons/lu";
import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import { formatDateDash } from "@/services/date";
import { Paginator } from "@/components/ui/paginator";
import Image from "next/image";


export default function Maintenance() {
    const columns = useColumns()
    const maintenance = useMaintenanceStore((state) => state.maintenance)
    const [closeModal, setCloseModal] = useState(false)
    const fetchMaintenance = useMaintenanceStore((state) => state.fetchMaintenance)
    const isMobile = window.innerWidth < 700

    useEffect(() => {
        if (!closeModal) fetchMaintenance()
    }, [closeModal])

    return (
        <>
            <Stack direction={{ base: 'column', md: 'row' }} mt={7} mb={4} justify={'space-between'}>
                <PageTitle mb={2} title="Maintenance Requests" />
                <Modal open={closeModal} onOpenChange={setCloseModal} size={{ base: 'full', md: 'cover' }} className=" w-[100%] rounded-none lg:rounded-[12px] md:w-[1200px] h-full md:h-fit" modalContent={<TenantMaintenanceModal />} triggerVariant={'primary'} triggerContent={'Add Request'} />
            </Stack>
            {isMobile ? <MobileTable rows={maintenance} /> : <DataTable tableName="Maintenance Requests" loading={useMaintenanceStore((state) => state.isLoading)} data={maintenance} my={5} columns={columns} />
            } </>
    )
}

const MobileTable = ({ rows }: { rows: MaintenaceResponse[] }) => {
    const Status = [
        {
            value: 'PENDING',
            label: 'Pending',
            bgColor: '#FFF1C2',
            textColor: '#975102'
        },
        {
            value: 'IN_PROGRESS',
            label: 'In Progress',
            bgColor: '#D8E9F9',
            textColor: '#1976D2'
        },
        {
            value: 'FIXED',
            label: 'Fixed',
            bgColor: '#CFF7D3',
            textColor: '#02542D'
        },
        {
            value: 'WORK_SCHEDULED',
            label: 'Work Scheduled',
            bgColor: '#E6E6E6',
            textColor: '#757575'
        }
    ]


    const Issue = [
        { value: 'ELECTRICAL', label: 'Electrical', icon: ElectricalIcon },
        { value: 'PLUMBING', label: 'Plumbing', icon: PlumbingIcon },
        { value: 'SECURITY', label: 'Security', icon: SecurityIcon },
        { value: 'CLEANING', label: 'Cleaning', icon: CleaningIcon },
        { value: 'HVAC', label: 'HVC/AC', icon: HvacIcon },
        { value: 'BUILDING', label: 'Building (Walls, Doors, Windows, Ceiling)', icon: BuildingIcon },
        { value: 'SAFETY', label: 'Safety & Security', icon: SecurityIcon },
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
            <h4 className='text-xl font-bold text-[#303030]'>No Request yet</h4>
            <p className='text-sm font-medium text-[#6A6C88]'>
                Maintenance updates and messages will appear here once you submit a request.
            </p>
        </div>
    </div>)
    return (
        <Box>
            {tableData?.map((row) => {
                const status = Status.find((status) => status.value === (row?.status ?? 'PENDING'))
                const issue = Issue.find((issue) => issue.value === row?.category)

                return <Box p={4} rounded={'lg'} my={4} border={'1.7px solid #F4F4F4'}>
                    <HStack justify={'space-between'} gap={1}>
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
                                        <Menu.Item mb={2} cursor={'pointer'} value="save-visitor" >Delete Request</Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Menu.Root>
                    </HStack>
                    <Flex alignItems={'center'} my={3} gap={2}>
                        <Image src={issue?.icon} className="size-[27px] mr-[6px] " alt="" />
                        <Box>
                            <Text className="capitalize satoshi-bold" children={row.subject || 'No Subject'} />
                            <Text className="capitalize satoshi-medium" children={issue?.label} />
                        </Box>
                    </Flex>

                    <HStack justify={'space-between'} my={5}>
                        <Text className="satoshi-bold text-sm">Date Submitted:</Text>
                        <Text className="satoshi-medium text-sm" >{formatDateDash(row.createdAt)}</Text>
                    </HStack>
                    <Modal size={{ base: 'full', md: 'cover' }} className=" w-[100%] rounded-none lg:rounded-[12px] md:w-[1200px] h-full md:h-fit" modalContent={<TenantMaintenanceModal row={row} />} triggerVariant={'outline'} triggerSize='lg' triggerContent={'View Details'} />

                </Box>
            })}
            <Paginator
                current={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
            />
        </Box>)
}