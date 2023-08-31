import { NextResponse } from "next/server"
import { getAllocation } from "../../../utils/database/database"

export async function POST(request)
{
    const { allocationId } = await request.json()
    return NextResponse.json({ allocation: await getAllocation(allocationId) })
}