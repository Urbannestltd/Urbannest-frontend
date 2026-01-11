import React from 'react';
import { Icon } from '@chakra-ui/react';
import { CgSpinner } from 'react-icons/cg';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'plain' | 'darkGhost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'auto';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactElement;
    iconColor?: string;
    iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-button-primary text-white hover:bg-button-hover',
    secondary:
        'bg-button-secondary',
    outline:
        'bg-transparent border border-button-primary text-button-primary hover:bg-button-hover hover:text-white',
    ghost:
        'bg-transparent border border-button-ghost',
    plain:
        'bg-button-plain',
    darkGhost:
        'bg-transparent border border-button-dark-ghost',

};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'w-[141px] h-[35px]',
    md: 'w-[219px]',
    lg: 'w-full',
    xl: 'w-[288px] h-[72px] flex justify-start',
    auto: 'w-auto',
};

export const MainButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconColor,
    iconPosition = 'left',
    loading,
    loadingText,
    fullWidth,
    ...props
}, ref) {
    const base =
        'cursor-pointer inline-flex items-center justify-center px-4 py-2 h-[45px] text-sm font-semibold rounded-[6px] border tracking-wide transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClassName = [base, variantStyles[variant], sizeStyles[size], props.className]
        .filter(Boolean)
        .join(' ');

    const renderIcon = (pos: 'left' | 'right') =>
        icon && iconPosition === pos
            ? (
                <Icon className={pos === 'left' ? 'mr-1' : 'ml-1'} color={iconColor}>
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        style: { color: iconColor || 'currentColor' }
                    })}
                </Icon>
            )
            : null;

    return (
        <button ref={ref} type={props.type ?? 'button'} {...props} className={combinedClassName}>
            {loading ? (
                <>
                    <CgSpinner size={12} className='mr-2 h-4 w-4 animate-spin' />
                    {loadingText}
                </>
            ) : (
                <>
                    {renderIcon('left')}
                    {children}
                    {renderIcon('right')}
                </>
            )}
        </button>
    );
});
