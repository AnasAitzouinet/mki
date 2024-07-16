import db from "@/lib/prisma";
import { getSession } from "@/lib/session";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const session = await getSession()
    if (!session || !session.userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    const user = await db.user.findFirst({
        where: {
            id: session.userId
        }
    })
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    
    try {
        const {
            inoviceId
        } = await req.json()

        const invoice = await stripe.invoices.retrieve(inoviceId);

        if (!invoice) {
            return new NextResponse("Error creating invoice", { status: 500 })
        }
        // check if the invoice is paid

        const isPaid = invoice.status

        return new NextResponse(JSON.stringify(isPaid), { status: 200 })

    } catch (error) {
        console.error(error)
        return new NextResponse("Error creating invoice " + error, { status: 500 })
    }

}