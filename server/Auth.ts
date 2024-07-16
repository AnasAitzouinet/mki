"use server"

import db from "@/lib/prisma"
import { LoginSchema, NewAccountSchema } from "@/schemas"
import type { LoginSchemas, NewAccountSchemas } from "@/schemas"
import { createSession, deleteSession, getSession } from "@/lib/session";

import bcryptjs from "bcryptjs"
import { redirect } from "next/navigation";


const salt = bcryptjs.genSaltSync(10)

export const CreateAccount = async (values: NewAccountSchemas) => {

    const session = await getSession()

    if (!session || !session.userId) {
        throw new Error("Unauthorized")
    }

    const validated = NewAccountSchema.parse(values)
    try {
        const user = await db.user.create({
            data: {
                email: validated.email,
                password: bcryptjs.hashSync(validated.password, salt),
                name: validated.username,
                role: "user"
            }
        })

        return { success: true, message: "Account created successfully" }

    } catch (error) {
        return { success: false, message: "Account creation failed", error }
    }
}


export const CreateAccountAdmin = async (values: NewAccountSchemas) => {

    const validated = NewAccountSchema.parse(values)
    try {
        const user = await db.user.create({
            data: {
                email: validated.email,
                password: bcryptjs.hashSync(validated.password, salt),
                name: validated.username,
                role: "admin"
            }
        })

        return { success: true, message: "Account created successfully" }

    } catch (error) {
        return { success: false, message: "Account creation failed", error }
    }
}

export const Login = async (values: LoginSchemas) => {
    const validated = LoginSchema.parse(values);
    try {
        const user = await db.user.findFirst({
            where: {
                email: validated.email,
            },
        });
        if (!user || !user.password) {
            console.log("Login failed: Email or Password invalid");
            return { success: false, message: "Login failed: Email or Password invalid" };
        }

        const valid = await bcryptjs.compare(validated.password, user.password);

        if (!valid) {
            console.log("Login failed: Email or Password invalid");
            return { success: false, message: "Login failed: Email or Password invalid" };
        }
        await createSession(user.id as string, user.role);
        return { success: true, message: "Login successful" };
    } catch (error) {
        return { success: false, message: "Login failed: Something Occured, try again later" };
    }
};


export const IsAdmin = async () => {
    const session = await getSession()
    if (!session || !session.userId) {
        return false
    }
    const user = await db.user.findFirst({
        where: {
            id: session.userId
        }
    })
    if (!user || user.role !== 'admin') {
        return false
    }
    return true
}

export const Logout = async () => {
    deleteSession()
    redirect('/')
}