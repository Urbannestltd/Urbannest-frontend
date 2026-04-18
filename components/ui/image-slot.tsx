import { Box, Flex, Image } from "@chakra-ui/react"
import { LuImage, LuX } from "react-icons/lu"

export const ImageSlot = ({
    src,
    className,
    alt,
    editMode,
    onDelete,
    boxSize
}: {
    src?: string
    className?: string
    alt?: string
    editMode?: boolean
    boxSize?: string
    onDelete?: () => void
}) => {
    return (
        <Box position={'relative'} boxSize={boxSize} className={className}>
            {editMode && src && (
                <Box
                    position={'absolute'}
                    top={'-8px'}
                    right={'-8px'}
                    zIndex={10}
                    bg={'#C00F0C'}
                    borderRadius={'full'}
                    boxSize={'20px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    cursor={'pointer'}
                    onClick={onDelete}
                >
                    <LuX size={12} color="white" />
                </Box>
            )}
            {src ? (
                <Image src={src} className="w-full h-full object-cover rounded-lg" alt={alt} />
            ) : (
                <Flex
                    w={'full'}
                    h={'full'}
                    align={'center'}
                    justify={'center'}
                    bg={'#F0F0F0'}
                    borderRadius={'8px'}
                    cursor={editMode ? 'pointer' : 'default'}
                >
                    <LuImage size={24} color={'#CCCCCC'} />
                </Flex>
            )}
        </Box>
    )
}