
import { NextApiResponse, NextApiRequest } from "next";

import { CreateAccountAdmin  } from "@/server/Auth";

export async function POST(req: Request ) {
    const { email, password , username } = await req.json()
    const res = await CreateAccountAdmin({ email, password , username })
    if(res.success){
        return Response.json(res)
    }else{
        return Response.json({ message: "message failed", status: 400, error: "error"})
    }
}