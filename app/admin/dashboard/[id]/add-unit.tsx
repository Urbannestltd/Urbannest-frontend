import { MainButton } from "@/components/ui/button"
import { CustomInput, CustomSelect } from "@/components/ui/custom-fields"
import { PageTitle } from "@/components/ui/page-title"
import { addUnitFormData } from "@/schema/admin"
import { Box, createListCollection, Flex, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const AddUnit = () => {
    const { control, reset, watch, handleSubmit, setValue, formState } =
        useForm<addUnitFormData>()



    return (
        <Box p={4}>
            <PageTitle
                title="Add A Unit"
                fontSize={"18px"}
                mb={7}
                spacing={0}
                subFontSize={"14px"}
            />
            <form>
                <HStack w={"full"} gap={4}>
                    <CustomInput
                        name='name'
                        width={"full"}
                        required
                        control={control}
                        label="Unit Name"
                        placeholder="Unit Name"
                    />
                    <CustomSelect
                        name='type'
                        width={"full"}
                        control={control}
                        collection={unitType}
                        label="Unit Type"
                        placeholder="Unit Type"
                    />
                </HStack>
                <HStack mt={4} w={"full"} gap={4}>
                    <CustomInput
                        name='property'
                        width={"full"}
                        required
                        control={control}
                        label="Property"
                        placeholder="Property"
                    />
                    <CustomSelect
                        name='floor'
                        width={"full"}
                        collection={Flooors}
                        required
                        control={control}
                        label="Floor"
                        placeholder="Floor"
                    />
                </HStack>
                <Flex mt={10} align={"center"} w={"full"}>
                    <MainButton size="lg" onClick={() => { }} type="submit">
                        Add Unit
                    </MainButton>
                </Flex>
            </form>
        </Box>
    )
}

const unitType = createListCollection({
    items: [
        { value: "SINGLE_UNIT", label: "Single Unit" },
        { value: "MULTI_UNIT", label: "Multi Unit" },
    ],
})

const Flooors = createListCollection({
    items: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
    ],
})