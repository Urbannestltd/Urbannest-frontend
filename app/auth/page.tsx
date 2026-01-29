"use client"
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Span,
    Text,
} from "@chakra-ui/react"
import GoogleIcon from "@/app/assets/google-icon.svg"
import Image from "next/image"
import { useEffect, useState } from "react"
import { SignUp } from "./sign-up"
import { Login } from "./login"
import { useSearchParams } from "next/navigation"
import Logo from '@/app/assets/urbannest-logo.png'
import { Suspense } from "react";

function SignIn() {
    const searchParams = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token") || "";
        if (token) {
            setIsSignUp(true);
        }
    }, [searchParams]);

    return (
        <Flex align={'center'} justify={"center"} p={2} >
            <Flex
                direction={"column"}
                mt={10}
                w={"468px"}
                align={"center"}
                justify={'center'}
                h={"100%"}
                bg={"white"}
            >
                <Heading fontSize={"32px"} className="satoshi-bold">
                    {isSignUp ? "Let’s Get Started" : "Welcome Back"}
                </Heading>
                <Button
                    my={8}
                    w={"full"}
                    p={3}
                    h={"48px"}
                    className="satoshi-medium"
                    border={"1px solid #767676"}
                >
                    <Image alt="google-icon" src={GoogleIcon} />
                    Continue with Google
                </Button>
                <HStack mb={4} w={"full"}>
                    <Box bg="#757575" w={"45%"} mr={2} h={"1px"} />
                    <Text>Or</Text>
                    <Box bg="#757575" w={"45%"} ml={2} h={"1px"} />
                </HStack>
                {isSignUp ? <SignUp /> : <Login />}

                <Text className="satoshi-medium">
                    Already have an account?{" "}
                    <Span
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary-gold cursor-pointer"
                    >
                        {isSignUp ? "Login" : "Sign Up"}
                    </Span>
                </Text>
                <Text w={"full"} my={10} textAlign={"center"}>
                    By clicking “continue” you agree to our{" "}
                    <Span className="text-primary-gold">terms of service</Span> and{" "}
                    <Span className="text-primary-gold">privacy policy</Span>
                </Text>
            </Flex>
        </Flex>
    )
}

export default function Auth() {
    return (
        <Flex align={'center'} justify={"center"} p={2}>
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
                <SignIn />
            </Suspense>
        </Flex>
    )
}