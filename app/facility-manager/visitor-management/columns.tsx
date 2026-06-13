import { Modal } from "@/components/ui/dialog";
import { formatDatetoTime } from "@/services/date";
import { Visitor, WalkIn } from "@/store/fm/visitor";
import { Center, Flex, Menu, Stack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import { ApproveRequestModal, RejectRequestModal, RescheduleRequestModal } from "./modal";
import { ActionsModal } from "./actions-modal";
import { set } from "lodash";

const isVisitor = (row: Visitor | WalkIn): row is Visitor => "normalizedStatus" in row;

export const useColumns = (scheduled: boolean): ColumnDef<Visitor | WalkIn, any>[] => {
    const Status = [
        {
            value: "UPCOMING",
            label: "Not Arrived",
            bgColor: "#F5F5F5",
            textColor: "#757575",
        },
        {
            value: "CHECKED_IN",
            label: "Checked In",
            bgColor: "#D8E9F9",
            textColor: "#1976D2",
        },
        {
            value: "CHECKED_OUT",
            label: "Checked Out",
            bgColor: "#F5F5F5",
            textColor: "#757575",
        },
        {
            value: "PENDING",
            label: "Pending",
            bgColor: "#FFFBEB",
            textColor: "#BF6A02",
        },
        {
            value: "RESCHEDULED",
            label: "Rescheduled",
            bgColor: "#FFFBEB",
            textColor: "#BF6A02",
        },
        {
            value: "REJECTED",
            label: "Rejected",
            bgColor: "#FEF2F2",
            textColor: "#B91C1C",
        },
    ];

    const Type = [
        {
            value: "ONE_OFF_AGENT",
            label: "Request",
            bgColor: "#FFFBEB",
            borderColor: "#EBFFEE",
            textColor: "#BF6A02",
        },
        {
            value: "ONE_OFF_AGENT_APPROVED",
            label: "Inspection",
            bgColor: "#EBFFEE",
            borderColor: "#FFFBEB",
            textColor: "#14AE5C",
        },
        {
            value: "ONE_OFF",
            label: "One Off",
            bgColor: "#FFFFFF",
            borderColor: "#E0E0E0",
            textColor: "#4A4A4A",
        },
        {
            value: "WHOLE_DAY",
            label: "Whole Day",
            bgColor: "#FFFFFF",
            borderColor: "#E0E0E0",
            textColor: "#4A4A4A",
        },
        {
            value: "RECURRING",
            label: "Recurring",
            bgColor: "#FFFBEB",
            borderColor: "#EBFFEE",
            textColor: "#BF6A02",
        },
    ];

    return [
        {
            accessorFn: (row) => row.propertyName + " (" + row.unitName + ")",
            header: "Property & Unit",
            cell: ({ row }) => (
                <Stack>
                    <Text fontWeight={"bold"}>{row.original.propertyName}</Text>
                    <Text fontSize={"12px"} color={"#757575"}>
                        {row.original.unitName}
                    </Text>
                </Stack>
            ),
        },
        {
            accessorKey: "visitorName",
            header: "Visitor Name",
            cell: ({ row }) => (
                <Text className="capitalize" children={row.original.visitorName} />
            ),
        },
        {
            accessorFn: (row) => (isVisitor(row) ? row.frequency : undefined),
            header: "Access",
            cell: ({ row }) => {
                const freq = isVisitor(row.original) ? row.original.frequency : undefined;
                const frequency = Type.find((f) => f.value === freq);
                return (
                    <Center
                        w={"fit"}
                        py={0.5}
                        bg={frequency?.bgColor}
                        rounded={"full"}
                        px={2}
                        border={`1px solid ${frequency?.borderColor}`}
                    >
                        <Text
                            className="capitalize satoshi-bold text-sm"
                            color={frequency?.textColor}
                            children={frequency?.label || freq || ""}
                        />
                    </Center>
                );
            },
        },
        {
            accessorFn: (row) =>
                isVisitor(row) ? row.normalizedStatus : row.status,
            header: "Status",
            cell: ({ row }) => {
                const statusVal = isVisitor(row.original)
                    ? row.original.rawStatus
                    : row.original.status;
                const status = Status.find((s) => s.value === statusVal);
                return (
                    <Flex
                        alignItems={"center"}
                        fontSize={"14px"}
                        fontWeight={"semibold"}
                        bg={status?.bgColor}
                        p={1}
                        px={4}
                        rounded={"3xl"}
                        justify={"center"}
                        w={"fit"}
                    >
                        <Text
                            className="capitalize"
                            color={status?.textColor}
                            children={status?.label || statusVal}
                        />
                    </Flex>
                );
            },
        },
        {
            accessorKey: "tenantName",
            header: "Tenant Name",
            cell: ({ row }) => (
                <Text className="capitalize" children={row.original.tenantName} />
            ),
        },
        scheduled
            ? {
                accessorFn: (row) =>
                    isVisitor(row) ? row.visitDate || row.proposedDate : undefined,
                header: "Expected",
                cell: ({ row }) => {
                    if (!isVisitor(row.original)) return null;
                    const date =
                        row.original.visitDate || row.original.proposedDate;
                    return formatDatetoTime(date, true);
                },
            }
            : {
                id: "expected-placeholder",
                header: "",
                cell: () => <></>,
            },
        {
            accessorFn: (row) =>
                isVisitor(row) ? row.proposedDate : row.checkedInAt,
            header: "Time In",
            cell: ({ row }) => {
                const time = isVisitor(row.original)
                    ? row.original.proposedDate
                    : row.original.checkedInAt;
                if (!time || time === "-") return "-";
                return formatDatetoTime(time);
            },
        },
        {
            accessorFn: (row) =>
                isVisitor(row) ? row.proposedDate : row.checkedOutAt,
            header: "Time Out",
            cell: ({ row }) => {
                const time = isVisitor(row.original)
                    ? row.original.proposedDate
                    : row.original.checkedOutAt;
                if (!time || time === "-") return "-";
                return formatDatetoTime(time);
            },
        },
        scheduled
            ? {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const [approve, setApprove] = useState(false);
                    const [reject, setReject] = useState(false);
                    const [reschedule, setReschedule] = useState(false);
                    const [actions, setActions] = useState(false);

                    if (!isVisitor(row.original)) return null;
                    const visitor = row.original;

                    if (visitor.rawStatus !== 'CHECKED_IN' && (!visitor.canApprove && !visitor.canReject && !visitor.canReschedule))
                        return null;

                    return (
                        <>
                            <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical />
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {visitor.canApprove && (
                                            <Menu.Item
                                                onClick={() => setApprove(true)}
                                                value="approve"
                                            >
                                                Approve Request
                                            </Menu.Item>
                                        )}
                                        {visitor.canReject && (
                                            <Menu.Item
                                                onClick={() => setReject(true)}
                                                value="reject"
                                            >
                                                Reject Request
                                            </Menu.Item>
                                        )}
                                        {visitor.canReschedule && (
                                            <Menu.Item
                                                onClick={() => setReschedule(true)}
                                                value="reschedule"
                                            >
                                                Reschedule Visit
                                            </Menu.Item>
                                        )}
                                        {visitor.rawStatus === 'CHECKED_IN' && (
                                            <Menu.Item
                                                onClick={() => setActions(true)}
                                                value="checkout"
                                            >
                                                Check Out
                                            </Menu.Item>
                                        )}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                            <Modal
                                open={approve}
                                onOpenChange={setApprove}
                                size={"xs"}
                                modalContent={
                                    <ApproveRequestModal
                                        agentData={{
                                            name: visitor.agentName,
                                            unit: visitor.unitName,
                                        }}
                                        id={visitor.id}
                                        onClose={() => setApprove(false)}
                                    />
                                }
                            />
                            <Modal
                                open={reject}
                                onOpenChange={setReject}
                                size={"xs"}
                                modalContent={
                                    <RejectRequestModal
                                        id={visitor.id}
                                        onClose={() => setReject(false)}
                                    />
                                }
                            />
                            <Modal
                                open={reschedule}
                                onOpenChange={setReschedule}
                                size={"sm"}
                                modalContent={
                                    <RescheduleRequestModal
                                        proposedDate={visitor.proposedDate}
                                        id={visitor.id}
                                        onClose={() => setReschedule(false)}
                                    />
                                }
                            />
                            <Modal
                                open={actions}
                                onOpenChange={setActions}
                                size={"xs"}
                                modalContent={
                                    <ActionsModal
                                        type={'checkout'}
                                        walkin={false} visitorName={visitor.visitorName}
                                        id={visitor.id}
                                        onClose={() => {
                                            setActions(false)
                                        }}
                                    />
                                }
                            />
                        </>
                    );
                },
            }
            : {
                id: "actions-placeholder",
                header: "Actions",
                cell: ({ row }) => {
                    const [openModal, setOpenModal] = useState(false);
                    const [type, setType] = useState<'repeat' | 'checkout' | 'status'>('checkout');

                    const visitor = row.original;


                    return (
                        <>
                            <Menu.Root>
                                <Menu.Trigger>
                                    <LuEllipsisVertical />
                                </Menu.Trigger>
                                <Menu.Positioner>
                                    <Menu.Content>

                                        <Menu.Item
                                            onClick={() => {
                                                setOpenModal(true);
                                                setType("repeat");
                                            }}
                                            value="repeat"
                                        >
                                            Repeat Visit
                                        </Menu.Item>

                                        <Menu.Item
                                            onClick={() => {
                                                setOpenModal(true);
                                                setType("status");
                                            }}
                                            value="status"
                                        >
                                            Check Status
                                        </Menu.Item>

                                        <Menu.Item
                                            onClick={() => {
                                                setOpenModal(true);
                                                setType("checkout");
                                            }}
                                            value="checkout"
                                        >
                                            Check Out
                                        </Menu.Item>

                                    </Menu.Content>
                                </Menu.Positioner>
                            </Menu.Root>
                            <Modal
                                open={openModal}
                                onOpenChange={setOpenModal}
                                size={"xs"}
                                modalContent={
                                    <ActionsModal
                                        type={type} visitorName={visitor.visitorName}
                                        id={visitor.id}
                                        onClose={() => {
                                            setOpenModal(false);
                                            setType('checkout')
                                        }}
                                    />
                                }
                            />
                        </>
                    );
                },
            },
    ];
};
