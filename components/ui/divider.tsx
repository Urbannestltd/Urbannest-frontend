import { Box } from "@chakra-ui/react"

interface DividerProps {
    my?: number
}
export const Divider = ({ my = 2 }: DividerProps) => {
    return (
        <Box
            bg={'#F1F1F1'}
            h={'1px'}
            w={'full'}
            my={my}
        />
    )
}