import { Box, Button, Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react"
import { StaticImageData } from "next/image"
import { Avatar } from "./avatar"
import { Divider } from "./divider"
import { MainButton } from "./button"
import { bg } from "zod/v4/locales"
import { Tenant } from "@/store/admin/dashboard"
import { useRouter } from "next/navigation"


interface ListCardProps {
    cardData: Tenant[]
}

export const ListCard = ({ cardData }: ListCardProps) => {
    const router = useRouter();

    return (
        <Grid overflowX={'scroll'} maxW={'full'} scrollbar={'hidden'} templateColumns={'repeat(4,1fr)'} gap={4}>{cardData.map((card) =>
            <GridItem key={card.name}>
                <Box border={'1px solid #F4F4F4'} rounded={'8px'} p={5}>
                    <Avatar name={card.name} src={card.photoUrl} />
                    <Text mt={2} className="text-[15px] satoshi-bold">{card.name}</Text>
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">{card.phone}</Text>
                    <Divider my={3} />
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">{card.address}</Text>
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">{card.leaseDuration}</Text>
                    <HStack mt={2}>
                        <Flex justify={'center'} align={'center'} rounded={'md'} p={2} color={colors[card.status as Status]?.color ?? 'red'} bg={colors[card.status as Status]?.bg ?? 'red'} className="text-[14px] h-[34px] w-[120px] text-center satoshi-medium ">Defaulting</Flex>
                        <MainButton variant='outline' size="sm" onClick={() => router.push(`/admin/dashboard/${card.propertyId}?tab=units&tenantId=${card.id} `)} className="h-[34px] w-[120px] text-sm">View Profile</MainButton>
                    </HStack>
                </Box>
            </GridItem>
        )}</Grid>
    )
}

type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED'

const colors: Record<Status, { bg: string, color: string }> = {
    ACTIVE: { bg: '#FFF8EB', color: '#975102' },
    PENDING: { bg: '#FEE9E7', color: '#C00F0C' },
    SUSPENDED: { bg: '#EBF9EE', color: '#34C759' },
}