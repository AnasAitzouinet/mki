"use client"

import { Leads, columns } from "@/components/Tables/Columns/Column";
import { DataTable } from "@/components/Tables/DataTable";
import { getClientsByUser, getDatas, getUsers } from "@/server/Data";
import { Clients, User } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IsAdmin } from "@/server/Auth";
import SkeletonDisplay from "@/components/Dashboard/SkeletonDisplay";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/DatePicker";

export function parseDateString(dateString: string): Date {
    const parts = dateString.split(/[/ :]/)
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}`)
}


export default function DemoPage() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [data, setData] = useState<Clients[]>([]);
    const [user, setUser] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [usersRes, dataRes, isAdminRes] = await Promise.all([getUsers(), getDatas(), IsAdmin()]);
            setUsers(usersRes);
            setData(dataRes);
            setIsAdmin(isAdminRes)
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (date && date.from && date.to) {
            const filteredData = data.filter((client) => {
                if (client.creationDate) {
                    const clientDate = parseDateString(client.creationDate);
                    console.log(clientDate, date.from, date.to);
                    return clientDate >= date.from! && clientDate <= date.to!;
                }
                return false;
            });
            console.log(filteredData);
            setData(filteredData);

        }
    }, [date]);


    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleUserChange = useCallback(async (userId: string) => {
        setLoading(true);
        try {
            const clientsByUser = await getClientsByUser(userId);
            setData(clientsByUser);
        } catch (error) {
            console.error("Failed to fetch clients by user", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleReset = () => {
        setUser('');
        setDate(undefined);
        fetchInitialData();
    };

    if (loading) return <SkeletonDisplay />;

    return (
        <div className="">
            <div className="w-full flex space-x-2">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">Les Fiches</h1>
                    {
                        isAdmin && (
                            <div className="w-full flex gap-x-2 items-center justify-center ">
                                <Select
                                    onValueChange={(value) => {
                                        setUser(value);
                                        handleUserChange(value);
                                    }}
                                    value={user}

                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="List of accounts" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full ">
                                        {
                                            users ?
                                                users.map((user, index) => (
                                                    <SelectItem key={index} value={user.id} className="flex     flex-col   items-start justify-start w-full">
                                                        <p>{user.name}</p>
                                                        <p>{user.email}</p>
                                                    </SelectItem>
                                                )) : 'no users found'
                                        }
                                    </SelectContent>
                                </Select>
                                {
                                    (
                                        <Button onClick={handleReset} variant="secondary">Reset</Button>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>

            <DataTable columns={columns} data={data} date={date} setDate={setDate} />
        </div>
    );
}
