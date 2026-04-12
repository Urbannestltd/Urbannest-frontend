"use client"
import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { SectionBox } from "@/components/ui/section-box"
import { addPropertyFormData } from "@/schema/admin"
import {
    Box,
    Breadcrumb,
    Button,
    Center,
    createListCollection,
    Flex,
    Group,
    HStack,
    Input,
    Tag,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaCross, FaPlus } from "react-icons/fa"
import { LuCross, LuDelete, LuPlus, LuX } from "react-icons/lu"
import { MdDelete } from "react-icons/md"
import Page from "../[id]/page"
import { UploadGallery } from "@/components/ui/gallery-upload"
import { StoreFile } from "@/services/tenant/maintenance"
import { useMutation } from "@tanstack/react-query"
import { addProperty, AddPropertyPayload } from "@/services/admin/property"
import toast from "react-hot-toast"
import { da } from "zod/v4/locales"
import { useRouter } from "next/navigation"
import { set } from "lodash"

export default function NewProperty() {
    const { control, reset, handleSubmit, formState } = useForm<addPropertyFormData>()
    const [input, setInput] = useState("")
    const [amenities, setAmenities] = useState<string[]>([])
    const [files, setFiles] = useState<File[] | null>(null);
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = () => {
        const item = input.trim()
        if (!item) return
        setAmenities([item, ...amenities])
        setInput("")
    }
    const upload = async (): Promise<string[]> => {
        if (!files?.length) return []

        return Promise.all(
            files.map(file =>
                StoreFile({ file, folder: 'support' })
            )
        )
    }

    const mutation = useMutation({
        mutationFn: (payload: AddPropertyPayload) => addProperty(payload),
        onSuccess: () => {
            toast.success('Property added successfully')
            setIsLoading(false)
            reset()
            router.push('/admin/dashboard')
        },
        onError: () => {
            setIsLoading(false)
            toast.error('Something went wrong')
        }
    })

    const onSubmit = async (data: addPropertyFormData) => {
        const getUrls = async () => {
            try {
                setIsLoading(true)
                const result = await upload()
                return result
            } catch (e) {
                console.error(e)
                return []
            } finally {
                setIsLoading(false)
            }
        }

        const urls = await getUrls()


        const payload: AddPropertyPayload = {
            name: data.propertyName,
            type: data.propertyType?.[0]?.toUpperCase() ?? '',
            price: data.propertyPrice,
            address: data.propertyAddress,
            state: data.propertyState[0].toUpperCase(),
            city: data.propertyState[0].toUpperCase(),
            zip: '1000001',
            amenities: amenities.length ? amenities : [],
            images: urls.length ? urls : [],
            noOfFloors: data.noOfFloors,
            noOfUnitsPerFloor: data.noOfUnitsPerFloor,

        }
        mutation.mutate(payload)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} >
                <HStack justify={"space-between"}>
                    <Box>
                        <PageTitle title="Add New Property" fontSize={"20px"} />
                        <Breadcrumb.Root className="satoshi-medium">
                            <Breadcrumb.List>
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href="/admin/dashboard">
                                        Dashboard
                                    </Breadcrumb.Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator />
                                <Breadcrumb.Item>
                                    <Breadcrumb.CurrentLink>
                                        Add New Property
                                    </Breadcrumb.CurrentLink>
                                </Breadcrumb.Item>
                            </Breadcrumb.List>
                        </Breadcrumb.Root>
                    </Box>
                    <Flex w={"243px"} gap={2}>
                        <MainButton
                            size="lg"
                            fullWidth
                            variant="outline"
                            className="h-[39px]"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </MainButton>
                        <MainButton size="lg" type="submit" loading={mutation.isPending || isLoading} disabled={mutation.isPending || !formState.isValid} fullWidth className="h-[39px]">
                            Submit
                        </MainButton>
                    </Flex>
                </HStack>
                <Flex mt={"34px"} gap={8}>

                    <Box>
                        <SectionBox w={"728px"} p={4}>
                            <PageTitle title="Property Information" fontSize={"18px"} />
                            <Flex gap={4} mt={6}>
                                <CustomInput
                                    name="propertyName"
                                    width={"full"}
                                    required
                                    label="Property Name"
                                    control={control}
                                    placeholder="Property Name"
                                />
                                <CustomSelect
                                    name="propertyType"
                                    width={"full"}
                                    required
                                    label="Property Type"
                                    control={control}
                                    placeholder="Property Type"
                                    collection={itemsTypes}
                                />
                                <CustomInput
                                    name="propertyPrice"
                                    width={"full"}
                                    required
                                    label="Property Price"
                                    control={control}
                                    onKeyDown={(e) => {
                                        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "+"]
                                        if (!allowed.includes(e.key) && !/[0-9]/.test(e.key)) {
                                            e.preventDefault()
                                        }
                                    }} pattern={{
                                        value: /^[0-9]+$/,
                                        message: "Enter a valid price",
                                    }}
                                    placeholder="Property Price"
                                />
                            </Flex>
                            <Flex gap={4} mt={6}>
                                <CustomInput
                                    name="noOfFloors"
                                    width={"full"}
                                    required
                                    label="No of Floors"
                                    control={control}
                                    placeholder="No of Floors"
                                    onKeyDown={(e) => {
                                        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "+"]
                                        if (!allowed.includes(e.key) && !/[0-9]/.test(e.key)) {
                                            e.preventDefault()
                                        }
                                    }} pattern={{
                                        value: /^[0-9]+$/,
                                        message: "Enter a valid number",
                                    }}
                                />
                                <CustomInput
                                    name="noOfUnitsPerFloor"
                                    width={"full"}
                                    required
                                    label="No of Units per Floor"
                                    control={control}
                                    placeholder="No of Units per Floor"
                                    onKeyDown={(e) => {
                                        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "+"]
                                        if (!allowed.includes(e.key) && !/[0-9]/.test(e.key)) {
                                            e.preventDefault()
                                        }
                                    }} pattern={{
                                        value: /^[0-9]+$/,
                                        message: "Enter a valid number",
                                    }}
                                />
                            </Flex>
                            <Flex gap={4} mt={6}>
                                <CustomInput
                                    name="propertyAddress"
                                    width={"full"}
                                    required
                                    label="Property Address"
                                    control={control}
                                    placeholder="Property Address"
                                />
                                <CustomSelect
                                    name="propertyState"
                                    width={"full"}
                                    required
                                    label="State"
                                    control={control}
                                    collection={States}
                                    placeholder="State"
                                />
                            </Flex>
                        </SectionBox>
                        <SectionBox w={"728px"} mt={"34px"} p={4}>
                            <PageTitle title="Amenities" fontSize={"18px"} />
                            <Flex gap={4} mt={6}>
                                <Flex gap={2} mb={3}>
                                    <Flex gap={2} wrap={'wrap'}>
                                        {amenities.map((item, index) => (
                                            <Flex
                                                key={index}
                                                align="center"
                                                gap={1}
                                                px={3}
                                                position={'relative'}
                                                py={1}
                                                border="1px solid #D0D5DD"
                                                borderRadius="full"
                                                fontSize="14px"
                                            >
                                                <Text>{item}</Text>
                                                <Center
                                                    position={"absolute"}
                                                    zIndex={'popover'}
                                                    cursor={"pointer"}
                                                    top={-2}
                                                    right={-1}
                                                    rounded={"full"}
                                                    boxSize={"fit"}
                                                    color={"white"}
                                                    overflow={'hidden'}
                                                    p={0.5}
                                                    bg={"red.500"}
                                                    onClick={() => setAmenities(amenities.filter((_, i) => i !== index))}
                                                >
                                                    <LuX color="'white" size={12} />
                                                </Center>
                                            </Flex>
                                        ))}
                                    </Flex>
                                    <Group
                                        className="relative"
                                        border={"1px solid #D9D9D9"}
                                        rounded={"full"}
                                        w={"67px"}
                                        h={"30px"}
                                        justify={"center"}
                                        align={"center"}
                                    >
                                        <Input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                            placeholder="Add"
                                            size={"sm"}
                                            fontSize={'14px'}
                                            outline={"none"}
                                            textAlign={"center"}
                                            width={"full"}
                                        />
                                        <Center
                                            position={"absolute"}
                                            zIndex={'popover'}
                                            cursor={"pointer"}
                                            top={-2}
                                            right={-1}
                                            rounded={"full"}
                                            boxSize={"fit"}
                                            color={"white"}
                                            overflow={'hidden'}
                                            onClick={handleAdd}
                                            p={0.5}
                                            bg={"#14AE5C"}
                                        >
                                            <LuPlus color="'white" size={14} />
                                        </Center>
                                    </Group>
                                </Flex>
                            </Flex>
                        </SectionBox>
                    </Box>
                    <Box>
                        <SectionBox w={'376px'}>
                            <PageTitle mb={6} title="Property Details" fontSize={"18px"} />
                            <UploadGallery onFileChange={setFiles} />
                        </SectionBox>
                    </Box>

                </Flex>
            </form>
        </>
    )
}
const itemsTypes = createListCollection({
    items: [
        { value: "RESIDENTIAL", label: "Residential" },
        { value: "COMMERCIAL", label: "Commercial" },
    ],
})


const nigeriaStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
]

const States = createListCollection({
    items: nigeriaStates.map((state) => ({
        label: state,
        value: state.toUpperCase(),
    }))
})
