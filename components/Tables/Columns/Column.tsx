"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { Clients, PaimentStatus, Status } from "@prisma/client"
import { editStatus } from "@/server/Data"
import { useRouter } from "next/navigation"

type StatusName = {
    name: string
    value: Status
}[]

export const statusName : StatusName = [
    {
      name: "LEADS",
      value: "LEADS"
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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Leads = {
    id: string
    status: Status | null
    // status: 'NRP' | 'MAIL_RELANCE_MAIL' | 'MAIL_RELANCE_TEL' | 'ANNULER' | 'WAITING_FOR_JUSTIFICATION' | 'WAITING_FOR_PAYMENT' | 'TO_BE_RECALLED' | 'QUALIFIED' | 'NOT_QUALIFIED' | 'VALIDATED'
    creationDate: string | null
    modificationDate: string | null
    qualificationDate: string | null
    full_name: string | null
    email: string | null
    phone: string | null
    comments: string | null
    recallDate: string | null
    montant: number | null
    paimentStatus: PaimentStatus
}




export const columns: ColumnDef<Clients>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "id",
        cell: ({ row }) => {
            const id = row.original.id
            return <span>{id.slice(2, 9) + '...'}</span>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <p className={`
                    px-2 py-1 text-xs font-semibold text-white rounded-full
                    ${row.original.status === "LEADS" && "bg-neutral-700"}
                    ${row.original.status === "NRP" && "bg-purple-500"}
                    ${row.original.status === "MAIL_RELANCE_MAIL" && "bg-pink-500"}
                    ${row.original.status === "MAIL_RELANCE_TEL" && "bg-yellow-500"}
                    ${row.original.status === "ANNULER" && "bg-red-500"}
                    ${row.original.status === "WAITING_FOR_JUSTIFICATION" && "bg-orange-500"}
                    ${row.original.status === "WAITING_FOR_PAYMENT" && "bg-red-500"}
                    ${row.original.status === "TO_BE_RECALLED" && "bg-blue-500"}
                    ${row.original.status === "VALIDATED" && "bg-green-500"}
                `}>
                    {
                        statusName.find(status => status.value === row.original.status)?.name
                    }
                </p>
            )
        }
    },
    {
        accessorKey: "creationDate",
        header: "date de création",
        cell: ({ row }) => {
            return <span>{row.original.creationDate}</span>
        }
    },
    {
        accessorKey: "modificationDate",
        header: "date de modification",
    },
    {
        accessorKey: "qualificationDate",
        header: "date de qualification",
    },
    {
        accessorKey: "full_name",
        header: "Nom complet",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "comments",
        header: "Comments",
    },
    {
        accessorKey: "recallDate",
        header: "Date de rappel",
    },
    {
        accessorKey: "paimentStatus",
        header: "Statut de paiement",
        cell: ({ row }) => {
            return (
                <span className={`
                    px-2 py-1 text-xs font-semibold text-white rounded-full
                    ${row.original.paimentStatus === "WAITING" && "bg-yellow-500"}
                    ${row.original.paimentStatus === "PAID" && "bg-green-500"}
                    ${row.original.paimentStatus === "NOT_PAID" && "bg-red-500"}
                `}>
                    {row.original.paimentStatus}
                </span>
            )
        },
    },
    {
        accessorKey: "montant",
        header: "Montant",
        cell: ({ row }) => {
            return <span>{row.original.montant} €</span>
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <Actions row={row} />
            )
        },
    },
]

const Actions = ({ row }:any) => {
    const id = row.original.id
    const router = useRouter()
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className=" h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {
                    statusName.map((status, index) => (
                        <DropdownMenuItem key={index} onClick={async () =>
                            await editStatus(status.value, id) && router.refresh()
                        }>
                            {status.name}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}