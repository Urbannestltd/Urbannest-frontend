import { Modal } from "@/components/ui/dialog";
import { formatDateDash, formatDatetoTime } from "@/services/date";
import { Visitor } from "@/store/fm/visitor";
import { Center, Flex, Menu, Stack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import { ApproveRequestModal, RejectRequestModal, RescheduleRequestModal } from "./modal";

export const useColumns = (scheduled: boolean): ColumnDef<Visitor, unknown>[] => {
    const Status = [
        {
            value: 'UPCOMING',
            label: 'Not Arrived',
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
        },
        {
            value: 'PENDING',
            label: 'Pending',
            bgColor: '#FFFBEB',
            textColor: '#BF6A02'
        },
        {
            value: 'RESCHEDULED',
            label: 'Rescheduled',
            bgColor: '#FFFBEB',
            textColor: '#BF6A02'
        },
        {
            value: 'REJECTED',
            label: 'Rejected',
            bgColor: '#FEF2F2',
            textColor: '#B91C1C'
        }
    ]

    const Type = [
        {
            value: 'ONE_OFF_AGENT',
            label: 'Request',
            bgColor: '#FFFBEB',
            borderColor: '#EBFFEE',
            textColor: '#BF6A02'
        },
        {
            value: 'ONE_OFF_AGENT_APPROVED',
            label: 'Inspection',
            bgColor: '#EBFFEE',
            borderColor: '#FFFBEB',
            textColor: '#14AE5C'
        },
        {
            value: 'ONE_OFF',
            label: 'One Off',
            bgColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            textColor: '#4A4A4A'
        },
        {
            value: 'WHOLE_DAY',
            label: 'Whole Day',
            bgColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            textColor: '#4A4A4A'
        },
        {
            value: 'RECURRING',
            label: 'Recurring',
            bgColor: '#FFFBEB',
            borderColor: '#EBFFEE',
            textColor: '#BF6A02'
        },
    ]


    return [
        {
            accessorFn: (row) => row.propertyName + ' (' + row.unitName + ')',
            header: "Property & Unit",
            cell: ({ row }) =>
                <Stack>
                    <Text fontWeight={'bold'}>{row.original.propertyName}</Text>
                    <Text fontSize={'12px'} color={'#757575'}>{row.original.unitName}</Text>
                </Stack>
        },
        {
            accessorKey: 'visitorName',
            header: "Visitor Name",
            cell: ({ row }) => {
                const visitorName = row.original.visitorName
                console.log(row.original)
                return <Text className="capitalize" children={visitorName} />
            },
        },

        {
            accessorKey: 'frequency',
            header: 'Access',
            cell: ({ row }) => {
                const frequency = Type.find((frequency) => frequency.value === row.getValue('frequency'))
                return <Center w={'fit'} py={0.5} bg={frequency?.bgColor} rounded={'full'} px={2} border={`1px solid ${frequency?.borderColor}`}>
                    <Text className="capitalize satoshi-bold text-sm " color={frequency?.textColor} children={frequency?.label || row.getValue('frequency')} />
                </Center>
            }
        },
        {
            accessorKey: 'normalizedStatus',
            header: "Status",
            cell: ({ row }) => {

                const status = Status.find((status) => status.value === row.getValue('normalizedStatus'))
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
            accessorKey: 'tenantName',
            header: "Tenant Name",
            cell: ({ row }) => {
                const tenantName = row.original.tenantName
                console.log(row.original)
                return <Text className="capitalize" children={tenantName} />
            },
        },
        scheduled
            ? {
                accessorKey: 'visitDate',
                header: 'Expected',
                cell: ({ row }) => {
                    const roow = row.original.visitDate
                    return `${formatDatetoTime(roow, true)}`
                }
            }
            : {
                accessorKey: 'lol',
                header: '',
                cell: () => <></>,
            },
        {
            accessorKey: 'proposedDate',
            header: 'Time In',
            cell: ({ row }) => {
                const roow = row.original.proposedDate
                if (roow === '-') return '-'
                return formatDatetoTime(row.getValue('checkInTime'))
            },
        },
        {
            accessorKey: 'proposedDate',
            header: 'Time Out',
            cell: ({ row }) => {
                const roow = row.original.proposedDate
                if (roow === '-') return '-'
                return formatDatetoTime(row.getValue('proposedDate'))
            },
        },
        scheduled ?
            {
                accessorKey: 'Actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const [approve, setApprove] = useState(false)
                    const [reject, setReject] = useState(false)
                    const [reschedule, setReschedule] = useState(false)

                    if (row.original.canApprove || row.original.canReject || row.original.canReschedule)
                        return (<>
                            <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical />
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {row.original.canApprove && <Menu.Item onClick={() => setApprove(true)} value="approve">Approve Request</Menu.Item>}
                                        {row.original.canReject && <Menu.Item onClick={() => setReject(true)} value="reject">Reject Request</Menu.Item>}
                                        {row.original.canReschedule && <Menu.Item onClick={() => setReschedule(true)} value="reschedule">Reschedule Visit</Menu.Item>}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                            <Modal open={approve} onOpenChange={setApprove} size={'xs'} modalContent={<ApproveRequestModal agentData={{ name: row.original.agentName, unit: row.original.unitName }} id={row.original.id} onClose={() => { setApprove(false) }} />} />
                            <Modal open={reject} onOpenChange={setReject} size={'xs'} modalContent={<RejectRequestModal id={row.original.id} onClose={() => { setReject(false) }} />} />
                            <Modal open={reschedule} onOpenChange={setReschedule} size={'sm'} modalContent={<RescheduleRequestModal proposedDate={row.original.proposedDate} id={row.original.id} onClose={() => { setReschedule(false) }} />} />
                        </>)
                }
            }
            : {
                accessorKey: 'lol',
                header: '',
                cell: () => <></>,
            },
    ]

}