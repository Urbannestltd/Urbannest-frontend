'use client'
import { Box, Button, Field, Flex, Grid, Heading, HStack, Input, InputGroup, Span, Text } from "@chakra-ui/react";
import GoogleIcon from "@/app/assets/google-icon.svg"
import Image from "next/image";
import { useForm } from "react-hook-form";
import { loginFormData } from "@/schema";
import { LuEye, LuEyeOff, LuLock, LuMail, LuPhone, LuUser } from "react-icons/lu";
import { useState } from "react";

export default function SignIn() {
    const {
        control,
        register,
        formState: { errors },
    } = useForm<loginFormData>()
    const [isSignUp, setIsSignUp] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = (data: loginFormData) => {

    }

    return (
        <Flex justify={'center'} p={2}  >
            <Flex direction={'column'} mt={4} w={'468px'} align={'center'} h={'100%'} bg={'white'}>
                <Heading fontSize={'32px'} className="satoshi-bold">{isSignUp ? 'Let’s Get Started' : 'Welcome Back'}</Heading>
                <Button my={8} w={'full'} p={3} h={'48px'} className="satoshi-medium" border={'1px solid #767676'}>
                    <Image alt="google-icon" src={GoogleIcon} />Continue with Google
                </Button>
                <HStack mb={4} w={'full'}>
                    <Box bg='#757575' w={'45%'} mr={2} h={'1px'} />
                    <Text>Or</Text>
                    <Box bg='#757575' w={'45%'} ml={2} h={'1px'} />
                </HStack>
                <form className="w-full" action="">
                    <Grid gapX={4} templateColumns={isSignUp ? 'repeat(2,1fr)' : 'repeat(1,1fr)'}>
                        {isSignUp && <><Field.Root my={4}>
                            <Field.Label className="satoshi-medium">Full Name</Field.Label>
                            <InputGroup rounded={'6px'} border={'1px solid #B2B2B2'} startElement={<LuUser color="#B3B3B3" />}>
                                <Input {...register('fullName')} placeholder="Full Name" />
                            </InputGroup>
                            <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
                        </Field.Root>
                            <Field.Root my={4}>
                                <Field.Label className="satoshi-medium">Phone Number</Field.Label>
                                <InputGroup rounded={'6px'} border={'1px solid #B2B2B2'} startElement={<LuPhone color="#B3B3B3" />}>
                                    <Input {...register('phone')} placeholder="Phone Number" />
                                </InputGroup>
                                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                            </Field.Root></>}
                        <Field.Root my={4}>
                            <Field.Label className="satoshi-medium">Email Address</Field.Label>
                            <InputGroup rounded={'6px'} border={'1px solid #B2B2B2'} startElement={<LuMail color="#B3B3B3" />}>
                                <Input {...register('email')} placeholder="Email" />
                            </InputGroup>
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root my={4}>
                            <Field.Label className="satoshi-medium">Password</Field.Label>
                            <InputGroup rounded={'6px'} border={'1px solid #B2B2B2'} startElement={<LuLock color="#B3B3B3" />} endElement={showPassword ? <LuEye color="#B3B3B3" onClick={() => setShowPassword(!showPassword)} /> : <LuEyeOff onClick={() => setShowPassword(!showPassword)} color="#B3B3B3" />}>
                                <Input {...register('password')} type={showPassword ? "text" : "password"} placeholder="Password" />
                            </InputGroup>
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            {!isSignUp && <Text placeSelf={'end'} className="text-primary-gold satoshi-medium">Forgot Password?</Text>
                            }</Field.Root>
                    </Grid>
                    <Button className="bg-button-primary hover:bg-button-hover text-white" my={8} w={'full'} p={3} h={'48px'} border={'1px solid #767676'}>Continue</Button>
                </form>
                <Text className="satoshi-medium">Already have an account? <Span onClick={() => setIsSignUp(!isSignUp)} className="text-primary-gold cursor-pointer">{isSignUp ? 'Login' : 'Sign Up'}</Span></Text>
                <Text w={'full'} my={10} textAlign={'center'}>By clicking “continue” you agree to our <Span className="text-primary-gold">terms of service</Span> and <Span className="text-primary-gold">privacy policy</Span></Text>
            </Flex>
        </Flex>
    );
}