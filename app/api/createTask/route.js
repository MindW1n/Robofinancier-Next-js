import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId, record } = await request.json()
    return NextResponse.json({ task: await prisma.task.create({ data: { userId, record } }).catch(() => null)})
}