import { Avatar } from "@/components/ui/avatar"
import { Modal } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress-bar"
import { formatDate, formatNumber } from "@/services/date"
import { Unit } from "@/store/admin/properties"
import { Center, Flex, Menu, Portal, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsisVertical } from "react-icons/lu"
import { AddMemberModal } from "./add-modal"
import { useState } from "react"
import { ProgressCircle } from "@/components/ui/progress-circle"

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



export const useUnitColumns = (onTenantClick: (row: Row) => void): ColumnDef<Row, any>[] => {

    const status = [
        {
            value: 'AVAILABLE',
            label: 'Available',
            bg: '#FEE9E7'
        },
        {
            value: 'OCCUPIED',
            label: 'Occupied',
            bg: '#EBFFEE'
        }
    ]
    const complaints = (row: number) => {
        if (row >= 0 && row <= 29) { return '#14AE5C' }
        if (row >= 30 && row <= 59) { return '#E8B931' }
        if (row >= 69) { return '#EC221F' }
        return ''
    }

    return [
        {
            accessorKey: 'name',
            header: 'Unit'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const statusDeets = status.find((status) => status.value === row.original.status)
                return <Center py={1} rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
            }
        },
        {
            accessorKey: 'rentAmount',
            header: 'Rent',
            cell: ({ row }) => <Text>{formatNumber(row.original.rentAmount)}</Text>
        },
        {
            accessorFn: (row) => `${row.tenantName} (${row.tenantProfilePic})`,
            header: 'Tenant',
            cell: ({ row }) => <Flex gap={2} onClick={() => onTenantClick(row.original)} cursor={'pointer'} align={'center'}>
                <Avatar src={row.original.tenantProfilePic} name={row.original.tenantName} />
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
            accessorKey: 'leaseExpiry',
            header: 'Lease Expiry',
            cell({ row }) {
                return <ProgressCircle showValueText value={80} thickness={2} cap={'round'} color={'green'} size={'xs'} />
            },
        },
        {
            accessorFn: (row) => row.complaints.percentage,
            header: 'Complaints',
            cell: ({ row }) => {
                const complaint = complaints(row.original.complaints.percentage)
                return (
                    <Progress showValueText value={row.original.complaints.percentage} color={complaint} info={complaint} />
                )
            }
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: () => {
                const [open, setOpen] = useState(false)
                return <Flex
                    justify={'center'}
                >
                    <Menu.Root >
                        <Menu.Trigger>
                            <LuEllipsisVertical size={20} />
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item value="assign-tenant" onClick={() => setOpen(true)} className="satoshi-medium">Assign Tenant</Menu.Item>
                                    <Menu.Item value="remove-tenant" className="satoshi-medium">Remove Tenant</Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                    <Modal open={open} onOpenChange={setOpen} size={'cover'} className="w-[600px] h-fit" modalContent={<AddMemberModal />} /></Flex>
            }
        }

    ]
}