import { NextResponse } from "next/server"
import { getMaxAllocationPercent, getAllocation, editAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { id, name, money, currency, percent, remindToPutTo, moneyToPut } = await request.json()
    const userId = (await getAllocation(id)).userId
    const maxAllocationPercent = await getMaxAllocationPercent(userId, id)
    if(percent > maxAllocationPercent) return NextResponse.json({ allocation: null })
    else return NextResponse.json({ allocation: await editAllocation({ id, name, percent, money, currency, remindToPutTo, moneyToPut }) })
}