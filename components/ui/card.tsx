import { Flex, Span, Text } from "@chakra-ui/react"

interface CardData {
    title: string
    data: string
    emptyMessage?: string
}

interface CardProps {
    data: CardData[]
}



export const DashboardCard = ({ data }: CardProps) => {
    return (
        <Flex gap={4} justify='start'>
            {data.map((item, index) => (
                <Flex key={index} direction={'column'} pl={6} justify={'center'} w={'236px'} h={'118px'} rounded={'8px'} border={'1px solid #F4F4F4'}>
                    <Span w={'100px'}>
                        <Text color={'#5A5A5A'}>
                            {item.title}
                        </Text>
                        <Text fontSize={'32px'} className="font-semibold">{item.data}</Text>
                    </Span>
                </Flex>))}
        </Flex>
    )
}