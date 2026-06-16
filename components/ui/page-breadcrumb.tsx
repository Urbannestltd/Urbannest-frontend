import * as React from 'react';;
import { Breadcrumb } from '@chakra-ui/react';
import { RiHome6Line } from 'react-icons/ri';
import Link from 'next/link';

type Crumb = {
    label: React.ReactNode;
    href?: string;
    to?: string;
    isCurrent?: boolean;
};

type AppBreadcrumbProps = {
    items: Crumb[];
    showHome?: boolean;
    homeHref?: string;
    homeIcon?: React.ReactNode;
} & React.ComponentProps<typeof Breadcrumb.Root>;

export const PageBreadcrumb: React.FC<AppBreadcrumbProps> = ({
    items,
    showHome = false,
    homeHref = '/',
    homeIcon = <RiHome6Line color='#667085' />,
    ...rootProps
}) => {
    const fullItems: Crumb[] = showHome ? [{ label: homeIcon, href: homeHref }, ...items] : items;

    return (
        <Breadcrumb.Root {...rootProps}>
            <Breadcrumb.List gap={2}>
                {fullItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <Breadcrumb.Item>
                            {item.isCurrent ? (
                                <Breadcrumb.CurrentLink className='font-semibold text-[#303030] py-1 rounded-md'>
                                    {item.label}
                                </Breadcrumb.CurrentLink>
                            ) : item.to ? (
                                <Breadcrumb.Link asChild className='text-[#303030] font-medium cursor-pointer'>
                                    <Link href={item.to}>{item.label}</Link>
                                </Breadcrumb.Link>
                            ) : item.href ? (
                                <Breadcrumb.Link href={item.href} className='text-[#303030] font-medium cursor-pointer'>
                                    {item.label}
                                </Breadcrumb.Link>
                            ) : (
                                <Breadcrumb.Link className='text-[#303030] font-medium cursor-pointer'>
                                    {item.label}
                                </Breadcrumb.Link>
                            )}
                        </Breadcrumb.Item>
                        {idx < fullItems.length - 1 && <Breadcrumb.Separator color='#303030' />}
                    </React.Fragment>
                ))}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
}