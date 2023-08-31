import { NextResponse } from "next/server"
import { createAllocation, getMaxAllocationPercent } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, name, percent, money, currency, remindToPutTo } = await request.json()
    const maxAllocationPercent = await getMaxAllocationPercent(userId)
    if(percent > maxAllocationPercent) return NextResponse.json({ allocation: null })
    else return NextResponse.json({ allocation: await createAllocation(userId, name, percent, money, currency, remindToPutTo) })
}