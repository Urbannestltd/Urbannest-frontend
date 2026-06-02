import { DummyVisitor, PropertyTicket, userData } from "@/utils/model"
import { Box, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"

import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import { formatDate, formatDatetoTime } from "@/services/date"
import { text } from "stream/consumers"
import { Tickets } from "@/store/admin/tickets"
import { DashboardTickets, DashboardVisitor } from "@/store/fm/dashboard"

export const useColumns = (): ColumnDef<DashboardTickets, any>[] => {

    const Status = [
        {
            value: 'PENDING',
            label: 'Open',
            bgColor: '#F5F5F5',
            textColor: '#4A4A4A',
            borderColor: '#F4F4F4',
            circleColor: '#4A4A4A'
        },
        {
            value: 'IN_PROGRESS',
            label: 'In Progress',
            bgColor: '#EFF6FF',
            textColor: '#1D4ED8',
            borderColor: '#DBEAFE',
            circleColor: '#3B82F6'
        },
        {
            value: 'RESOLVED',
            label: 'Resolved',
            bgColor: '#CFF7D3',
            textColor: '#047857',
            borderColor: '#D1FAE5',
            circleColor: '#10B981'
        },
        {
            value: 'ESCALATED',
            label: 'Escalated',
            bgColor: '#FEE2E2',
            textColor: '#991B1B',
            borderColor: '#FECACA',
            circleColor: '#DC2626'
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

    const Priority = [
        { value: 'LOW', label: 'Low', bg: '#F5F5F5', textColor: '#4A4A4A', borderColor: '#F4F4F4' },
        { value: 'MEDIUM', label: 'Medium', bg: '#FFF7ED', textColor: '#975102', borderColor: '#FFEDD5' },
        { value: 'HIGH', label: 'High', bg: '#FEF2F2', textColor: '#B91C1C', borderColor: '#FEE2E2' },
    ]



    return [
        {
            accessorFn: (row) => row.propertyName + ' (' + row.unitName + ')',
            header: "Property & Unit",
            cell: ({ row }) =>
                <Stack>
                    <Text fontWeight={'bold'}>{row.original.propertyName}</Text>
                    <Text fontSize={'12px'}>{row.original.unitName}</Text>
                </Stack>
        },
        {
            accessorFn: (row) => row.subject + ' (' + row.category + ')',
            header: "Tenant & Issue Type",
            cell: ({ row }) => {
                const maintenanceRequest = row.original
                const issue = Issue.find((issue) => issue.value === maintenanceRequest?.category)

                return (
                    <Box gap={2}>
                        <Text className="capitalize" children={maintenanceRequest.subject || 'No Subject'} />
                        <HStack>
                            <Image src={issue?.icon.src} className="size-[14px] mr-[1px] " alt="" />
                            <Text className="capitalize" children={issue?.label} />
                        </HStack>
                    </Box>)
            }
        },

        {
            accessorKey: 'priority',
            header: "Priority",
            cell: ({ row }) => {
                const priority = Priority.find((priority) => priority.value === row.original.priority)
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        fontWeight={'medium'}
                        bg={priority?.bg}
                        border={'1px solid'}
                        borderColor={priority?.borderColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        placeSelf={'center'}
                        w={'fit'}
                    >
                        <Text className="capitalize" color={priority?.textColor} children={priority?.label} />
                    </Flex>)
            }
        },
        {
            accessorKey: 'dateSubmitted',
            header: "Date",
            cell: ({ row }) => <Text>{formatDate(row.original.createdAt)}</Text>
        }
    ]
}

export const useVisitorColumns = (): ColumnDef<DashboardVisitor, any>[] => {
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
            label: 'ONE_OFF',
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
    return [
        {
            accessorFn: (row) => row.type + ' (' + row.visitorName + ')',
            header: "Visitor Name",
            cell: ({ row }) => {
                const isAgent = row.original.type === 'ONE_OFF_AGENT'
                return (<Box>
                    <Text className="satoshi-bold">{row.original.visitorName}</Text>
                    {isAgent && <Text fontWeight={'normal'} className="text-[13.3px]" color={'#757575'}>Agent</Text>}
                </Box>)
            }
        },
        {
            accessorKey: 'propertyName',
            header: "Property",
            cell: ({ row }) => <Text color={'#4A4A4A'}>{row.original.propertyName}</Text>
        }
        ,
        {
            accessorKey: 'checkedInAt',
            header: "Time In",
            cell: ({ row }) => <Text color={'#4A4A4A'}>{formatDatetoTime(row.original.checkedInAt)}</Text>
        },
        {
            accessorKey: 'type',
            header: "Access Type",
            cell: ({ row }) => {
                const type = Type.find((type) => type.value === row.original.type)
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        fontWeight={'medium'}
                        bg={type?.bgColor}
                        border={'1px solid'}
                        borderColor={type?.borderColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        placeSelf={'center'}
                        w={'fit'}
                    >
                        <Text className="capitalize" color={type?.textColor} children={type?.label} />
                    </Flex>)
            }
        }


    ]

}