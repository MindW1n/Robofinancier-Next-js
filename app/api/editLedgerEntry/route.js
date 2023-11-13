import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request)
{
    const { id, date, allocationId, allocationsGroupId, amount, categoryId, record } = await request.json()
    const ledgerEntry = await prisma.ledgerEntry.findFirst({ where: { id } })

    if(ledgerEntry.allocationsGroupId == null && ledgerEntry.allocationId == null) await prisma.allocation.findMany({ where: { userId: ledgerEntry.userId } })
        .then((allocations) => Promise.all(allocations.map((allocation) => prisma.allocation.update({ 
            
            where: { id: allocation.id }, 
            data: { money: allocation.money - ledgerEntry.amount * allocation.percent / 100 }

        }))).then())

    else if(ledgerEntry.allocationsGroupId != null) await prisma.allocation.findMany({ where: { allocationsGroupId: ledgerEntry.allocationsGroupId } })
        .then((allocations) => {
            
            const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0)

            return Promise.all(allocations.map((allocation) => prisma.allocation.update({

                where: { id: allocation.id },
                data: { money: allocation.money - ledgerEntry.amount * allocation.percent / commonPercent}

            })))

        }).then()

    else await prisma.allocation.findFirst({ where: { id: ledgerEntry.allocationId } })
        .then((allocation) => prisma.allocation.update({ 
            
            where: { id: allocation.id }, 
            data: { money: allocation.money - ledgerEntry.amount }
        
        }).then())

    if(allocationsGroupId == null && allocationId == null) prisma.allocation.findMany({ where: { userId: ledgerEntry.userId } })
        .then((allocations) => Promise.all(allocations.map((allocation) => {

            if(!allocation.remindToPutTo || amount < 0) return prisma.allocation.update({

                where: { id: allocation.id }, 
                data: { money: allocation.money + amount * allocation.percent / 100 }
            })

            else return prisma.allocation.update({ 
            
                where: { id: allocation.id }, 
                data: { moneyToPut: allocation.moneyToPut + amount * allocation.percent / 100 }
            })

        })).then())

    else if(allocationsGroupId != null) prisma.allocation.findMany({ where: { allocationsGroupId } }).then((allocations) => {
            
        const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0)

        Promise.all(allocations.map((allocation) => prisma.allocation.update({

            where: { id: allocation.id },
            data: { money: allocation.money + amount * allocation.percent / commonPercent}

        }))).then()
    })

    else prisma.allocation.findFirst({ where: { id: allocationId } })
        .then((allocation) => { 

            if(!allocation.remindToPutTo || amount < 0) return prisma.allocation.update({

                where: { id: allocation.id }, 
                data: { money: allocation.money + amount }
            })

            else return prisma.allocation.update({ 
            
                where: { id: allocation.id }, 
                data: { moneyToPut: allocation.moneyToPut + amount }
            })

        }).then()

    return NextResponse.json({ ledgerEntry: await prisma.ledgerEntry.update({ 
        
        where: { id }, 
        data: { id, date, allocationId, allocationsGroupId, amount, categoryId, record },
        include: { category: true, allocation: true }
    
    }) }, { status: 200 })
}