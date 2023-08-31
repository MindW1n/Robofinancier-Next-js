import { NextResponse } from "next/server"
import { editTask } from "../../../utils/database/database"

export async function POST(request)
{
    const { id, record } = await request.json()
    return NextResponse.json({ task: await editTask(id, record) })
}