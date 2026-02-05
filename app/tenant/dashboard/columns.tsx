import { formatDate, formatDateDash, formatDateRegular, formatDateTime, formatDatetoTime } from "@/services/date";
import { Visitor } from "@/store/visitors";
import { Flex, Menu, MenuItemGroup, Text } from "@chakra-ui/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { LuEllipsisVertical } from "react-icons/lu";

export const useColumns = (scheduled: boolean): ColumnDef<Visitor, unknown>[] => {
    const Status = [
        {
            value: 'UPCOMING',
            label: 'Upcoming',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        },
        {
            value: 'CHECKED_IN',
            label: 'Checked In',
            bgColor: '#D8E9F9',
            textColor: '#1976D2'
        },
        {
            value: 'CHECKED_OUT',
            label: 'Checked Out',
            bgColor: '#F5F5F5',
            textColor: '#757575'
        }
    ]

    const frequencies = [
        {
            value: 'ONE_OFF',
            label: 'One Off'
        },
        {
            value: 'WHOLE_DAY',
            label: 'Whole Day'
        },
        {
            value: 'RECURRING',
            label: 'Recurring'
        }
    ]

    return [
        {
            accessorKey: 'visitorName',
            header: "Visitor",
            cell: ({ row }) => {
                const visitorName = row.original.visitorName + (row.original.groupName ? ` (${(row.original.groupName)})` : '')
                return <Text className="capitalize" children={visitorName} />
            },
        },
        {
            accessorKey: 'visitorPhone',
            header: "Phone",
            cell: ({ row }) => row.getValue('visitorPhone'),
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
                        <Text className="capitalize" color={status?.textColor} children={status?.label || row.getValue('status')} />
                    </Flex>)
            }

        },
        {
            accessorKey: 'frequency',
            header: 'Access',
            cell: ({ row }) => {
                const frequency = frequencies.find((frequency) => frequency.value === row.getValue('frequency'))
                return <Text className="capitalize" children={frequency?.label || row.getValue('frequency')} />
            }
        },
        scheduled
            ? {
                accessorKey: 'expectedTime',
                header: 'Expected',
                cell: ({ row }) => {
                    const roow = row.original.date
                    return `${formatDateDash(roow)} | ${formatDatetoTime(roow)}`
                }
            }
            : {
                accessorKey: 'lol',
                header: '',
                cell: () => <></>,
            },
        {
            accessorKey: 'checkInTime',
            header: 'Time In',
            cell: ({ row }) => {
                const roow = row.original.checkInTime
                if (roow === '-') return '-'
                return formatDatetoTime(row.getValue('checkInTime'))
            },
        },
        {
            accessorKey: 'checkOutTime',
            header: 'Time Out',
            cell: ({ row }) => {
                const roow = row.original.checkOutTime
                if (roow === '-') return '-'
                return formatDatetoTime(row.getValue('checkOutTime'))
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: () => (
                <Menu.Root>
                    <Menu.Trigger>
                        <LuEllipsisVertical cursor={'pointer'} />
                    </Menu.Trigger>
                    <Menu.Positioner>
                        <Menu.Content>
                            <MenuItemGroup gap={3}>
                                <Menu.Item mb={2} cursor={'pointer'} value="save-visitor" >Save as Visitor</Menu.Item>
                                <Menu.Item my={2} cursor={'pointer'} value="view-details">View Details</Menu.Item>
                                <Menu.Item my={2} cursor={'pointer'} value="revoke-access">Revoke Access</Menu.Item>
                            </MenuItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Menu.Root>

            )
        }
    ]

}