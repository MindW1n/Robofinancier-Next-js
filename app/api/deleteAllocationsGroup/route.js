import { NextResponse } from "next/server"
import { deleteAllocationsGroup } from "../../../utils/database/database"

export async function POST(request)
{
    const { id } = await request.json()
    deleteAllocationsGroup(id)
    return NextResponse.json({}, { status: 200 })
}