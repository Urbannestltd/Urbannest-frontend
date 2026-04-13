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
            value: 'PAID',
            label: 'Paid',
            color: '#545F73',
            bg: '#22C55E',
            border: '#545F7333'
        },
        {
            value: 'OVERDUE',
            label: 'Overdue',
            color: '#752121',
            bg: '#FE898333'
        }
    ]

    const type = [
        { value: "RENT", label: "Rent" },
        { value: "UTILITY_BILL", label: "Utility Bill" },
        { value: "UTILITY_TOKEN", label: "Utility Token" },
        { value: "SERVICE_CHARGE", label: "Service Charge" },
    ]

    return [
        {
            accessorKey: 'createdAt',
            header: "Date",
            cell: ({ row }) => <Text>{row.original.dueDate ? 'Due on' + ' ' + formatDate(row.original.dueDate) : formatDate(row.original.createdAt)}</Text>
        },
        {
            accessorFn: (row) => row.tenant.name,
            header: "Tenant Name",
            cell: ({ row }) => <Text>{row.original.tenant.name}</Text>
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
            accessorKey: 'type',
            header: "Type",
            cell: ({ row }) => {
                const typeItem = type.find((item) => item.value === row.original.type)
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
                if (statusItem?.value === 'PAID') return <Center fontSize={'12px'} color={statusItem?.color} rounded={'full'} px={1} border={`1px solid ${statusItem.border}`} bg={'transparent'}>
                    <Circle size='5px' mr={1} bg={statusItem?.bg} />{statusItem?.label}</Center>
                return <Text color={statusItem?.color} rounded={'full'} px={1} bg={statusItem?.bg}>{statusItem?.label}</Text>
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