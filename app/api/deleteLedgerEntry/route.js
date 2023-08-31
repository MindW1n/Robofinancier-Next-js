import { NextResponse } from "next/server"
import { getUser, getLedgerEntry, getCategory, deleteLedgerEntry, getAllocations, editAllocation, getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { ledgerEntryId } = await request.json()
    const ledgerEntry = await getLedgerEntry(ledgerEntryId) 
    const databaseRequests = [getUser(ledgerEntry.userId), getCategory(ledgerEntry.categoryId)]
    const [user, category] = await Promise.all(databaseRequests)

    if(category.type == "Income") {

        const allocations = await getAllocations(user.id)

        for(const allocation of allocations) {

            if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money - ledgerEntry.amount / 100 * allocation.percent })
            else editAllocation({ id: allocation.id, moneyToPut: allocation.moneyToPut - ledgerEntry.amount / 100 * allocation.percent })
        }
    }

    else {

        const allocation = await getAllocation(ledgerEntry.allocationId)
        editAllocation({ id: allocation.id, money: allocation.money + ledgerEntry.amount })
    }

    deleteLedgerEntry(ledgerEntryId)
    return NextResponse.json({ }, { status: 200 })
}