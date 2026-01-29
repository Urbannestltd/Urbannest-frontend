import { Visitor } from "@/store/visitors";
import { Flex, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuEllipsis, LuEllipsisVertical } from "react-icons/lu";
import { text } from "stream/consumers";

export const useColumns = (): ColumnDef<Visitor, unknown>[] => {
    const Status = [
        {
            value: 'checked-in',
            label: 'Checked In',
            bgColor: '#D8E9F9',
            textColor: '#1976D2'
        },
        {
            value: 'checked-out',
            label: 'Checked Out',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        }
    ]

    return [
        {
            accessorKey: 'name',
            header: "Visitor",
            cell: ({ row }) => row.getValue("name"),
        },
        {
            accessorKey: 'type',
            header: "Phone",
            cell: ({ row }) => row.getValue("type"),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = Status.find((status) => status.value === row.getValue('status'))
                return (
                    <Flex
                        alignItems={'center'}
                        fontSize={'14px'}
                        fontWeight={'semibold'}
                        bg={status?.bgColor}
                        p={1}
                        px={4}
                        rounded={'3xl'}
                        justify={'center'}
                        w={'fit'}
                    >
                        <Text className="capitalize" color={status?.textColor} children={status?.label} />
                    </Flex>)
            }

        },
        {
            accessorKey: 'type',
            header: 'Access',
            cell: ({ row }) =>
                <Text className="capitalize" children={row.getValue('type')} />
        },
        {
            accessorKey: 'checkInTime',
            header: 'Time In',
            cell: ({ row }) => row.getValue('checkInTime'),
        },
        {
            accessorKey: 'checkOutTime',
            header: 'Time Out',
            cell: ({ row }) => row.getValue('checkOutTime'),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: () => (
                <LuEllipsisVertical cursor={'pointer'} />
            )
        }
    ]

}