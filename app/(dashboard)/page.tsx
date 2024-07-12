"use client"
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Navbar from "@/components/Dashboard/Navbar"
import ClientList from "@/components/Dashboard/ClientList"

const Cards = [
  {
    name: "Mail Relance (mail)",
    href: "#",
  },
  {
    name: "Mail Relance (tel)",
    href: "#",
  },
  {
    name: "NRP",
    href: "#",
  },
  {
    name: "Annuler",
    href: "#",
  },
  {
    name: "A rappeler",
    href: "#",
  },
  {
    name: "En attente de paiement",
    href: "#",
  }, {
    name: "En attente de justif",
    href: "#",
  },
  {
    name: "Nombre de total (clients)",
    href: "#",
  },
  {
    name: "Qualifié",
    href: "#",
  },
  {
    name: "Production mensuelle",
  },
  {
    name: "Validé",
  }
]
export default function Dashboard() {
  return (
    <main className="my-auto">
      <div className="grid h-full gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-2">
        {
          Cards.map((card, index) => (
            <Card x-chunk={`dashboard-01-chunk-${index}`} key={card.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.name}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </main>
  )
}
