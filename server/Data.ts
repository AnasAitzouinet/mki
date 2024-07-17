"use server";
import { Leads } from "@/components/Tables/Columns/Column";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";
import stripe from "@/lib/stripe";
import { CsvFileImportSchema } from "@/schemas";
import { Clients, Status, User } from "@prisma/client";
import * as z from "zod";


export async function ImportCsvFile(file: z.infer<typeof CsvFileImportSchema>) {
    const validatedData = CsvFileImportSchema.safeParse(file);

    if (!validatedData.success) {
        console.log(validatedData.error.errors);
        return { success: false, message: 'Invalid data', errors: validatedData.error.errors };
    }
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }

    const isUser = await db.user.findUnique({
        where: {
            id: session.userId as string
        }
    })

    if (!isUser) {
        throw new Error("Unauthorized")
    }

    if (!validatedData) {
        return { success: false, message: 'Invalid data' }
    }

    try {
        console.log(validatedData.data);

        const data = await db.clients.createMany({
            data: validatedData.data.map((d) => {
                return {
                    userId: isUser.id,
                    ...d
                }
            })
        })



        return { success: true, message: 'Data imported successfully' }
    } catch (error) {
        return { success: false, message: 'Error importing data', error, data: validatedData.data }
    }
}

export async function getDatas(): Promise<Clients[]> {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        } else {
            if (isUser.role === 'user') {
                return db.clients.findMany({
                    where: {
                        userId: isUser.id
                    }
                })
            }
        }

        const data = await db.clients.findMany()

        return data
    } catch (error) {
        console.error(error)
        return error as Clients[]
    }
}

export async function editStatus(status: Status, id: string) {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })
        if (!isUser) {
            throw new Error("Unauthorized")
        }

        if (isUser.role === 'admin') {
            const data = await db.clients.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
        } else {
            const data = await db.clients.update({
                where: {
                    id,
                    userId: isUser.id
                },
                data: {
                    status
                }
            })
        }

        return { success: true, message: 'Data updated successfully' }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Error updating data', error }
    }

}

export async function editStatusMass(status: Status, id: string[]) {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }

        const data = await db.clients.updateMany({
            where: {
                id: {
                    in: id
                },
                userId: isUser.id
            },
            data: {
                status
            }
        })

        return { success: true, message: 'Data updated successfully' }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Error updating data', error }
    }

}

export async function deleteAllDatas() {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }

        const data = await db.clients.deleteMany()

        return data
    } catch (error) {
        console.error(error)
        return error
    }
}
export async function deleteData(ids: string[]) {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }
        if (isUser.role === 'admin') {
            const data = await db.clients.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } else {
            const data = await db.clients.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                    userId: isUser.id
                },
            });
        }
        return { success: true, message: 'Data deleted successfully' }
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function getUsers(): Promise<User[]> {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }

        const data = await db.user.findMany({
            where: {
                role: 'user'
            }
        })

        return data
    } catch (error) {
        console.error(error)
        return error as User[]
    }
}

export async function getClientsByUser(id: string): Promise<Clients[]> {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }

        const data = await db.clients.findMany({
            where: {
                userId: id
            }
        })

        return data
    } catch (error) {
        console.error(error)
        return error as Clients[]
    }
}

export async function ShareClients(id: string[], userId: string) {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {

        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }

        const data = await db.clients.updateMany({
            where: {
                id: {
                    in: id
                }
            },
            data: {
                userId
            }
        })

        return { success: true, message: 'Data shared successfully' }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Error sharing data', error }
    }
}

export async function getFactures() {
    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }
    try {
        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        })

        if (!isUser) {
            throw new Error("Unauthorized")
        }


        const factures = await db.factures.findMany({
            where: {
                userId: isUser.id
            },
            include: {
                client: true
            }
        })

        const data = factures.map((facture) => {
            return {
                id: facture.id,
                full_name: facture.client.full_name,
                email: facture.client.email,
                phone: facture.client.phone,
                montant: facture.montant,
                paimentStatus: facture.client.paimentStatus,
                paiment_link: [facture.paiment_Link],
                creationDate: facture.client.creationDate,
                modificationDate: facture.client.modificationDate,
                dateDecheance: [facture.dateDecheance],
                facturePdf: [facture.paiment_PDF],
                invoiceId: facture.invoice_id
            }
        })
        // Check and update the status of each facture
        for (const facture of data) {
            const { invoiceId } = facture;
            if (invoiceId) {
                try {
                    const res = await stripe.invoices.retrieve(invoiceId);
                    if (res) {
                        const isPaid = res.status === 'paid';
                        const isWaiting = res.status === 'open';
                        const isNotPaid = facture.dateDecheance[0] < new Date();
                        if (isPaid) {
                            await db.factures.update({
                                where: { id: facture.id },
                                include: { client: true },
                                data: {
                                    client: {
                                        update: { paimentStatus: 'PAID' }
                                    }
                                }
                            });
                        } else if (isWaiting) {
                            await db.factures.update({
                                where: { id: facture.id },
                                include: { client: true },
                                data: { client: { update: { paimentStatus: 'WAITING' } } }

                            });
                        } else if (isNotPaid) {
                            await db.factures.update({
                                where: { id: facture.id },
                                include: { client: true },
                                data: { client: { update: { paimentStatus: 'NOT_PAID' } } }
                            });
                        }

                    }
                } catch (error) {
                    console.error(`Error checking invoice status for facture ID ${facture.id}:`, error);
                }
            }
        }

        return data;
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Error sharing data', error }
    }
}

export async function getStatistics() {
    const session = await getSession();

    if (!session || !session.userId) {
        throw new Error("Unauthorized");
    }

    try {
        const isUser = await db.user.findUnique({
            where: {
                id: session.userId as string
            }
        });

        if (!isUser) {
            throw new Error("Unauthorized");
        }
        let data;
        if (isUser.role === 'user') {
             data = await db.clients.groupBy({
                by: ['status'],
                _count: {
                    status: true
                },
                where: {
                    userId: isUser.id
                }
            });
        } else {
             data = await db.clients.groupBy({
                by: ['status'],
                _count: {
                    status: true
                }
            });
        }


        const AllClients = await db.clients.findMany({
            select: {
                montant: true,
                paimentStatus: true
            }
        });
        const Cards = [
            { name: "Mail Relance (mail)", status: "MAIL_RELANCE_MAIL" },
            { name: "Mail Relance (tel)", status: "MAIL_RELANCE_TEL" },
            { name: "NRP", status: "NRP" },
            { name: "Annuler", status: "ANNULER" },
            { name: "A rappeler", status: "TO_BE_RECALLED" },
            { name: "En attente de paiement", status: "WAITING_FOR_PAYMENT" },
            { name: "En attente de justif", status: "WAITING_FOR_JUSTIF" },
            { name: "Nombre de total (clients)", status: "TOTAL" },
            { name: "Qualifié", status: "QUALIFIED" },
            { name: "Production mensuelle", status: "MONTHLY_PRODUCTION" },
            { name: "Validé", status: "VALIDATED" }
        ];

        const datas = Cards.map((card) => {
            const countData = data.find((d) => d.status === card.status);
            const total = AllClients.length;

            if (card.status === "MONTHLY_PRODUCTION") {
                const monthlyProduction = AllClients.reduce((acc, client) => {
                    if (client.montant && client.paimentStatus === "PAID") {
                        return acc + client.montant;
                    }
                    return acc;
                }, 0);
                return {
                    name: card.name,
                    value: monthlyProduction,
                    status: card.status
                };
            }

            if (card.status === "TOTAL") {
                return {
                    name: card.name,
                    value: total,
                    status: card.status
                };
            }
            return {
                name: card.name,
                value: countData ? countData._count.status : 0,
                status: card.status
            };
        });
        await db.$disconnect();
        return datas;
    } catch (error) {
        console.error(error);
    }
}


