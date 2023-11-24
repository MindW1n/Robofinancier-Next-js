import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId } = await request.json()
    return NextResponse.json({ tasks: await prisma.task.findMany({ where: { userId } }) })
}