'use client'
import { DragAndDrop } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { PersonalInfoFormData, PersonalInfoSchema } from "@/schema"
import { Box, Flex, Grid, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuMail, LuPhone, LuUser } from "react-icons/lu"

export const AccountInfo = () => {
    const { control } = useForm<PersonalInfoFormData>()
    return (
        <Box w={'full'}>
            <form action="">
                <HStack justify={'space-between'}>
                    <PageTitle title="Account Information" />
                    <Flex gap={2}>
                        <MainButton variant='outline' className="h-[35px]" size='sm'>Cancel</MainButton>
                        <MainButton className="h-[35px]" size='sm'>Save</MainButton>
                    </Flex>
                </HStack>
                <Divider my={10} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Profile Picture" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Choose your profile picture." />
                    <DragAndDrop />
                </Flex>
                <Divider my={14} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Personal Information" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Enter your necessary details" />
                    <Grid w={'542px'} gap={{ base: 1, md: 4 }} templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }}>
                        <CustomInput name='fullName' width={'100%'} startElement={<LuUser color="#B3B3B3" />} control={control} label="Full Name" placeholder="John Doe" />
                        <CustomInput name='emailAddress' width={'100%'} startElement={<LuMail color="#B3B3B3" />} control={control} label="Email" placeholder="yFJ0t@example.com" />
                        <CustomInput name='phoneNumber' width={'100%'} startElement={<LuPhone color="#B3B3B3" />} control={control} label="Phone Number" placeholder="+234 80 0000 0000" />
                        <CustomInput name="emergencyContact" width={'100%'} startElement={<LuPhone color="#B3B3B3" />} control={control} label="Emergency Contact Number" placeholder="+234 80 0000 0000" />
                    </Grid>
                </Flex>
                <Divider my={10} />
            </form>
        </Box>
    )
}