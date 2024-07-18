"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
     FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
import { Link, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import {   useState } from "react"
import { CreateFacturesEnMass    } from "@/server/Data"
import { Clients } from "@prisma/client"
 
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
    dateDecheance: z.date(),
    description: z.string(),
    montant: z.string().refine(value => !isNaN(parseFloat(value)), {
        message: "Montant must be a number",
    }),
})

export default function NewFacutres({
    clients
}: {
    clients: Clients[]
}) {

    const [loading, setLoading] = useState(false)
    const { toast } = useToast()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateDecheance: new Date(),
            description: "",
            montant: "",
        },
    })



    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const validated = formSchema.safeParse(values)
        if (!validated.success) {
            return;
        }

        const { dateDecheance, montant } = validated.data

        try {
            setLoading(true)
            if (clients.length === 0) {
                toast({
                    title: "No clients selected",
                });
                return;
            }

            const clientData = clients.map(client => ({
                id: client.id,
                name: client.full_name,
                email: client.email
            }));

            const res = await CreateFacturesEnMass(
                clientData,
                parseFloat(montant),
                dateDecheance
            )

            if (res.success) {
                console.log(res)
                toast({
                    title: "Success",
                    description: res.message,
                });
            } else {
                console.log(res)

                toast({
                    title: "Error",
                    description: res.message,
                });
            }
        } catch (error) {
            console.error("Failed to create new facture", error)
            toast({
                title: "Error creating new facture",
            });
        } finally {
            setLoading(false)
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5">

                <FormField
                    disabled={loading}
                    control={form.control}
                    name="dateDecheance"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date d&apos;échéance</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    disabled={loading}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <Textarea  {...field} placeholder="Lead linking crédit affiliate" />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    disabled={loading}
                    name="montant"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Montant</FormLabel>
                            <Input {...field} placeholder="Montant person" />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={loading}

                    type="submit">Submit</Button>
            </form>
        </Form>
    )
}
