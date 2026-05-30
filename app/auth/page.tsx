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
import { useRouter, useSearchParams } from "next/navigation"
import Logo from '@/app/assets/urbannest-logo.png'
import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query"
import { validateToken } from "@/services/auth"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

function SignIn() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter()

    const mutate = useMutation({
        mutationFn: (payload: string) => {
            return validateToken(payload)
        },
        onSuccess: () => {
            setIsSignUp(true)
        },
        onError: (_error: AxiosError<{ message: string }>) => {
            router.push(`/auth/${token}/invalid`)
        }
    })

    useEffect(() => {
        const token = searchParams.get("token") || "";
        if (token) {
            mutate.mutate(token)
        }
    }, [searchParams]);




    if (token && mutate.isPending) {
        return (
            <Flex align={'center'} h={'87vh'} justify={"center"}>
                <Image src={Logo} alt="loader" />
            </Flex>
        )
    }

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
                    {isSignUp ? "Let's Get Started" : "Welcome Back"}
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
                    w={"full"}
                    align={"center"}
                    justify={'center'}
                    h={'90vh'}
                    bg={'transparent'}
                >
                    <Image src={Logo} alt="loader" />
                </Flex>
            }>
                <SignIn />
            </Suspense>
        </Flex>
    )
}