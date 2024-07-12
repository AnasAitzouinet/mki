import { ImportCsvFile } from "@/server/Data"


export async function POST(req: Request) {
    const { data } = await req.json()
    console.log(data)
    try {
        const res = await ImportCsvFile(data)
        console.log(res)
        return Response.json(res)
    } catch (error) {
        console.error(error)
        return Response.json(error)
    }

}