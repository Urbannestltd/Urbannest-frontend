import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatNumberRegular } from "@/services/date";
import { Users } from "@/store/admin/user";
import { Box, Circle, Flex, HStack, Menu, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuEllipsisVertical } from "react-icons/lu";

export const useColumns = (): ColumnDef<Users, any>[] => {
    const Status = [
        {
            value: 'ACTIVE',
            label: 'Active',
            textColor: '#047857',
            circleColor: '#10B981'
        },
        {
            value: 'PENDING',
            label: 'Pending',
            textColor: '#975102',
            circleColor: '#E8B931'
        },
        {
            value: 'BLOCKED',
            label: 'Suspended',
            textColor: '#900B09',
            circleColor: '#EC221F'
        }
    ]



    return [
        {
            accessorFn: (row) => row.fullName + ' ' + row.profileUrl,
            header: "Name",
            cell: ({ row }) => <HStack>
                <Avatar src={row.original.profileUrl} name={row.original.fullName} />
                <Box>
                    <Text className="satoshi-bold">
                        {row.original.fullName ?? 'N/A'}
                    </Text>
                    {
                        row.original.role === 'TENANT' && (
                            <>
                                <Text fontSize={'11px'} color={'#757575'}>{row.original.currentUnit?.propertyName ?? null}</Text>
                                <Text fontSize={'11px'} color={'#757575'}>{row.original.currentUnit?.unitName ?? null}</Text>
                            </>

                        )
                    }
                </Box>
            </HStack>
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => <Text className="satoshi-bold" textTransform={'capitalize'}>{row.original.role.toLowerCase()}</Text>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = Status.find(s => s.value === row.original.status)
                return <Flex align={'center'} className="satoshi-bold" color={status?.textColor}><Circle size={'7px'} mr={1} bg={status?.circleColor} />{status?.label}</Flex>
            }
        },
        {
            accessorFn: (row) => row.email + ' / ' + row.phone,
            header: 'Email/Phone',
            cell: ({ row }) => <Box>
                <Text className="satoshi-medium">{row.original.email}</Text>
                <Text fontSize={'13px'} color={'#5A6061'}>{formatNumberRegular(row.original.phone) ?? '-'}</Text>
            </Box>
        },
        {
            accessorKey: 'active',
            header: 'Last Active',
            cell: ({ row }) => <Text>-</Text>
        },
        {
            accessorKey: 'createdAt',
            header: ' Created At',
            cell: ({ row }) => <Text>{formatDate(row.original.createdAt)}</Text>
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => <Menu.Root>
                <Menu.Trigger><LuEllipsisVertical /></Menu.Trigger>
                <Menu.Content><Menu.Item value="Delete">Delete</Menu.Item></Menu.Content>
            </Menu.Root>
        }

    ]
}