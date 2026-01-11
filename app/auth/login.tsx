import { loginFormData, loginSchema } from "@/schema"
import { clearStoredCredentials, getStoredCredentials, loginUser, saveCredentials } from "@/services/auth"
import { storeRefreshToken, storeUserToken } from "@/services/cookies"
import { setAuthTokenHeader } from "@/services/https"
import useAuthStore from "@/store/auth"
import { Button, Field, Grid, Input, InputGroup, Text } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LuEye, LuEyeOff, LuLock, LuMail } from "react-icons/lu"

export const Login = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<loginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        }
    })
    const [showPassword, setShowPassword] = useState(false)

    const { loginUser: persistUser } = useAuthStore()
    const setUser = useAuthStore((state) => state.setUser)

    const router = useRouter()

    const mutation = useMutation({
        mutationFn: (data: loginFormData) => {
            return loginUser(data)
        },

        onSuccess: (response, variables: loginFormData) => {
            const remember = !!variables.rememberMe
            if (response.data?.accessToken && response.data?.user) {
                setUser(response.data.user)
                persistUser(
                    response.data.user,
                    response.data.accessToken,
                    response.data.refreshToken,
                    remember
                )
                storeUserToken(response.data.accessToken, variables.rememberMe)
                storeRefreshToken(response.data.refreshToken, variables.rememberMe)
                setAuthTokenHeader(response.data.accessToken)

                if (response.data.user.user.role === "admin") {
                    router.push("/admin/dashboard")
                } else if (response.data.user.user.role === "tenant") {
                    router.push("/tenant/dashboard")
                }
                return
            }

            if (remember) {
                if (variables.email && variables.password) {
                    saveCredentials(variables.email, variables.password)
                } else {
                    clearStoredCredentials()
                }
            } else {
                clearStoredCredentials()
            }
        },
    })
    useEffect(() => {
        const storedCredentials = getStoredCredentials()
        if (storedCredentials) {
            setValue("email", storedCredentials.email, { shouldValidate: true })
            setValue("password", storedCredentials.password, { shouldValidate: true })
            setValue("rememberMe", true)
        }
    }, [setValue])
    return (
        <><form
            className="w-full"
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
            <Grid
                gapX={4}
                templateColumns={"repeat(1,1fr)"}
            >

                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">
                        Email Address
                    </Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuMail color="#B3B3B3" />}
                    >
                        <Input {...register("email")} placeholder="Email" />
                    </InputGroup>
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
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
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                        />
                    </InputGroup>
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>

                    <Text
                        placeSelf={"end"}
                        className="text-primary-gold satoshi-medium cursor-pointer"
                        onClick={() => router.push('/auth/forgot-password')}
                    >
                        Forgot Password?
                    </Text>
                </Field.Root>
            </Grid>
            <Button
                className="bg-button-primary hover:bg-button-hover text-white"
                disabled={mutation.isPending}
                loading={mutation.isPending}
                my={8}
                w={"full"}
                p={3}
                h={"48px"}
                border={"1px solid #767676"}
            >
                Continue
            </Button>
        </form></>
    )
}