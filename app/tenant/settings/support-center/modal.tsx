import { AddImage } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomSelect, CustomTextarea } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { NeedHelpFormData } from "@/schema"
import { StoreFile } from "@/services/maintenance"
import { createTicket, createTicketPayload } from "@/services/settings"
import { Box, createListCollection, Stack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const NeedHelp = () => {
    const { control, handleSubmit } = useForm<NeedHelpFormData>()
    const [files, setFiles] = useState<File[] | null>(null);

    const upload = async (): Promise<string[]> => {
        if (!files?.length) return []

        return Promise.all(
            files.map(file =>
                StoreFile({ file, folder: 'maintenance' })
            )
        )
    }

    const mutation = useMutation({
        mutationFn: (payload: createTicketPayload) => createTicket(payload),
        onSuccess: () => {
            toast.success('Submitted successfully', {
                position: 'top-right',
                duration: 3000,
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '14px',
                }
            })
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const onSubmit = async (data: NeedHelpFormData) => {
        const urls = await upload()

        const payload: createTicketPayload = {
            category: data.category[0].toUpperCase(),
            subject: data.description,
            message: data.description,
            priority: 'HIGH',
            attachments: urls?.length ? urls : undefined
        }

        mutation.mutate(payload)

    }

    return (
        <Box p={4}>
            <PageTitle title="Need help?" mb={4} fontSize={'18px'} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                    <CustomSelect size={'xs'} name='category' labelBold alignCenter triggerHeight={'31px'} control={control} label="Category" width={'32%'} placeholder="Select Category" collection={categories} />
                    <CustomTextarea name='description' labelBold label="Description" width={'100%'} placeholder="Enter Description" control={control} />
                    <AddImage onFileChange={setFiles} />
                    <MainButton children="Submit" onClick={handleSubmit(onSubmit)} type="submit" className="h-[37px]" size='sm' />
                </Stack>

            </form>
        </Box>
    )
}

const categories = createListCollection({
    items: [
        {
            value: 'MAINTENANCE',
            label: 'Maintenance'
        },
        {
            value: 'BILLING',
            label: 'Billing'
        },
        {
            value: 'NON',
            label: 'Category 3'
        }
    ]
})