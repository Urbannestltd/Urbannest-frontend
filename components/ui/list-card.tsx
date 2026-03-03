import { Box, Button, Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react"
import { StaticImageData } from "next/image"
import { Avatar } from "./avatar"
import { Divider } from "./divider"
import { MainButton } from "./button"
import { bg } from "zod/v4/locales"

export interface ListCardData {
    image: StaticImageData
    name: string
    phone: string
    address: string
    lease: string
    isDefaulting: 'Yes' | 'Warning' | 'No'

}

interface ListCardProps {
    cardData: ListCardData[]
}

export const ListCard = ({ cardData }: ListCardProps) => {

    return (
        <Grid overflowX={'scroll'} maxW={'full'} scrollbar={'hidden'} templateColumns={'repeat(4,1fr)'} gap={4}>{cardData.map((card) =>
            <GridItem key={card.name}>
                <Box border={'1px solid #F4F4F4'} rounded={'8px'} p={5}>
                    <Avatar name={card.name} src={card.image.src} />
                    <Text mt={2} className="text-[15px] satoshi-bold">{card.name}</Text>
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">{card.phone}</Text>
                    <Divider my={3} />
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">{card.address}</Text>
                    <Text className="text-[15px] satoshi-medium text-[#5A5A5A]">Lease : {card.lease}</Text>
                    <HStack mt={2}>
                        <Flex justify={'center'} align={'center'} rounded={'md'} bg={colors[card.isDefaulting].bg} color={colors[card.isDefaulting].color} p={2} className="text-[14px] h-[34px] w-[120px] text-center satoshi-medium ">Defaulting</Flex>
                        <MainButton variant='outline' size="sm" className="h-[34px] w-[120px] text-sm">View Profile</MainButton>
                    </HStack>
                </Box>
            </GridItem>
        )}</Grid>
    )
}

const colors = {
    "Yes": { bg: '#FEE9E7', color: '#C00F0C' },
    "Warning": { bg: '#FFF8EB', color: '#975102' },
    "No": { bg: '#EBF9EE', color: '#34C759' }
}