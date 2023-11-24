import { NextResponse } from "next/server"
import { getMaxAllocationPercent } from "@/utils/calculations"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId, name, percent, money, currency, remindToPutTo } = await request.json()
    const allocations = await prisma.allocation.findMany({ where: { userId } })
    const maxAllocationPercent = getMaxAllocationPercent(allocations)
    if(percent > maxAllocationPercent) return NextResponse.json({ allocation: null })
    else return NextResponse.json({ allocation: await prisma.allocation.create({ data: { userId, name, percent, money, currency, 
        remindToPutTo } }).catch(() => null) })
}