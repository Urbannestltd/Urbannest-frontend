'use client'
import { Flex } from "@chakra-ui/react"
import { usePathname } from "next/navigation";

export const PageContainer = ({ children, left }: { children: React.ReactNode, left: string }) => {
    const pathname = usePathname();
    const isSetting = pathname.includes('settings');
    const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
    return (
        <Flex
            position="absolute"
            justify={'center'}
            color="blue.900"
            top="0rem"
            bg={isSetting ? 'white' : 'transparent'}
            left={isSetting || isMobile ? '0rem' : left}
            p={{ base: 4, md: 8 }}
            w={`calc(100vw - ${isSetting || isMobile ? '0rem' : left})`}
            className="scrollbar-hide"
        >
            <div className=" w-full max-w-[1440px]">
                {children}
            </div>
        </Flex>
    )
}
