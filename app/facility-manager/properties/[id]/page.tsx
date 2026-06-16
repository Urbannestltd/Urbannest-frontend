'use client'
import { Box, Flex, HStack, Image, SkeletonText, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { PropertyTabs } from "./tabs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePropertyStore } from "@/store/fm/properties";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";



export default function Page() {
    const params = useParams();
    const id = params?.id as string;

    const property = usePropertyStore((state) => state.property)
    const fetchProperty = usePropertyStore((state) => state.fetchProperty)
    const fetchUnits = usePropertyStore((state) => state.fetchUnits)
    const isLoading = usePropertyStore((state) => state.isLoadingProperty)
    const [selectedTab, setSelectedTab] = useState('Overview')
    const { control, reset, getValues } = useForm<{ name: string, address: string, state: string, }>()


    useEffect(() => {
        fetchProperty(id)
        fetchUnits(id)
    }, [id])

    useEffect(() => {
        if (property) {
            reset({
                name: property.name,
                address: property.address,
                state: 'Lagos'
            })
        }
    }, [property])


    return (<div>
        <PageBreadcrumb items={[{ label: "Properties", to: "/facility-manager/properties" }, { label: selectedTab, isCurrent: true }]} />
        <Flex direction={{ base: 'column', md: 'row' }} mb={12} mt={4} justify={'space-between'} align={'center'} rounded={'8px'} p={{ base: 2, md: 4 }} className="bg-primary-gold-50">
            <HStack w={{ base: 'full', md: 'auto' }}  >
                <Image src={property?.images[0] ?? rentImage.src} mr={{ base: 4, md: 3 }} w={{ base: '100px', md: '165px' }} rounded={'8px'} h={{ base: '60px', md: '80px' }} alt="rent" />
                {isLoading ? <Box>
                    <SkeletonText w={{ base: '150px', md: '300px' }} mb={2} noOfLines={1} h={'20px'} />
                    <SkeletonText w={{ base: '200px', md: '400px' }} noOfLines={1} h={'20px'} />
                </Box> :
                    <Box>
                        <Text className="satoshi-bold text-[20px] md:text-[24px]">{property?.name}</Text>
                        <HStack>
                            <Image alt="location-icon" src={locateIcon.src} />
                            <Text className="satoshi-medium text-[12px] lg:text-[14px] mt-0">{property?.address}, {property?.state}</Text>
                        </HStack>
                        <Text className="satoshi-medium" fontSize={'14px'}>Last Updated: 1 March, 2026</Text>
                    </Box>

                }

            </HStack>
        </Flex>
        <PropertyTabs setTab={setSelectedTab} property={property} />
    </div >
    )
}