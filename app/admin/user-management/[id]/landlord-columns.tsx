import { Text } from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import { LuEllipsis, LuEllipsisVertical } from "react-icons/lu"

export interface Properties {
    id: string
    name: string
    value?: string
    status?: string
    leadCount?: number
    dateListed?: string
}

export const useColumns = (): ColumnDef<Properties, any>[] => {
    return [
        {
            accessorKey: 'name',
            header: "Property Asset",
            cell: ({ row }) => <Text>{row.original.name}</Text>
        },
        {
            accessorKey: 'value',
            header: "Assigned Value",
        },
        {
            accessorKey: 'status',
            header: "Property Status",
        },
        {
            accessorKey: 'leadCount',
            header: "Lead Count",
        },
        {
            accessorKey: 'dateListed',
            header: "Date Listed",
        },
        {
            accessorKey: 'actions',
            header: "",
            cell: ({ row }) => <LuEllipsisVertical />
        }
    ]
}