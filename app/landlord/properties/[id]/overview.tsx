/* eslint-disable react/display-name, react-hooks/set-state-in-effect */
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
import React, { useEffect, useImperativeHandle, useState } from "react"
import { ImageSlot } from "@/components/ui/image-slot"
import { Controller, useForm } from "react-hook-form"
import { CustomEditable } from "@/components/ui/custom-fields"
import { addPropertyFormData, editPropertyFormData } from "@/schema/admin"
import { StoreFile } from "@/services/tenant/maintenance"
import { Property, usePropertyStore } from "@/store/landlord/properties"

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
    const isLoading = usePropertyStore((state) => state.isLoadingProperty)
    const { control, reset, getValues, watch } = useForm<editPropertyFormData>({
        defaultValues: {
            price: property?.rentalPrice,
        }
    })
    const [amenities, setAmenities] = useState<string[]>([])
    const isMobile = window.innerWidth < 600

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
            Property.images
        }
        if (Property?.amenities?.length) {
            setAmenities(Property.amenities)
        }
        if (Property) {
            reset({
                price: Property.rentalPrice,
                // ...any other fields
            })
        }
    }, [Property])
    useEffect(() => { }, [Property?.amenities])


    if (!Property) return null

    return (
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            <Box w={{ base: 'full', md: "65%" }}>
                {isMobile
                    ?
                    <Box spaceY={2}>
                        <Grid gap={3} templateColumns={'repeat(2,1fr)'}>
                            <SectionBox
                                spaceY={1}
                                borderColor={'#F4F4F4'}
                            >
                                <Text className="satoshi-medium text-xs text-[#5A6061]">Rental Price</Text>

                                <Text className="satoshi-bold text-sm">
                                    {formatNumber(Property?.rentalPrice)}
                                </Text>
                            </SectionBox>
                            <SectionBox
                                spaceY={1}
                                borderColor={'#F4F4F4'}
                            >
                                <Text className="satoshi-medium text-xs text-[#5A6061]">No of Floors</Text>

                                <Text className="satoshi-bold text-sm">{Property?.noOfFloors}</Text>
                            </SectionBox>
                            <SectionBox
                                spaceY={1}
                                borderColor={'#F4F4F4'}
                            >
                                <Text className="satoshi-medium text-xs text-[#5A6061]">No Of Units</Text>

                                <Text className="satoshi-variable text-sm font-semibold">
                                    {Property?.noOfUnits}
                                </Text>
                            </SectionBox>
                            <SectionBox
                                spaceY={1}
                                borderColor={'#F4F4F4'}
                            >
                                <Text className="satoshi-medium text-xs text-[#5A6061]">Listed On</Text>
                                <Text className="satoshi-variable text-sm font-semibold">
                                    {formatDate(Property?.listedOn)}
                                </Text>
                            </SectionBox>
                        </Grid>
                        <SectionFlex
                            gap={2}
                            h={"54px"}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Text className="satoshi-medium text-sm">Occupancy Rate</Text>
                            <Center
                                px={2}
                                w={"50px"}
                                rounded={"full"}
                                fontSize={'sm'}
                                bg={occupancy(Property?.occupancyRate ?? 0)}
                            >
                                <Text>{Property?.occupancyRate}</Text>
                            </Center>
                        </SectionFlex>
                        <SectionFlex
                            gap={5}
                            h={"fit"}
                            align={"center"}
                            direction={'column'}
                            justify={"space-between"}
                        >
                            <HStack w={'full'} justify={'space-between'}>
                                <Text className="satoshi-medium text-sm">Complaints</Text>
                                <Text className="satoshi-medium text-sm">
                                    {Property?.complaintsPercentage}
                                </Text>

                            </HStack>

                            <div className="w-full">
                                <Progress
                                    valueText={`${Property?.complaintsPercentage ?? 0}`}
                                    value={stringtoNumber(
                                        String(Property?.complaintsPercentage ?? "0"),
                                    )}
                                    color={complaints(Property?.complaintsPercentage ?? 0)}
                                />
                            </div>
                        </SectionFlex>

                    </Box>
                    : <SectionBox maxW={"100%"}>
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
                                borderColor={edit ? "#2A3348" : '#F4F4F4'}
                                justify={"space-between"}
                            >
                                <Text className="satoshi-medium">Rental Price</Text>

                                <Text className="satoshi-bold">
                                    {formatNumber(Property?.rentalPrice)}
                                </Text>
                            </SectionFlex>
                            <SectionFlex
                                gap={2}
                                h={"50px"}
                                align={"center"}
                                justify={"space-between"}
                            >
                                <Text className="satoshi-medium">No of Floors</Text>

                                <Text>{Property?.noOfFloors}</Text>
                            </SectionFlex>
                            <SectionFlex
                                gap={2}
                                h={"50px"}
                                align={"center"}
                                justify={"space-between"}
                            >
                                <Text className="satoshi-medium">No Of Units</Text>

                                <Text className="satoshi-variable font-semibold">
                                    {Property?.noOfUnits}
                                </Text>
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
                                <div className="w-full">
                                    <Progress
                                        showValueText
                                        valueText={`${Property?.complaintsPercentage ?? 0}`}
                                        value={stringtoNumber(
                                            String(Property?.complaintsPercentage ?? "0"),
                                        )}
                                        color={complaints(Property?.complaintsPercentage ?? 0)}
                                    />
                                </div>
                            </SectionFlex>
                        </Grid>
                    </SectionBox>}
                <SectionBox mt={6} pb={7} w={{ base: 'full' }}>
                    <PageTitle title="Amenities" fontSize={"16px"} />
                    <Flex gap={2} mt={4} wrap={"wrap"}>
                        {Property?.amenities.length === 0 && !edit && !isLoading && (
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
                    </Flex>
                </SectionBox>

            </Box>
            <Box w={{ base: 'full', md: "30%" }}>
                <SectionBox w={"full"}>
                    <PageTitle title="Images" fontSize={"16px"} />
                    <Box w={"full"}>
                        <ImageSlot
                            src={Property?.images[0]}
                            className="w-full h-[177px] rounded-lg mt-2"
                            alt="Property Image 1"
                        />
                        <HStack mt={2} justify={"center"} w={"full"} mb={6}>
                            {[1, 2, 3].map((i) => (
                                <ImageSlot
                                    key={i}
                                    src={Property?.images[i]}
                                    className="w-[33%] md:w-[31%] h-[93px] rounded-lg"
                                    alt={`Property Image ${i + 1}`}
                                />
                            ))}
                        </HStack>
                        <MainButton icon={<LuImage />} size="lg" variant="outline">
                            See All Images ({Property?.images.length})
                        </MainButton>
                    </Box>
                </SectionBox>
            </Box>
        </Flex >
    )
})
