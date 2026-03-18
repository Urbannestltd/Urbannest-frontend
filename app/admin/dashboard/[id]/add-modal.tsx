import { Avatar } from "@/components/ui/avatar"
import { MainButton } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SearchInput } from "@/components/ui/search-input"
import { Box, createListCollection, Flex, HStack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const AddMemberModal = () => {
    const { control } = useForm()
    return (
        <Box p={4}>
            <PageTitle title="Add A Member" />
            <HStack my={4} align={'center'} justify={'center'}>
                <SearchInput width={'100%'} />
                <Box w={'40%'}>
                    <CustomSelect control={control} name="role" width={'full'} placeholder="Facility Manager" collection={roles} />
                </Box>
                <MainButton className="h-[34px]" size='sm'>Invite Member</MainButton>
            </HStack>
            <Box borderBottom={'1px solid #F5F5F5'}>
                <Text pb={2} w={'fit'} borderBottom={'2px solid #000000'}>Members (45)</Text>
            </Box>
            <Box>
                {Members.map((member) => (
                    <Flex _hover={{ bg: '#F5F5F5' }} align={'center'} justify={'space-between'} p={2}>
                        <Flex>
                            <Avatar name={member.name} bg={'#CFAA67'} color={'white'} />

                            <Box ml={4}>
                                <Text className="text-[15px] satoshi-bold">{member.name}</Text>
                                <Text className="text-[13px] satoshi-medium text-[#5A5A5A]">{member.email}</Text>
                            </Box>
                        </Flex>
                        <Box>
                            <CustomSelect control={control} name={`memberRole ${member.name}`} width={'140px'} value={member.role} collection={roles} />
                        </Box>
                    </Flex>))}
            </Box>
        </Box>
    )
}

const roles = createListCollection({
    items: [
        { value: "tenant", label: "Tenant" },
        { value: 'landlord', label: 'Landlord' },
        { value: 'facility-manager', label: 'Facility Manager' },
    ]
})

const Members = [
    {
        name: "Ade Adeyemi",
        role: "tenant",
        email: 'adeadeyemi@gmailcom',
    },
    {
        name: 'Ibrahim Adeyemi',
        role: "facility-manager",
        email: 'ibrahim@gmailcom',
    },
    {
        name: 'John Doe',
        role: "landlord",
        email: 'john@gmailcom',
    },
    {
        name: 'kunle adeyemi',
        role: "tenant",
        email: 'kunle@gmailcom',
    }
]