import { MultiBar } from "@/components/bar-chart/muti-bar"
import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatDate, formatDateRegular, formatNumber } from "@/services/date"
import {
    Box,
    Center,
    Editable,
    Flex,
    Grid,
    Group,
    HStack,
    Image,
    Input,
    Text,
} from "@chakra-ui/react"
import mapImage from "@/app/assets/images/map-image.png"
import rentImage from "@/app/assets/images/lease-image.png"
import { MainButton } from "@/components/ui/button"
import {
    LuEllipsisVertical,
    LuImage,
    LuMail,
    LuPhone,
    LuPlus,
    LuUpload,
    LuX,
} from "react-icons/lu"
import Pfp from "@/app/assets/images/user-avatar.png"
import { Avatar } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"
import { Property, usePropertyStore } from "@/store/admin/properties"
import React, { useEffect, useImperativeHandle, useState } from "react"
import { ImageSlot } from "@/components/ui/image-slot"
import { Controller, useForm } from "react-hook-form"
import { CustomEditable } from "@/components/ui/custom-fields"
import { addPropertyFormData, editPropertyFormData } from "@/schema/admin"
import { StoreFile } from "@/services/tenant/maintenance"

interface OverviewProps {
    property?: Property | null
    edit?: boolean
    onSave?: (details: {
        amenities: string[],
        formValues: editPropertyFormData
        images: string[]
    }) => void
}
export const Overview = React.forwardRef<{ handleSave: () => void }, OverviewProps>(({
    property,
    edit,
    onSave,
}, ref) => {
    const Property = usePropertyStore((state) => state.property)
    const fetchProperty = usePropertyStore((state) => state.fetchProperty)
    const isLoading = usePropertyStore((state) => state.isLoading)
    const { control, reset, getValues, watch } = useForm<editPropertyFormData>({
        defaultValues: {
            price: property?.rentalPrice,
            noOfFloors: property?.noOfFloors,
            noOfUnits: property?.noOfUnits,
        }
    })
    const [amenities, setAmenities] = useState<string[]>([])
    const [input, setInput] = useState("")
    const suggestions = [
        "Swimming Pool",
        "Gym",
        "Parking",
        "24/7 Security",
        "Elevator",
        "CCTV surveillance",
        "Fire sprinklers",
        "Cleaning services",
        "Central HVAC",
        "Backup power",
        "Pantry/kitchenette",
        "Parking Garage",
    ]

    useEffect(() => {
        if (property?.id) {
            fetchProperty(property.id)
        }
    }, [property?.id])
    const occupancy = (row: number | string) => {
        const value =
            typeof row === "string" ? parseFloat(row.replace("%", "")) : row

        if (isNaN(value)) return ""
        if (value >= 0 && value <= 49) return "#FEE9E7"
        if (value >= 50 && value <= 69) return "#FFFBEB"
        if (value >= 70) return "#EBFFEE"
        return ""
    }
    const complaints = (row: number | string) => {
        const value =
            typeof row === "string" ? parseFloat(row.replace("%", "")) : row

        if (value >= 0 && value <= 29) {
            return "#EC221F"
        }
        if (value >= 30 && value <= 59) {
            return "#E8B931"
        }
        if (value >= 60) {
            return "#14AE5C"
        }
        return ""
    }

    const stringtoNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace("%", "")) || 0
    }
    useEffect(() => {
        if (Property?.images?.length) {
            setImages(Property.images)
        }
        if (Property?.amenities?.length) {
            setAmenities(Property.amenities)
        }
        if (Property) {
            reset({
                price: Property.rentalPrice,
                noOfFloors: Property.noOfFloors,
                noOfUnits: Property.noOfUnits,
                // ...any other fields
            })
        }
    }, [Property])
    useEffect(() => { }, [Property?.amenities])

    const handleAddAmenities = (value: string) => {
        const item = value.trim()
        if (!item || amenities.includes(item)) return
        setAmenities([...amenities, item])
        setInput("")
    }
    const [images, setImages] = useState<string[]>(Property?.images ?? [])

    const handleDelete = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }



    const handleAdd = async (file: File) => {
        const url = await StoreFile({ file, folder: 'property' })
        setImages([...images, url])
    }


    const handleSave = () => {
        const formValues = watch()
        onSave?.({ amenities, images, formValues })
    }

    useImperativeHandle(ref, () => ({ handleSave }))


    const PropertyContacts = [
        {
            title: "Facility Manager",
            name: Property?.facilityManager?.name ?? "N/A",
            email: Property?.facilityManager?.email ?? "N/A",
            pfp: Property?.facilityManager?.photoUrl ?? Pfp.src,
        },
        {
            title: "Agent’s Details",
            name: "Teniola Khadijah",
            email: "Teniola.Khadijah@gmail.com",
            pfp: Pfp.src,
        },
        {
            title: "Owner’s Details",
            name: Property?.landlord?.name ?? "",
            email: Property?.landlord?.email ?? "",
            pfp: Property?.landlord?.photoUrl ?? Pfp.src,
        },
    ]
    if (!Property) return null

    return (
        <Flex gap={8}>
            <Box>
                <SectionBox maxW={"748px"}>
                    <PageTitle title="Property Details" fontSize={"16px"} />
                    <Grid
                        templateColumns={"repeat(3,1fr)"}
                        gapX={2}
                        gapY={4}
                        mt={4}
                        fontSize={"14px"}
                        w={"full"}
                        color={"#5A5A5A"}
                    >
                        <SectionFlex
                            gap={2}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">Rental Price</Text>
                            {edit ? (
                                <CustomEditable
                                    key={`propertyPrice-${Property?.rentalPrice}`}
                                    name='price'
                                    control={control}
                                    value={property?.rentalPrice}
                                />
                            ) : (
                                <Text className="satoshi-bold">
                                    {formatNumber(Property?.rentalPrice)}
                                </Text>
                            )}
                        </SectionFlex>
                        <SectionFlex
                            gap={2}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">No of Floors</Text>
                            {edit ? (
                                <CustomEditable
                                    key={`noOfFloors-${Property?.noOfFloors}`}
                                    name="noOfFloors"
                                    control={control}
                                    value={property?.noOfFloors}
                                />
                            ) : (
                                <Text>{Property?.noOfFloors}</Text>
                            )}
                        </SectionFlex>
                        <SectionFlex
                            gap={2}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">No Of Units</Text>
                            {edit ? (
                                <CustomEditable
                                    key={`noOfUnits-${Property?.noOfUnits}`}
                                    name='noOfUnits'
                                    control={control}
                                    value={property?.noOfUnits}
                                />
                            ) : (
                                <Text className="satoshi-variable font-semibold">
                                    {Property?.noOfUnits}
                                </Text>
                            )}
                        </SectionFlex>
                        <SectionFlex
                            gap={2}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">Listed On</Text>
                            <Text className="satoshi-variable font-semibold">
                                {formatDate(Property?.listedOn)}
                            </Text>
                        </SectionFlex>
                        <SectionFlex
                            gap={2}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">Occupancy Rate (%)</Text>
                            <Center
                                px={2}
                                w={"50px"}
                                rounded={"full"}
                                bg={occupancy(Property?.occupancyRate ?? 0)}
                            >
                                <Text>{Property?.occupancyRate}</Text>
                            </Center>
                        </SectionFlex>
                        <SectionFlex
                            gap={5}
                            h={"50px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium">Complaints</Text>
                            <Progress
                                showValueText
                                valueText={`${Property?.complaintsPercentage ?? 0}`}
                                value={stringtoNumber(
                                    String(Property?.complaintsPercentage ?? "0"),
                                )}
                                color={complaints(Property?.complaintsPercentage ?? 0)}
                            />
                        </SectionFlex>
                    </Grid>
                </SectionBox>
                <SectionBox mt={6} w={"748px"}>
                    <MultiBar loading={isLoading} chartData={Property.rentalRevenue} />
                </SectionBox>
                <SectionBox mt={6} pb={7} w={"748px"}>
                    <PageTitle title="Amenities" fontSize={"16px"} />
                    <Flex gap={2} mt={4} wrap={"wrap"}>
                        {Property?.amenities.length === 0 && !edit && (
                            <Text className="satoshi-bold text-center w-full place-self-center text-[#5A5A5A]">
                                No Amenities Listed
                            </Text>
                        )}
                        {amenities.map((item, index) => {
                            return (
                                <Flex
                                    key={index}
                                    align="center"
                                    gap={1}
                                    px={3}
                                    position={"relative"}
                                    py={1}
                                    border="1px solid #D0D5DD"
                                    borderRadius="full"
                                    fontSize="14px"
                                    className="satoshi-medium px-5 py-1 border border-[#D9D9D9] rounded-full text-[#5A5A5A]"
                                >
                                    {item}
                                    {edit && (
                                        <Center
                                            position={"absolute"}
                                            zIndex={"popover"}
                                            cursor={"pointer"}
                                            top={-2}
                                            right={-1}
                                            rounded={"full"}
                                            boxSize={"fit"}
                                            color={"white"}
                                            overflow={"hidden"}
                                            p={0.5}
                                            bg={"red.500"}
                                            onClick={() =>
                                                setAmenities(amenities.filter((_, i) => i !== index))
                                            }
                                        >
                                            <LuX color="'white" size={12} />
                                        </Center>
                                    )}
                                </Flex>
                            )
                        })}
                        {edit && (
                            <Box mt={3}>
                                <Text mb={2} className="satoshi-bold font-md">
                                    Add Amenities
                                </Text>
                                {/* Suggestions */}
                                <Flex gap={2} flexWrap={"wrap"} mb={3}>
                                    {suggestions
                                        .filter((s) => !amenities.includes(s))
                                        .map((suggestion) => (
                                            <Flex
                                                as="button"
                                                key={suggestion}
                                                onClick={() => handleAddAmenities(suggestion)}
                                                align="center"
                                                gap={1}
                                                px={3}
                                                position={"relative"}
                                                py={1}
                                                border="1px solid #D0D5DD"
                                                borderRadius="full"
                                                cursor={"pointer"}
                                                fontSize="14px"
                                                _hover={{
                                                    border: "0.94px solid #CFAA67",
                                                }}
                                            >
                                                {suggestion}
                                            </Flex>
                                        ))}
                                    <Group
                                        border={"1px solid #D9D9D9"}
                                        rounded={"full"}
                                        w={"67px"}
                                        h={"30px"}
                                        justify={"center"}
                                        align={"center"}
                                        position={"relative"}
                                    >
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && handleAddAmenities(input)
                                            }
                                            placeholder="Add"
                                            size={"sm"}
                                            textAlign={"center"}
                                            fontSize={"sm"}
                                            _focus={{ outline: "none" }}
                                            width={"full"}
                                        />
                                        <Center
                                            position={"absolute"}
                                            cursor={"pointer"}
                                            top={-2}
                                            right={0}
                                            rounded={"full"}
                                            p={0.5}
                                            bg={"#14AE5C"}
                                            onClick={() => handleAddAmenities(input)}
                                        >
                                            <LuPlus color="white" size={14} />
                                        </Center>
                                    </Group>
                                </Flex>
                            </Box>
                        )}
                    </Flex>
                </SectionBox>
                <SectionBox mt={6} pb={7}>
                    <PageTitle title="Google Maps" fontSize={"16px"} />
                    <Image
                        className="rounded-lg w-[718px] h-[393.3px] mt-6 object-cover"
                        src={mapImage.src}
                        alt="Map Image"
                    />
                </SectionBox>
            </Box>
            <Box w={"376px"}>
                <SectionBox w={"full"}>
                    <PageTitle title="Images" fontSize={"16px"} />
                    <Box w={"full"}>
                        <ImageSlot
                            src={images[0]}
                            className="w-full h-[177px] rounded-lg mt-2"
                            alt="Property Image 1"
                            editMode={edit}
                            onDelete={() => handleDelete(0)}
                        />
                        <HStack mt={2} justify={"center"} w={"full"} mb={6}>
                            {[1, 2, 3].map((i) => (
                                <ImageSlot
                                    key={i}
                                    src={images[i]}
                                    className="w-[31%] h-[93px] rounded-lg"
                                    alt={`Property Image ${i + 1}`}
                                    editMode={edit}
                                    onDelete={() => handleDelete(i)}
                                />
                            ))}
                        </HStack>
                        {edit && images.length < 4 ? (
                            <MainButton variant="outline" size="lg" icon={<LuImage />}>
                                <label style={{ cursor: "pointer" }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleAdd(file)
                                        }}
                                    />


                                    Add Image</label>
                            </MainButton>

                        ) : (
                            <MainButton icon={<LuImage />} size="lg" variant="outline">
                                See All Images ({images.length})
                            </MainButton>
                        )}
                    </Box>
                </SectionBox>
                <SectionBox mt={6}>
                    {PropertyContacts.map((contact, index) => (
                        <Box key={index}>
                            <HStack justify={"space-between"}>
                                <Text
                                    fontSize={"12px"}
                                    textTransform={"uppercase"}
                                    color={"#757575"}
                                    className="satoshi-bold tracking-[1.1px]"
                                >
                                    {contact.title}
                                </Text>
                                <LuEllipsisVertical />
                            </HStack>
                            <Flex mt={4} justify={"start"}>
                                <Avatar size={"lg"} src={contact.pfp} />
                                <Box ml={"11px"} w={"full"}>
                                    <Box>
                                        <Text fontSize={"14px"} className="satoshi-bold">
                                            {contact.name}
                                        </Text>
                                        <Text fontSize={"11px"} color={"#010F0D"}>
                                            {contact.email}
                                        </Text>
                                    </Box>
                                    <Flex mt={3} gap={2}>
                                        <MainButton
                                            size="lg"
                                            variant="ghost"
                                            className="px-1 h-[29px]"
                                            icon={<LuPhone />}
                                        >
                                            Call
                                        </MainButton>
                                        <MainButton
                                            size="lg"
                                            variant="ghost"
                                            className="px-1 h-[29px]"
                                            icon={<LuMail />}
                                        >
                                            Email
                                        </MainButton>
                                    </Flex>
                                </Box>
                            </Flex>

                            {index !== 2 && <Divider my={6} />}
                        </Box>
                    ))}
                </SectionBox>
            </Box>
        </Flex>
    )
})

const Amenities = [
    "Gym",
    "Elevator",
    "24/7 security",
    "CCTV surveillance",
    "Fire sprinklers",
    "Cleaning services",
    "Central HVAC",
    "Backup power",
    "Pantry/kitchenette",
    "Parking Garage",
]
