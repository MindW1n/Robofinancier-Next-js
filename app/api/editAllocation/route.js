import { NextResponse } from "next/server"
import { getMaxAllocationPercent } from "@/utils/calculations"
import prisma from "@/libs/prisma"

export async function POST(request)
{
    const { id, name, money, currency, percent, remindToPutTo, moneyToPut } = await request.json()
    const userId = (await prisma.allocation.findFirst({ where: { id } })).userId
    const allocations = await prisma.allocation.findMany({ where : { userId } })
    const maxAllocationPercent = getMaxAllocationPercent(allocations, id)

    if(percent > maxAllocationPercent) return NextResponse.json({ allocation: null })

    else return NextResponse.json({ allocation: await prisma.allocation.update({ 
        
        where: { id }, 
        data: { name, money, currency, percent, remindToPutTo, moneyToPut } 
    
    }) })
}