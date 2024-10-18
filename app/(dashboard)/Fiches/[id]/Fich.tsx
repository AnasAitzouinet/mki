"use client";

import React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { statusName } from '@/components/Tables/Columns/Column';
import { Textarea } from '@/components/ui/textarea';
import { Clients, Status } from '@prisma/client';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parseDateStringV2 } from '@/lib/utils';
import { UpdateFichItem } from '@/server/Data';


const formSchema = z.object({
    creationDate: z.string().optional(),
    modificationDate: z.string().optional(),
    qualificationDate: z.string().optional(),
    full_name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    status: z.string().optional(),
    comments: z.string().optional(),
    montant: z.preprocess((val) => Number(val), z.number().optional()),
    recallDate: z.string().optional(),
    paimentStatus: z.enum(["WAITING", "PAID", "NOT_PAID"]).optional(),
    FraisAdministratif: z.preprocess((val) => Number(val), z.number().optional()),
    MotifDuPret: z.string().optional(),
    BanqueEtAnnee: z.string().optional(),
    SituationFamiliale: z.string().optional(),
    NombreEnfants: z.preprocess((val) => Number(val), z.number().optional()),
    SituationProfessionnelle: z.string().optional(),
    SalaireNet: z.preprocess((val) => Number(val), z.number().optional()),
    SituationLogement: z.string().optional(),
    LoyerEnEuro: z.preprocess((val) => Number(val), z.number().optional()),
    DateDeNaissance: z.string().optional(),
    villeDeNaissance: z.string().optional(),
    ResultatDeLaSimulation: z.string().optional(),
});


export default function Fich(FichItem: Clients) {



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            creationDate: parseDateStringV2(FichItem.creationDate) || "",
            modificationDate:parseDateStringV2(FichItem.modificationDate)|| "",
            qualificationDate: parseDateStringV2(FichItem.qualificationDate)|| "",
            full_name: FichItem.full_name || "",
            email: FichItem.email || "",
            phone: FichItem.phone || "",
            status: FichItem.status || "",
            comments: FichItem.comments || "",
            montant: FichItem.montant || undefined,
            recallDate: FichItem.recallDate || "",
            paimentStatus: FichItem.paimentStatus || undefined,
            FraisAdministratif: FichItem.FraisAdministratif || undefined,
            MotifDuPret: FichItem.MotifDuPret || "",
            BanqueEtAnnee: FichItem.BanqueEtAnnee || "",
            SituationFamiliale: FichItem.SituationFamiliale || "",
            NombreEnfants: FichItem.NombreEnfants || undefined,
            SituationProfessionnelle: FichItem.SituationProfessionnelle || undefined,
            SalaireNet: FichItem.SalaireNet || undefined,
            SituationLogement: FichItem.SituationLogement || undefined,
            LoyerEnEuro: FichItem.LoyerEnEuro || undefined
        }
    });

    console.log("FichItem:", FichItem);
    // Handle form submission
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const updatedData = {
                ...data,
                status: data.status as Status | null | undefined,
            };
            const response = await UpdateFichItem(FichItem.id, updatedData);
            if (response.success) {
                console.log(response.message);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Update Data for ID: {FichItem.id}
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Creation Date */}
                        <FormField
                            control={form.control}
                            name="creationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Creation Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Modification Date */}
                        <FormField
                            control={form.control}
                            name="modificationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modification Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Qualification Date */}
                        <FormField
                            control={form.control}
                            name="qualificationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualification Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusName.map((status, idx) => (
                                                    <SelectItem key={idx} value={status.value}>
                                                        {status.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Comments */}
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Montant */}
                        <FormField
                            control={form.control}
                            name="montant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Recall Date */}
                        <FormField
                            control={form.control}
                            name="recallDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recall Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payment Status */}
                        <FormField
                            control={form.control}
                            name="paimentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Payment Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["WAITING", "PAID", "NOT_PAID"].map((status, idx) => (
                                                    <SelectItem key={idx} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Frais Administratif */}
                        <FormField
                            control={form.control}
                            name="FraisAdministratif"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frais Administratif</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Motif Du Pret */}
                        <FormField
                            control={form.control}
                            name="MotifDuPret"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motif Du Pret</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Banque Et Annee */}
                        <FormField
                            control={form.control}
                            name="BanqueEtAnnee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banque Et Annee</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Situation Familiale */}
                        <FormField
                            control={form.control}
                            name="SituationFamiliale"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Situation Familiale</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nombre Enfants */}
                        <FormField
                            control={form.control}
                            name="NombreEnfants"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Enfants</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Situation Professionnelle */}
                        <FormField
                            control={form.control}
                            name="SituationProfessionnelle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Situation Professionnelle</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Salaire Net */}
                        <FormField
                            control={form.control}
                            name="SalaireNet"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salaire Net</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Situation Logement */}
                        <FormField
                            control={form.control}
                            name="SituationLogement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Situation Logement</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Loyer En Euro */}
                        <FormField
                            control={form.control}
                            name="LoyerEnEuro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loyer En Euro</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date De Naissance */}
                        <FormField
                            control={form.control}
                            name="DateDeNaissance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date De Naissance</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ville De Naissance */}
                        <FormField
                            control={form.control}
                            name="villeDeNaissance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ville De Naissance</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Resultat De La Simulation */}
                        <FormField
                            control={form.control}
                            name="ResultatDeLaSimulation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resultat De La Simulation</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Update Data
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
