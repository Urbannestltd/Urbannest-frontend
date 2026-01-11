import { useEffect } from 'react';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { cn } from '@/utils/lib';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from './table';

import { MdOutlineHourglassEmpty } from "react-icons/md";
import { Paginator } from './paginator';
import { Skeleton } from '@chakra-ui/react';

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
    stages,
    showStages = false,
    borderRadius,
    headerColor,
    px,
    my
}: DataTableProps<TData, TValue>) {

    const tableData = showStages && stages ? stages.flatMap(stage => stage.data) : (data ?? []);

    const {
        getHeaderGroups,
        getRowModel,
        setPageIndex,
    } = useReactTable({
        data: tableData,
        columns,
        initialState: {
            ...(pagination !== undefined && {
                pagination: {
                    pageIndex: pagination?.currentPage - 1,
                    pageSize: pagination?.pageSize,
                },
            }),
        },
        manualPagination: !!pagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: pagination?.totalPages,
    });

    useEffect(() => {
        setPageIndex(pagination?.currentPage ? pagination.currentPage - 1 : 0);
    }, [pagination?.currentPage, setPageIndex]);

    const isDataEmpty = showStages
        ? !stages || stages.every(stage => stage.data.length === 0)
        : !data || data.length === 0

    const skeletonData = new Array(5).fill(null);

    const renderMultipleTableSections = (stageData: TData[], stageIndex: number) => {
        if (stageData.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className='text-center py-4 text-[#6A6C88] italic"'>
                        No data found for this stage
                    </TableCell>
                </TableRow>
            )
        }

        return stageData.map((item, itemIndex) => {
            const globalIndex = stageIndex * 1000 + itemIndex; // Create unique index
            return (
                <TableRow
                    key={`stage-${stageIndex}-row-${itemIndex}`}
                    onClick={() => onRowClick?.(item)}
                    className={cn(

                        itemIndex % 2 === 1 ? 'bg-[#F7F7F7]' : 'bg-white',
                        'hover:bg-[#F7F7F7] cursor-pointer',
                    )}
                >
                    {columns.map((column, colIndex) => (
                        <TableCell key={`cell-${colIndex}`} color='#475467'>
                            {flexRender(
                                column.cell,
                                {
                                    row: { original: item, index: globalIndex } as any,
                                    column: { id: column.id } as any,
                                    cell: {} as any,
                                    getValue: () => (item as any)[column.id as string],
                                    renderValue: () => (item as any)[column.id as string],
                                    table: {} as any,
                                }
                            )}
                        </TableCell>
                    ))}
                </TableRow>
            );
        });
    }

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
                        {getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className='!font-semibold  !text-[#475467]'>
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
                                                <MdOutlineHourglassEmpty size={45} />
                                            </div>

                                            <div className='flex flex-col items-center justify-center space-y-2'>
                                                <h4 className='text-xl font-bold text-[#070A2C]'>No {tableName}</h4>

                                                <p className='text-sm font-medium text-[#6A6C88]'>
                                                    No {tableName} found at the moment
                                                </p>
                                            </div>
                                        </div>
                                    </TableEmpty>
                                ) : showStages && stages ? (
                                    <>
                                        {stages.map((stage, stageIndex) => (
                                            <>
                                                <TableRow key={`stage-header-${stageIndex}`} className="bg-[#F0F1F4]">
                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className="font-bold text-[#070A2C] py-3 px-4 text-base"
                                                    >
                                                        {stage.title}
                                                    </TableCell>
                                                </TableRow>

                                                {renderMultipleTableSections(stage.data, stageIndex)}


                                            </>
                                        ))}
                                    </>
                                ) : (
                                    getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick?.(row.original)}
                                            data-state={row.getIsSelected() && 'selected'}
                                            className={cn(
                                                'data-[state=selected]:bg-[#F1FCF6]',
                                            )}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} color='#475467'>
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

                {pagination ? (
                    <div className="mt-3 px-4 sm:mt-6">
                        <Paginator
                        />
                    </div>
                ) : null}

            </div >
        </>
    );
}