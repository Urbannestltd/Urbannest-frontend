import { Avatar } from "@/components/ui/avatar"
import { Modal } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress-bar"
import { formatDate, formatNumber } from "@/services/date"
import { Center, Flex, Menu, Portal, Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsisVertical } from "react-icons/lu"
import { AddMemberModal, DeleteTenantPopUp } from "./add-modal"
import { useState } from "react"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { DeletePopUp } from "./tabs"
import { AddUnit } from "./add-unit"
import { set } from "lodash"
import { usePropertyStore } from "@/store/admin/properties"

export interface Row {
    complaints: {
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
    id: string
}



export const useUnitColumns = (onTenantClick: (row: Row) => void, propertyId: string, propertyName: string, onEdit?: (id: string) => void): ColumnDef<Row, any>[] => {

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
            accessorKey: 'name',
            header: 'Unit'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const statusDeets = status.find((status) => status.value === row.original.status)
                return <Center py={1} px={1} rounded={'full'} bg={statusDeets?.bg}>{statusDeets?.label}</Center>
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
            cell: ({ row }) => <Flex gap={2} className=" group" onClick={() => onTenantClick(row.original)} cursor={'pointer'} align={'center'}>
                <Avatar src={row.original.tenantProfilePic} name={row.original.tenantName} />
                <Text className=" group-hover:underline">{row.original.tenantName ?? 'N/A'}</Text>
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
            header: 'Lease Left',
            cell({ row }) {
                return <ProgressCircle showValueText value={stringToNumber(row.original.leaseExpiry)} thickness={2} cap={'round'} color={leaseExpiry(stringToNumber(row.original.leaseExpiry))} size={'xs'} />
            },
        },
        {
            accessorFn: (row) => row.complaints.openPercent,
            header: 'Complaints',
            cell: ({ row }) => {
                const complaint = complaints(row.original.complaints.openPercent)
                return (
                    <Progress showValueText value={row.original.complaints.openPercent} color={complaint} info={complaint} />
                )
            }
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => <ActionCell onEdit={onEdit} row={row} propertyId={propertyId} propertyName={propertyName} />
        }

    ]
}

export const ActionCell = ({ row, propertyId, propertyName, onEdit }: { row: any, propertyId: string, propertyName: string, onEdit?: (id: string) => void }) => {
    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [removeTenant, setRemoveTenant] = useState(false)

    const fetchUnits = usePropertyStore((state) => state.fetchUnits)


    return (
        <Flex justify={'center'}>
            <Menu.Root>
                <Menu.Trigger>
                    <LuEllipsisVertical size={20} />
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="edit-unit" onClick={() => onEdit?.(row.original.id)} className="satoshi-medium">Edit Unit</Menu.Item>
                            <Menu.Item value="assign-tenant" onClick={() => setOpen(true)} className="satoshi-medium">Assign Tenant</Menu.Item>
                            <Menu.Item value="remove-tenant" onClick={() => setRemoveTenant(true)} className="satoshi-medium">Remove Tenant</Menu.Item>
                            <Menu.Item value="delete-unit" onClick={() => setOpenDelete(true)} className="satoshi-medium" color={'#C00F0C'}>Delete Unit</Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            <Modal open={removeTenant} onOpenChange={setRemoveTenant} size={'xs'} className="h-fit" modalContent={<DeleteTenantPopUp data={{ unitId: row.original.id, propertyId: propertyId, role: 'TENANT', userId: row.original.tenantId }} onClose={() => { setRemoveTenant(false); fetchUnits(propertyId) }} />} />
            <Modal open={open} onOpenChange={setOpen} size={'cover'} className="w-[600px] h-fit" modalContent={<AddMemberModal unit unitId={row.original.id} />} />
            <Modal open={openDelete} onOpenChange={setOpenDelete} size={'xs'} className="h-fit" modalContent={<DeletePopUp onClose={() => { setOpenDelete(false); fetchUnits(propertyId) }} data={{ propertyId: propertyId, unit: true, unitId: row.original.id }} />} />
        </Flex>
    )
}