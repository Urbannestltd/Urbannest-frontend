import { Input } from '@chakra-ui/react';
import { InputGroup } from './input-group';
import { FiSearch } from 'react-icons/fi';

type SearchInputProps = {
    width?: string | number
    value?: string
    onChange?: (value: string) => void
    onSearch?: (value: string) => void
    placeholder?: string
}

export const SearchInput = ({ width, value, onChange, onSearch, placeholder }: SearchInputProps) => {
    return (
        <InputGroup w={width} startElement={<FiSearch color='#B3B3B3' size='16px' />}>
            <Input
                h='34px'
                rounded='full'
                border='0.5px solid #D9D9D9'
                bg='#F5F5F5'
                value={value}
                placeholder={placeholder ?? 'Search...'}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch?.(value ?? '')
                }}
            />
        </InputGroup>
    );
};