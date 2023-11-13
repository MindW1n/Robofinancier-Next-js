import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"
import { getUser, getLedgerEntry, getCategory, deleteLedgerEntry, getAllocations, editAllocation, getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { ledgerEntryId } = await request.json()
    const ledgerEntry = await getLedgerEntry(ledgerEntryId) 

    if(ledgerEntry.allocationId == null && ledgerEntry.allocationsGroupId == null) prisma.allocation.findMany({ where: { userId: ledgerEntry.userId } })
        .then((allocations) => Promise.all(allocations.map((allocation) => prisma.allocation.update({ 
            
            where: { id: allocation.id },
            data: { money: allocation.money - ledgerEntry.amount / 100 * allocation.percent }

        }))).then())

    else if(ledgerEntry.allocationId != null) prisma.allocation.findFirst({ where: { id: ledgerEntry.allocationId }})
        .then((allocation) => prisma.allocation.update({ where: { id: allocation.id }, data: { money: allocation.money - ledgerEntry.amount } }).then())

    else {

        const allocations = await prisma.allocation.findMany({ where: { allocationsGroupId: ledgerEntry.allocationsGroupId } })
        const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0);

        Promise.all(allocations.map((allocation) => prisma.allocation.update({

                where: { id: allocation.id },
                data: { money: allocation.money - ledgerEntry.amount * allocation.percent / commonPercent }

        }))).then()
    }

    deleteLedgerEntry(ledgerEntryId)
    return NextResponse.json({ }, { status: 200 })
}