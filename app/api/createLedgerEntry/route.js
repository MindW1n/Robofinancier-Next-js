import { NextResponse } from "next/server"
import { getCategory, createLedgerEntry, getAllocations, editAllocation, getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, date, allocationId, categoryId, amount, record } = await request.json()
    const ISOFormatDate = date + "T00:00:00.000Z"
    const databaseRequests = [createLedgerEntry(userId, ISOFormatDate, allocationId, categoryId, amount, record), getCategory(categoryId)]
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