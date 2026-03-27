import { MultiBar } from "@/components/bar-chart/muti-bar"
import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatDate, formatDateRegular, formatNumber } from "@/services/date"
import { Box, Center, Flex, Grid, HStack, Image, Text } from "@chakra-ui/react"
import mapImage from '@/app/assets/images/map-image.png'
import rentImage from '@/app/assets/images/lease-image.png'
import { MainButton } from "@/components/ui/button"
import { LuEllipsisVertical, LuImage, LuMail, LuPhone } from "react-icons/lu"
import Pfp from '@/app/assets/images/user-avatar.png'
import { Avatar } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"
import { Property, usePropertyStore } from "@/store/admin/properties"
import { useEffect } from "react"

export const Overview = ({ property }: { property?: Property | null }) => {
    const Property = usePropertyStore((state) => state.property)
    const fetchProperty = usePropertyStore((state) => state.fetchProperty)
    const isLoading = usePropertyStore((state) => state.isLoading)

    useEffect(() => {
        if (property?.id) {
            fetchProperty(property.id)
        }
    }, [property?.id])
    const occupancy = (row: number | string) => {
        const value = typeof row === "string"
            ? parseFloat(row.replace("%", ""))
            : row

        if (isNaN(value)) return ''
        if (value >= 0 && value <= 49) return '#FEE9E7'
        if (value >= 50 && value <= 69) return '#FFFBEB'
        if (value >= 70) return '#EBFFEE'
        return ''
    }
    const complaints = (row: number | string) => {
        const value = typeof row === "string"
            ? parseFloat(row.replace("%", ""))
            : row

        if (value >= 0 && value <= 29) { return '#14AE5C' }
        if (value >= 30 && value <= 59) { return '#E8B931' }
        if (value >= 60) { return '#EC221F' }
        return ''
    }

    const stringtoNumber = (val: string | number | undefined) => {
        if (val === undefined || val === null) return 0
        return parseFloat(String(val).replace('%', '')) || 0
    }


    const PropertyContacts = [
        {
            title: 'Facility Manager',
            name: Property?.facilityManager?.name ?? 'N/A',
            email: Property?.facilityManager?.email ?? 'N/A',
            pfp: Property?.facilityManager?.photoUrl ?? Pfp.src
        },
        {
            title: 'Agent’s Details',
            name: 'Teniola Khadijah',
            email: 'Teniola.Khadijah@gmail.com',
            pfp: Pfp.src
        },
        {
            title: 'Owner’s Details',
            name: Property?.landlord?.name ?? '',
            email: Property?.landlord?.email ?? '',
            pfp: Property?.landlord?.photoUrl ?? Pfp.src
        }
    ]
    if (!Property) return null
    return (
        <Flex gap={8}>
            <Box>
                <SectionBox maxW={'748px'}>
                    <PageTitle title="Property Details" fontSize={'16px'} />
                    <Grid templateColumns={'repeat(3,1fr)'} gapX={2} gapY={4} mt={4} fontSize={'14px'} w={'full'} color={'#5A5A5A'}>
                        <SectionFlex gap={2} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Rental Price</Text>
                            <Text className="satoshi-bold" >{formatNumber(Property?.rentalPrice)}</Text>
                        </SectionFlex>
                        <SectionFlex gap={2} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium" >No of Floors</Text>
                            <Text>{Property?.noOfFloors}</Text>
                        </SectionFlex>
                        <SectionFlex gap={2} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium" >No Of Units</Text>
                            <Text className="satoshi-variable font-semibold">{Property?.noOfUnits}</Text>
                        </SectionFlex>
                        <SectionFlex gap={2} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Listed On</Text>
                            <Text className="satoshi-variable font-semibold">{formatDate(Property?.listedOn)}</Text>
                        </SectionFlex>
                        <SectionFlex gap={2} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Occupancy Rate (%)</Text>
                            <Center px={2} w={'50px'} rounded={'full'} bg={occupancy(Property?.occupancyRate ?? 0)}>
                                <Text>{Property?.occupancyRate}</Text>
                            </Center>
                        </SectionFlex>
                        <SectionFlex gap={5} h={'50px'} align={'center'} justify={'space-between'}>
                            <Text className="satoshi-medium">Complaints</Text>
                            <Progress
                                showValueText
                                valueText={`${Property?.complaintsPercentage ?? 0}`}
                                value={stringtoNumber(String(Property?.complaintsPercentage ?? '0'))}
                                color={complaints(Property?.complaintsPercentage ?? 0)}
                            />
                        </SectionFlex>

                    </Grid>
                </SectionBox>
                <SectionBox mt={6} w={'748px'}>
                    <MultiBar loading={isLoading} chartData={Property.rentalRevenue} />
                </SectionBox>
                <SectionBox mt={6} pb={7} w={'748px'}>
                    <PageTitle title="Amenities" fontSize={'16px'} />
                    <Flex gap={2} mt={4} wrap={'wrap'}>
                        {Property?.amenities.length === 0 && <Text className="satoshi-bold text-center w-full place-self-center text-[#5A5A5A]">No Amenities Listed</Text>}
                        {Property?.amenities.map((item, index) => {

                            return (
                                <Center fontSize={'14px'} key={index} className="satoshi-medium px-5 py-1 border border-[#D9D9D9] rounded-full text-[#5A5A5A]">{item}</Center>
                            )
                        })}
                    </Flex>
                </SectionBox>
                <SectionBox mt={6} pb={7}>
                    <PageTitle title="Google Maps" fontSize={'16px'} />
                    <Image className="rounded-lg w-[718px] h-[393.3px] mt-6 object-cover" src={mapImage.src} alt="Map Image" />
                </SectionBox>
            </Box>
            <Box w={'376px'}>
                <SectionBox w={'full'}>
                    <PageTitle title="Images" fontSize={'16px'} />
                    <Box w={'full'}>
                        <Image src={rentImage.src} className="w-full h-[177px] rounded-lg mt-2" alt="Property Image 1" />
                        <HStack mt={2} justify={'center'} w={'full'} mb={6}>
                            <Image src={rentImage.src} className="w-[31%] h-[93px] rounded-lg" alt="Property Image 2" />
                            <Image src={rentImage.src} className="w-[31%] h-[93px] rounded-lg" alt="Property Image 3" />
                            <Image src={rentImage.src} className="w-[31%] h-[93px] rounded-lg" alt="Property Image 4" />
                        </HStack>
                        <MainButton icon={<LuImage />} size='lg' variant='outline'>See All Images ({Property?.images.length})</MainButton>
                    </Box>
                </SectionBox>
                <SectionBox mt={6}>
                    {
                        PropertyContacts.map((contact, index) => (
                            <Box key={index}>
                                <HStack justify={'space-between'}>
                                    <Text fontSize={'12px'} textTransform={'uppercase'} color={'#757575'} className="satoshi-bold tracking-[1.1px]">{contact.title}</Text>
                                    <LuEllipsisVertical />
                                </HStack>
                                <Flex mt={4} justify={'start'}>
                                    <Avatar size={'lg'} src={contact.pfp} />
                                    <Box ml={'11px'} w={'full'}>
                                        <Box >
                                            <Text fontSize={'14px'} className="satoshi-bold">{contact.name}</Text>
                                            <Text fontSize={'11px'} color={'#010F0D'}>{contact.email}</Text>
                                        </Box>
                                        <Flex mt={3} gap={2}>
                                            <MainButton size='lg' variant='ghost' className="px-1 h-[29px]" icon={<LuPhone />}>Call</MainButton>
                                            <MainButton size='lg' variant='ghost' className="px-1 h-[29px]" icon={<LuMail />}>Email</MainButton>
                                        </Flex>
                                    </Box>
                                </Flex>

                                {index !== 2 && <Divider my={6} />}
                            </Box>
                        ))
                    }
                </SectionBox>
            </Box>
        </Flex>
    )
}

const Amenities = [
    'Gym', 'Elevator', '24/7 security', 'CCTV surveillance', 'Fire sprinklers', 'Cleaning services', 'Central HVAC', 'Backup power', 'Pantry/kitchenette', 'Parking Garage'
]
