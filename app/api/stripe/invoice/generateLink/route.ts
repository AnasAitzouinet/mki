import db from "@/lib/prisma";
import { getSession } from "@/lib/session";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !session.userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findFirst({
        where: { id: session.userId }
    });
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const {
            ProductName,
            ProductPrice,
            CustomerName,
            CustomerEmail,
            clientId,
            dateDecheanceDays,
            dateDecheance,
            description
        } = await req.json();

        const unitAmount = parseInt(ProductPrice) * 100;

        const [product, customer] = await Promise.all([
            stripe.products.create({ name: ProductName, description }),
            stripe.customers.create({ name: CustomerName, email: CustomerEmail })
        ]);

        if (!product || !customer) {
            return new NextResponse("Error creating product or customer", { status: 500 });
        }

        const price = await stripe.prices.create({
            unit_amount: unitAmount,
            currency: 'usd',
            product: product.id
        });

        if (!price) {
            return new NextResponse("Error creating price", { status: 500 });
        }

        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: "send_invoice",
            days_until_due: dateDecheanceDays
        });

        if (!invoice) {
            return new NextResponse("Error creating invoice", { status: 500 });
        }

        const invoiceItems = await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: invoice.id,
            price: price.id
        });

        if (!invoiceItems) {
            return new NextResponse("Error creating invoice items", { status: 500 });
        }

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
            expand: ['payment_intent']
        });

        await db.factures.create({
            data: {
                dateDecheance,
                montant: parseFloat(ProductPrice),
                paiment_Link: finalizedInvoice.hosted_invoice_url,
                paiment_PDF: finalizedInvoice.invoice_pdf,
                invoice_id: finalizedInvoice.id,
                client: {
                    connect: {
                        id: clientId
                    }
                },
                user: {
                    connect: {
                        id: user.id
                    }
                }

            }
        });

        await db.clients.update({
            where: { id: clientId },
            data: { montant: parseFloat(ProductPrice) }
        });

        return new NextResponse("Invoice created successfully", { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new NextResponse(`Error creating invoice: ${error.message}`, { status: 500 });
    }
}
