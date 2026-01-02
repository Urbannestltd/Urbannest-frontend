"use client"
import {
    Box,
    Button,
    Field,
    Flex,
    Grid,
    Heading,
    HStack,
    Input,
    InputGroup,
    Span,
    Text,
} from "@chakra-ui/react"
import GoogleIcon from "@/app/assets/google-icon.svg"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { loginFormData, loginSchema } from "@/schema"
import {
    LuEye,
    LuEyeOff,
    LuLock,
    LuMail,
    LuPhone,
    LuUser,
} from "react-icons/lu"
import { useEffect, useState } from "react"
import { setAuthTokenHeader } from "@/services/https"
import { storeRefreshToken, storeUserToken } from "@/services/cookies"
import useAuthStore from "@/store/auth"
import {
    clearStoredCredentials,
    getStoredCredentials,
    loginUser,
    saveCredentials,
} from "@/services/auth"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUp } from "./sign-up"
import { Login } from "./login"

export default function SignIn() {

    const [isSignUp, setIsSignUp] = useState(false)



    return (
        <Flex justify={"center"} p={2}>
            <Flex
                direction={"column"}
                mt={4}
                w={"468px"}
                align={"center"}
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
