import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { id, date, allocationId, allocationsGroupId, amount, categoryId, record } = await request.json()
    const ledgerEntry = await prisma.ledgerEntry.findFirst({ where: { id } })

    const newLedgerEntry = await prisma.ledgerEntry.update({ 
        
        where: { id }, 
        data: { id, date, allocationId, allocationsGroupId, amount, categoryId, record },
        include: { category: true, allocation: true }
    })

    prisma.allocation.findMany({ where: { userId: ledgerEntry.userId }}).then((allocations) => {

        const calculateCommonPercent = (allocations, allocationsGroupId) => 
            (allocationsGroupId != null) 
                ? allocations.reduce((total, allocation) => 
                    allocation.allocationsGroupId == allocationsGroupId
                        ? total + allocation.percent 
                        : total, 0)
                : undefined

        var commonPercent = calculateCommonPercent(allocations, ledgerEntry.allocationsGroupId)
        
        allocations = allocations.map((allocation) => {

            if(ledgerEntry.allocationsGroupId == null && ledgerEntry.allocationId == null) allocation.money -= ledgerEntry.amount * allocation.percent / 100 

            else if(commonPercent && allocation.allocationsGroupId == ledgerEntry.allocationsGroupId) 
                allocation.money -= ledgerEntry.amount * allocation.percent / commonPercent 

            else if(allocation.id == ledgerEntry.allocationId) allocation.money -= ledgerEntry.amount
            return allocation
        })

        commonPercent = calculateCommonPercent(allocations, allocationsGroupId)

        Promise.all(allocations.map((allocation) => {

            if(allocationsGroupId == null && allocationId == null) {

                if(!allocation.remindToPutTo || amount < 0) allocation.money += amount * allocation.percent / 100
                else allocation.moneyToPut += amount * allocation.percent / 100
            }

            else if(allocationsGroupId != null && allocation.allocationsGroupId == allocationsGroupId) {

                if(!allocation.remindToPutTo || amount < 0) allocation.money += amount * allocation.percent / commonPercent
                else allocation.moneyToPut += amount * allocation.percent / commonPercent
            }

            else if(allocation.id == allocationId) {

                if(!allocation.remindToPutTo || amount < 0) allocation.money += amount
                else allocation.moneyToPut += amount
            }

            return prisma.allocation.update({ where: { id: allocation.id } , data: allocation })

        })).catch((error) => { throw error })
    })

    return NextResponse.json({ ledgerEntry: newLedgerEntry }, { status: 200 })
}