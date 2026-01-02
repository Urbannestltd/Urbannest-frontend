import { registerFormData, registerSchema } from "@/schema"
import { Button, Field, Grid, Input, InputGroup } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
    LuEye,
    LuEyeOff,
    LuLock,
    LuMail,
    LuPhone,
    LuUser,
} from "react-icons/lu"

export const SignUp = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<registerFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    })
    const [showPassword, setShowPassword] = useState(false)

    return (
        <form>
            <Grid gapX={4} templateColumns={"repeat(2,1fr)"}>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Email Address</Field.Label>
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
                </Field.Root>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Full Name</Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuUser color="#B3B3B3" />}
                    >
                        <Input {...register("fullName")} placeholder="Full Name" />
                    </InputGroup>
                    <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root my={4}>
                    <Field.Label className="satoshi-medium">Phone Number</Field.Label>
                    <InputGroup
                        rounded={"6px"}
                        border={"1px solid #B2B2B2"}
                        startElement={<LuPhone color="#B3B3B3" />}
                    >
                        <Input {...register("phone")} placeholder="Phone Number" />
                    </InputGroup>
                    <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                </Field.Root>
            </Grid>
            <Button
                className="bg-button-primary hover:bg-button-hover text-white"
                my={8}
                w={"full"}
                p={3}
                h={"48px"}
                border={"1px solid #767676"}
            >
                Continue
            </Button>
        </form>
    )
}
