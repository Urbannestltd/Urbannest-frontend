import { useEffect, useMemo, useState } from 'react';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { cn } from '@/utils/lib';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from './table';

import { Paginator } from './paginator';
import { Box, Skeleton } from '@chakra-ui/react';
import Image from 'next/image';
import { da } from 'zod/v4/locales';


export type EmptyDetails = {
    icon: string;
    title: string;
    description: string;
}

export type PaginationMeta = {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize?: number;
};

export type stageProps<TData> = {
    title: string,
    data: TData[],
    emptyMessage?: string
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[] | null;
    onRowClick?: (row: TData) => void;
    pagination?: PaginationMeta;
    onPage?: (page: number) => void;
    loading?: boolean;
    tableName?: string;
    emptyDetails?: EmptyDetails
    stages?: stageProps<TData>[]
    showStages?: boolean
    headerColor?: string
    borderRadius?: any
    px?: any
    my?: any
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    pagination,
    onPage,
    loading = false,
    tableName,
    emptyDetails,
    borderRadius,
    headerColor,
    px,
    my
}: DataTableProps<TData, TValue>) {

    const pageSize = pagination?.pageSize || 10;
    const totalPages = Math.ceil((data?.length ?? 0) / pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() =>
        data?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [],
        [data, currentPage, pageSize]
    );


    const tableData = (currentData ?? []);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    const isDataEmpty = !data || data.length === 0

    const skeletonData = new Array(5).fill(null);


    return (
        <>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                }}
                className={`h-full w-full ${px}  ${my ? `my-[${my}]` : 'my-10'} rounded-md  py-2 ${headerColor && `bg-[${headerColor}]`} sm:rounded-xl`}
            >
                <Table>
                    <TableHeader className=' bg-[#F5F5F5] rounded-full'  >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={tableName + headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={tableName + header.id} className='!font-semibold  !text-[#475467]'>
                                        {!header.isPlaceholder &&
                                            flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            skeletonData.map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <Skeleton className='h-8 w-full' />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {isDataEmpty ? (
                                    <TableEmpty colSpan={columns.length} className=''>
                                        <div className='flex flex-col items-center justify-center space-y-6'>
                                            <div className='flex items-center justify-center'>
                                                {emptyDetails?.icon ? <Image src={emptyDetails?.icon} alt="" /> : <Box rounded={'full'} className='bg-primary-gold' boxSize={'40px'} />}
                                            </div>

                                            <div className='flex flex-col items-center justify-center space-y-2'>
                                                <h4 className='text-xl font-bold text-[#303030]'> {emptyDetails?.title || `No ${tableName} found`}</h4>
                                                <p className='text-sm font-medium text-[#6A6C88]'>
                                                    {emptyDetails?.description || `No ${tableName} found`}
                                                </p>
                                            </div>
                                        </div>
                                    </TableEmpty>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick?.(row.original)}
                                            data-state={row.getIsSelected() && 'selected'}
                                            className={cn(
                                                'data-[state=selected]:bg-[#F1FCF6]',
                                            )}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={tableName + cell.id} color='#475467'>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
                <div className="mt-3 px-4 sm:mt-6">
                    <Paginator
                        current={currentPage}
                        total={totalPages}
                        onChange={(page) => setCurrentPage(page)}
                    />

                </div>
            </div >
        </>
    );
}