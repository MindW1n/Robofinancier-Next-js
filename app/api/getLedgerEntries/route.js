import { NextResponse } from "next/server"
import { getLedgerEntries } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, orderBy } = await request.json()
    return NextResponse.json({ ledgerEntries: await getLedgerEntries(userId, orderBy) })
}