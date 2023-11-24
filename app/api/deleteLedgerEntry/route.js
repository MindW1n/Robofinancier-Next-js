import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { ledgerEntryId } = await request.json()
    const ledgerEntry = await prisma.ledgerEntry.findFirst({ where: { id: ledgerEntryId } }) 

    if(ledgerEntry.allocationId == null && ledgerEntry.allocationsGroupId == null) prisma.allocation.findMany({ where: { userId: ledgerEntry.userId } })
        .then((allocations) => Promise.all(allocations.map((allocation) => prisma.allocation.update({ 
            
            where: { id: allocation.id },
            data: { money: allocation.money - ledgerEntry.amount / 100 * allocation.percent }

        }))).catch((error) => { throw error }))

    else if(ledgerEntry.allocationId != null) prisma.allocation.findFirst({ where: { id: ledgerEntry.allocationId }})
        .then((allocation) => prisma.allocation.update({ 
    
            where: { id: allocation.id }, 
            data: { money: allocation.money - ledgerEntry.amount } 
        
        }).catch((error) => { throw error }))

    else {

        const allocations = await prisma.allocation.findMany({ where: { allocationsGroupId: ledgerEntry.allocationsGroupId } })
        const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0);

        Promise.all(allocations.map((allocation) => prisma.allocation.update({

            where: { id: allocation.id },
            data: { money: allocation.money - ledgerEntry.amount * allocation.percent / commonPercent }

        }))).catch((error) => { throw error })
    }

    prisma.ledgerEntry.delete({ where: { id: ledgerEntryId } }).catch((error) => { throw error })
    return NextResponse.json({ }, { status: 200 })
}