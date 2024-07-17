import {
 
  DollarSign,
 
} from "lucide-react"
 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStatistics } from "@/server/Data"

 
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
export default async function Dashboard() {
  const getdata = await getStatistics()

  return (
    <main className="my-auto">
      <div className="grid h-full gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-2">
        {
          getdata && getdata.map((card, index) => (
            <Card x-chunk={`dashboard-01-chunk-${index}`} key={card.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.name}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {card.value} {
                    card.name === "Production mensuelle" ? "€" : ""
                  }
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </main>
  )
}
