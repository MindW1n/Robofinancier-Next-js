import { NextResponse } from "next/server"
import { getCategory, createLedgerEntry, getAllocations, editAllocation, getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, date, allocationId, allocationsGroupId, categoryId, amount, record } = await request.json()
    const databaseRequests = [createLedgerEntry(userId, date, allocationId, categoryId, amount, record), getCategory(categoryId)]

    await prisma.ledgerEntry.create({

        data: {

            userId: userId,
            date: date,
            allocationId: allocationId,
            categoryId: categoryId,
            amount: amount,
            record: record
        },
        include: {

            allocation: true,
            category: true
        }
    })
    
    const [ledgerEntry, category] = await Promise.all(databaseRequests)

    if(category.type == "Income") {

        const allocations = await getAllocations(userId)

        for(const allocation of allocations) {

            if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money + amount / 100 * allocation.percent })
            else editAllocation({ id: allocation.id, moneyToPut: allocation.moneyToPut + amount / 100 * allocation.percent })
        }
    }

    else {

        const allocation = await getAllocation(allocationId)
        editAllocation({ id: allocation.id, money: allocation.money - amount })
    }

    return NextResponse.json({ ledgerEntry })
}