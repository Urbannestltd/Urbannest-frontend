'use client'
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSwitch } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { PageTitle } from "@/components/ui/page-title"
import { SecurityPrivacyFormData } from "@/schema"
import { ChangePassword, ChangePasswordPayload, Disable2fa, Enable2fa } from "@/services/settings"
import useAuthStore from "@/store/auth"
import { Box, Flex, HStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { LuEye, LuEyeOff, LuLock } from "react-icons/lu"

export const SecurityPrivacy = () => {
    const [showPassword, setShowPassword] = useState<number>(0)
    const { control, handleSubmit, formState, reset, getValues } = useForm<SecurityPrivacyFormData>()
    const twofa = useAuthStore((state) => state.twofa)
    const mutate = useMutation({
        mutationFn: (data: ChangePasswordPayload) => ChangePassword(data),

        onSuccess: () => {
            toast.success('Password Reset Successfully')
            reset({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        },

        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const handle2fa = async (twofa: boolean) => {
        if (twofa) {
            try {
                await Enable2fa();
                toast.success('2FA Enabled Successfully')
            } catch {
                toast.error('Something went wrong')
            }
        } else {
            try {
                await Disable2fa();
                toast.success('2FA Disabled Successfully')
            } catch {
                toast.error('Something went wrong')
            }
        }
    }


    const onSubmit = async (data: SecurityPrivacyFormData) => {
        const payload: ChangePasswordPayload = {
            oldPassword: data.oldPassword,
            newPassword: data.confirmPassword
        }
        mutate.mutate(payload)
    };
    return (
        <Box w={'full'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack justify={'space-between'}>
                    <PageTitle title="Security & Privacy" />
                    <Flex gap={2}>
                        <MainButton variant='outline' className="h-[35px]" size='sm'>Cancel</MainButton>
                        <MainButton className="h-[35px]" type='submit' disabled={mutate.isPending || !formState.isValid || !formState.isDirty} size='sm'>Save</MainButton>
                    </Flex>
                </HStack>
                <Divider my={10} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Change Password" fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Update your account password." />
                    <Flex mt={2} w={'40%'} direction={'column'} gap={6}>
                        <CustomInput name='oldPassword' type={showPassword === 1 ? "text" : "password"} width={'100%'} startElement={<LuLock color="#B3B3B3" />} endElement={
                            showPassword === 1 ? (
                                <LuEye
                                    color="#B3B3B3"
                                    onClick={() => setShowPassword(0)}
                                />
                            ) : (
                                <LuEyeOff
                                    onClick={() => setShowPassword(1)}
                                    color="#B3B3B3"
                                />
                            )
                        } control={control} label="Old Password" placeholder='*********' />
                        <CustomInput name='newPassword' type={showPassword === 2 ? "text" : "password"} width={'100%'} startElement={<LuLock color="#B3B3B3" />} endElement={
                            showPassword === 2 ? (
                                <LuEye
                                    color="#B3B3B3"
                                    onClick={() => setShowPassword(0)}
                                />
                            ) : (
                                <LuEyeOff
                                    onClick={() => setShowPassword(2)}
                                    color="#B3B3B3"
                                />
                            )
                        } control={control} label="New Password" placeholder='*********' />
                        <CustomInput rules={{
                            validate: (v) =>
                                v === getValues('newPassword') || "Passwords do not match"
                        }} name="confirmPassword" type={showPassword === 3 ? "text" : "password"} width={'100%'} startElement={<LuLock color="#B3B3B3" />} endElement={
                            showPassword === 3 ? (
                                <LuEye
                                    color="#B3B3B3"
                                    onClick={() => setShowPassword(0)}
                                />
                            ) : (
                                <LuEyeOff
                                    onClick={() => setShowPassword(3)}
                                    color="#B3B3B3"
                                />
                            )
                        } control={control} label="Confirm Password" placeholder='*********' />
                    </Flex>
                </Flex>
                <Divider my={14} />
                <Flex justify={'space-between'}>
                    <PageTitle title="Two Factor Authentication " fontSize={'18px'} subFontSize={'16px'} spacing={0} subText="Add an extra layer of security to your account by verifying your sign-in with a code." />
                    <CustomSwitch name='twofa' control={control} value={twofa} onChange={handle2fa} />
                </Flex>
                <Divider my={14} />
            </form>
        </Box>
    )
}