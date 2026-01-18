import { loginFormData, loginSchema } from "@/schema"
import { clearStoredCredentials, getStoredCredentials, loginUserApi, saveCredentials } from "@/services/auth"
import { setAuthTokenHeader } from "@/services/https"
import useAuthStore from "@/store/auth"
import { Button, Field, Grid, Input, InputGroup, Text } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
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
    const { loginUser } = useAuthStore()
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: (data: loginFormData) => {
            return loginUserApi(data)
        },

        onSuccess: async (response, variables: loginFormData) => {
            toast.success('Logged in')
            const remember = !!variables.rememberMe;

            if (response.data?.token && response.data?.user) {
                loginUser(
                    response.data.user,
                    response.data.token,
                    remember
                )
                setAuthTokenHeader(response.data.token)

                await new Promise(resolve => setTimeout(resolve, 200))

                const lsData = localStorage.getItem('auth-storage')
                console.log("📦 localStorage:", lsData);

                const storedUser = useAuthStore.getState().user
                console.log("🔍 User in store:", storedUser);

                if (!storedUser) {
                    console.error("❌ User not in store!");
                    return;
                }

                const role = response.data.user.role;
                console.log("🎯 User role:", role);

                if (role === "admin") {
                    console.log("→ Redirecting to admin dashboard");
                    router.replace("/admin/dashboard")
                } else if (role === "tenant") {
                    console.log("→ Redirecting to tenant dashboard");
                    router.replace("/tenant/dashboard")
                }
                return;
            } else {
                console.error("❌ Missing token or user in response");
            }

            // Handle remember me for credentials
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

        onError: (error) => {
            toast.error(`Error logging in please try again: ${error?.message}`)
        }
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
                type="submit"
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