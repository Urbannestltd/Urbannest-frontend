
import { SectionBox } from "@/components/ui/section-box"
import {
    Box,
    Flex,
    HStack,
    Text,
} from "@chakra-ui/react"
import { MainButton } from "@/components/ui/button"
import {
    LuEllipsisVertical,
    LuMail,
    LuPhone,
} from "react-icons/lu"
import { Avatar } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"

export interface PropertyContact {
    pfp: string
    name: string
    email: string
    phone?: string
    title: string
}

export const ContactSection = ({ data }: { data: PropertyContact[] }) => {
    return <SectionBox mt={6}>
        {data.map((contact, index) => (
            <Box key={index}>
                <HStack justify={"space-between"}>
                    <Text
                        fontSize={"12px"}
                        textTransform={"uppercase"}
                        color={"#757575"}
                        className="satoshi-bold tracking-[1.1px]"
                    >
                        {contact.title}
                    </Text>
                    <LuEllipsisVertical />
                </HStack>
                <Flex mt={4} justify={"start"}>
                    <Avatar size={"lg"} src={contact.pfp} />
                    <Box ml={"11px"} w={"full"}>
                        <Box>
                            <Text fontSize={"14px"} className="satoshi-bold">
                                {contact.name}
                            </Text>
                            <Text fontSize={"11px"} color={"#010F0D"}>
                                {contact.email}
                            </Text>
                        </Box>
                        <Flex mt={3} gap={2}>
                            <MainButton
                                size="lg"
                                variant="ghost"
                                className="px-1 h-[29px]"
                                icon={<LuPhone />}
                            >
                                Call
                            </MainButton>
                            <MainButton
                                size="lg"
                                variant="ghost"
                                className="px-1 h-[29px]"
                                icon={<LuMail />}
                            >
                                Email
                            </MainButton>
                        </Flex>
                    </Box>
                </Flex>

                {index !== 2 && <Divider my={6} />}
            </Box>
        ))}
    </SectionBox>
}