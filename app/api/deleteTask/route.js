import { NextResponse } from "next/server"
import { deleteTask } from "../../../utils/database/database"

export async function POST(request)
{
    const { id } = await request.json()
    deleteTask(id)
    return NextResponse.json({}, { status: 200 })
}