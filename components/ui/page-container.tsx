'use client'
import { Flex } from "@chakra-ui/react"
import { usePathname } from "next/navigation";

export const PageContainer = ({ children, left }: { children: React.ReactNode, left: string }) => {
    const pathname = usePathname();
    const isSetting = pathname.includes('settings');
    return (
        <Flex
            position="absolute"
            justify={'center'}
            color="blue.900"
            top="0rem"
            left={isSetting ? '0rem' : left}
            p={{ base: 4, md: 8 }}
            w={`calc(100vw - ${isSetting ? '0rem' : left})`}
            className="scrollbar-hide"
        >
            <div className=" w-full max-w-[1440px]">
                {children}
            </div>
        </Flex>
    )
}