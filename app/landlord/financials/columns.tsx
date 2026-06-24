import { formatDate, formatNumber } from "@/services/date"
import { arrears, transactions } from "@/store/landlord/financials"
import { Center, Circle, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsisVertical } from "react-icons/lu"

export const useColumns = (): ColumnDef<arrears, unknown>[] => {
    return [
        {
            accessorKey: "tenantName",
            header: "Tenant Name",
            cell: ({ row }) => <Text>{row.original.tenantName}</Text>,
        },
        {
            accessorKey: "propertyName",
            header: "Property",
            cell: ({ row }) => <Text>{row.original.propertyName}</Text>,
        },
        {
            accessorKey: "unitName",
            header: "Unit",
            cell: ({ row }) => <Text>{row.original.unitName}</Text>,
        },
        {
            accessorKey: "balanceDue",
            header: "Amount",
            cell: ({ row }) => (
                <Text color={"#2A3348"} className="satoshi-bold">
                    {formatNumber(row.original.balanceDue)}
                </Text>
            ),
        },
        {
            accessorKey: "daysOverdue",
            header: "Days Overdue",
            cell: ({ row }) => {
                const days = row.original.daysOverdue
                const isCritical = days > 7

                return (
                    <Center
                        w={"fit"}
                        rounded={"full"}
                        px={3}
                        py={1}
                        fontSize={"12px"}
                        color={isCritical ? "#9F403D" : "#975102"}
                        bg={isCritical ? "#FE898333" : "#FFF1C2"}
                        className="satoshi-medium"
                    >
                        {days} {days === 1 ? "Day" : "Days"}
                    </Center>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => <LuEllipsisVertical />,
        },
    ]
}

export const useFinancialsColumns = (): ColumnDef<transactions, any>[] => {

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
            accessorKey: 'transactionDate',
            header: "Date",
            cell: ({ row }) => <Text>{formatDate(row.original.transactionDate)}</Text>
        },
        {
            accessorKey: 'tenantName',
            header: "Tenant Name",
        },
        {
            accessorKey: 'propertyName',
            header: "Property Name",
        },
        {
            accessorKey: 'unitName',
            header: "Property Unit",
        },
        {
            accessorFn: (row) => row.paymentType,
            header: "Type",
            cell: ({ row }) => {
                const typeItem = type.find((item) => item.value === (row.original.paymentType))
                return <Text>{typeItem?.label}</Text>
            }
        },
        {
            accessorKey: 'amount',
            header: "Amount",
            cell: ({ row }) => <Text className="satoshi-bold">{formatNumber(row.original.amount)}</Text>
        },
        {
            accessorKey: 'paymentStatus',
            header: "Status",
            cell: ({ row }) => {
                const statusItem = status.find((item) => item.value === row.original.paymentStatus)
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