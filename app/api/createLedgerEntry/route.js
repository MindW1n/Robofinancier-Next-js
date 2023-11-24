import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId, date, allocationId, allocationsGroupId, categoryId, amount, record } = await request.json()

    const ledgerEntry = await prisma.ledgerEntry.create({ 
        
        data: { userId, date, allocationId, allocationsGroupId, categoryId, amount, record },
        include: { allocation: true, allocationsGroup: true, category: true }
    })

    if(allocationId == null && allocationsGroupId == null) {
    
        const allocations = await prisma.allocation.findMany({ where: { userId } })

        Promise.all(allocations.map((allocation) => {

            return prisma.allocation.update({

                where: { id: allocation.id },
                
                data: (() => {

                    return !allocation.remindToPutTo || amount < 0
                        ? { money: allocation.money + amount / 100 * allocation.percent }
                        : { moneyToPut: allocation.moneyToPut + amount / 100 * allocation.percent }

                })()
            })

        })).catch((error) => { throw error })
    }

    else if(allocationId != null) prisma.allocation.update({

        where: { id: allocationId },

        data: (() => {

            return !ledgerEntry.allocation.remindToPutTo || amount < 0 
                ? { money: ledgerEntry.allocation.money + amount }
                : { moneyToPut: ledgerEntry.allocation.moneyToPut + amount }
        })()

    }).catch((error) => { throw error })

    else if(allocationsGroupId != null){

        const allocations = await prisma.allocation.findMany({ where: { allocationsGroupId } })
        const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0)

        Promise.all(allocations.map((allocation) => {

            return prisma.allocation.update({

                where: { id: allocation.id },

                data: (() => {

                    return !allocation.remindToPutTo || amount < 0
                        ? { money: allocation.money + amount * allocation.percent / commonPercent }
                        : { moneyToPut: allocation.moneyToPut + amount * allocation.percent / commonPercent }

                })()
            })

        })).catch((error) => { throw error })
    }

    return NextResponse.json({ ledgerEntry })
}