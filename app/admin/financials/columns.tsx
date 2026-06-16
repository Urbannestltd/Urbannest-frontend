import { formatDate, formatNumber } from "@/services/date";
import { financials } from "@/store/admin/financial";
import { Center, Circle, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuEllipsisVertical } from "react-icons/lu";

export const useColumns = (): ColumnDef<financials, any>[] => {

    const status = [
        {
            value: 'PENDING',
            label: 'Pending',
            color: '#975102',
            bg: '#FFF1C2'

        },
        {
            value: "FLAGGED",
            label: "Flagged",
            color: "#9F403D",
            bg: '#F2C391',
            border: '#F2C391'
        },
        {
            value: 'PAID',
            label: 'Paid',
            color: '#545F73',
            bg: '#22C55E',
            border: '#545F7333'
        },
        {
            value: 'LOGGED',
            label: 'Logged',
            color: '#545F73',
            bg: '#22C55E',
            border: '#545F7333'
        },
        {
            value: 'OVERDUE',
            label: 'Overdue',
            color: '#752121',
            bg: '#FE898333'
        },
        {
            value: 'FAILED',
            label: 'Failed',
            color: '#752121',
            bg: '#FE898333'
        },
    ]

    const type = [
        { value: "RENT", label: "Rent" },
        { value: "UTILITY_BILL", label: "Utility Bill" },
        { value: "UTILITIES", label: "Utilities" },
        { value: 'MAINTENANCE', label: "Maintenance" },
        { value: "UTILITY_TOKEN", label: "Utility Token" },
        { value: "SERVICE_CHARGE", label: "Service Charge" },
    ]

    return [
        {
            accessorKey: 'createdAt',
            header: "Date",
            cell: ({ row }) => <Text>{row.original.dueDate ? row.original.paidDate ? 'Paid on' + ' ' + formatDate(row.original.paidDate) : 'Due on' + ' ' + formatDate(row.original.dueDate) : formatDate(row.original.date)}</Text>
        },
        {
            accessorFn: (row) => row.tenant?.name,
            header: "Tenant Name",
            cell: ({ row }) => <Text>{row.original.tenant?.name}</Text>
        },
        {
            accessorFn: (row) => row.property.name ?? '',
            header: "Property Name",
            cell: ({ row }) => <Text>{row.original.property?.name ?? ''}</Text>
        },
        {
            accessorFn: (row) => row.unit.name,
            header: "Property Unit",
            cell: ({ row }) => <Text>{row.original.unit?.name}</Text>
        },
        {
            accessorFn: (row) => row.category ?? row.paymentType,
            header: "Type",
            cell: ({ row }) => {
                const typeItem = type.find((item) => item.value === (row.original.category ?? row.original.paymentType))
                return <Text>{typeItem?.label}</Text>
            }
        },
        {
            accessorKey: 'amount',
            header: "Amount",
            cell: ({ row }) => <Text className="satoshi-bold">{formatNumber(row.original.amount)}</Text>
        },
        {
            accessorKey: 'status',
            header: "Status",
            cell: ({ row }) => {
                const statusItem = status.find((item) => item.value === row.original.status)
                if (statusItem?.value === 'PAID' || statusItem?.value === 'LOGGED') return <Center fontSize={'12px'} w={'fit'} color={statusItem?.color} rounded={'full'} px={3} border={`1px solid ${statusItem.border}`} bg={'transparent'}>
                    <Circle size='5px' mr={1} bg={statusItem?.bg} />{statusItem?.label}</Center>
                return <Text color={statusItem?.color} w={'fit'} rounded={'full'} fontSize={'12px'} px={3} bg={statusItem?.bg}>{statusItem?.label}</Text>
            }
        },
        {
            accessorKey: 'type',
            header: "Method",
            cell: ({ row }) => <Text>-</Text>
        },
        {
            accessorKey: 'actions',
            header: "Actions",
            cell: ({ row }) => <LuEllipsisVertical />
        }
    ]

}