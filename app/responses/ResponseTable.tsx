"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { columns } from "./Columns"
import {
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
  DropdownMenuItem,
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
import { parseFormResponse } from "@/lib/utils/utils"
import { exportToCSV } from "@/lib/utils/tableUtils"
import { ParsedFormResponse } from "@/lib/type"
import { Checkbox } from "@/components/ui/checkbox"
import ResponseDetailsModal from "./ResponseDetailsModal"

const emptyArray: ParsedFormResponse[] = [];
 
const ResponseTable = () => {
    console.log('refreshed');

    const [selectedForm, setSelectedForm] = useState<number>(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<Partial<ParsedFormResponse>>({});


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
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, globalFilter, columnVisibility, rowSelection },
        
    })

    useEffect(() => {
        console.log('Selected Form:', selectedForm);
    }, [selectedForm]);

    useEffect(() => {
        console.log('Responses:', responses);
    }, [responses]);


    return (
        <div>
            {/* Form select */}
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

            {/* Filter input */}
            <Input
                placeholder="Filter by name or emails..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="flex-grow"
            />

            {/* Bulk action */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto" disabled={Object.keys(rowSelection).length === 0}>
                    Bulk Actions
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem onSelect={()=>{}}>Delete Selected</DropdownMenuItem>
                <DropdownMenuItem onSelect={()=>{}}>Export Selected</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Column Visibility */}
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
                        <TableHead className="w-[48px]">
                            <Checkbox
                                checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                                }
                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                aria-label="Select all"
                            />
                        </TableHead>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                        ))}
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
                        <TableCell>
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                            />
                        </TableCell>

                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        <TableCell>
                            <Button
                            onClick={() => {
                                setSelectedResponse(row.original)
                                setIsDetailsModalOpen(true)
                            }}
                            >
                            View Details
                            </Button>
                        </TableCell>
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

             <ResponseDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                response={selectedResponse}
            />
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