'use client'
import { addVisitorGroupsFormData } from "@/schema"
import { Box, createListCollection, Flex, HStack, IconButton } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { MainButton } from "@/components/ui/button"
import addVisitorIcon from '@/app/assets/icons/add-user-icon.svg'
import Image from "next/image"
import toast from "react-hot-toast"

interface addVisitorProps {
    Submit: () => void
}

export const AddVisitorGroupsModal = ({ Submit }: addVisitorProps) => {

    const { control, reset, handleSubmit } = useForm<addVisitorGroupsFormData>()

    const handleAddVisitor = (data: addVisitorGroupsFormData) => {
        console.log(data)
        Submit?.()
        toast.success('success')
    }

    return (
        <Box p={4}>
            <PageTitle title="Add A Visitor" fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Create a visitor pass for guests, deliveries, or service providers." />
            <form onSubmit={handleSubmit(handleAddVisitor)}>
                <HStack w={'full'} gap={4}>
                    <CustomInput name='groupName' width={'full'} required control={control} label='Group Name' placeholder="Group Name" />
                    <CustomInput name='contactNumber' width={'full'} required control={control} label='Group Contact Number' placeholder="Group Contact Number" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomSelect name="visitorType" width={'full'} collection={visitorType} required control={control} label='Visitor Type' placeholder="Visitor Type" />
                    <CustomSelect name="accessType" width={'full'} collection={accessType} required control={control} label='Access Type' placeholder="Access Type" />
                </HStack>
                <HStack mt={4} mb={4} w={'full'} gap={4}>
                    <CustomInput name='timeExpected' type='time' width={'full'} control={control} label='Time Expected' placeholder="Time Expected" />
                    <CustomInput name='dateExpected' type='date' width={'full'} control={control} label='Date Expected' placeholder="Date Expected" />
                </HStack>
                <CustomInput name="visitorlist" control={control} label="Visitor List" placeholder="Visitor List" />
                <Flex mt={10} align={'center'} w={'full'}>
                    <MainButton size="lg" type="submit">Add Vistors</MainButton>
                    <IconButton size="lg" className="h-8" rounded={'6px'} border={'1.15px solid #B2B2B2'} ml={4} variant="outline"><Image src={addVisitorIcon} alt="add visitor" /></IconButton>
                </Flex>
            </form>
        </Box>
    )
}

const visitorType = createListCollection({
    items: [
        { label: 'Guest', value: 'guest' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Service Provider', value: 'service-provider' },
    ]
})

const accessType = createListCollection({
    items: [
        { label: 'Walk-in', value: 'walkIn' },
        { label: 'Scheduled', value: 'scheduled' },
    ]
})