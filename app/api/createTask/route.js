import { NextResponse } from "next/server"
import { createTask } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, record } = await request.json()
    return NextResponse.json({ task: await createTask(userId, record) }, { status: 200 })
}