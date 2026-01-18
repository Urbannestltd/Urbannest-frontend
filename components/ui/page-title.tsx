import { Heading, Stack, Text } from '@chakra-ui/react';

interface PageTitleProps {
    title: string;
    titleColor?: string;
    subText?: string;
    fontSize?: string | number;
    subFontSize?: string | number;
    fontWeight?: string | number;
    subTextColor?: string;
    spacing?: string | number;
    py?: string | number;
    mb?: string | number;
    mt?: string | number;
}

export const PageTitle = ({
    title,
    titleColor = '#303030',
    subText,
    subFontSize = 'md',
    fontSize = '25px',
    fontWeight = 'bold',
    subTextColor = '#303030',
    spacing = 2,
    py,
    mb,
    mt
}: PageTitleProps) => {
    return (
        <Stack gap={spacing} mb={mb} mt={mt} py={py} maxW='500px'>
            <Heading className='satoshi-bold' fontSize={fontSize} color={titleColor}>
                {title}
            </Heading>
            {subText && (
                <Text fontSize={subFontSize} color={subTextColor}>
                    {subText}
                </Text>
            )}
        </Stack>
    );
};