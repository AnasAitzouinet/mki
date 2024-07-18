import db from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_SECRET_WEBHOOK_KEY!)
        console.log('Event:', event.type)

        switch (event.type) {
            case 'invoice.payment_succeeded':
                const invoicePaymentSucceeded = event.data.object.id
                await db.factures.update({
                    where: { invoice_id: invoicePaymentSucceeded },
                    include: { client: true },
                    data: { client: { update: { paimentStatus: 'PAID' } } }
                })
                console.log('Invoice Payment Succeeded:', invoicePaymentSucceeded)
                break

            default:
                console.log('Unhandled event:', event.type)
        }

    } catch (err: any) {
        console.error(err)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

}