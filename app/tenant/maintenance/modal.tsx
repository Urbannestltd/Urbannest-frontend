import { AddImage } from "@/components/ui/add-image"
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect, CustomTextarea } from "@/components/ui/custom-fields"
import { Divider } from "@/components/ui/divider"
import { MessageCard } from "@/components/ui/message-card"
import { PageTitle } from "@/components/ui/page-title"
import { MaintenanceRequestFormData } from "@/schema"
import { editMaintenancePayload, EditMaintenanceRequest, getMaintenancePayload, MaintenaceResponse, SubmitMaintanceRequest } from "@/services/maintenance"
import { useMaintenanceStore } from "@/store/maintenance"
import { Box, Button, createListCollection, Flex, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { LuImage } from "react-icons/lu"

export const TenantMaintenanceModal = ({ row }: { row?: MaintenaceResponse }) => {
    const { control, reset, handleSubmit, formState } = useForm<MaintenanceRequestFormData>()
    const messages = useMaintenanceStore(
        (state) => state.messagesByTicket[row?.id ?? '']
    ) ?? []

    const [files, setFiles] = useState<File[] | null>(null);
    const [edit, setEdit] = useState(false)
    const uploadedImages = files;

    const fetchMaintenanceMessages = useMaintenanceStore((state) => state.fetchMaintenanceMessages)



    const createmutation = useMutation({
        mutationFn: (data: getMaintenancePayload) => SubmitMaintanceRequest(data),
        onSuccess: () => {
            toast.success('Maintenance request created successfully')
            fetchMaintenanceMessages(row?.id ?? '')
            // Submit?.()
            reset()
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })
    const onSubmit = (data: MaintenanceRequestFormData) => {
        const payload: getMaintenancePayload = {
            subject: data.title,
            category: data.type[0].toUpperCase() ?? '',
            description: data.description,
            priority: 'HIGH',
        }
        if (uploadedImages?.[0]?.name) {
            payload.attachment = {
                filename: uploadedImages[0].name,
                folder: 'maintenance',
            }
        }
        console.log(payload)
        createmutation.mutate(payload)
    }


    const editmutation = useMutation({
        mutationFn: (data: editMaintenancePayload) => EditMaintenanceRequest(data),
        onSuccess: () => {
            toast.success('Maintenance request updated successfully')
            setEdit(false)
            fetchMaintenanceMessages(row?.id ?? '')
            // Submit?.()
            reset()
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })
    const onSave = (data: MaintenanceRequestFormData) => {
        const payload: editMaintenancePayload = {
            ticketId: row?.id ?? '',
            payload: {
                category: row?.category ?? '',
                subject: data.title ?? row?.subject ?? 'No Subject',
                description: data.description,
                priority: 'HIGH',
            }
        }
        if (uploadedImages?.[0]?.name) {
            payload.payload.attachment = {
                filename: uploadedImages[0].name,
                folder: 'maintenance',
            }
        }
        editmutation.mutate(payload)
    }



    const status = Status.find((status) => status.value === row?.status)
    return (
        <Box w={'full'} overflow={'hidden'} h={'fit'}>
            <div className="p-4">
                <PageTitle
                    fontSize={'18px'}
                    title={row ? "View Maintenance Request" : "Maintenance Request"}
                />
            </div>
            <Divider my={0} />
            <Flex h={'fit'} gap={8}>
                <form onSubmit={handleSubmit(row ? onSave : onSubmit)} className="p-4 h-full w-[90%]">
                    <div className="my-1">
                        {row ? (
                            <Box>
                                {edit ? <CustomInput
                                    name="title"
                                    width={"full"}
                                    value={row?.subject}
                                    required
                                    control={control}
                                    placeholder="Enter Request Subject"
                                /> : <Text className="satoshi-bold" onClick={() => setEdit(true)} fontSize={'22px'}>{row.subject || "No Subject"}</Text>}
                                <Text className="text-[#767676]" my={2} fontSize={'15px'}>22 Jan 2026, 17:34</Text>
                            </Box>
                        ) : (
                            <CustomInput
                                name="title"
                                width={"full"}
                                required
                                control={control}
                                placeholder="Enter Request Subject"
                            />
                        )}
                    </div>
                    <Flex
                        alignItems={"center"}
                        fontSize={"14px"}
                        fontWeight={"semibold"}
                        bg={status?.bgColor || "#E6E6E6"}
                        p={1}
                        px={4}
                        my={4}
                        rounded={"3xl"}
                        justify={"center"}
                        w={"fit"}
                    >
                        <Text
                            className="capitalize"
                            color={status?.textColor || "#757575"}
                            children={status?.label || "Request Status"}
                        />
                    </Flex>
                    <Box my={6} w={'148px'}>
                        <Text className="satoshi-bold" mb={2.5} fontSize={"18px"}>Issue Type</Text>
                        <CustomSelect triggerHeight="31px" readOnly alignCenter value={row?.category || ''} name='type' control={control} collection={Issue} placeholder="Issue Type" />
                    </Box>
                    <Box mt={6} mb={8} w={'full'}>
                        <Text className="satoshi-bold" mb={2.5} fontSize={"18px"}>Description</Text>
                        <CustomTextarea name='description' placeholder="Tell us more about the issue you’re experiencing" control={control} value={row?.description} />
                        <AddImage onFileChange={setFiles} />

                    </Box>
                    <MainButton loading={row ? editmutation.isPending : createmutation.isPending} disabled={(row ? editmutation.isPending : createmutation.isPending) || !formState.isDirty || !formState.isValid} type="submit" children={row ? "Save" : "Submit"} />
                </form>
                <Flex direction={'column'} justify={'space-between'} p={4} bg={'#FBFBFB'} border={'1px solid #EAEAEA'} w={'70%'}>
                    <PageTitle title="Activity & Comments" fontSize={'18px'} />
                    <MessageCard ticketId={row?.id} cardData={row ? messages : undefined} />
                </Flex>
            </Flex>
        </Box>
    )
}

const Status = [
    {
        value: "PENDING",
        label: "Pending",
        bgColor: "#FFF1C2",
        textColor: "#975102",
    },
    {
        value: "IN_PROGRESS",
        label: "In Progress",
        bgColor: "#D8E9F9",
        textColor: "#1976D2",
    },
    {
        value: "FIXED",
        label: "Fixed",
        bgColor: "#CFF7D3",
        textColor: "#02542D",
    },
    {
        value: "WORK_SCHEDULED",
        label: "Work Scheduled",
        bgColor: "#E6E6E6",
        textColor: "#757575",
    },
]


const Issue = createListCollection({
    items: [
        { value: 'ELECTRICAL', label: 'Electrical', },
        { value: 'PLUMBING', label: 'Plumbing' },
        { value: 'SECURITY', label: 'Security', },
        { value: 'CLEANING', label: 'Cleaning', },
        { value: 'HVAC', label: 'HVC/AC', },
        { value: 'BUILDING', label: 'Building (Walls, Doors, Windows, Ceiling)', },
        { value: 'SAFETY', label: 'Safety & Security', },
    ]
})