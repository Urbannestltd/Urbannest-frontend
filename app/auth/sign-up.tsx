import { registerFormData, registerSchema } from "@/schema"
import { loginUserApi, registerUser } from "@/services/auth"
import { setAuthTokenHeader } from "@/services/https"
import useAuthStore from "@/store/auth"
import { Button, Field, Grid, Input, InputGroup } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation";

import {
    LuEye,
    LuEyeOff,
    LuLock,
    LuMail,
    LuPhone,
    LuUser,
} from "react-icons/lu"
import toast from "react-hot-toast"

export const SignUp = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<registerFormData>({
        defaultValues: {
            userPassword: "",
            userFullName: "",
            userPhone: "",
            userRoleName: "tenant",
            rememberMe: true,
        },
    })
    const [showPassword, setShowPassword] = useState(false)

    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const [email, hash] = token.split("$$");

    const {
        loginUser,
    } = useAuthStore()
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: (data: registerFormData) => {
            console.log(data);
            return registerUser(data, token || "")
        },


        onSuccess: async (_response, variables: registerFormData) => {
            toast.success('Account created successfully')
            const loginRes = await loginUserApi({
                email: email,
                password: variables.userPassword
            })

            if (!loginRes.data?.token || !loginRes.data?.user) return

            loginUser(
                loginRes.data.user,
                loginRes.data.token,
                variables.rememberMe
            )
            setAuthTokenHeader(loginRes.data.token)

            router.push("/tenant/dashboard")
        },
        onError: (error) => {
            toast.error(`Error logging in please try again: ${error?.message}`)
        },
    })
    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <Grid gapX={4} templateColumns={"repeat(2,1fr)"}>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Email Address</Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuMail color="#B3B3B3" />}
                    >
                        <Input value={email} readOnly placeholder="Email" />
                    </InputGroup>
                    <Field.ErrorText>{errors.root?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Password</Field.Label>
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
                            {...register("userPassword")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                        />
                    </InputGroup>
                    <Field.ErrorText>{errors.userPassword?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Full Name</Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuUser color="#B3B3B3" />}
                    >
                        <Input {...register("userFullName")} placeholder="Full Name" />
                    </InputGroup>
                    <Field.ErrorText>{errors.userFullName?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Phone Number</Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuPhone color="#B3B3B3" />}
                    >
                        <Input {...register("userPhone")} placeholder="Phone Number" />
                    </InputGroup>
                    <Field.ErrorText>{errors.userPhone?.message}</Field.ErrorText>
                </Field.Root>
            </Grid>
            <Button
                className="bg-button-primary hover:bg-button-hover text-white"
                my={8}
                w={"full"}
                p={3}
                h={"48px"}
                border={"1px solid #767676"}
                type="submit"
                disabled={mutation.isPending}
                loading={mutation.isPending}
            >
                Continue
            </Button>
        </form>
    )
}
