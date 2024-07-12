"use client";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { LoginSchema, } from "@/schemas"
import type { LoginSchemas } from "@/schemas"
import { Login } from "@/server/Auth";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { set } from "date-fns";

export default function LoginForm() {
    const { toast } = useToast()
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<LoginSchemas>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: LoginSchemas) => {
        setLoading(true)
        Login(values).then((res) => {
            if (res.success) {
                setSuccess(res.message)
                toast({
                    title: "Login is Done",
                    description: res.message,
                    duration: 5000,
                    color: "success",
                })
                window.location.href = "/"
                setLoading(false)
            } else {
                setError(res.message)
                toast({
                    title: "Login Failed",
                    description: res.message,
                    duration: 5000,
                    color: "danger",
                })
                setLoading(false)
            }
        })
    }

    return (
        <main className="w-screen flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">

                            <FormField
                                control={form.control}
                                name="email"
                                disabled={loading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jhon@doe.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                disabled={loading}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="******" type="password" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                disabled={loading}
                                type="submit" className="w-full ">Submit</Button>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </main>
    )
}
