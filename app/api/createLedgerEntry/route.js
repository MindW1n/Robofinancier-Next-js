import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request)
{
    const { userId, date, allocationId, allocationsGroupId, categoryId, amount, record } = await request.json()

    const ledgerEntry = await prisma.ledgerEntry.create({ 
        
        data: { userId, date, allocationId, allocationsGroupId, categoryId, amount, record },
        include: { allocation: true, allocationsGroup: true, category: true }
    })

    if(allocationId == null && allocationsGroupId == null) {
    
        const allocations = await prisma.allocation.findMany({ where: { userId } })

        Promise.all(allocations.map((allocation) => {

            if(!allocation.remindToPutTo || amount < 0) {

                return prisma.allocation.update({

                    where: { id: allocation.id },
                    data: { money: allocation.money + amount / 100 * allocation.percent }
                })
            }

            else {

                return prisma.allocation.update({

                    where: { id: allocation.id },
                    data: { moneyToPut: allocation.moneyToPut + amount / 100 * allocation.percent }
                })
            }

        })).then()
    }

    else if(allocationId != null) {

        if(!ledgerEntry.allocation.remindToPutTo || amount < 0) {

            prisma.allocation.update({

                where: { id: allocationId },
                data: { money: ledgerEntry.allocation.money + amount }

            }).then()
        }

        else {

            prisma.allocation.update({

                where: { id: allocationId },
                data: { moneyToPut: ledgerEntry.allocation.moneyToPut + amount }

            }).then()
        }
    }

    else if(allocationsGroupId != null){

        const allocations = await prisma.allocation.findMany({ where: { allocationsGroupId } })
        const commonPercent = allocations.reduce((total, allocation) => total + allocation.percent, 0)

        Promise.all(allocations.map((allocation) => {

            if(!allocation.remindToPutTo || amount < 0) {

                return prisma.allocation.update({

                    where: { id: allocation.id },
                    data: { money: allocation.money + amount * allocation.percent / commonPercent }
                })
            }

            else {

                return prisma.allocation.update({

                    where: { id: allocation.id },
                    data: { moneyToPut: allocation.moneyToPut + amount * allocation.percent / commonPercent}
                })
            }

        })).then()
    }

    return NextResponse.json({ ledgerEntry })
}