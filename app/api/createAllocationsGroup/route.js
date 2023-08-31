import { NextResponse } from "next/server"
import { createAllocationsGroup } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, name, allocationsIds } = await request.json()
    return NextResponse.json({ allocationsGroup: await createAllocationsGroup(userId, name, allocationsIds) })
}