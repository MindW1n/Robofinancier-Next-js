import { NextResponse } from "next/server"
import { getCategories } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId } = await request.json()
    return NextResponse.json({ categories: await getCategories(userId) })
}