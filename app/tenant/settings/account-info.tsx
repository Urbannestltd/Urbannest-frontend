'use client'
import { DragAndDrop } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { PersonalInfoFormData } from "@/schema"
import { StoreFile } from "@/services/maintenance"
import { UpdateUserProfile, UserProfilePayload } from "@/services/settings"
import { useSettingStore } from "@/store/settings"
import { Box, Flex, Grid, HStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { LuMail, LuPhone, LuUser } from "react-icons/lu"

export const AccountInfo = () => {
    const { control, handleSubmit } = useForm<PersonalInfoFormData>()
    const userSettings = useSettingStore((state) => state.userSettings);
    const [file, setFile] = useState<File | null>(null)



    const mutate = useMutation({
        mutationFn: (payload: UserProfilePayload) => UpdateUserProfile(payload),
        onSuccess: () => {
            toast.success('Profile updated successfully')
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const onSubmit = async (data: PersonalInfoFormData) => {
        const profileUrl = await StoreFile({ folder: 'support', file: file ?? new File([], '') })
        console.log(profileUrl)
        const payload: UserProfilePayload = {
            userFullName: data.fullName ?? userSettings?.userFullName,
            userEmail: data.emailAddress ?? userSettings?.userEmail,
            userPhone: data.phoneNumber ?? userSettings?.userPhone,
            userEmergencyContact: data.emergencyContact ?? userSettings?.userEmergencyContact,
            userProfileUrl: profileUrl ?? userSettings?.userProfileUrl
        }
        mutate.mutate(payload)
    }

    return (
        <Box w={'full'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack justify={'space-between'}>
                    <PageTitle title="Account Information" />
                    <Flex gap={2}>
                        <MainButton variant='outline' className="h-[35px]" size='sm'>Cancel</MainButton>
                        <MainButton type="submit" className="h-[35px]" size='sm'>Save</MainButton>
                    </Flex>
                </HStack>
                <Divider my={10} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Profile Picture" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Choose your profile picture." />
                    <DragAndDrop onFileChange={(file) => setFile(file)} />
                </Flex>
                <Divider my={14} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Personal Information" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Enter your necessary details" />
                    <Grid w={'542px'} gap={{ base: 1, md: 4 }} templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }}>
                        <CustomInput name='fullName' width={'100%'} startElement={<LuUser color="#B3B3B3" />} control={control} value={userSettings?.userFullName} label="Full Name" placeholder="John Doe" />
                        <CustomInput name='emailAddress' width={'100%'} startElement={<LuMail color="#B3B3B3" />} control={control} value={userSettings?.userEmail} label="Email" placeholder="yFJ0t@example.com" />
                        <CustomInput name='phoneNumber' width={'100%'} startElement={<LuPhone color="#B3B3B3" />} control={control} value={userSettings?.userPhone} label="Phone Number" placeholder="+234 80 0000 0000" />
                        <CustomInput name="emergencyContact" width={'100%'} startElement={<LuPhone color="#B3B3B3" />} control={control} value={userSettings?.userEmergencyContact} label="Emergency Contact Number" placeholder="+234 80 0000 0000" />
                    </Grid>
                </Flex>
                <Divider my={10} />
            </form>
        </Box>
    )
}