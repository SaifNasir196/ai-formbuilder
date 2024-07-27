"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { columns } from "./Columns"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForms } from "@/app/hooks/useForms"
import { useResponses } from "@/app/hooks/useResponses"
import { parseFormResponse, exportToCSV } from "@/lib/utils/utils"
import { ParsedFormResponse } from "@/lib/type"


// interface ResponseTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }
const emptyArray: ParsedFormResponse[] = [];
 
const ResponseTable = () => {
    console.log('refreshed');

    const [selectedForm, setSelectedForm] = useState<number>(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const { data: forms, isLoading: isFormsLoading } = useForms();
    const { data: responses, isLoading: isResponsesLoading } = useResponses(selectedForm);

    const memoizedResponses = useMemo(() => 
        responses?.map(form => parseFormResponse(form)) ?? [],
        [responses]
    );


    const handleFormSelect = useCallback((value: string) => {
        setSelectedForm(parseInt(value));
    }, []);

    const table = useReactTable({
        data: memoizedResponses || emptyArray,
        columns,
        enableRowSelection: true,
        // onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, globalFilter, columnVisibility },
        
    })

    useEffect(() => {
        console.log('Selected Form:', selectedForm);
    }, [selectedForm]);

    useEffect(() => {
        console.log('Responses:', responses);
    }, [responses]);


    return (
        <div>
        {/* Filtering */}
        <div className="flex items-center justify-between py-4 gap-4">
            <Select onValueChange={handleFormSelect} value={selectedForm.toString()} >
            <SelectTrigger className="w-96">
                <SelectValue placeholder="Form" />
            </SelectTrigger>
            <SelectContent>
                {forms?.map((form) => {
                    const formTitle = JSON.parse(form.jsonform).formTitle
                    return (
                        <SelectItem key={form.id} value={form.id.toString()}>
                            {formTitle}
                        </SelectItem>
                    )}
                )}
                

            </SelectContent>
            </Select>



            <Input
                placeholder="Filter by name or emails..."
                // value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
                // onChange={(event) =>
                //     table.getColumn("firstName")?.setFilterValue(event.target.value)
                // }
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}

                className="flex-grow"
            />

            <div className="flex gap-4"> 
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto w-28">
                        Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                        .getAllColumns()
                        .filter(
                            (column) => column.getCanHide()
                        )
                        .map((column) => {
                            return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* export button */}
                <Button variant="outline" className="ml-auto w-28" onClick={() => exportToCSV(memoizedResponses)}> Export </Button>
            </div>
        </div>

        {/* Data */}
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                { isFormsLoading || isResponsesLoading ? (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        Loading...
                    </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        {/* Page controls */}
        <div className="flex items-center justify-between space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
        </div>
    )
}

export default ResponseTable;