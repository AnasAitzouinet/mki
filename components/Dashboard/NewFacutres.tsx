"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Link, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import { useCallback, useEffect, useState } from "react"
import { getDatas } from "@/server/Data"
import { Clients } from "@prisma/client"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Toast } from "../ui/toast"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
    client: z.string(),
    dateDecheance: z.date(),
    description: z.string(),
    montant: z.string(),
})

export default function NewFacutres({
     setDone
}: {
     setDone: (done: boolean) => void
}) {
    const [clients, setClient] = useState<Clients[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: "",
            dateDecheance: new Date(),
            description: "",
            montant: "",
        },
    })


    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const getClients = await getDatas();
            setClient(getClients);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const validated = formSchema.safeParse(values);
        if (!validated.success) {
            console.error(validated.error.errors);
            setLoading(false);
            return;
        }
        const { client, dateDecheance, description, montant } = validated.data;

        const dueDate = new Date(dateDecheance);
        const currentDate = new Date();
        const diffInDays = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        try {
            const res = await fetch("/api/stripe/invoice/generateLink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientId: client,
                    dateDecheanceDays: diffInDays,
                    dateDecheance,
                    ProductPrice: montant,
                    description,
                    CustomerName: clients.find((c) => c.id === client)?.full_name,
                    CustomerEmail: clients.find((c) => c.id === client)?.email,
                    ProductName: "Facture",
                }),
            });

            if (res.ok) {
                console.log("Invoice created successfully");
                toast({
                    title: "Invoice created successfully",
                })
                document.getElementById("close-dialog")?.click();
                setDone(true);
            } else {
                console.error("Failed to create invoice");
                toast({
                    title: "Invoice created failed",
                })
            }
        } catch (error) {
            console.error("Failed to create invoice", error);
            toast({
                title: `Error: ${error}`,
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5">
                <FormField
                    control={form.control}
                    name="client"
                    disabled={loading}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Clients</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />

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
