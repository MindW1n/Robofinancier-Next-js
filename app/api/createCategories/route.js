import { NextResponse } from "next/server"
import { createCategories } from "../../../utils/database/database"

export async function POST(request)
{
    const data = await request.json()
    return NextResponse.json({ categories: await createCategories(data) })
}