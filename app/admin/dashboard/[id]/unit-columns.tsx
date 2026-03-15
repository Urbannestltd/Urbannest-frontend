import { Avatar } from "@/components/ui/avatar"
import { formatDate } from "@/services/date"
import { Unit } from "@/store/admin/properties"
import { Flex, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"

export interface Row {
    complaints: {
        percentage: number
        total: number
        unresolved: number
    }
    floor: string
    id: string
    members: number
    moveInDate: string
    name: string
    rentAmount: number
    status: string
    tenantName: string
    tenantProfilePic: string
}

export const useUnitColumns = (): ColumnDef<Row, any>[] => {
    return [
        {
            accessorKey: 'name',
            header: 'Unit'
        },
        {
            accessorKey: 'status',
            header: 'Status'
        },
        {
            accessorKey: 'rentAmount',
            header: 'Rent'
        },
        {
            accessorFn: (row) => `${row.tenantName} (${row.tenantProfilePic})`,
            header: 'Tenant',
            cell: ({ row }) => <Flex>
                <Avatar src={row.original.tenantProfilePic} size={'lg'} />
                <Text>{row.original.tenantName}</Text>
            </Flex>
        },
        {
            accessorKey: 'moveInDate',
            header: 'Move In Date',
            cell: ({ row }) => <Text>{formatDate(row.original.moveInDate)}</Text>
        },
        {
            accessorKey: 'members',
            header: 'Members'
        },
        {
            accessorFn: (row) => row.complaints.percentage,
            header: 'Complaints',
            cell: ({ row }) => <Text>{row.original.complaints.total}</Text>
        }

    ]
}