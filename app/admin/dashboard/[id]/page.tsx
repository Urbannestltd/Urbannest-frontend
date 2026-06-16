'use client'
import { Box, Flex, HStack, Image, SkeletonText, Text } from "@chakra-ui/react";
import rentImage from '@/app/assets/images/lease-image.png'
import locateIcon from '@/app/assets/icons/location-icon.svg'
import { MainButton } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { PropertyTabs } from "./tabs";
import { usePropertyStore } from "@/store/admin/properties";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { editPropertyFormData } from "@/schema/admin";
import { CustomEditable } from "@/components/ui/custom-fields";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { editProperty, EditPropertyPayload } from "@/services/admin/property";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";



export default function Page() {
    const params = useParams();
    const id = params?.id as string;
    const property = usePropertyStore((state) => state.property)
    const fetchProperty = usePropertyStore((state) => state.fetchProperty)
    const fetchUnits = usePropertyStore((state) => state.fetchUnits)
    const isLoading = usePropertyStore((state) => state.isLoading)
    const [selectedTab, setSelectedTab] = useState('Overview')
    const [editMode, setEditMode] = useState(false)
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

    const mutation = useMutation({
        mutationFn: (payload: EditPropertyPayload) => {
            return editProperty(payload)
        },
        onSuccess: () => {
            toast.success('Property updated successfully')
            fetchProperty(id)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? error?.message)
        }
    })

    const overviewRef = useRef<{ handleSave: () => void }>(null)
    const handleSave = async (data: { amenities: string[], images: string[], formValues: editPropertyFormData }) => {
        const pageValues = getValues()

        const payload: EditPropertyPayload = {
            id: id,
            ...data.formValues,
            ...pageValues,
            amenities: data.amenities,
            images: data.images,
        }

        console.log(payload)
        mutation.mutate(payload)
        setEditMode(false)

    }


    return (<div>
        <PageBreadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Property Details', href: '#' }, { label: selectedTab, isCurrent: true }]} />

        <Flex direction={{ base: 'column', md: 'row' }} mb={12} mt={4} justify={'space-between'} align={'center'} rounded={'8px'} p={4} className="bg-primary-gold-50">
            <HStack>
                <Image src={property?.images[0] ?? rentImage.src} mr={3} w={{ base: '100px', md: '165px' }} rounded={'8px'} h={{ base: '60px', md: '80px' }} alt="rent" />
                {isLoading ? <Box>
                    <SkeletonText w={{ base: '150px', md: '300px' }} mb={2} noOfLines={1} h={'20px'} />
                    <SkeletonText w={{ base: '200px', md: '400px' }} noOfLines={1} h={'20px'} />
                </Box> :
                    <Box>
                        {editMode ? (
                            <Box>
                                <CustomEditable control={control} textBold textAlign="start" textSize={'20px'} name='name' value={property?.name} />
                                <HStack>
                                    <Image alt="location-icon" src={locateIcon.src} />
                                    <CustomEditable control={control} textAlign="start" textSize={'14px'} name='address' value={property?.address} />,
                                    <CustomEditable control={control} textAlign="start" textSize={'14px'} name='state' value={'Lagos'} />
                                </HStack>
                            </Box>
                        ) : (
                            <Box>
                                <Text className="satoshi-bold text-[20px] md:text-[24px]">{property?.name}</Text>
                                <HStack>
                                    <Image alt="location-icon" src={locateIcon.src} />
                                    <Text className="satoshi-medium text-[12px] lg:text-[14px] mt-0">{property?.address}, {property?.state}</Text>
                                </HStack>
                            </Box>
                        )}
                    </Box>
                }

            </HStack>
            {editMode ? <Flex gap={1}>
                <MainButton variant='outline' onClick={() => setEditMode(false)} children="Cancel" />
                <MainButton onClick={() => overviewRef.current?.handleSave()} children="Save" />
            </Flex> : <MainButton icon={<FiEdit />} onClick={() => setEditMode(true)} children="Edit" />}
        </Flex>
        <PropertyTabs ref={overviewRef} edit={editMode} onSave={handleSave} setTab={setSelectedTab} property={property} />
    </div >
    )
}