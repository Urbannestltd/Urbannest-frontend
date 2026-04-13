import { Flex, Span, Text } from "@chakra-ui/react"
import { Progress } from "./progress-bar"

export interface CardData {
    title: string
    data: string | number
    emptyMessage?: string
    progress?: number
    isTitleBold?: boolean
    attentionRequired?: boolean
    titleColor?: string
    tinyText?: string
    percentage?: string
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
                    px={6}
                    py={6}
                    justify={"center"}
                    w={"full"}
                    minW={'184px'}
                    bg={'white'}
                    h={"full"} wrap={'wrap'}
                    rounded={"8px"}
                    border={"1px solid "}
                    borderColor={item.attentionRequired ? '#9F403D' : '#F4F4F4'}
                    borderLeft={item.attentionRequired ? '4px solid #9F403D' : ''}
                >
                    <Span w="full">
                        <Text color={"#5A5A5A"} className={item.isTitleBold ? "satoshi-bold" : "satoshi-medium"}>{item.title}</Text>
                        <Flex align={'end'} gap={1}>
                            <Text color={item.titleColor ?? '#303030'} fontSize={"32px"} className="font-semibold">
                                {item.data.toString().padStart(2, '0')}
                            </Text>
                            {item.tinyText && <Text ml={1} mb={2} color={'#757575'} fontSize={"12px"} className="satoshi-medium">{item.tinyText}</Text>}
                            {item.percentage && <Text ml={1} mb={2} color={'#16A34A'} fontSize={'12px'} className="satoshi-medium">↓{item.percentage}</Text>}
                        </Flex>
                        {item.attentionRequired && <Text color={'#9F403D'} mt={1} fontSize={'12px'} className="satoshi-medium">Critical attention required</Text>}
                        {item.emptyMessage && <Text color={"#5A5A5A"} mt={1} fontSize={'12px'} className="satoshi-medium">{item.emptyMessage}</Text>}
                        {item.progress && <Progress mt={1} size={'sm'} color={'#545F73'} value={item.progress} />}
                    </Span>
                </Flex>
            ))}
        </Flex>
    )
}
