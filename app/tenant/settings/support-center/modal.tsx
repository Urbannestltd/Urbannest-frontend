import { AddImage } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomSelect, CustomTextarea } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { NeedHelpFormData } from "@/schema"
import { Box, createListCollection, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const NeedHelp = () => {
    const { control } = useForm<NeedHelpFormData>()
    return (
        <Box p={4}>
            <PageTitle title="Need help?" mb={4} fontSize={'18px'} />
            <form action="">
                <Stack gap={4}>
                    <CustomSelect size={'xs'} name='category' labelBold alignCenter triggerHeight={'31px'} control={control} label="Category" width={'32%'} placeholder="Select Category" collection={categories} />
                    <CustomTextarea name='description' labelBold label="Description" width={'100%'} placeholder="Enter Description" control={control} />
                    <AddImage onFileChange={() => { }} />
                    <MainButton children="Submit" className="h-[37px]" size='sm' />
                </Stack>

            </form>
        </Box>
    )
}

const categories = createListCollection({
    items: [
        {
            value: 'MAINTENANCE',
            label: 'Category 1'
        },
        {
            value: 'PLUMBING',
            label: 'Category 2'
        },
        {
            value: 'NON',
            label: 'Category 3'
        }
    ]
})