'use client'
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { useParams } from "next/navigation"

export default function Page() {
    const params = useParams()

    return (<div>{params.id}

        <Flex direction={{ base: 'column', md: 'row' }} justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
            <HStack>
                <Image src={rentImage.src} mr={3} w={{ base: '100px', md: '165px' }} rounded={'8px'} h={{ base: '60px', md: '80px' }} alt="rent" />

                <Box>
                    <Text className="satoshi-bold text-[20px] md:text-[24px]"> {params.id}</Text>
                    <HStack>
                        <Image alt="location-icon" src={locateIcon.src} />
                        <Text className="satoshi-medium text-[12px] lg:text-[14px]  mt-0 ">m</Text>
                    </HStack>
                </Box>
            </HStack>
            <MainButton icon={<FiEdit />} children="Edit" />
        </Flex></div >
    )
}