"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { ParsedFormSubmission } from "@/lib/type"
import { DateTime } from 'luxon'
import { useState } from "react"
import SubmissionModal from "./SubmissionModal"

// This type represents the parsed response data

//     id: number;
//     formId: number;
//     submittedAt: DateTime;
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     submission: string;


export const createColumns = (formId: number): ColumnDef<ParsedFormSubmission>[] => [
  {
    accessorKey: "id",
    header: "No.",
    id: "conut",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>
    }

  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => DateTime.fromJSDate(row.original.submittedAt).toLocaleString(DateTime.DATETIME_MED),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
      const [selectedResponse, setSelectedResponse] = useState<Partial<ParsedFormSubmission>>({});
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedResponse(row.original)
                setIsDetailsModalOpen(true)
              }}>View Submission</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { }}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SubmissionModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            response={selectedResponse}
          />
        </>
      )
    },
  },
]