"use client"
import { factureCol } from '@/components/Tables/Columns/FacturesColumn'
import { FacturesTable } from '@/components/Tables/FacturesTable'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/DatePicker'
import { $Enums, Clients, PaimentStatus, Status } from '@prisma/client'
import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewFacutres from '@/components/Dashboard/NewFacutres'
import { getFactures } from '@/server/Data'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { DateRange } from 'react-day-picker'
import { parseDateString } from '../Fiches/page'
import { LoaderCircleIcon } from 'lucide-react'


interface FactureData {
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

export default function Factures() {
  const [data, setData] = React.useState<FactureData[]>([])
  const [initialData, setInitialData] = React.useState<FactureData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [done, setDone] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  const router = useRouter()


  const fetchClients = React.useCallback(async () => {
    setLoading(true);
    try {
      const getClients = await getFactures();
      setData(getClients as FactureData[]);
      setInitialData(getClients as FactureData[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [])

  React.useEffect(() => {
    fetchClients()
  }, [])

  React.useEffect(() => {
    if (done) {
      fetchClients()
      setDone(false)
    }
  }, [done])

  React.useEffect(() => {
    if (date && date.from && date.to) {
      const filteredData = initialData.filter((client) => {
        if (client.creationDate) {
          const clientDate = parseDateString(client.creationDate);
          console.log(clientDate, date.from, date.to);
          return clientDate >= date.from! && clientDate <= date.to!;
        }
        return false;
      });
      setData(filteredData);
    } else {
      setData(initialData);
    }
  }, [date, initialData]);


  if (loading) {
    return (
      <div className='fixed top-1/2 left-1/2'>
            <LoaderCircleIcon className='animate-spin  w-[3rem] h-[3rem] ' />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster />
      <div className="w-full flex space-x-2">
        <div className="space-y-2 w-full">
          <h1 className="text-2xl font-semibold">Les Factures</h1>
          <div className='flex justify-center items-center w-full  space-x-4'>

            <DatePickerWithRange date={date} setDate={setDate} />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Ajouter une facture</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une facture</DialogTitle>
                </DialogHeader>
                <NewFacutres setDone={setDone} />
              </DialogContent>
              <DialogClose
                id='close-dialog'
              />
            </Dialog>
          </div>
        </div>
      </div>
      <FacturesTable data={data} columns={factureCol} />
    </div>
  )
}
