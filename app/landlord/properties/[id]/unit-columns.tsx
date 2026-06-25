/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "@/components/ui/avatar"
import { Modal } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress-bar"
import { formatDate, formatNumber } from "@/services/date"
import { Center, Flex, Menu, Portal, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { ProgressCircle } from "@/components/ui/progress-circle"

export interface Row {
    id: string
    propertyId: string
    propertyName: string
    unitName: string
    status: string
    baseRent: number
    tenantName: string
    tenantId: string
    leaseStartDate: string
    leaseEndDate: string
    complaintsPercentage: number,
    leaseExpiryPercentage: number,
    members: number,

    /* complaints: {
         openPercent: number
         openCount: number
         total: number
     }
     members: number
     leaseExpiry: string
     moveInDate: string
     tenantProfilePic: string
     tenantName: string
     tenantId: string
     rentAmount: number
     status: string
     floor: string
     name: string
     id: string*/
}



export const useUnitColumns = (onTenantClick: (row: Row) => void): ColumnDef<Row, any>[] => {

    const status = [
        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE',
            textColor: '#047857'
        },
        {

            value: 'AVAILABLE',
            label: 'Vacant',
            bg: '#FEE9E7',
            textColor: '#C2410C'
        }
    ]
    const complaints = (row: number) => {
        if (row >= 0 && row <= 29) { return '#14AE5C' }
        if (row >= 30 && row <= 59) { return '#E8B931' }
        if (row >= 69) { return '#EC221F' }
        return ''
    }

    const leaseExpiry = (row: number) => {
        if (row >= 0 && row <= 40) { return '#EC221F' }
        if (row >= 41 && row <= 70) { return '#E8B931' }
        if (row >= 71) { return '#14AE5C' }
        return ''
    }

    const stringToNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }

    return [
        {
            accessorKey: 'unitName',
            header: 'Unit'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const statusDeets = status.find((status) => status.value === row.original.status)
                return <Center py={1} px={1.5} color={statusDeets?.textColor} className="satoshi-bold" rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
            }
        },
        {
            accessorKey: 'baseRent',
            header: 'Rent',
            cell: ({ row }) => <Text>{formatNumber(row.original.baseRent)}</Text>
        },
        {
            accessorFn: (row) => `${row.tenantName}`,// ${row.tenantProfilePic}`,
            header: 'Tenant',
            cell: ({ row }) => <Flex gap={2} className=" group" onClick={() => onTenantClick(row.original)} cursor={'pointer'} align={'center'}>
                <Avatar name={row.original.tenantName} />
                <Text className=" group-hover:underline">{row.original.tenantName ?? 'N/A'}</Text>
            </Flex>
        },
        {
            accessorKey: 'leaseStartDate',
            header: 'Move In Date',
            cell: ({ row }) => <Text>{formatDate(row.original.leaseStartDate)}</Text>
        },
        {
            accessorKey: 'members',
            header: 'Members'
        },
        {
            accessorKey: 'leaseExpiryPercentage',
            header: 'Lease Left',
            cell({ row }) {
                return <ProgressCircle showValueText value={stringToNumber(row.original.leaseExpiryPercentage)} thickness={2} cap={'round'} color={leaseExpiry(stringToNumber(row.original.leaseExpiryPercentage))} size={'xs'} />
            },
        },
        {
            accessorFn: (row) => row.complaintsPercentage,
            header: 'Complaints',
            cell: ({ row }) => {
                const complaint = complaints(row.original.complaintsPercentage)
                return (
                    <Progress showValueText value={row.original.complaintsPercentage} color={complaint} info={complaint} />
                )
            }
        },


    ]
}

