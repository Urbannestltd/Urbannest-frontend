import { Avatar } from "@/components/ui/avatar";
import { CustomInput } from "@/components/ui/custom-fields";
import { Button, HStack, VStack, Text, Grid, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuUserPlus } from "react-icons/lu";

interface Visitor {
    name: string;
    phone: string;
}
interface VisitorListProps {
    visitors: Visitor[]
    onChange: (list: Visitor[]) => void
}

export const VisitorList = ({ visitors, onChange }: VisitorListProps) => {
    const [visitorList, setVisitorList] = useState<Visitor[]>(visitors);

    const { handleSubmit, formState, reset, control } = useForm<Visitor>();

    const addVisitor = (data: Visitor) => {
        if (data.name && data.name !== '' || data.phone && data.phone !== '') {
            onChange([...visitors, { name: data.name, phone: data.phone }]);
            setVisitorList([...visitorList, { name: data.name, phone: data.phone }]);
            reset({ name: '', phone: '' });
        }
    };

    return (
        <>

            <HStack gap={4} align="end">
                <CustomInput
                    name="name"
                    control={control}
                    label="Visitor Name"
                    placeholder="John Doe"
                />
                <CustomInput
                    name='phone'
                    control={control}
                    label="Visitor Phone"
                    placeholder="123-456-7890"
                />

                <Button
                    disabled={!formState.isValid}
                    onClick={handleSubmit(addVisitor)}
                    bg="#F5F5F5"
                    className="hover:border disabled:bg-button-disabled disabled:text-text-disabled hover:border-button-primary rounded-full size-[40px]"
                >
                    <LuUserPlus size={16} color={'#CFAA67'} />
                </Button>
            </HStack>

            <Flex align="start" mt={4} gap={2} wrap={'wrap'}>
                {visitorList.map((visitor, index) => (
                    <HStack mr={4}>
                        <Avatar bg={'#CFAA67'} color={'white'} size={'sm'} name={visitor.name} />
                        <Text key={index}>
                            {visitor.name}
                        </Text>
                    </HStack>
                ))}
            </Flex>
        </>
    );
};
