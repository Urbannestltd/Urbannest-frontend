import { PropertyTicket } from "@/utils/model"
import { Box, Circle, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import ElectricalIcon from '@/app/assets/icons/maintenance-icons/electrical.svg'
import PlumbingIcon from '@/app/assets/icons/maintenance-icons/plumbing.svg'
import SecurityIcon from '@/app/assets/icons/maintenance-icons/safety-security.svg'
import CleaningIcon from '@/app/assets/icons/maintenance-icons/cleaning.svg'
import HvacIcon from '@/app/assets/icons/maintenance-icons/hvc-ac.svg'
import BuildingIcon from '@/app/assets/icons/maintenance-icons/building.svg'
import { Avatar } from "@/components/ui/avatar"
import { convertMinutes, formatDate } from "@/services/date"
import { Tickets } from "@/store/admin/tickets"

export const useTicketColumns = (): ColumnDef<Tickets, any>[] => {

    const Status = [
        {
            value: 'OPEN',
            label: 'Open',
            bgColor: '#F5F5F5',
            textColor: '#4A4A4A',
            borderColor: '#F4F4F4'
        },
        {
            value: 'PENDING',
            label: 'In Progress',
            bgColor: '#EFF6FF',
            textColor: '#1D4ED8',
            borderColor: '#DBEAFE'
        },
        {
            value: 'RESOLVED',
            label: 'Resolved',
            bgColor: '#CFF7D3',
            textColor: '#02542D',
            borderColor: '#D1FAE5'
        },
        {
            value: 'ESCALATED',
            label: 'Escalated',
            bgColor: '#FEE2E2',
            textColor: '#991B1B',
            borderColor: '#FECACA'
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
            accessorFn: (row) => row.property?.name + ' (' + row.unit?.name + ')',
            header: "Property & Unit",
            cell: ({ row }) =>
                <Stack>
                    <Text fontWeight={'bold'}>{row.original.property?.name}</Text>
                    <Text fontSize={'12px'}>{row.original.unit?.name}</Text>
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
            accessorKey: ' status',
            header: "Status",
            cell: ({ row }) => {
                const status = Status.find((status) => status.value === row.original.status)
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        fontWeight={'semibold'}
                        bg={status?.bgColor}
                        border={'1px solid'}
                        borderColor={status?.borderColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        w={'fit'}
                    >
                        <Circle size={'8px'} bg={status?.textColor} mr={1} />
                        <Text className="capitalize" color={status?.textColor} children={status?.label} />
                    </Flex>)
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
                        fontWeight={'semibold'}
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

            accessorFn: (row) => row.assignedTo.name,
            header: "FM Assigned",
            cell: ({ row }) => <Flex align={'center'}>
                <Avatar size={'sm'} name={row.original.assignedTo?.name ?? 'N/A'} />
                <Text ml={2}>{row.original.assignedTo?.name ?? 'N/A'}</Text>
            </Flex>
        },
        {
            accessorKey: 'dateSubmitted',
            header: "Created",
            cell: ({ row }) => <Text>{formatDate(row.original.dateSubmitted)}</Text>
        },
        {
            accessorKey: 'responseTimeMinutes',
            header: 'Response',
            cell: ({ row }) => <Text color={row.original.isResponseLate ? '#DC2626' : '#303030'}>{convertMinutes(row.original.responseTimeMinutes)}</Text>
        }
    ]
}