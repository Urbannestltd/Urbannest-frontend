import { Center, Flex, Grid, HStack, Image, Span, Text } from "@chakra-ui/react"
import { Progress } from "./progress-bar"
import { StaticImageData } from "next/image"

export interface CardData {
    title: string
    data: string | number
    emptyMessage?: string
    progress?: number
    isTitleBold?: boolean
    attentionRequired?: boolean
    actionRequired?: boolean
    titleColor?: string
    tinyText?: string
    percentage?: string
    icon?: StaticImageData
    new?: number
    cardColor?: string
    newColor?: string
    border?: boolean
}

interface CardProps {
    data: CardData[]
    newMobile?: boolean
    fourcolumn?: boolean
}

export const DashboardCard = ({
    data,
    newMobile,
    fourcolumn = true,
}: CardProps) => {
    const isMobile = window.innerWidth < 600
    return (
        <Grid
            gap={4}
            templateColumns={{
                base: newMobile ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                md: fourcolumn ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            }}
            w={"full"}
            minH={newMobile ? "180px" : "118px"}
            h={newMobile ? "auto" : "fit"}
            maxH={{ base: "auto", md: "400px" }}
        >
            {data.map((item, index) => (
                <Flex
                    key={index}
                    direction={"column"}
                    px={6}
                    py={{ base: 2, md: 6 }}
                    justify={"center"}
                    w={"full"}
                    minW={{ base: "full", md: "184px" }}
                    bg={"white"}
                    h={{ base: "full", md: item.icon ? "155px" : "full" }}
                    wrap={"wrap"}
                    rounded={item.icon ? "12px" : "8px"}
                    border={"1px solid "}
                    borderColor={
                        item.attentionRequired
                            ? "#9F403D"
                            : item.border
                                ? "#E0E0E0"
                                : "#F4F4F4"
                    }
                    borderLeft={item.attentionRequired ? "4px solid #9F403D" : ""}
                >
                    {isMobile ? (
                        <HStack>
                            {item.icon && <Image src={item.icon.src} alt={item.title} />}
                            <Flex ml={1} direction={"column"} w={"full"}>
                                <Text
                                    fontSize={"14px"}
                                    color={"#5A5A5A"}
                                    className={
                                        item.isTitleBold ? "satoshi-bold" : "satoshi-medium"
                                    }
                                >
                                    {item.title}
                                </Text>
                                <Flex align={"end"} gap={1}>
                                    <Text
                                        color={item.titleColor ?? "#303030"}
                                        fontSize={{ base: "20px", md: "32px" }}
                                        lineHeight={"32px"}
                                        className="font-semibold"
                                    >
                                        {item.data.toString().padStart(2, "0")}
                                    </Text>
                                    {item.tinyText && (
                                        <Text
                                            ml={1}
                                            mb={2}
                                            color={"#757575"}
                                            fontSize={"12px"}
                                            className="satoshi-medium"
                                        >
                                            {item.tinyText}
                                        </Text>
                                    )}
                                    {item.percentage && (
                                        <Text
                                            ml={1}
                                            mb={2}
                                            color={"#16A34A"}
                                            fontSize={"12px"}
                                            className="satoshi-medium"
                                        >
                                            ↓{item.percentage}
                                        </Text>
                                    )}
                                </Flex>
                                {item.progress && <Progress value={item.progress} />}
                            </Flex>
                        </HStack>
                    ) : (
                        <Span w="full">
                            {(item.icon || item.new) && (
                                <Flex mb={2} justify={"space-between"}>
                                    {item.icon && <Image src={item.icon.src} alt={item.title} />}
                                    {item.new && (
                                        <Center
                                            h={"29px"}
                                            rounded={"7px"}
                                            fontSize={"12px"}
                                            px={"9px"}
                                            py={"4.5px"}
                                            bg={item.cardColor}
                                            color={item.newColor}
                                            className="satoshi-bold"
                                        >
                                            +{item.new} NEW
                                        </Center>
                                    )}
                                </Flex>
                            )}
                            <Text
                                color={"#5A5A5A"}
                                className={item.isTitleBold ? "satoshi-bold" : "satoshi-medium"}
                            >
                                {item.title}
                            </Text>
                            <Flex
                                justify={item.actionRequired ? "space-between" : "start"}
                                align={item.actionRequired ? "center" : "end"}
                                gap={1}
                            >
                                <Text
                                    color={item.titleColor ?? "#303030"}
                                    fontSize={"32px"}
                                    className="font-semibold"
                                >
                                    {item.data.toString().padStart(2, "0")}
                                </Text>
                                {item.actionRequired && (
                                    <Text
                                        color={"white"}
                                        bg={"#9F403D"}
                                        textTransform={"uppercase"}
                                        fontSize={"12px"}
                                        py={1}
                                        px={2}
                                        className="satoshi-medium"
                                    >
                                        Action required
                                    </Text>
                                )}
                                {item.tinyText && (
                                    <Text
                                        ml={1}
                                        mb={2}
                                        color={"#757575"}
                                        fontSize={"12px"}
                                        className="satoshi-medium"
                                    >
                                        {item.tinyText}
                                    </Text>
                                )}
                                {item.percentage && (
                                    <Text
                                        ml={1}
                                        mb={2}
                                        color={"#16A34A"}
                                        fontSize={"12px"}
                                        className="satoshi-medium"
                                    >
                                        ↓{item.percentage}
                                    </Text>
                                )}
                            </Flex>
                            {item.attentionRequired && (
                                <Text
                                    color={"#9F403D"}
                                    mt={1}
                                    fontSize={"12px"}
                                    className="satoshi-medium"
                                >
                                    Critical attention required
                                </Text>
                            )}
                            {item.emptyMessage && (
                                <Text
                                    color={"#5A5A5A"}
                                    mt={1}
                                    fontSize={"12px"}
                                    className="satoshi-medium"
                                >
                                    {item.emptyMessage}
                                </Text>
                            )}
                            {item.progress && (
                                <Progress
                                    mt={1}
                                    size={"sm"}
                                    color={"#545F73"}
                                    value={item.progress}
                                />
                            )}
                        </Span>
                    )}
                </Flex>
            ))}
        </Grid>
    )
}
