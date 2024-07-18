"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Table as TableType,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useCallback } from "react"
import { parse } from "json2csv";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExternalLinkIcon, Import, ReceiptEuro, User, X } from "lucide-react"
import { set } from "react-hook-form"
import { DatePickerWithRange } from "../ui/DatePicker"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ImportCsv from "./ImportCsv"
import { CreateFacturesEnMass, deleteAllDatas, deleteData, editStatusMass, getUsers, ShareClients } from "@/server/Data"
import { useRouter } from "next/navigation"
import { Status, User as Users } from "@prisma/client"
import { IsAdmin } from "@/server/Auth"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import NewFacutres from "../Dashboard/NewFacutresMass"


const statusName = [
  {
    name: "All",
    value: "All"
  },
  {
    name: "Leads",
    value: "Leads"
  },
  {
    name: "NRP",
    value: "NRP"
  },
  {
    name: "A Rappler (mail) ",
    value: "MAIL_RELANCE_MAIL"
  },
  {
    name: "A Rappler (tel)",
    value: "MAIL_RELANCE_TEL"
  },
  {
    name: "annuler",
    value: "ANNULER"
  },
  {
    name: "En attente de justification",
    value: "WAITING_FOR_JUSTIFICATION"
  },
  {
    name: "En attente de paiement",
    value: "WAITING_FOR_PAYMENT"
  },
  {
    name: "A rappeler",
    value: "TO_BE_RECALLED"
  },
  {
    name: "Validé",
    value: "VALIDATED"
  }
]

type StatusName = {
  name: string
  value: Status
}[]

export const statusNames: StatusName = [
  {
    name: "NRP",
    value: "NRP"
  },
  {
    name: "A Rappler (mail) ",
    value: "MAIL_RELANCE_MAIL"
  },
  {
    name: "A Rappler (tel)",
    value: "MAIL_RELANCE_TEL"
  },
  {
    name: "annuler",
    value: "ANNULER"
  },
  {
    name: "En attente de justification",
    value: "WAITING_FOR_JUSTIFICATION"
  },
  {
    name: "En attente de paiement",
    value: "WAITING_FOR_PAYMENT"
  },
  {
    name: "A rappeler",
    value: "TO_BE_RECALLED"
  },
  {
    name: "Validé",
    value: "VALIDATED"
  }
]

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  date,
  setDate
}: DataTableProps<TData, TValue>) {

  // States:

  const [loading, setLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [status, setStatus] = React.useState({
    name: "All",
    value: "All"
  })
  const [users, setUsers] = React.useState<Users[]>([])
  const [isAdmin, setIsAdmin] = React.useState(false)






  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting, columnFilters, columnVisibility, rowSelection

    },
  })

  const handleExportCSV = useCallback(() => {
    const fields = Object.keys(data[0] || {})
    const csv = parse(data, { fields })
    const bom = "\uFEFF"
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `test.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [data])

  type Status = "All" | "Leads" | "NRP" | "MAIL_RELANCE_MAIL" | "MAIL_RELANCE_TEL" | "ANNULER" | "WAITING_FOR_JUSTIFICATION" | "WAITING_FOR_PAYMENT" | "TO_BE_RECALLED" | "VALIDATED";
  type ColumnId = "status" | "email" | "id" | "actions" | "creationDate" | "full_name" | "phone" | "paimentStatus" | "montant" | "modificationDate" | "qualificationDate" | "comments" | "recallDate";

  const columnVisibilityMap: Record<Status, ColumnId[]> = {
    "All": ["email", "status", "id", "actions", "creationDate", "full_name", "phone", "paimentStatus", "montant", "modificationDate", "qualificationDate", "comments", "recallDate"],
    "Leads": ["email", "id", "actions", "creationDate", "full_name", "phone"],
    "WAITING_FOR_PAYMENT": ["email", "paimentStatus", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "VALIDATED": ["email", "paimentStatus", "montant", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    // Add other statuses with their corresponding visible columns here
    "NRP": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "MAIL_RELANCE_MAIL": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "MAIL_RELANCE_TEL": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "ANNULER": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "WAITING_FOR_JUSTIFICATION": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"],
    "TO_BE_RECALLED": ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone", "recallDate"],
  };

  const getVisibleColumns = (status: Status): ColumnId[] => columnVisibilityMap[status] || ["email", "id", "modificationDate", "actions", "qualificationDate", "comments", "creationDate", "full_name", "phone"];

  React.useEffect(() => {
    const visibleColumns = getVisibleColumns(status.value as Status);

    table.getAllColumns().forEach((column) => {
      column.toggleVisibility(visibleColumns.includes(column.id as ColumnId));
    });

    table.getColumn("status")?.setFilterValue(status.value === "All" ? "" : status.value);

  }, [status]);

  React.useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      const [users, isAdmin] = await Promise.all([getUsers(), IsAdmin()])
      setUsers(users)
      setIsAdmin(isAdmin)

      setLoading(false)
    }
    fetch()
  }, []);


  const router = useRouter()

  return (
    <div>


      <div className="grid grid-rows-2">
        <div className=" flex justify-between items-center w-full   py-4 gap-2">
          <Select

            value={status.name}
            onValueChange={(value) => {
              setStatus(statusName.find(item => item.value == value) as any)
            }}
          >
            <SelectTrigger className="w-[30rem]">
              <p>
                {status.name}
              </p>
            </SelectTrigger>
            <SelectContent side="top">
              {
                statusName.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm "
          />

          <div className="w-full">
            <DatePickerWithRange
              date={date}
              setDate={setDate}
            />
          </div>

          <div className="gap-3 flex flex-row-reverse justify-center items-center">

            {
              isAdmin && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={handleExportCSV}

                  >
                    <span>Export All</span>
                    <ExternalLinkIcon />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center space-x-2"
                        variant="destructive"
                      >
                        <span>Delete All</span>
                        <X />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="space-y-4">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your data from our servers.

                        </DialogDescription>
                        <DialogClose className="w-full">
                          <Button
                            className="flex items-center w-full space-x-2"
                            variant="destructive"
                            onClick={async () => {
                              await deleteAllDatas()
                              router.refresh()
                            }}
                          >
                            <span>Delete All</span>
                          </Button>
                        </DialogClose>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <div className="mb-2">
                    <ImportCsv />
                  </div>
                </>
              )
            }


            {
              rowSelection && Object.keys(rowSelection).length > 0 && (
                <div className="flex gap-x-2">
                  <Button
                    className="flex items-center space-x-2"
                    variant="destructive"
                    onClick={async () => {
                      const selectedRows = table.getFilteredSelectedRowModel().rows
                      console.log(selectedRows.map(row => row.original.id))
                      await deleteData(selectedRows.map(row => row.original.id as string))
                      //clean the selection
                      table.setRowSelection({})
                      router.refresh()
                    }}
                  >
                    <span>Delete ({Object.keys(rowSelection).length})</span>
                    <X />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center space-x-2  bg-green-500  text-white hover:bg-green-600 hover:text-white 
                 dark:bg-green-700  dark:hover:bg-green-900  
                "
                        variant="outline"
                        onClick={async () => {
                          const selectedRows = table.getFilteredSelectedRowModel().rows
                          console.log(selectedRows.map(row => row.original))
                          const client = selectedRows.map(row => row.original)

                        }}
                      >
                        <ReceiptEuro />
                        <span>Facturer ({Object.keys(rowSelection).length})</span>

                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une facture</DialogTitle>
                      </DialogHeader>
                      <NewFacutres  clients={
                        table.getFilteredSelectedRowModel().rows.map(row => row.original) as any
                      } />
                    </DialogContent>
                    <DialogClose
                      id='close-dialog'
                    />
                  </Dialog>
                </div>
              )
            }


          </div>

        </div>
        <div className="">
          {
            rowSelection && Object.keys(rowSelection).length > 0 && (
              <div className="flex items-center gap-x-3">
                <Select
                  onValueChange={async (value) => {
                    const selectedRows = table.getFilteredSelectedRowModel().rows
                    await editStatusMass(value as any, selectedRows.map(row => row.original.id as string)) && router.refresh()
                    table.setRowSelection({})
                  }}
                >
                  <SelectTrigger className="w-fit ">
                    <p>Change status to</p>
                  </SelectTrigger>
                  <SelectContent side="top">
                    {
                      statusNames.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

                {
                  isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="space-x-2" variant={"outline"}  >
                          <span>
                            Share to user
                          </span>
                          <User />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          Select a user to share the selected rows with
                        </DialogHeader>
                        <div className=" grid grid-cols-2  w-full gap-3">
                          {
                            users.map((user, index) => (
                              <Button
                                key={index}
                                onClick={async () => {
                                  const selectedRows = table.getFilteredSelectedRowModel().rows
                                  console.log(selectedRows.map(row => row.original.id))
                                  await ShareClients(selectedRows.map(row => row.original.id as string), user.id as string)
                                  //clean the selection
                                  table.setRowSelection({})
                                  router.refresh()
                                }
                                }
                                variant="outline" className="flex items-center w-full space-x-2 py-8">
                                <User />
                                <div className="flex flex-col justify-start items-start">
                                  <span>{user.name}</span>
                                  <span>{user.email}</span>
                                </div>
                              </Button>
                            ))
                          }
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                }
              </div>
            )
          }
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8 pb-3">
          <div className="flex-1 text-sm text-muted-foreground  ">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border w-full">
        <Table className="min-w-full">
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
            {table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-center space-x-2 py-4 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page{" "}

          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
          {" "}
        </span>
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
