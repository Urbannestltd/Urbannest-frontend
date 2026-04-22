import { Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsis, LuEllipsisVertical } from "react-icons/lu"

export interface FacilityProperties {
    id: string
    name: string
    responseTime?: string
    maintenanceScore?: number
    activeWorkOrders?: number
    lastInspection?: string
}

export const useColumns = (): ColumnDef<FacilityProperties, any>[] => {
    return [
        {
            accessorKey: 'name',
            header: "Property Asset",
            cell: ({ row }) => <Text>{row.original.name}</Text>
        },
        {
            accessorKey: 'responseTime',
            header: "Response Time",
        },
        {
            accessorKey: 'maintenanceScore',
            header: "Maintenance Score",
        },
        {
            accessorKey: 'activeWorkOrders',
            header: "Active Work Orders",
        },
        {
            accessorKey: 'lastInspection',
            header: "Last Inspection",
        },
    ]
}