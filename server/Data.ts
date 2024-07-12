"use server";
import { Leads } from "@/components/Tables/Columns/Column";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";
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

        const data = await db.clients.update({
            where: {
                id,
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
                facturePdf: [facture.paiment_PDF]
            }})

        console.log('Fetched Factures:', factures)

        return data
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Error sharing data', error }
    }
}
