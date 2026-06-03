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


function SignIn() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [states, setStates] = useState<'login' | 'signup' | 'loading'>('loading');
    const router = useRouter()

    const mutate = useMutation({
        mutationFn: (payload: string) => {
            return validateToken(payload)
        },
        onSuccess: (response) => {
            if (response.status === "expired") {
                router.push(`/auth/expired?token=${encodeURIComponent(token)}`)
            }
            else if (response.status === "valid") {
                setStates('signup')
            }
            else if (response.status === "used") {
                router.push(`/auth/expired?token=${encodeURIComponent(token)}`)
            }


        },
        onError: (_error: AxiosError<{ message: string }>) => {
            router.push(`/auth/invalid?token=${encodeURIComponent(token)}`)
        }
    })

    useEffect(() => {
        const token = searchParams.get("token") || "";
        if (token) {
            mutate.mutate(token)
        }
        if (!token) {
            setStates('login')
        }
    }, [searchParams]);






    if (token || states === 'loading' && (mutate.isIdle || mutate.isPending)) {
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
                    {states === 'login' ? "Let's Get Started" : states === 'signup' ? "Welcome Back" : null}
                </Heading>

                {states === "signup" ? <SignUp /> : states === "login" && <Login />}

                {states !== 'loading' && <><Text className="satoshi-medium">
                    Already have an account?{" "}
                    <Span
                        onClick={() => states === "login" && setStates("signup") || states === "signup" && setStates("login")}
                        className="text-primary-gold cursor-pointer"
                    >
                        {states === "login" ? "Login" : states === "signup" && "Sign Up"}
                    </Span>
                </Text>
                    <Text w={"full"} my={{ base: 4, md: 10 }} textAlign={"center"}>
                        By clicking “continue” you agree to our{" "}
                        <Span className="text-primary-gold">terms of service</Span> and{" "}
                        <Span className="text-primary-gold">privacy policy</Span>
                    </Text></>}
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