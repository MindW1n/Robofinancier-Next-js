import { NextResponse } from "next/server"
import { getUser, getCategory, editLedgerEntry, getLedgerEntry, getAllocations, editAllocation, getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { id, date, allocationId, amount, categoryId, record } = await request.json()
    const ISOFormatDate = date + "T00:00:00.000Z"
    const ledgerEntry = await getLedgerEntry(id)
    const databaseRequests = [await getCategory(ledgerEntry.categoryId), await getCategory(categoryId), await getUser(ledgerEntry.userId)]
    const [prevCategory, currentCategory, user] = await Promise.all(databaseRequests)
    const categoryTypeChanged = prevCategory.type != currentCategory.type
    const wasIncomeCategory = prevCategory.type == "Income"
    const difference = !categoryTypeChanged 
        ? (amount - ledgerEntry.amount) 
        : wasIncomeCategory ? -(amount + ledgerEntry.amount) : amount + ledgerEntry.amount

    if(!categoryTypeChanged) {

        if(wasIncomeCategory) {

            const allocations = await getAllocations(user.id)

            for(const allocation of allocations) {

                if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money + difference * allocation.percent / 100 })
                else editAllocation({ id: allocation.id, moneyToPut: allocation.moneyToPut + difference * allocation.percent / 100 })
            }
        }

        else {

            if(allocationId != ledgerEntry.allocationId) {

                const prevAllocation = await getAllocation(ledgerEntry.allocationId)
                editAllocation({ id: prevAllocation.id, money: prevAllocation.money + ledgerEntry.amount })
                const currentAllocation = await getAllocation(allocationId)
                editAllocation({ id: currentAllocation.id, money: currentAllocation.money - amount })
            }

            else {

                const allocation = await getAllocation(allocationId)
                editAllocation({ id: allocationId, money: allocation.money - difference })
            }
        }
    }

    else {

        if(wasIncomeCategory) {
            
            const allocations = await getAllocations(user.id)

            for(const allocation of allocations) {

                if(allocation.id != allocationId) {
                    
                    if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money - ledgerEntry.amount * allocation.percent / 100 })
                    else editAllocation({ id: allocation.id, moneyToPut: allocation.moneyToPut - ledgerEntry.amount * allocation.percent / 100 })
                }
            }

            const allocation = await getAllocation(allocationId)
            if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money - amount - ledgerEntry.amount * allocation.percent / 100 })
            else editAllocation({ id: allocation.id, moneyToPut: allocation.moneyToPut - ledgerEntry.amount * allocation.percent / 100, money: allocation.money - amount })
        }

        else {

            const prevAllocation = await getAllocation(ledgerEntry.allocationId)
            if(!prevAllocation.remindToPutTo) editAllocation({ id: prevAllocation.id, money: prevAllocation.money + ledgerEntry.amount + amount * prevAllocation.percent / 100 }) 
            else editAllocation({ id: prevAllocation.id, money: prevAllocation.money + ledgerEntry.amount, moneyToPut: prevAllocation.moneyToPut + amount * prevAllocation.percent / 100 })
            const allocations = await getAllocations(user.id)

            for(const allocation of allocations) {

                if(allocation.id != prevAllocation.id) { 
                    
                    if(!allocation.remindToPutTo) editAllocation({ id: allocation.id, money: allocation.money + amount * allocation.percent / 100 })
                    else editAllocation({ id: allocation.id, money: allocation.money, moneyToPut: allocation.moneyToPut + amount * allocation.percent / 100 })
                }
            }
        }
    }
    
    return NextResponse.json({ ledgerEntry: await editLedgerEntry(id, ISOFormatDate, allocationId, amount, categoryId, record) })
}