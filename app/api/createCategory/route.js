import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId, name } = await request.json()
    return NextResponse.json({ category: await prisma.category.create({ data: { userId, name } }).catch(() => null) })
}