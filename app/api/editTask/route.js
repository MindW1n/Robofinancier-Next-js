import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { id, record } = await request.json()
    return NextResponse.json({ task: await prisma.task.update({ where: { id }, data: { record } }) })
}