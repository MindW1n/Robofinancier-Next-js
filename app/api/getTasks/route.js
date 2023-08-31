import { NextResponse } from "next/server"
import { getTasks } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId } = await request.json()
    return NextResponse.json({ tasks: await getTasks(userId) })
}