import { NextResponse } from "next/server"
import { createCategory } from "../../../utils/database/database"

export async function POST(request)
{
    const { userId, name, type } = await request.json()
    return NextResponse.json({ category: await createCategory(userId, name, type) })
}