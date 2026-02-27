import { Flex, Span, Text } from "@chakra-ui/react"

interface CardData {
    title: string
    data: string | number
    emptyMessage?: string
}

interface CardProps {
    data: CardData[]
}

export const DashboardCard = ({ data }: CardProps) => {
    return (
        <Flex gap={4} w={{ base: "auto", md: "full" }} h={"118px"} maxH={"400px"} justify="start">
            {data.map((item, index) => (
                <Flex
                    key={index}
                    direction={"column"}
                    pl={6}
                    justify={"center"}
                    w={"full"}
                    minW={'184px'}
                    bg={'white'}
                    h={"full"} wrap={'wrap'}
                    rounded={"8px"}
                    border={"1px solid #F4F4F4"}
                >
                    <Span w="full">
                        <Text color={"#5A5A5A"}>{item.title}</Text>
                        <Text fontSize={"32px"} className="font-semibold">
                            {item.data.toString().padStart(2, '0')}
                        </Text>
                    </Span>
                </Flex>
            ))}
        </Flex>
    )
}
