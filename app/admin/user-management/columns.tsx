import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/dialog";
import { deleteUser } from "@/services/admin/user";
import { formatDate, formatNumberRegular } from "@/services/date";
import { Users, useUserStore } from "@/store/admin/user";
import { Box, Button, Circle, Flex, HStack, Menu, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
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
            cell: ({ row }) => {
                const [OpenModal, setOpenModal] = useState(false)
                return <div>
                    <Menu.Root>
                        <Menu.Trigger onClick={(e) => e.stopPropagation()}><LuEllipsisVertical /></Menu.Trigger>
                        <Menu.Positioner><Menu.Content onClick={(e) => { e.stopPropagation(); setOpenModal(true) }}><Menu.Item value="Delete">Delete</Menu.Item></Menu.Content></Menu.Positioner> </Menu.Root>
                    <Modal size={'sm'} open={OpenModal} onOpenChange={setOpenModal} modalContent={<DeleteUser onClose={() => setOpenModal(false)} user={{ name: row.original.fullName, id: row.original.id }} />} />
                </div>
            }
        }

    ]
}

const DeleteUser = ({ user, onClose }: {
    user: { id: string, name: string }, onClose?: () => void
}) => {
    const fetchUsers = useUserStore((state) => state.fetchUsers)

    const mutate = useMutation({
        mutationFn: (payload: string) => {
            return deleteUser(payload)
        },
        onSuccess: () => {
            toast.success('User deleted successfully')
            onClose?.()
            fetchUsers()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? 'Failed to remove property')
        }
    })
    const removeUser = async () => {
        mutate.mutate(user.id)
    }


    return <>
        <Flex direction={'column'} mt={4} p={4} align={'center'}>
            <Text fontSize={'18px'} mb={2} className="satoshi-bold capitalize">Delete {user.name ?? 'N/A'} </Text>
            <Text w={'full'} textWrap={'wrap'} mb={4} color={'#303030'} textAlign={'center'}  >This will permanently remove this {user.name ?? 'N/A'}. This action cannot be undone.</Text>
            <Button h={'45px'} onClick={removeUser} w={'full'} loading={mutate.isPending} color={'white'} bg={'#C00F0C'}>Remove</Button>
        </Flex>
    </>

}