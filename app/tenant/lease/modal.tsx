import { PageTitle } from "@/components/ui/page-title"
import { Box, Checkbox, Field, Flex, HStack, Text } from "@chakra-ui/react"
import Image from "next/image"
import ElectricityIcon from '@/app/assets/icons/electricity-utility.svg'
import { Controller, useForm } from "react-hook-form"
import { UtilitiesFormData } from "@/schema"
import { CustomInput } from "@/components/ui/custom-fields"
import { MainButton } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { purchaseElectricity, UtilityPaymentPayload } from "@/services/utilities"
import { util } from "zod"
import toast from "react-hot-toast"

export const UtilitiesModal = () => {
    const { control, formState, handleSubmit } = useForm<UtilitiesFormData>()
    const [selectUtility, setSelectUtility] = useState<"electricity" | "gas" | "water" | "empty">('empty')

    const mutation = useMutation({
        mutationFn: purchaseElectricity,
        onSuccess: (response) => {
            localStorage.setItem("payment_reference", response.reference)
            window.location.href = response.url
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
    const onSubmit = (data: UtilitiesFormData) => {
        const payload: UtilityPaymentPayload = {
            serviceID: 'ikeja-electric',
            type: 'prepaid',
            meterNumber: data.meterNumber,
            amount: data.amount,
            saveMeter: data.saveMeter,
            label: 'Recharge Light'
        }
        mutation.mutate(payload)
    }

    return (
        <Box p={4}>
            <PageTitle mb={6} title="Pay Utilities" fontSize={'18px'} />
            <Box mb={5}>
                <Flex cursor={'pointer'} _hover={{
                    border: '1px solid #5A5A5A',
                    shadow: 'sm'
                }} onClick={() => setSelectUtility('electricity')} direction={'column'} justify={'center'} align={'center'} rounded={'12px'} shadow={selectUtility === 'electricity' ? 'sm' : 'none'} border={selectUtility === 'electricity' ? '1px solid #5A5A5A' : '1px solid #EAEAEA'} w={'158px'} p={4}>
                    <Image src={ElectricityIcon} alt="lease-image" />
                    <Text className="satoshi-medium" mt={6}>Electricity</Text>
                </Flex>
            </Box>
            <Box display={selectUtility === 'electricity' ? 'block' : 'none'}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <HStack mb={4} gap={8}>
                        <CustomInput height={'45px'} name="meterNumber" control={control} label="Meter Number" placeholder="Meter Number" />
                        <CustomInput height={'45px'} name="amount" control={control} label="Amount" placeholder="Amount" />
                    </HStack>
                    <Controller
                        control={control}
                        name='saveMeter'
                        render={({ field }) => (
                            <Field.Root mb={4} invalid={!!formState.errors.saveMeter} disabled={field.disabled}>
                                <Checkbox.Root
                                    checked={field.value}
                                    onCheckedChange={({ checked }) => field.onChange(checked)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control w={'16px'} h={'16px'} rounded={'4px'} border={'1px solid #B2B2B2'}>
                                        <Checkbox.Indicator color={'#B2B2B2'} />
                                    </Checkbox.Control>
                                    <Checkbox.Label className="satoshi-medium" fontSize={'14px'} color={'#B3B3B3'}>Remember Meter Number</Checkbox.Label>
                                </Checkbox.Root>
                                <Field.ErrorText>
                                    {formState.errors.saveMeter?.message}
                                </Field.ErrorText>
                            </Field.Root>
                        )}
                    />
                    <MainButton loading={mutation.isPending} disabled={mutation.isPending} size='lg' type="submit">Continue</MainButton>
                </form>
            </Box>

        </Box>
    )
}