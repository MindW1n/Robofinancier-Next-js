import { NextResponse } from "next/server"
import { getAllocationsGroups } from "@/utils/database/database"

export async function POST(request)
{
    const { userId } = await request.json()
    return NextResponse.json({ allocationsGroups: await getAllocationsGroups(userId) })
}