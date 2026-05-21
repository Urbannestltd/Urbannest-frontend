import { DragAndDrop } from "@/components/ui/add-image"
import { AxiosError } from "axios"
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { TenantLeaseFormData } from "@/schema"
import { updateLease, UpdateLeasePayload, uploadLease, UploadLeasePayload } from "@/services/admin/property"
import { StoreFile } from "@/services/tenant/maintenance"
import { usePropertyStore } from "@/store/admin/properties"
import { Box, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const UploadDocuments = ({ formData, onComplete, tenantId, unitId, activeId }: {
    formData: TenantLeaseFormData,
    onComplete: () => void,
    tenantId: string,
    unitId: string,
    activeId?: string
}) => {
    const [files, setFiles] = useState<File | null>(null)

    const newmutate = useMutation({
        mutationFn: (payload: UploadLeasePayload) => uploadLease(payload),
        onSuccess: () => {
            toast.success('Property added successfully')
            onComplete()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const updatemutate = useMutation({
        mutationFn: (payload: UpdateLeasePayload) => updateLease(payload),
        onSuccess: () => {
            toast.success('Property updated successfully')
            onComplete()
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const handleSubmit = async () => {
        const payload: UploadLeasePayload = {
            tenantId: tenantId,
            unitId: unitId,
            rentAmount: formData.rentAmount,
            serviceCharge: formData.serviceCharge,
            startDate: formData.leaseStartDate,
            endDate: formData.leaseEndDate,
            moveOutNotice: formData.moveOutNotice[0],
            documentUrl: await StoreFile({ file: files!, folder: 'leases' }),
        }
        if (!activeId) {
            newmutate.mutate(payload)
        } else {
            updatemutate.mutate({ ...payload, leaseId: activeId })
        }
    }

    return (
        < >
            <PageTitle title="Upload Documents" mb={7.5} fontSize={'18px'} />
            <DragAndDrop width={'full'} accept={'application/*'} onFileChange={setFiles} />
            <MainButton size="lg" className="my-4" loading={newmutate.isPending || updatemutate.isPending} disabled={!files} onClick={handleSubmit}>
                Continue
            </MainButton>
        </>
    )
}

const LeaseForm = ({ onNext, activeId }: { onNext: (next: boolean, data?: TenantLeaseFormData) => void, activeId?: string }) => {
    const lease = usePropertyStore((state) => state.lease)
    const fetchLease = usePropertyStore((state) => state.fetchLease)
    const { control, reset, watch, handleSubmit, setValue } =
        useForm<TenantLeaseFormData>({ mode: 'onChange' })

    useEffect(() => {
        if (activeId) {
            fetchLease(activeId)
        }
    }, [activeId])

    useEffect(() => {
        if (lease) {
            reset({
                rentAmount: lease.rentAmount,
                leaseStartDate: lease.startDate
                    ? new Date(lease.startDate).toISOString().split('T')[0]
                    : '',
                leaseEndDate: lease.endDate
                    ? new Date(lease.endDate).toISOString().split('T')[0]
                    : '',
                moveOutNotice: [lease.moveOutNotice],
                serviceCharge: lease.serviceCharge
            })
        }
    }, [lease])

    const rentRaw = watch('rentAmount')
    const serviceChargeRaw = watch('serviceCharge')

    useEffect(() => {
        const s = String(rentRaw ?? '').replace(/[^0-9.]/g, '')
        if (rentRaw !== undefined && String(rentRaw) !== s) {
            setValue('rentAmount', s as any, { shouldValidate: true })
        }
    }, [rentRaw])

    useEffect(() => {
        const s = String(serviceChargeRaw ?? '').replace(/[^0-9.]/g, '')
        if (serviceChargeRaw !== undefined && String(serviceChargeRaw) !== s) {
            setValue('serviceCharge', s as any, { shouldValidate: true })
        }
    }, [serviceChargeRaw])

    const blockNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.']
        if (!allowed.includes(e.key) && !/[0-9]/.test(e.key)) {
            e.preventDefault()
        }
    }

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
                        onKeyDown={blockNonNumeric}
                        rules={{
                            pattern: {
                                value: /^[0-9]+(\.[0-9]+)?$/,
                                message: 'Enter a valid amount'
                            }
                        }}
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
                        onKeyDown={blockNonNumeric}
                        rules={{
                            pattern: {
                                value: /^[0-9]+(\.[0-9]+)?$/,
                                message: 'Enter a valid amount'
                            }
                        }}
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

export const LeaseInfo = ({ tenantId, unitId, activeId, onComplete }: { tenantId: string, unitId: string, activeId?: string, onComplete: () => void }) => {
    const [next, setNext] = useState(false)
    const [formData, setFormData] = useState<TenantLeaseFormData>()


    return <Box p={4} h={'fit'}>
        {next ?
            <UploadDocuments
                tenantId={tenantId}
                activeId={activeId}
                unitId={unitId}
                formData={formData!}
                onComplete={() => onComplete()} /> :
            <LeaseForm activeId={activeId} onNext={(next, payload) => { setNext(next); setFormData(payload) }} />}</Box>
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