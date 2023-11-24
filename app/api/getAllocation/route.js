import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { allocationId } = await request.json()
    return NextResponse.json({ allocation: await prisma.allocation.findFirst({ where: { id: allocationId } }) })
}