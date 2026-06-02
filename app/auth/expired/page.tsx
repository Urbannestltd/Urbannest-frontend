"use client";
import { Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import bgImage from '@/app/assets/images/forgot-password-bg.png'
import { Suspense } from "react";
import Logo from '@/app/assets/urbannest-logo.png'
import InvalidIcon from "@/app/assets/icons/invalid-icon.svg";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function ExpiredPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            router.replace("/auth");
        }
    }, [token, router]);

    if (!token) return null;

    return (
        <>
            <Flex justify={{ base: 'center', md: 'space-between' }} w={'full'} p={3} h={'78%'}>
                <Flex h={'full'} direction={'column'} justify={'center'} align={'center'} className="w-full md:w-[50%]">
                    <Flex direction={'column'} justify={'center'} align={'center'} w={{ base: 'full', md: "468px" }}>
                        <Image alt="expired" className="w-[50px]" src={InvalidIcon} />
                        <Heading textAlign={'center'} className="satoshi-bold text-[28px] my-2.5">Invite Link Expired</Heading>
                        <Text textAlign={'center'} className="satoshi-medium">This link has expired.</Text>
                        <Text textAlign={'center'} className="satoshi-medium">Contact your administrator for a new invite.</Text>
                    </Flex>
                </Flex>
                <Image alt="bg" className="w-[50%] hidden md:block -top-7 h-[97%] absolute right-3" src={bgImage} />
            </Flex>
        </>
    )
}

export default function Expired() {
    return (
        <Flex align={'center'} justify={"center"} h={'88%'} p={2}>
            <Suspense fallback={
                <Flex direction={"column"} mt={10} w={"468px"} align={"center"} justify={'center'} h={'90vh'} bg={"white"}>
                    <Image src={Logo} alt="loader" />
                </Flex>
            }>
                <ExpiredPage />
            </Suspense>
        </Flex>
    )
}
