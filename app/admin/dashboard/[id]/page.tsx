'use client'
import { Box, Breadcrumb, Flex, HStack, Image, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { useParams } from "next/navigation"
import { propertiess } from "@/utils/data";
import { PropertyTabs } from "./tabs";
import { useQueryClient } from "@tanstack/react-query";
import { Property, usePropertyStore } from "@/store/admin/properties";

export default function Page() {
    const property = usePropertyStore((state) => state.selectedProperty)

    return (<div>
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="/admin/dashboard">Dashboard</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Property Details</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.CurrentLink>Overview</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
        <Flex direction={{ base: 'column', md: 'row' }} mb={12} mt={4} justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
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