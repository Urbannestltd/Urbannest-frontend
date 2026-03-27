'use client'
import { Box, Breadcrumb, Flex, HStack, Image, SkeletonText, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { PropertyTabs } from "./tabs";
import { usePropertyStore } from "@/store/admin/properties";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";



export default function Page() {
    const params = useParams();
    const id = params?.id as string;

    const property = usePropertyStore((state) => state.property)
    const fetchProperty = usePropertyStore((state) => state.fetchProperty)
    const isLoading = usePropertyStore((state) => state.isLoading)
    const [selectedTab, setSelectedTab] = useState('Overview')

    useEffect(() => {
        fetchProperty(id)
    }, [id])


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
                    <Breadcrumb.CurrentLink>{selectedTab}</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
        <Flex direction={{ base: 'column', md: 'row' }} mb={12} mt={4} justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
            <HStack>
                <Image src={rentImage.src} mr={3} w={{ base: '100px', md: '165px' }} rounded={'8px'} h={{ base: '60px', md: '80px' }} alt="rent" />
                {isLoading ? <Box>
                    <SkeletonText w={{ base: '150px', md: '300px' }} mb={2} noOfLines={1} h={'20px'} />
                    <SkeletonText w={{ base: '200px', md: '400px' }} noOfLines={1} h={'20px'} />
                </Box> :
                    <Box>
                        <Text className="satoshi-bold text-[20px] md:text-[24px]"> {property?.name}</Text>
                        <HStack>
                            <Image alt="location-icon" src={locateIcon.src} />
                            <Text className="satoshi-medium text-[12px] lg:text-[14px]  mt-0 ">
                                {property?.address}
                            </Text>
                        </HStack>
                        <Text className="satoshi-medium text-sm">Last Updated: 1 March, 2026</Text>
                    </Box>
                }

            </HStack>
            <MainButton icon={<FiEdit />} children="Edit" />
        </Flex>
        <PropertyTabs setTab={setSelectedTab} property={property} />
    </div >
    )
}