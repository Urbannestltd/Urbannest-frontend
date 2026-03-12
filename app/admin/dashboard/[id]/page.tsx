'use client'
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { useParams } from "next/navigation"
import { propertiess } from "@/utils/data";
import { PropertyTabs } from "./tabs";

export default function Page() {
    const params = useParams()
    const property = propertiess.find(property => property.unitId === params.id)

    return (<div>
        <Flex direction={{ base: 'column', md: 'row' }} mb={12} justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
            <HStack>
                <Image src={rentImage.src} mr={3} w={{ base: '100px', md: '165px' }} rounded={'8px'} h={{ base: '60px', md: '80px' }} alt="rent" />

                <Box>
                    <Text className="satoshi-bold text-[20px] md:text-[24px]"> {property?.name}</Text>
                    <HStack>
                        <Image alt="location-icon" src={locateIcon.src} />
                        <Text className="satoshi-medium text-[12px] lg:text-[14px]  mt-0 ">
                            {property?.address}
                        </Text>
                    </HStack>
                    <Text className="satoshi-medium">Last Updated: 1 March, 2026</Text>
                </Box>
            </HStack>
            <MainButton icon={<FiEdit />} children="Edit" />
        </Flex>
        <PropertyTabs property={property} />
    </div >
    )
}