import { useFileUploadContext, FileUpload } from "@chakra-ui/react"
import { LuUpload, LuImage } from "react-icons/lu"
import { MainButton } from "@/components/ui/button"
import { Box, Flex, HStack, Grid } from "@chakra-ui/react"

const MAX_FILES = 4 // 1 large + 3 small

const PlaceholderBox = ({ className }: { className?: string }) => (
    <Flex
        className={className}
        align="center"
        justify="center"
        bg="#F0F0F0"
        borderRadius="12px"
        w="full"
        h="full"
    >
        <LuImage size={32} color="#CCCCCC" />
    </Flex>
)

const GalleryItem = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles

    const getFile = (index: number) => files[index] ?? null

    return (
        <Box w={'full'}>

            <Box w="full" h="177px" borderRadius="8px" overflow="hidden" mb={3}>
                {getFile(0) ? (
                    <FileUpload.ItemGroup className="">
                        <FileUpload.Item w="full" h="full" p={0} file={getFile(0)!}>
                            <FileUpload.ItemPreviewImage
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                alt="Main preview"
                            />
                        </FileUpload.Item>
                    </FileUpload.ItemGroup>
                ) : (
                    <PlaceholderBox />
                )}
            </Box>

            <FileUpload.ItemGroup className="">
                <HStack gap={3} mb={3}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} w="full" h="93px" borderRadius="8px" overflow="hidden">
                            {getFile(i) ? (
                                <FileUpload.Item w="full" h="full" p={0} file={getFile(i)!}>
                                    <FileUpload.ItemPreviewImage
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                        alt={`Preview ${i + 1}`}
                                    />
                                </FileUpload.Item>
                            ) : (
                                <PlaceholderBox />
                            )}
                        </Box>
                    ))}
                </HStack>
            </FileUpload.ItemGroup>
        </Box>
    )
}

export const UploadGallery = ({
    onFileChange,
}: {
    onFileChange: (files: File[] | null) => void
}) => {
    return (
        <FileUpload.Root
            maxFiles={MAX_FILES}
            accept="image/*"
            onFileChange={(details) => onFileChange?.(details.acceptedFiles || null)}
        >
            <FileUpload.HiddenInput />
            <FileUpload.Context>
                {() => <GalleryItem />}
            </FileUpload.Context>
            <FileUpload.Trigger asChild>
                <MainButton size="lg" variant="outline" icon={<LuUpload />} >
                    Upload Image
                </MainButton>
            </FileUpload.Trigger>
        </FileUpload.Root>
    )
}