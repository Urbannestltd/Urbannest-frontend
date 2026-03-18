import { Input } from '@chakra-ui/react';
import { InputGroup } from './input-group';
import { FiSearch } from 'react-icons/fi';

export const SearchInput = ({ width }: { width?: string | number }) => {
    return (
        <InputGroup w={width} startElement={<FiSearch color='#B3B3B3' size='16px' />}>
            <Input
                h='34px'
                rounded='full'
                border='0.5px solid #D9D9D9'
                bg='#F5F5F5'
            />
        </InputGroup>
    );
};
