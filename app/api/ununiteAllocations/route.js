import { NextResponse } from "next/server"
import { updateAllocationsGroupIds } from "@/utils/database/database"

export async function POST(request)
{
    const { allocationsIds } = await request.json()
    updateAllocationsGroupIds(allocationsIds, null)
    return NextResponse.json({ }, { status: 200 })
}