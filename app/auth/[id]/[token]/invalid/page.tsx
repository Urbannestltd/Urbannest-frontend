"use client";
import { Flex, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import Image from "next/image";
import bgImage from '@/app/assets/images/forgot-password-bg.png'
import { Suspense, } from "react";
import Logo from '@/app/assets/urbannest-logo.png'
import InvalidIcon from "@/app/assets/icons/invalid-icon.svg";

export function InvalidPage() {

    return (
        <>
            <Flex justify={{ base: 'center', md: 'space-between' }} w={'full'} p={3} h={'78%'}>
                <Flex h={'full'} direction={'column'} justify={'center'} align={'center'} className="w-full md:w-[50%]">
                    <Flex direction={'column'} justify={'center'} align={'center'} w={{ base: 'full', md: "468px" }}>
                        <Image alt="forgot-password" className="w-[50px]" src={InvalidIcon} />
                        <Heading textAlign={'center'} className="satoshi-bold text-[28px] my-2.5">Invite Link Expired</Heading>
                        <Text textAlign={'center'} className="satoshi-medium">This link has expired.</Text><Text textAlign={'center'} className="satoshi-medium">
                            Contact your administrator for a new invite.</Text>
                    </Flex>
                </Flex>
                <Image alt="forgot-password" className="w-[50%] hidden md:block -top-7 h-[97%] absolute right-3" src={bgImage} />
            </Flex>
        </>
    )
}

export default function Invalid() {
    return (
        <Flex align={'center'} justify={"center"} h={'88%'} p={2}>
            <Suspense fallback={
                <Flex
                    direction={"column"}
                    mt={10}
                    w={"468px"}
                    align={"center"}
                    justify={'center'}
                    h={'90vh'}
                    bg={"white"}
                >
                    <Image src={Logo} alt="loader" />
                </Flex>
            }>
                <InvalidPage />
            </Suspense>
        </Flex>
    )
}