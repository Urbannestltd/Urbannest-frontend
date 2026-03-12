import { MultiBar } from "@/components/bar-chart/muti-bar"
import { PageTitle } from "@/components/ui/page-title"
import { Progress } from "@/components/ui/progress-bar"
import { SectionBox, SectionFlex } from "@/components/ui/section-box"
import { formatDateRegular, formatNumber } from "@/services/date"
import { Properties } from "@/utils/model"
import { Box, Center, Flex, HStack, Text } from "@chakra-ui/react"
import Image from "next/image"
import mapImage from '@/app/assets/images/map-image.png'
import rentImage from '@/app/assets/images/lease-image.png'
import { MainButton } from "@/components/ui/button"
import { LuEllipsisVertical, LuImage, LuMail, LuPhone } from "react-icons/lu"
import Pfp from '@/app/assets/images/user-avatar.png'
import { Avatar } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"

export const Overview = ({ property }: { property?: Properties }) => {
    const occupancy = (row: number) => {
        if (row >= 0 && row <= 49) { return '#FEE9E7' }
        if (row >= 50 && row <= 69) { return '#FFFBEB' }
        if (row >= 70) { return '#EBFFEE' }
        return ''
    }
    const complaints = (row: number) => {
        if (row >= 0 && row <= 29) { return '#14AE5C' }
        if (row >= 30 && row <= 59) { return '#E8B931' }
        if (row >= 69) { return '#EC221F' }
        return ''
    }
    return (
        <Flex gap={8}>
            <Box>
                <SectionBox maxW={'748px'}>
                    <PageTitle title="Property Details" fontSize={'16px'} />
                    <Flex wrap={'wrap'} gapX={4} gapY={4} mt={4} w={'full'} color={'#5A5A5A'}>
                        <SectionFlex gap={5} h={'50px'} align={'center'} minW={'217px'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Rental Price</Text>
                            <Text className="satoshi-bold" >{formatNumber(property?.rent)}</Text>
                        </SectionFlex>
                        <SectionFlex gap={5} h={'50px'} align={'center'} minW={'217px'} justify={'space-between'}>
                            <Text className="satoshi-medium" >No Of Units</Text>
                            <Text className="satoshi-variable font-semibold">{property?.noOfUnits}</Text>
                        </SectionFlex>
                        <SectionFlex gap={5} h={'50px'} align={'center'} minW={'217px'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Listed On</Text>
                            <Text className="satoshi-variable font-semibold">{formatDateRegular(property?.date)}</Text>
                        </SectionFlex>
                        <SectionFlex gap={5} h={'50px'} align={'center'} w={'337px'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Occupancy Rate (%)</Text>
                            <Center px={2} w={'50px'} rounded={'full'} bg={occupancy(property?.occupancy ?? 0)}>
                                <Text>{property?.occupancy}%</Text>
                            </Center>
                        </SectionFlex>
                        <SectionFlex gap={5} h={'50px'} align={'center'} w={'337px'} justify={'space-between'}>
                            <Text className="satoshi-medium" >Complaints</Text>
                            <Progress showValueText value={property?.complaints} color={complaints(property?.complaints ?? 0)} info={property?.complaints} />
                        </SectionFlex>
                    </Flex>
                </SectionBox>
                <SectionBox mt={6} w={'748px'}>
                    <MultiBar />
                </SectionBox>
                <SectionBox mt={6} pb={7} w={'748px'}>
                    <PageTitle title="Amenities" fontSize={'16px'} />
                    <Flex gap={2} mt={4} wrap={'wrap'}>
                        {Amenities.map((item, index) => (
                            <Center fontSize={'14px'} key={index} className="satoshi-medium px-5 py-1 border border-[#D9D9D9] rounded-full text-[#5A5A5A]">{item}</Center>
                        ))}
                    </Flex>
                </SectionBox>
                <SectionBox mt={6} pb={7}>
                    <PageTitle title="Google Maps" fontSize={'16px'} />
                    <Image className="rounded-lg w-[718px] h-[393.3px] mt-6 object-cover" src={mapImage} alt="Map Image" />
                </SectionBox>
            </Box>
            <Box>
                <SectionBox>
                    <PageTitle title="Images" fontSize={'16px'} />
                    <Box>
                        <Image src={rentImage} className="w-[346px] h-[177px] rounded-lg mt-2" alt="Property Image 1" />
                        <HStack mt={2} mb={6}>
                            <Image src={rentImage} className="size-[110px] rounded-lg" alt="Property Image 2" />
                            <Image src={rentImage} className="size-[110px] rounded-lg" alt="Property Image 3" />
                            <Image src={rentImage} className="size-[110px] rounded-lg" alt="Property Image 4" />
                        </HStack>
                        <MainButton icon={<LuImage />} size='lg' variant='outline'>See All Images (12)</MainButton>
                    </Box>
                </SectionBox>
                <SectionBox mt={6}>
                    {
                        PropertyContacts.map((contact, index) => (
                            <Box key={index}>
                                <HStack justify={'space-between'}>
                                    <PageTitle title={contact.title} fontSize={'16px'} />
                                    <LuEllipsisVertical />
                                </HStack>
                                <Flex mt={4} justify={'start'}>
                                    <Avatar size={'lg'} src={contact.pfp.src} />
                                    <Box ml={'11px'} w={'full'}>
                                        <Box >
                                            <Text className="satoshi-bold">{contact.name}</Text>
                                            <Text mt={1} color={'#010F0D'}>{contact.email}</Text>
                                        </Box>
                                        <Flex mt={3} gap={2}>
                                            <MainButton size='lg' icon={<LuPhone />}>Contact</MainButton>
                                            <MainButton size='lg' variant="outline" icon={<LuMail />}>Send Email</MainButton>
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

const PropertyContacts = [
    {
        title: 'Facility Manager',
        name: 'Teniola Khadijah',
        email: 'Teniola.Khadijah@gmail.com',
        pfp: Pfp
    },
    {
        title: 'Agent’s Details',
        name: 'Teniola Khadijah',
        email: 'Teniola.Khadijah@gmail.com',
        pfp: Pfp
    },
    {
        title: 'Owner’s Details',
        name: 'Teniola Khadijah',
        email: 'Teniola.Khadijah@gmail.com',
        pfp: Pfp
    }
]