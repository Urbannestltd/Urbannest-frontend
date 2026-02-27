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
        <Flex align={'center'} h={'87vh'} justify={"center"} p={2} >
            <Flex
                direction={"column"}

                w={{ base: "100%", md: "468px" }}
                align={"center"}
                justify={'center'}
                h={{ base: "auto", md: "100%" }}
                bg={'transparent'}
            >
                <Heading mt={{ base: 6 }} fontSize={{ base: "30px", md: "32px" }} mb={{ base: 4, md: 8 }} className="satoshi-bold">
                    {isSignUp ? "Let’s Get Started" : "Welcome Back"}
                </Heading>

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
                <Text w={"full"} my={{ base: 4, md: 10 }} textAlign={"center"}>
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