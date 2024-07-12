"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Papa from "papaparse";
import { Import, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

// Define the schema for the form
const CsvFileSchema = z.object({
    file: z.instanceof(File).refine((file) => file.type === "text/csv", {
        message: "Only CSV files are accepted",
    }),
});

// Define the types for the form values
type CsvFileFormValues = z.infer<typeof CsvFileSchema>;

export default function ImportCsv() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<CsvFileFormValues>({
        resolver: zodResolver(CsvFileSchema),
        defaultValues: {
            file: undefined,
        },
    });

    const onSubmit = async (values: CsvFileFormValues) => {
        setLoading(true);
        if (values.file) {
            Papa.parse(values.file, {
                header: true,
                complete: async (results) => {
                    console.log("Parsed CSV:", results.data);
                    const contacts = results.data
                        .map((row: any) => ({
                            creationDate: row['Créé'] || row.creationDate,
                            email: row['Adresse e-mail'] || row.email,
                            full_name: row['Nom'] || row.full_name,
                            phone: row['Téléphone'] ||row['Téléphone (recommandé)'] || row.phone,
                        }))
                        .filter((contact: any) => contact.email && contact.full_name);
                    if (contacts.length === 0) {
                        setLoading(false);
                        return;
                    }

                    fetch("/api/import", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ data: contacts }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                toast({
                                    title: "Contacts imported successfully",
                                    color: "success",
                                })
                                setLoading(false);
                                form.reset();
                                router.refresh();
                            }else{
                                toast({
                                    title: "Error importing contacts",
                                    description: data.message,
                                    color: "error",
                                })
                                setLoading(false);
                            }
                            
                        });
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    setLoading(false);
                },
            });
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue("file", file);
        }
    };

    const removeFile = () => {
        form.reset();
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full flex flex-row-reverse items-center justify-center gap-x-2">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem className="w-full flex items-center">
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {!field.value ? (
                                <Button type="button" onClick={triggerFileInput}>
                                    Upload CSV <Import className="ml-2" />
                                </Button>
                            ) : (
                                <div className="flex items-center">
                                    <FormDescription className="ml-2">
                                        {field.value.name}
                                    </FormDescription>
                                    <Button type="button" onClick={removeFile} size={"icon"} variant={"ghost"} className="ml-2">
                                        <X />
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    )}
                />
                {form.watch('file') && (
                    <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white w-32 h-10 rounded-md"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
                    </Button>
                )}
            </form>
        </Form>
    );
}
