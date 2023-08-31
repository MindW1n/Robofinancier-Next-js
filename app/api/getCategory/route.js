import { NextResponse } from "next/server"
import { getCategory } from "../../../utils/database/database"

export async function POST(request)
{
    const { categoryId } = await request.json()
    return NextResponse.json({ category: await getCategory(categoryId) })
}