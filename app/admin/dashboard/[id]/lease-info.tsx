import { DragAndDrop } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { TenantLeaseFormData } from "@/schema"
import { Box, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"

const UploadDocuments = () => {
    const [files, setFiles] = useState<File[] | null>(null)
    return (
        < >
            <PageTitle title="Upload Documents" mb={7.5} fontSize={'18px'} />
            <DragAndDrop width={'full'} onFileChange={(file) => setFiles} />
            <MainButton size="lg" className="my-4">
                Continue
            </MainButton>
        </>
    )
}

const LeaseForm = ({ onNext }: { onNext: (next: boolean, data?: TenantLeaseFormData) => void }) => {
    const { control, reset, watch, handleSubmit, setValue, formState } =
        useForm<TenantLeaseFormData>()

    const onSubmit = (data: TenantLeaseFormData) => {
        onNext(true, data)
    }

    return (
        <div>
            <PageTitle
                title="Tenant Lease"
                fontSize={"18px"}
                mb={7}
                spacing={0}
                subFontSize={"14px"}
                subText="Create a visitor pass for guests, deliveries, or service providers."
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack w={"full"} gap={4}>
                    <CustomInput
                        name="rentAmount"
                        width={"full"}
                        required
                        control={control}
                        label="Rent Amount"
                        placeholder="Rent Amount"
                    />
                    <CustomInput
                        name="leaseLength"
                        width={"full"}
                        control={control}
                        label="Lease Length"
                        placeholder="Lease Length"
                    />
                </HStack>
                <HStack mt={4} w={"full"} gap={4}>
                    <CustomInput
                        name="leaseStartDate"
                        width={"full"}
                        type="date"
                        required
                        control={control}
                        label="Lease Start Date"
                        placeholder="Lease Start Date"
                    />
                    <CustomInput
                        name="leaseEndDate"
                        width={"full"}
                        type="date"
                        required
                        control={control}
                        label="Lease End Date"
                        placeholder="Lease End Date"
                    />
                </HStack>
                <HStack mt={4} w={"full"} gap={4}>
                    <CustomSelect
                        name="moveOutNotice"
                        width={"full"}
                        collection={moveOutNotice}
                        control={control}
                        label="Move Out Notice"
                        placeholder="Move Out Notice"
                    />
                    <CustomInput
                        name="serviceCharge"
                        width={"full"}
                        control={control}
                        label="Service Charge"
                        placeholder="Service Charge"
                    />
                </HStack>
                <Flex mt={10} align={"center"} w={"full"}>
                    <MainButton size="lg" type="submit">
                        Next
                    </MainButton>
                </Flex>
            </form>
        </div>
    )
}

export const LeaseInfo = () => {
    const [next, setNext] = useState(false)
    const [formdata, setFormData] = useState<TenantLeaseFormData>()

    const handleSubmit = (data: TenantLeaseFormData) => {
        const payload = { ...formdata, ...data }
    }

    return <Box p={4} h={'fit'}>{next ? <UploadDocuments /> : <LeaseForm onNext={(next, payload) => { setNext(next); setFormData(payload) }} />}</Box>
}

const moveOutNotice = createListCollection({
    items: [
        {
            label: "None",
            value: 0,
        },
        {
            label: "1 Week",
            value: '1 Week',
        },
        {
            label: "2 Weeks",
            value: '2 Weeks',
        },
        {
            label: '3 Weeks',
            value: '3 Weeks',
        },
        {
            label: '1 Month',
            value: '1 Month',
        },
        {
            label: '1-3 Months',
            value: '1-3 Months',
        },

    ]
})