import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { categoryId } = await request.json()
    return NextResponse.json({ category: await prisma.caterory.findFirst({ where: { id: categoryId } }) })
}