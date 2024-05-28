import React from 'react'

import {
    Column,
    ColumnDef,
    FilterFn,
    PaginationState,
    Table,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'

// export declare const rankings: {
//     readonly CASE_SENSITIVE_EQUAL: 7;
//     readonly EQUAL: 6;
//     readonly STARTS_WITH: 5;
//     readonly WORD_STARTS_WITH: 4;
//     readonly CONTAINS: 3;
//     readonly ACRONYM: 2;
//     readonly MATCHES: 1;
//     readonly NO_MATCH: 0;
// };

// export type Ranking = (typeof rankings)[keyof typeof rankings];

// export interface RankingInfo {
//     rankedValue: any;
//     rank: Ranking;
//     accessorIndex: number;
//     accessorThreshold: Ranking | undefined;
//     passed: boolean;
// }

declare module '@tanstack/react-table' {
    //add fuzzy filter to the filterFns
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

function MyTable({
    data,
    columns,
}: {
    data: any[]
    columns: ColumnDef<any>[]
}) {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = React.useState('')

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        state: {
            globalFilter,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy', //apply fuzzy filter to the 
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    })

    //apply the fuzzy sort if the fullName column is being filtered
    React.useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    return (
        <div className="p-2">
            <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 text-sm font-semilight border border-block rounded"
                    placeholder="Search"
                />
            </div>
            <div className="h-2" />
            <table className='bg-white border-collapse border w-full'>
                <thead className='bg-gray-100'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan} className='border p-2 text-left text-sm font-semilight'>
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    {/* <Filter column={header.column} table={table} /> */}
                                                </div>
                                            ) : null}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id} className='border-b'>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id} className='border-r p-2 text-sm font-semilight'>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-5" />
            <div className="flex items-center justify-between gap-2 text-sm font-semilight">
                <div className="flex items-center gap-2 text-sm font-semilight">
                    <button
                        className="border rounded px-1 pt-1 disabled:text-gray-300"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
                    </button>
                    <button
                        className="border rounded px-1 pt-1 disabled:text-gray-300"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="material-symbols-outlined">keyboard_arrow_left</span>
                    </button>
                    <button
                        className="border rounded px-1 pt-1 disabled:text-gray-300"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="material-symbols-outlined">keyboard_arrow_right</span>
                    </button>
                    <button
                        className="border rounded px-1 pt-1 disabled:text-gray-300"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
                    </button>
                </div>
                <span className="flex items-center gap-1 text-sm font-semilight">
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    </span>
                </span>
                <select
                    className='text-sm font-semilight'
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                {table.getRowCount().toLocaleString()} Rows
            </div>
        </div>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any, any>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ''}
                onChange={e =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ''}
                onChange={e =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <input
            className="w-36 border shadow rounded"
            onChange={e => column.setFilterValue(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export default MyTable;