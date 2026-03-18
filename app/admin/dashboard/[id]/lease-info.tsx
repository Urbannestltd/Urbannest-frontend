import { MainButton } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { TenantLeaseFormData } from "@/schema"
import { Flex, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const LeaseInfo = () => {
    const { control, reset, watch, handleSubmit, setValue, formState } = useForm<TenantLeaseFormData>()
    return (
        <div>
            <PageTitle title="Tenant Lease" fontSize={'18px'} mb={7} spacing={0} subFontSize={'14px'} subText="Create a visitor pass for guests, deliveries, or service providers." />
            <form >
                <HStack w={'full'} gap={4}>
                    <CustomInput name='rentAmount' width={'full'} required control={control} label="Rent Amount" placeholder="Rent Amount" />
                    <CustomInput name='leaseLength' width={'full'} control={control} label='Lease Length' placeholder="Lease Length" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomInput name='leaseStartDate' width={'full'} type='date' required control={control} label='Lease Start Date' placeholder="Lease Start Date" />
                    <CustomInput name='leaseEndDate' width={'full'} type='date' required control={control} label='Lease End Date' placeholder="Lease End Date" />
                </HStack>
                <HStack mt={4} w={'full'} gap={4}>
                    <CustomInput name='moveOutNotice' width={'full'} control={control} label='Move Out Notice' placeholder="Move Out Notice" />
                    <CustomInput name='serviceCharge' width={'full'} control={control} label='Service Charge' placeholder="Service Charge" />
                </HStack>
                <Flex mt={10} align={'center'} w={'full'}>
                    <MainButton size="lg" type="submit">Next</MainButton>
                </Flex>
            </form>
        </div>
    )
}
