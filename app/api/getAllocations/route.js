import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId } = await request.json()
    return NextResponse.json({ allocations: await prisma.allocation.findMany({ where: { userId } }) })
}