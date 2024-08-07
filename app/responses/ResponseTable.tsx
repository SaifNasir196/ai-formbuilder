"use client"
import React, { useState, useCallback, useMemo, useEffect } from "react"
import { createColumns } from "./Columns"
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
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useForms } from "@/app/hooks/useForms"
import { useSubmissions } from "@/app/hooks/useResponses"
import { parseFormSubmission } from "@/lib/utils/utils"
import { exportToCSV, exportToPDF, handleBulkDelete } from "@/lib/utils/tableUtils"
import { ParsedFormSubmission, Recipient, EmailResponseData } from "@/lib/type"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { BulkEmailModal } from "./BulkEmailModal"
import { useMailerSend } from "../hooks/useMailerSend"
import { useSearchParams } from 'next/navigation'

const emptyArray: ParsedFormSubmission[] = [];

const ResponseTable = () => {
    const searchParams = useSearchParams()
    const formId = searchParams.get('formId')
    const [selectedForm, setSelectedForm] = useState<number>(formId ? parseInt(formId) : 0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const sendBulkEmail = useMailerSend();
    const columns = createColumns(selectedForm);

    useEffect(() => {
        if (selectedForm !== undefined) {
            const url = new URL(window.location.href);
            url.searchParams.set('formId', selectedForm.toString());
            window.history.pushState({}, '', url);
        } else {
            const url = new URL(window.location.href);
            url.searchParams.delete('formId');
            window.history.pushState({}, '', url);
        }
    }, [selectedForm]);


    const { data: forms, isLoading: isFormsLoading } = useForms();
    const { data: responses, isLoading: isResponsesLoading } = useSubmissions(selectedForm);

    const memoizedResponses = useMemo(() =>
        responses?.map(form => parseFormSubmission(form)) ?? [],
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

    const handleBulkExport = useCallback((format: 'csv' | 'pdf') => {
        const selectedRows = table.getSelectedRowModel().rows
        const selectedData = selectedRows.map(row => row.original)
        if (format === 'csv') {
            exportToCSV(selectedData)
        } else {
            exportToPDF(selectedData)
        }
    }, [table])



    return (
        <div>
            <div className="flex items-center justify-between py-4 gap-4">
                {/* Form select */}
                <Select onValueChange={handleFormSelect} value={selectedForm.toString() || "Select Form"} >
                    <SelectTrigger className="w-1/3">
                        {/* <SelectValue placeholder="forms" /> */}
                    </SelectTrigger>

                    <SelectContent>
                        {forms?.map((form) => {
                            const formTitle = JSON.parse(form.jsonform).formTitle
                            return (
                                <SelectItem key={form.id} value={form.id.toString()}>
                                    {formTitle}
                                </SelectItem>
                            )
                        }
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

                <div className="flex gap-4">
                    {/* Actions */}
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-auto w-32"
                                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllPageRowsSelected()}
                                >
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DialogTrigger asChild><DropdownMenuItem> Compose Emails</DropdownMenuItem></DialogTrigger>
                                <DropdownMenuItem onSelect={() => handleBulkExport('csv')}>Export to CSV</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleBulkExport('pdf')}>Export to PDF</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleBulkDelete(table.getSelectedRowModel().rows.map(row => row.original))}>
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <BulkEmailModal recipients={table.getSelectedRowModel().rows.map(row => row.original).map((response: ParsedFormSubmission) => ({
                            email: response.email ?? "",
                            name: `${response.firstName ?? ""} ${response.lastName ?? ""}`,
                        }))}
                        />

                    </Dialog>




                    {/* Column Visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto w-32">
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
                        {isFormsLoading || isResponsesLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={index}>
                                    {Array.from({ length: columns.length }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <Skeleton className="my-2 h-6 w-full rounded-md" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="my-6 h-16 text-center">
                                    No responses found
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