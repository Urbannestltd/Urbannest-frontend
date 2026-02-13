"use client";
import { Box, Button, Center, Field, Flex, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import Image from "next/image";
import bgImage from '@/app/assets/images/forgot-password-bg.png'
import KeyIcon from '@/app/assets/icons/keys-icon.svg'
import { LuArrowLeft, LuCircleCheck, LuEye, LuEyeOff, LuLock, } from "react-icons/lu";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Suspense, useState } from "react";
import { MainButton } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword, ResetPasswordPayload } from "@/services/auth";
import toast from "react-hot-toast";
import Logo from '@/app/assets/urbannest-logo.png'

export function ResetPasswordFunc() {
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm<{ password: string }>();
    const [isSucessful, setIsSucessful] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const mutate = useMutation({
        mutationFn: (data: ResetPasswordPayload) => resetPassword(data),

        onSuccess: () => {
            toast.success('Password Reset Successfully')
            setIsSucessful(true)
        },

        onError: (error) => {
            toast.error(error?.message)
        }
    })


    const onSubmit = async (data: any) => {
        const payload: ResetPasswordPayload = {
            token: token,
            newPassword: data.password
        }
        mutate.mutate(payload)
    };
    return (
        <>
            <Flex justify={{ base: 'center', md: 'space-between' }} p={3} h={'88%'}>
                <Flex h={'full'} direction={'column'} justify={'center'} align={'center'} className="w-full md:w-[50%]">
                    {isSucessful ? <Box w={{ base: 'full', md: "468px" }}>
                        <Center placeSelf={'center'} my={8} className="bg-[#EBFFEE] rounded-full size-[82px]">
                            <LuCircleCheck size={40} color={"#14AE5C"} />
                        </Center>
                        <Heading textAlign={'center'} className="satoshi-bold text-[28px] mb-2.5">Password updated!</Heading>
                        <Text textAlign={'center'} className="satoshi-medium">You can now sign in with your new password.</Text>
                        <Link href={'/auth'} className="flex justify-center items-center"><MainButton children='Continue' /></Link>
                    </Box>
                        : <Box w={{ base: 'full', md: "468px" }}>
                            <Center placeSelf={'center'} my={8} className="bg-primary-gold-70 rounded-full size-[82px]">
                                <Image alt="" src={KeyIcon} />
                            </Center>
                            <Heading textAlign={'center'} className="satoshi-bold text-[28px] mb-2.5">Set a new password</Heading>
                            <Text textAlign={'center'} className="satoshi-medium">Create a new password to secure your account.</Text>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Field.Root my={4}>
                                    <Field.Label className="satoshi-medium">
                                        New Password
                                    </Field.Label>
                                    <InputGroup
                                        rounded={"6px"}
                                        border={"1px solid #B2B2B2"}
                                        startElement={<LuLock color="#B3B3B3" />}
                                        endElement={
                                            showPassword ? (
                                                <LuEye
                                                    color="#B3B3B3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                />
                                            ) : (
                                                <LuEyeOff
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    color="#B3B3B3"
                                                />
                                            )
                                        }
                                    >
                                        <Input
                                            {...register("password")}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                        />
                                    </InputGroup>
                                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root my={4}>
                                    <Field.Label className="satoshi-medium">
                                        Confirm New Password
                                    </Field.Label>
                                    <InputGroup
                                        rounded={"6px"}
                                        border={"1px solid #B2B2B2"}
                                        startElement={<LuLock color="#B3B3B3" />}
                                        endElement={
                                            showPassword ? (
                                                <LuEye
                                                    color="#B3B3B3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                />
                                            ) : (
                                                <LuEyeOff
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    color="#B3B3B3"
                                                />
                                            )
                                        }
                                    >
                                        <Input
                                            {...register("password")}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                        />
                                    </InputGroup>
                                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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

export default function ResetPassword() {
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
                <ResetPasswordFunc />
            </Suspense>
        </Flex>
    )
}