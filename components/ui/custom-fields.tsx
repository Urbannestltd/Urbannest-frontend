import * as React from 'react';
import { Control, FieldPath, FieldValues, Controller, useController } from 'react-hook-form';
import { Field, Select, Portal, Text, Input, NumberInput, Textarea, Box, useSelectContext, Flex, RadioGroup, Fieldset, Stack, Checkbox, CheckboxGroup, CheckboxRootProps, Switch, SelectRootProps } from '@chakra-ui/react';
import { Avatar } from './avatar';
import { InputGroup } from './input-group';

const isMobile = window.innerWidth < 500;
type BaseProps<T extends FieldValues> = {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    fieldProps?: React.ComponentProps<typeof Field.Root>;
    trimOnBlur?: boolean;
    description?: string;
    readOnly?: boolean;
    width?: string | number;
    orientation?: 'horizontal' | 'vertical';
    bg?: string
    required?: boolean
};

export type Option = { label: string; value: string, description?: string } & Record<string, any>;

type CustomSelectProps<T extends FieldValues> = BaseProps<T> & {
    collection: any;
    isLoading?: boolean;
    multiple?: boolean;
    arrayValue?: boolean;
    renderItem?: (item: Option) => React.ReactNode;
    triggerHeight?: string;
    errorTextFallback?: string;
    avatar?: boolean;
    value?: any;
    labelBold?: boolean
    labelWidth?: string | number;
    alignCenter?: boolean
    size?: SelectRootProps['size']
};

type InputProps<T extends FieldValues> = BaseProps<T> & {
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    inputProps?: Omit<
        React.ComponentProps<typeof Input>,
        'name' | 'value' | 'onChange' | 'onBlur' | 'ref'
    >;
    height?: string | number;
    readOnly?: boolean;
    value?: any;
    description?: string;
    labelWidth?: string | number;
    setValue?: (value: any) => void
    startElement?: React.ReactNode
    endElement?: React.ReactNode
};

type TextareaProps<T extends FieldValues> = BaseProps<T> & {
    textareaProps?: Omit<
        React.ComponentProps<typeof Textarea>,
        'name' | 'value' | 'onChange' | 'onBlur' | 'ref'
    >;
    minH?: string | number;
    description?: string;
    readOnly?: boolean;
    value?: string;
    labelWidth?: string | number;
    labelBold?: boolean
};

type NumberInputProps<T extends FieldValues> = BaseProps<T> & {
    min?: number;
    max?: number;
    step?: number;
    height?: string | number;
    parseAsNumber?: boolean;
    description?: string;
    labelWidth?: string | number;
};

type RadioButtonProps<T extends FieldValues> = BaseProps<T> & {
    options: Option[];
    description?: string;
    labelWidth?: string | number;
    renderItem?: (item: Option) => React.ReactNode;
    isLoading?: boolean;
    multiple?: boolean;
    arrayValue?: boolean;
    triggerHeight?: string;
    errorTextFallback?: string;
    avatar?: boolean;
    value?: any;
    buttonDirection?: 'row' | 'column';
};

type CheckboxProps<T extends FieldValues> = BaseProps<T> & {
    options: Option;
    description?: string;
    labelWidth?: string | number;
    renderItem?: (item: Option) => React.ReactNode;
    isLoading?: boolean;
    multiple?: boolean;
    arrayValue?: boolean;
    triggerHeight?: string;
    errorTextFallback?: string;
    avatar?: boolean;
    variant?: CheckboxRootProps['variant'];
    value?: any;
    buttonDirection?: 'row' | 'column';
};

type SwitchProps<T extends FieldValues> = BaseProps<T> & {
    options: Option;
    description?: string;
    labelWidth?: string | number;
    renderItem?: (item: Option) => React.ReactNode;
    isLoading?: boolean;
    multiple?: boolean;
    arrayValue?: boolean;
    triggerHeight?: string;
    errorTextFallback?: string;
    value?: any;
}

export function CustomSelect<T extends FieldValues>({
    name,
    control,
    label,
    collection,
    placeholder,
    isLoading = false,
    multiple = false,
    arrayValue = true,
    disabled = false,
    renderItem,
    triggerHeight = '40px',
    fieldProps,
    errorTextFallback,
    alignCenter,
    description,
    readOnly,
    width,
    required,
    orientation = 'vertical',
    avatar,
    labelBold,
    labelWidth,
    size,
    bg = 'white',
    value
}: CustomSelectProps<T>) {
    const SelectValue = () => {
        const select = useSelectContext();
        const items = select.selectedItems as Array<{
            label: string;
            avatar: string;
            name: string;
            image: string;
        }>;

        const [selectedItems, setSelectedItems] = React.useState<
            Array<{ label: string; avatar: string; name: string; image: string }>
        >([]);

        React.useEffect(() => {
            if (items) {
                setSelectedItems(items);
            }
        }, [items]);

        if (!items || items.length === 0) {
            return (
                <Select.ValueText
                    fontSize="14px"
                    placeholder={placeholder}
                    p={2}
                    _placeholder={{ color: "#667085" }}
                    color="#101828"
                >
                    {placeholder}
                </Select.ValueText>
            );
        }

        return (
            <Flex gap={2} h={'fit'} wrap="wrap" p={2}>
                {selectedItems.map((item, index) => (
                    <Flex
                        key={index}
                        align="center"
                        border={'1px solid #D0D5DD'}
                        borderRadius="md"
                        p="4px 8px"
                    >
                        <Avatar className='size-6' src={item.avatar || item.image} name={item.label || item.name} />
                        <Text ml={2} fontWeight={'medium'} fontSize="14px">
                            {item.label || item.name}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        );
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required ? `${label ?? name} is required` : false }}
            render={({ field, fieldState }) => {
                const errorMsg = (fieldState.error?.message as string | undefined) ?? errorTextFallback;

                const currentValue = field.value ?? [value];

                const valueForSelect = multiple
                    ? (currentValue ?? [])
                    : arrayValue
                        ? (currentValue ?? [])
                        : [currentValue ?? ''];

                return (
                    <Field.Root orientation={orientation} justifyContent={'start'} invalid={!!fieldState.error} {...fieldProps}>

                        <Field.Label
                            className={labelBold ? 'satoshi-bold' : `satoshi-medium`}
                        >{label}
                        </Field.Label>

                        <Select.Root
                            multiple={multiple}
                            collection={collection}
                            name={field.name}
                            value={valueForSelect}
                            border={'1px solid #A0A0A0'}
                            rounded={'md'}
                            width={width}
                            disabled={disabled}
                            readOnly={readOnly}
                            color={'black'}
                            bg={bg}
                            size={size}
                            onInteractOutside={() => field.onBlur()}
                            onValueChange={(event) => {
                                if (multiple) {
                                    field.onChange(event.value);
                                } else {
                                    const v = event.value[0] ?? '';
                                    field.onChange(arrayValue ? [v] : v);
                                }
                            }}
                        >
                            {multiple && <Select.HiddenSelect />}
                            <Select.Control >
                                <Select.Trigger h={avatar ? 'fit' : triggerHeight}>
                                    {isLoading ? (
                                        <Text>Loading...</Text>
                                    ) : (
                                        avatar ? <SelectValue /> : <Select.ValueText p={2} textAlign={alignCenter ? 'center' : 'start'} w={'full'} placeholder={placeholder} fontSize={'14px'} _placeholder={{ color: '#B3B3B3' }} color='black' />
                                    )}
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>

                            <Portal >
                                <Select.Positioner w={width} >
                                    <Select.Content p={2} w={'96%'} zIndex='9999' bg='white'>
                                        {collection.items.map((item: Option) => (
                                            <Select.Item
                                                justifyContent={'start'}
                                                item={item as any}
                                                key={item.value ?? item.label ?? item.title ?? item.name}
                                                p={1}
                                                mb={1}
                                                w={'full'}
                                                color='#101828'
                                            >
                                                {avatar &&
                                                    <Avatar
                                                        name={item.label || item.title || item.name}
                                                        src={item.avatar || item.image}
                                                        size='xs'
                                                    />
                                                }
                                                {renderItem ? renderItem(item) : item.label || item.title || item.name}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        {errorMsg && <Field.ErrorText>{errorMsg}</Field.ErrorText>}
                    </Field.Root>

                );
            }}
        />
    );
}


export function CustomInput<T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    disabled,
    fieldProps,
    trimOnBlur,
    type = 'text',
    inputProps,
    height = '3rem',
    width,
    readOnly,
    required,
    value,
    setValue,
    description,
    labelWidth,
    orientation = 'vertical',
    startElement,
    endElement
}: InputProps<T>) {
    const { field, fieldState, } = useController({
        name, control, rules: {
            required: required ? `${label ?? name} is required` : false,
        },
    });
    return (
        <div>
            <Field.Root orientation={orientation} justifyContent={'start'} invalid={!!fieldState.error} {...fieldProps}>
                {label && <Box>
                    <Field.Label className='satoshi-medium'>
                        {label}{label && required && '*'}
                    </Field.Label>
                </Box>}
                {startElement || endElement ? (
                    <InputGroup startElement={startElement} endElement={endElement} w={width}>
                        <Input
                            {...inputProps}
                            type={type}
                            name={field.name}
                            ref={field.ref}
                            value={field.value ?? value}
                            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                                e.currentTarget.showPicker()
                            }}
                            onChange={(e) => {
                                field.onChange(e.target.value);
                                setValue && setValue?.(e.target.value)
                            }}
                            onBlur={(e) => {
                                if (trimOnBlur) {
                                    const v = (e.target.value ?? '').trim();
                                    if (v !== field.value) field.onChange(v);
                                }
                                field.onBlur();
                            }}
                            disabled={disabled}
                            placeholder={placeholder}
                            color={'black'}
                            bg={readOnly ? '#F9FAFB' : 'white'}
                            p={3}
                            h={height}
                            w={width}
                            border={'1px solid #B2B2B2'}
                            rounded={'6px'}
                            fontSize={"14px"}
                            className=''
                            _active={{
                                border: 'none',
                            }}
                        />
                    </InputGroup>
                ) : (
                    <Input
                        {...inputProps}
                        type={type}
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? value}
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                            e.currentTarget.showPicker()
                        }}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                            setValue && setValue?.(e.target.value)
                        }}
                        onBlur={(e) => {
                            if (trimOnBlur) {
                                const v = (e.target.value ?? '').trim();
                                if (v !== field.value) field.onChange(v);
                            }
                            field.onBlur();
                        }}
                        disabled={disabled}
                        placeholder={placeholder}
                        color={'black'}
                        bg={readOnly ? '#F9FAFB' : 'white'}
                        p={3}
                        h={height}
                        w={width}
                        border={'1px solid #B2B2B2'}
                        rounded={'6px'}
                        fontSize={"14px"}
                        className=''
                        _active={{
                            border: 'none',
                        }}
                    />
                )}
                {fieldState.error?.message && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
            </Field.Root >
        </div>
    );
}




export function CustomTextarea<T extends FieldValues>({
    value,
    name,
    control,
    label,
    placeholder,
    disabled,
    fieldProps,
    trimOnBlur,
    textareaProps,
    minH = '100px',
    labelBold,
    width,
    description,
    readOnly,
    orientation = 'vertical'
}: TextareaProps<T>) {
    const { field, fieldState } = useController({ name, control });
    return (
        <div>
            <Field.Root orientation={orientation} invalid={!!fieldState.error} {...fieldProps}>
                <Box>
                    <Field.Label
                        w={'fit'}
                        color='#344054'
                        display={'flex'}
                        alignItems={'flex-start'}
                        flexDirection={'column'}
                    >
                        <Text className={labelBold ? 'satoshi-bold' : 'satoshi-medium'}>{label}</Text>
                        <Text fontWeight={'normal'} w={orientation === 'horizontal' ? !isMobile ? '15vw' : 'full' : 'full'} fontSize={'14px'} color={'#475467'}>
                            {description}
                        </Text>
                    </Field.Label>
                </Box>
                <Textarea
                    {...textareaProps}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={(e) => {
                        if (trimOnBlur) {
                            const v = (e.target.value ?? '').trim();
                            if (v !== field.value) field.onChange(v);
                        }
                        field.onBlur();
                    }}
                    disabled={disabled}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    p={3}
                    color={'black'}
                    bg={'white'}
                    border={'1px solid #A0A0A0'}
                    rounded={'8px'}
                    minH={minH}
                    w={width}
                    size='sm'
                />
                {fieldState.error?.message && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
            </Field.Root>
        </div>
    );
}

export function CustomNumberInput<T extends FieldValues>({
    name,
    control,
    label,
    min,
    max,
    parseAsNumber = false,
    fieldProps,
    height = '3rem',
    width = '6rem',
    step = 1,
    readOnly,
    placeholder,
    description,
    labelWidth,
    orientation = 'horizontal'
}: NumberInputProps<T>) {
    const { field, fieldState } = useController({ name, control });
    const stringValue = field.value === undefined || field.value === null ? '' : String(field.value);
    return (
        <div>
            <Field.Root orientation={orientation} justifyContent={'start'} invalid={!!fieldState.error} {...fieldProps}>
                <Box>
                    <Field.Label
                        w={labelWidth ?? 'fit'}
                        color='#344054'
                        display={'flex'}
                        alignItems={'flex-start'}
                        flexDirection={'column'}
                    >
                        <Text color={'#344054'}>{label}</Text>
                        {description && <Text fontWeight={'normal'} w={orientation === 'horizontal' ? !isMobile ? '15vw' : 'full' : 'full'} fontSize={'14px'} color={'#475467'}>
                            {description}
                        </Text>}
                    </Field.Label>
                </Box>
                <NumberInput.Root
                    defaultValue='1'
                    min={min}
                    max={max}
                    step={step}
                    readOnly={readOnly}
                    w={width}
                    value={stringValue}
                    onValueChange={(e: any) => {
                        const v = typeof e === 'string' ? e : (e?.value ?? '');
                        field.onChange(parseAsNumber ? (v === '' ? '' : Number(v)) : v);
                    }}
                >
                    <NumberInput.Control />
                    <NumberInput.Input
                        ref={field.ref}
                        p={2}
                        h={height}
                        w={'full'}
                        color={readOnly ? '#475467' : 'black'}
                        bg={readOnly ? '#F9FAFB' : 'white'}
                        border={'1px solid #D0D5DD'}
                        rounded={'8px'}
                        placeholder={placeholder}
                        onChange={(e) => field.onChange(e.target.value)}
                        fontSize={"14px"}
                        className='shadow-[0px_1px_2px_0px_#1018280D]'
                        _active={{
                            border: '',
                        }}
                    />
                </NumberInput.Root>
                {fieldState.error?.message && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
            </Field.Root>
        </div>
    );
}

export function CustomRadio<T extends FieldValues>({ name,
    control,
    options,
    label,
    disabled = false,
    renderItem,
    fieldProps,
    errorTextFallback,
    description,
    width,
    orientation = 'horizontal',
    buttonDirection = 'row',
    labelWidth }: RadioButtonProps<T>) {

    return (

        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const errorMsg = (fieldState.error?.message as string | undefined) ?? errorTextFallback;

                return (
                    <Field.Root orientation={orientation} justifyContent={'start'} invalid={!!fieldState.error} {...fieldProps}>
                        <Box>
                            <Field.Label
                                w={labelWidth ?? 'fit'}
                                color='#344054'
                                display={'flex'}
                                alignItems={'flex-start'}
                                flexDirection={'column'}
                            >
                                <Text color={'#344054'}>{label}</Text>
                                {description && <Text fontWeight={'normal'} w={orientation === 'horizontal' ? !isMobile ? '15vw' : 'full' : 'full'} fontSize={'14px'} color={'#475467'}>
                                    {description}
                                </Text>}
                            </Field.Label>
                        </Box>
                        <RadioGroup.Root p={2}
                            size={'md'}
                            color={'#475467'}
                            bg={'#F9FAFB'}
                            border={'1px solid #D0D5DD'}
                            rounded={'8px'} width={width} disabled={disabled} name={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} >
                            <Stack direction={buttonDirection}>
                                {options.map((option) => (
                                    <RadioGroup.Item key={option.value} my={3} colorPalette={'purple'} value={option.value} disabled={option.disabled}>
                                        <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                                        <RadioGroup.ItemIndicator border={'1px solid #D0D5DD'} />
                                        {renderItem ? renderItem(option) : <RadioGroup.Label>{option.label}</RadioGroup.Label>}
                                    </RadioGroup.Item>
                                ))}
                            </Stack>
                            {errorMsg && <Field.ErrorText>{errorMsg}</Field.ErrorText>}
                        </RadioGroup.Root>
                    </Field.Root>
                )
            }}
        />
    )
}


export function CustomCheckbox<T extends FieldValues>({ name,
    control,
    options,
    label,
    renderItem,
    description,
    variant = 'outline',
    width,
    orientation = 'horizontal',
    labelWidth }: CheckboxProps<T>) {
    const { field, fieldState } = useController({ name, control });

    return (
        <Fieldset.Root justifyContent={'start'} invalid={!!fieldState.error} >
            <CheckboxGroup value={field.value}
                onValueChange={field.onChange} name={name} >
                <>
                    <Checkbox.Root variant={variant} key={options.value} width={width} mb={1} value={options.value} disabled={options.disabled}>
                        <Checkbox.HiddenInput onBlur={field.onBlur} />
                        <Checkbox.Control rounded={'sm'} border={'1.5px solid #2A3348'} ><Checkbox.Indicator /></Checkbox.Control>
                        {renderItem ? renderItem(options) : <Checkbox.Label>
                            <Box mt={3}>
                                <Text fontSize={'16px'} className={options.description ? 'satoshi-bold' : 'satoshi'}>{options.label}</Text>
                                <Text>{options.description}</Text>
                            </Box></Checkbox.Label>}
                    </Checkbox.Root>
                    {fieldState.error && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
                </>


            </CheckboxGroup>
        </Fieldset.Root>
    )
}

export function CustomDatePicker<T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    disabled,
    fieldProps,
    trimOnBlur,
    required,
    type = 'text',
    inputProps,
    height = '40px',
    width,
    readOnly,
    value,
    orientation = 'vertical'
}: InputProps<T>) {
    const { field, fieldState } = useController({ name, control });
    return (
        <Field.Root orientation={orientation} justifyContent={'start'} invalid={!!fieldState.error} {...fieldProps}>
            <Box>
                <Field.Label className='satoshi-medium'>
                    {label}{required && '*'}
                </Field.Label>
            </Box>
            <Input
                {...inputProps}
                type={type}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={trimOnBlur ? field.onBlur : undefined}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                height={height}
                width={width}
            />
            {fieldState.error && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
        </Field.Root>
    )
}

export function CustomSwitch<T extends FieldValues>({
    name,
    control,
    label,
    disabled,
    height = '40px',
    width,
    readOnly,
    value,
    orientation = 'vertical'
}: InputProps<T>) {
    return (
        <Stack mt={2} >
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <Field.Root invalid={!!!fieldState.error}>
                        <Switch.Root
                            name={field.name}
                            checked={field.value}
                            colorPalette={'green'}
                            disabled={disabled}
                            readOnly={readOnly}
                            onCheckedChange={({ checked }) => field.onChange(checked)}
                        >
                            <Switch.HiddenInput onBlur={field.onBlur} />
                            <Switch.Control />
                            <Switch.Label>{label}</Switch.Label>
                        </Switch.Root>
                        {fieldState.error && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}
                    </Field.Root>
                )}
            />
        </Stack>
    )
}