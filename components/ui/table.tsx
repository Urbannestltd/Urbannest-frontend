import * as React from 'react';
import { cn } from '@/utils/lib';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className='relative w-full overflow-auto'>
            <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    ),
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn(
            'hidden lg:table-header-group bg-[#F5F5F5]  [&_tr]:border-b-[#EAECF0]',
            className,
        )}
        {...props}
    />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0  my-10', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(' font-medium [&>tr]:last:border-b-0', className)}
        {...props}
    />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                'data-[state=selected]:bg-muted transition-colors hover:bg-transparent',
                className,
            )}
            {...props}
        />
    ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        style={{ color: '#303030', fontWeight: '500' }}
        className={cn(
            'h-10 text-nowrap  px-4  py-3 text-left align-middle text-[14px] satoshi-bold leading-3 text-[#303030] lg:text-sm lg:leading-[18px] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className,
        )}
        {...props}
    />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        style={{ color: '#303030' }}
        className={cn(
            ' text-nowrap  px-4  py-3   align-middle  text-[16px] satoshi-medium leading-5  tracking-tight text-[#303030] lg:h-[60px] lg:text-sm [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className,
        )}
        {...props}
    />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

const TableEmpty = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, colSpan = 1, children, ...props }, ref) => (
    <TableRow>
        <TableCell
            ref={ref}
            className={cn(
                'w-full max-w-[293px] whitespace-nowrap p-4 text-center align-middle text-sm',
                className,
            )}
            colSpan={colSpan}
            {...props}
        >
            <div className='flex items-center justify-center py-5'>{children}</div>
        </TableCell>
    </TableRow>
));

TableEmpty.displayName = 'TableEmpty';

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TableEmpty,
};
