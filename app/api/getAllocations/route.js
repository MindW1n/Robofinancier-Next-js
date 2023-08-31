import { NextResponse } from "next/server"
import { getAllocations } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId } = await request.json()
    return NextResponse.json({ allocations: await getAllocations(userId) })
}