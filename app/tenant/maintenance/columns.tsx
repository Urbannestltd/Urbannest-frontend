
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import Image from "next/image";
import { LuEllipsisVertical } from "react-icons/lu";
import { Modal } from "@/components/ui/dialog";
import { TenantMaintenanceModal } from "./modal";
import { MaintenaceResponse } from "@/services/maintenance";
import { formatDate } from "@/services/date";

export const useColumns = (): ColumnDef<MaintenaceResponse, unknown>[] => {
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

    return [
        {
            accessorKey: 'issue',
            header: 'Issue',
            cell: ({ row }) => {
                const maintenanceRequest = row.original
                const issue = Issue.find((issue) => issue.value === maintenanceRequest?.category)

                return (
                    <Flex alignItems={'center'} gap={2}>
                        <Image src={issue?.icon} className="size-[27px] mr-[6px] " alt="" />
                        <Box>
                            <Text className="capitalize" children={maintenanceRequest.description} />
                            <Text className="capitalize" children={issue?.label} />
                        </Box>
                    </Flex>)
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => formatDate(row.getValue('createdAt'))
        },
        {
            accessorKey: 'status',
            header: () => <Text placeSelf={'center'}>Status</Text>,
            cell: ({ row }) => {
                const status = Status.find((status) => status.value === row.getValue('status'))
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        fontWeight={'semibold'}
                        bg={status?.bgColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        placeSelf={'center'}
                        w={'fit'}
                    >
                        <Text className="capitalize" color={status?.textColor} children={status?.label} />
                    </Flex>)
            }
        },
        {
            accessorKey: 'action',
            header: '',
            cell: ({ row }) => {
                const maintenanceRequest = row.original
                return (
                    <HStack justify={'end'}>
                        <Modal size={'cover'} className="w-[1200px] h-fit" modalContent={<TenantMaintenanceModal row={maintenanceRequest} />} triggerVariant={'outline'} triggerContent={'View Details'} />
                        <LuEllipsisVertical cursor={'pointer'} size={20} />
                    </HStack>
                )
            }
        }

    ]
}