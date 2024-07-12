"use client"

import { ColumnDef } from "@tanstack/react-table"
import { File, Link as LinkIcon, MoreHorizontal, PanelLeftDashed } from "lucide-react"
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
import { $Enums, Clients, PaimentStatus, Status } from "@prisma/client"
import { editStatus } from "@/server/Data"
import { useRouter } from "next/navigation"
import Link from "next/link"

type StatusName = {
    name: string
    value: Status
}[]

export const statusName: StatusName = [
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
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    montant: number;
    paimentStatus: $Enums.PaimentStatus | null;
    paiment_link: (string | null)[];
    creationDate: string | null;
    modificationDate: string | null;
    dateDecheance: Date[];
    facturePdf: (string | null)[];
}




export const factureCol: ColumnDef<Leads>[] = [
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
        accessorKey: "creationDate",
        header: "date de création",
    },
    {
        accessorKey: "modificationDate",
        header: "date de modification",
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
        accessorKey: "dateDecheance",
        header: "Date de décheance",
        cell: ({ row }) => {
            const date = row.original.dateDecheance
            const parsed = new Date(date[0])
            return <span>{
                parsed.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }</span>
        }
    },
    {
        accessorKey: "paiment_link",
        header: "Lien de paiement",
        cell: ({ row }) => {
            const link = row.original.paiment_link
            const pdf = row.original.facturePdf
            return (
                <div className=" ml-2 flex items-center gap-x-2">
                    <Button
                        variant={"outline"}
                        size={"icon"}

                    >
                        <Link href={link[0] || ""}>
                            <LinkIcon />

                        </Link>
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                    >
                        <Link href={pdf[0] || ""}>
                            <File />
                        </Link>
                    </Button>
                </div>
            )
        }
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
     
]
 