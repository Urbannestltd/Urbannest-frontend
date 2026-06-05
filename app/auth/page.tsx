"use client"
import { Flex, Heading, Span, Text } from "@chakra-ui/react"
import Image from "next/image"
import { useEffect, useState, Suspense } from "react"
import { SignUp } from "./sign-up"
import { Login } from "./login"
import { useRouter, useSearchParams } from "next/navigation"
import Logo from '@/app/assets/urbannest-logo.png'
import { useMutation } from "@tanstack/react-query"
import { validateToken } from "@/services/auth"
import { AxiosError } from "axios"

type AuthState = 'login' | 'signup' | 'loading'

function SignIn() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const router = useRouter()
    const [state, setState] = useState<AuthState>('loading');

    const { mutate, isIdle, isPending } = useMutation({
        mutationFn: validateToken,
        onSuccess: (response) => {
            if (response.status === "valid") {
                setState('signup')
            } else {
                router.push(`/auth/expired?token=${encodeURIComponent(token)}`)
            }
        },
        onError: (_error: AxiosError<{ message: string }>) => {
            router.push(`/auth/invalid?token=${encodeURIComponent(token)}`)
        }
    })

    useEffect(() => {
        if (token) {
            mutate(token)
        } else {
            setState('login')
        }
    }, [token]);

    if (state === 'loading' && (isIdle || isPending)) {
        return (
            <Flex align={'center'} h={'87vh'} justify={"center"}>
                <Image src={Logo} alt="loader" />
            </Flex>
        )
    }

    return (
        <Flex align={'center'} h={'87vh'} justify={"center"} p={2}>
            <Flex
                direction={"column"}
                w={{ base: "100%", md: "468px" }}
                align={"center"}
                justify={'center'}
                h={{ base: "auto", md: "100%" }}
                bg={'transparent'}
            >
                <Heading mt={{ base: 6 }} fontSize={{ base: "30px", md: "32px" }} mb={{ base: 4, md: 8 }} className="satoshi-bold">
                    {state === 'signup' ? "Let's Get Started" : "Welcome Back"}
                </Heading>

                {state === "signup" ? <SignUp /> : <Login />}

                <Text className="satoshi-medium">
                    {state === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <Span
                        onClick={() => setState(state === "login" ? "signup" : "login")}
                        className="text-primary-gold cursor-pointer"
                    >
                        {state === "signup" ? "Login" : "Sign Up"}
                    </Span>
                </Text>
                <Text w={"full"} my={{ base: 4, md: 10 }} textAlign={"center"}>
                    By clicking "continue" you agree to our{" "}
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
                <Flex direction={"column"} mt={10} w={"full"} align={"center"} justify={'center'} h={'90vh'} bg={'transparent'}>
                    <Image src={Logo} alt="loader" />
                </Flex>
            }>
                <SignIn />
            </Suspense>
        </Flex>
    )
}
