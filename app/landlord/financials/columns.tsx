import { formatNumber } from "@/services/date"
import { arrears } from "@/store/landlord/financials"
import { Center, Text } from "@chakra-ui/react"
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
