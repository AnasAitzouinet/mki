"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

import { NewAccountSchema } from "@/schemas";
import { CreateAccount } from "@/server/Auth";
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";


export default function NewClient() {
  const { toast } = useToast()
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof NewAccountSchema>>({
    resolver: zodResolver(NewAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof NewAccountSchema>) => {
    setLoading(true)
    CreateAccount(values).then((res) => {
      if (res.success) {
        setSuccess(res.message)
        toast({
          title: "Creation is Done",
          description: res.message,
          duration: 5000,
          color: "success",
        })
        setLoading(false)
      } else {
        setError(res.message)
        toast({
          title: "Creation is Done",
          description: res.message,
          duration: 5000,
          color: "error",
        })
        setLoading(false)

      }
    })
  }

  return (
    <Card className="mx-auto my-auto w-1/4">
      <CardHeader>
        <CardTitle className="text-xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">
            <FormField
              control={form.control}
              name="username"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Jhone doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="password"
              disabled={loading}

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
  )
}
