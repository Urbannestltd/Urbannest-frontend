'use client'
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { createBudget, createBudgetPayload } from "@/services/admin/maintenance"
import { usePropertyStore } from "@/store/admin/properties"
import { Box, createListCollection, Flex } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { use, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const AddBudget = ({ onClose }: { onClose: () => void }) => {
    const { control, handleSubmit } = useForm<{ propertySelected: string[], amount: number }>()
    const properties = usePropertyStore(state => state.properties)
    const fetchProperties = usePropertyStore(state => state.fetchProperties)

    useEffect(() => {
        fetchProperties()
    }, [])



    const PropertiesList = createListCollection({
        items: [{ label: 'All Properties', value: 'all' }, ...properties.map((item) => ({ label: item.propertyName, value: item.propertyId }))]
    })

    const mutation = useMutation({
        mutationFn: (payload: createBudgetPayload) => createBudget(payload),
        onSuccess: (response) => {
            toast.success(response.message)
            onClose()
        }
    })

    const onSubmit = (data: { propertySelected: string[], amount: number }) => {
        const payload: createBudgetPayload = {
            defaultMaintenanceBudget: data.amount
        }
        mutation.mutate(payload)
    }
    return (<>

        <PageTitle title="Budget Settings" fontSize={'18px'} subFontSize={'14px'} mt={4} spacing={0} subText="Set the budget for automated approvals. Tickets above this amount require manual override." />
        <Flex h={'95%'} direction={'column'} mt={8} justify={'space-between'}>

            <Flex direction={'column'} gap={4}>
                <CustomSelect control={control} label="Property" name="propertySelected" collection={PropertiesList} />
                <CustomInput control={control} label="Amount ($)" name="amount" />
            </Flex>
            <Flex gap={2}>
                <MainButton size="lg" type="submit" loading={mutation.isPending} onClick={handleSubmit(onSubmit)} >Save Budget</MainButton>
                <MainButton size='sm' variant='outline' onClick={() => onClose}>Cancel</MainButton>
            </Flex>

        </Flex>

    </>)
}