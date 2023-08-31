import { NextResponse } from "next/server"
import { deleteAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { id } = await request.json()
    deleteAllocation(id)
    return NextResponse.json({}, { status: 200 })
}