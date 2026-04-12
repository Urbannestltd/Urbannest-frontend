import { Avatar } from "@/components/ui/avatar"
import { MainButton } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-fields"
import { Modal } from "@/components/ui/dialog"
import { PageTitle } from "@/components/ui/page-title"
import { addMember, addMemberPayload, removeMember, removeMemberPayload } from "@/services/admin/property"
import { Box, Button, createListCollection, Flex, HStack, Input, InputGroup, Menu, Portal, Select, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FiSearch } from "react-icons/fi"
import { LuChevronDown } from "react-icons/lu"

export const AddMemberModal = ({ unitId, propertyId, unit }: { unitId?: string, propertyId?: string, unit?: boolean }) => {
    const [userId, setUserId] = useState('')
    const [inviteRole, setInviteRole] = useState<{ value: string, label: string } | null>(null)

    const [memberRoles, setMemberRoles] = useState<Record<number, { value: string, label: string }>>({});
    const [deleteTarget, setDeleteTarget] = useState<{
        index: number, data: {
            userId: string,
            role: string,
            unitId: string,
            propertyId: string
        }
    } | null>(null)

    const roles = createListCollection({
        items: unit
            ? [{ value: "TENANT", label: "Tenant" }]
            : [
                { value: 'LANDLORD', label: 'Landlord' },
                { value: 'FACILITY_MANAGER', label: 'Facility Manager' },
            ]
    })

    const Members = unit ? [
        {
            name: "Ade Adeyemi",
            role: "TENANT",
            email: 'adeadeyemi@gmailcom',
        },
        {
            name: 'kunle adeyemi',
            role: "TENANT",
            email: 'kunle@gmailcom',
        }
    ] : [{
        name: 'Ibrahim Adeyemi',
        role: "FACILITY_MANAGER",
        email: 'ibrahim@gmailcom',
    },
    {
        name: 'John Doe',
        role: "LANDLORD",
        email: 'john@gmailcom',
    },]
    const handleRoleChange = (memberIndex: number, role: { value: string, label: string }) => {
        setMemberRoles(prev => ({ ...prev, [memberIndex]: role }))
    }

    const mutation = useMutation({
        mutationFn: (payload: addMemberPayload) => addMember(payload),
        onSuccess: () => {
            toast.success('Member added successfully')
            setUserId('')
            setInviteRole(null)
        },
        onError: () => {
            toast.error('Failed to add member')
        }
    })
    const onAddMember = () => {
        const payload: addMemberPayload = {
            propertyId: propertyId ?? '',
            unitId: unitId ?? '',
            userEmail: userId,
            userRole: inviteRole?.value.toUpperCase() ?? ''
        }
        mutation.mutate(payload)

    }


    return (
        <Box p={4}>
            <PageTitle title="Add A Member" />
            <HStack my={4} align={'center'} justify={'center'}>
                <InputGroup w={'100%'} startElement={<FiSearch color='#B3B3B3' size='16px' />}>
                    <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        h='34px'
                        rounded='full'
                        border='0.5px solid #D9D9D9'
                        bg='#F5F5F5'
                    />
                </InputGroup>
                <Box w={'40%'}>
                    <Menu.Root>
                        <Menu.Trigger>
                            <Flex
                                align={'center'}
                                gap={2}
                                p={2}
                                h={'34px'}
                                border={'1px solid #D9D9D9'}
                                borderRadius={'6px'}
                                cursor={'pointer'}
                                minW={'150px'}
                                justify={'space-between'}
                            >
                                <Text fontSize={'14px'}>{inviteRole?.label ?? 'Role'}</Text>
                                <LuChevronDown />
                            </Flex>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content zIndex={'modal'}>
                                    {roles.items.map((role) => (
                                        <Menu.Item
                                            value={role.value}
                                            key={role.value}
                                            onClick={() => setInviteRole(role)}
                                            borderLeft={'6px solid transparent'}
                                            bg={'white'}
                                            _hover={{ borderLeft: '6px solid #CFAA67', bg: '#FDFAF3' }}
                                            className="satoshi-medium"
                                        >
                                            {role.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root></Box>
                <MainButton className="h-[34px] " onClick={onAddMember} size='sm'>Invite Member</MainButton>
            </HStack>

            <Box borderBottom={'1px solid #F5F5F5'}>
                <Text pb={2} w={'fit'} borderBottom={'2px solid #000000'}>Members ({Members.length})</Text>
            </Box>

            <Box>
                {Members.map((member, memberIndex) => {
                    const currentRole = memberRoles[memberIndex]
                    const initialRole = roles.items.find(role => role.value === member.role)
                    return (
                        <Flex key={memberIndex} _hover={{ bg: '#F5F5F5' }} align={'center'} justify={'space-between'} p={2}>
                            <Flex align={'center'}>
                                <Avatar name={member.name} bg={'#CFAA67'} color={'white'} />
                                <Box ml={4}>
                                    <Text className="text-[15px] satoshi-bold">{member.name}</Text>
                                    <Text className="text-[13px] satoshi-medium text-[#5A5A5A]">{member.email}</Text>
                                </Box>
                            </Flex>

                            <Menu.Root>
                                <Menu.Trigger>
                                    <Flex align={'center'} gap={2} p={2} border={'1px solid #D9D9D9'} borderRadius={'6px'} cursor={'pointer'}>
                                        {currentRole?.label ?? initialRole?.label}
                                        <LuChevronDown />
                                    </Flex>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content zIndex={'modal'}>
                                            {roles.items.map((role) => (
                                                <Menu.Item
                                                    value={role.value} // 👈 unique value per item
                                                    key={role.value}
                                                    onClick={() => handleRoleChange(memberIndex, role)} // 👈 uses memberIndex from closure
                                                    borderLeft={'6px solid transparent'}
                                                    bg={'white'}
                                                    _hover={{ borderLeft: '6px solid #CFAA67', bg: '#FDFAF3' }}
                                                    className="satoshi-medium"
                                                >
                                                    {role.label}
                                                </Menu.Item>
                                            ))}
                                            <Menu.Item
                                                value={`remove-${memberIndex}`} // 👈 unique per member
                                                onClick={() => setDeleteTarget({ index: memberIndex, data: { userId: member.email, role: member.role, unitId: unitId ?? '', propertyId: propertyId ?? '' } })}
                                                textTransform={'capitalize'}
                                                borderLeft={'6px solid transparent'}
                                                bg={'white'}
                                                color={'red'}
                                                _hover={{ bg: '#FDFAF3' }}
                                                className="satoshi-medium"
                                            >
                                                Remove {currentRole?.label ?? initialRole?.label}
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </Flex>
                    )
                })}
            </Box>

            <Modal
                size={'sm'}
                className="w-[350px] h-fit"
                open={!!deleteTarget}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
                modalContent={<DeletePopUp data={deleteTarget?.data ?? { userId: '', role: '', unitId: '', propertyId: '' }} />}
            />
        </Box>
    )
}
const DeletePopUp = ({ data }: {
    data: {
        userId: string,
        role: string,
        unitId: string,
        propertyId: string
    }
}) => {

    const mutate = useMutation({
        mutationFn: (payload: removeMemberPayload) => {
            return removeMember(payload)
        },
        onSuccess: () => {
            toast.success('Member removed successfully')
        },
        onError: () => {
            toast.error('Failed to remove member')
        }
    })

    const removeMembers = async () => {
        const payload: removeMemberPayload = {
            propertyId: data.propertyId ?? '',
            data: {
                userId: data.userId,
                role: data.role,
                unitId: data.unitId ?? '',
            },
        }
        mutate.mutate(payload)
    }

    const description = [
        {
            role: 'TENANT', description: 'This will remove the tenant from the unit. They will no longer have access to their tenant account for this property.',
        },
        {
            role: 'LANDLORD', description: 'This will remove the landlord from the property. They will no longer have access to manage it.',
        },
        {
            role: 'FACILITY MANAGER', description: 'This will remove the facility manager from the property. They will no longer receive or manage maintenance requests for it.',
        }
    ]
    const selectDescription = description.find(item => item.role === data.role)
    return <>
        <Flex direction={'column'} mt={4} p={4} align={'center'}>
            <Text fontSize={'18px'} mb={2} className="satoshi-bold capitalize">Remove {data.role}</Text>
            <Text w={'full'} textWrap={'wrap'} mb={4} color={'#303030'} textAlign={'center'}  >{selectDescription?.description}</Text>
            <Button h={'45px'} onClick={removeMembers} w={'full'} color={'white'} bg={'#C00F0C'}>Remove</Button>
        </Flex>
    </>

}

