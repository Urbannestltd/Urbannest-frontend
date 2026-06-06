import { Box } from "@chakra-ui/react"

interface DividerProps {
    my?: number
    orientation?: 'horizontal' | 'vertical'
}
export const Divider = ({ my = 2, orientation = 'horizontal' }: DividerProps) => {
    return (
        <Box
            bg={'#F1F1F1'}
            h={orientation === 'vertical' ? 'full' : '1px'}
            w={orientation === 'horizontal' ? 'full' : '1px'}
            my={my}
        />
    )
}