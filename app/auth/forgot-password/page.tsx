"use client";

import { Box, Button, Center, Field, Flex, Heading, Input, InputGroup, Span, Text } from "@chakra-ui/react";
import Image from "next/image";
import bgImage from '@/app/assets/images/forgot-password-bg.png'
import KeyIcon from '@/app/assets/icons/keys-icon.svg'
import { LuArrowLeft, LuMail } from "react-icons/lu";
import { useForm } from "react-hook-form";
import Link from "next/link";
import http from "@/services/https";
import endpoints from "@/services/endpoint";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth";

export default function ForgotPassword() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ email: string }>();
    const [isSucessful, setIsSucessful] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: string) => forgotPassword(data),
        onSuccess: () => {
            setIsSucessful(true);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const onSubmit = async (data: { email: string }) => {
        const email = data.email;
        mutation.mutate(email);
    };
    return (
        <>
            <Flex justify={{ base: 'center', md: 'space-between' }} w={'full'} p={3} h={'88%'}>
                <Flex h={'full'} direction={'column'} justify={'center'} align={'center'} className=" w-full lg:w-[50%]">
                    {isSucessful ? <Box w={{ base: 'full', md: "468px" }}>
                        <Center placeSelf={'center'} my={8} className="bg-primary-gold-70 rounded-full size-[82px]">
                            <LuMail size={40} color={"#CFAA67"} />
                        </Center>
                        <Heading textAlign={'center'} className="satoshi-bold text-[28px] mb-2.5">Check your inbox!</Heading>
                        <Text textAlign={'center'} className="satoshi-medium">We’ve sent a password reset link to your email.</Text>
                        <Text className="satoshi-medium text-center mt-8 mb-3.5">Didn’t receive the email? <Span className="text-primary-gold">Resend</Span></Text>
                        <Link href={'/auth'} className="flex justify-center items-center"><LuArrowLeft size={18} color="#CFAA67" /><Text className="text-primary-gold satoshi-medium ml-2.5">Back to log in</Text></Link>
                    </Box>
                        : <Box w={{ base: 'full', md: "468px" }}>
                            <Center placeSelf={'center'} my={8} className="bg-primary-gold-70 rounded-full size-[82px]">
                                <Image alt="" src={KeyIcon} />
                            </Center>
                            <Heading textAlign={'center'} className="satoshi-bold text-[28px] mb-2.5">Forgot your password?</Heading>
                            <Text textAlign={'center'} className="satoshi-medium">No worries. We’ll send you a reset link.</Text>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Field.Root my={4}>
                                    <Field.Label className="satoshi-medium">
                                        Email Address
                                    </Field.Label>
                                    <InputGroup
                                        rounded={"6px"}
                                        border={"1px solid #B2B2B2"}
                                        startElement={<LuMail color={"#B3B3B3"} />}
                                    >
                                        <Input {...register("email")} placeholder="Email" />
                                    </InputGroup>
                                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                </Field.Root>
                                <Button
                                    className="bg-button-primary hover:bg-button-hover text-white"
                                    type="submit"
                                    my={8}
                                    w={"full"}
                                    p={3}
                                    h={"48px"}
                                    border={"1px solid #767676"}
                                >
                                    Continue
                                </Button>
                            </form>
                            <Link href={'/auth'} className="flex justify-center items-center hover:underline text-primary-gold"><LuArrowLeft size={18} color="#CFAA67" /><Text className="text-primary-gold satoshi-medium ml-2.5">Back to log in</Text></Link>
                        </Box>}
                </Flex>
                <Image alt="forgot-password" className="w-[50%] hidden md:block -top-7 h-[97%] absolute right-3" src={bgImage} />
            </Flex>
        </>
    )
}