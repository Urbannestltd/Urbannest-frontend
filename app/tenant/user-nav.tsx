import { PageTitle } from "@/components/ui/page-title"
import { Avatar, Flex, HStack } from "@chakra-ui/react"
import { FaRegBell } from "react-icons/fa"
import UserAvatar from "@/app/assets/images/user-avatar.png"

export const UserNav = () => {
    return (
        <HStack justify={"space-between"}>
            <PageTitle title="Hello, Amanda" subText="Welcome to your dashboard!" />
            <Flex gap={4} align={"center"}>
                <FaRegBell size={20} />
                <Avatar.Root>
                    <Avatar.Fallback name="Amanda" />
                    <Avatar.Image src={UserAvatar.src} />
                </Avatar.Root>
            </Flex>
        </HStack>
    )
}