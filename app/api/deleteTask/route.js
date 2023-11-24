import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request)
{
    const { id } = await request.json()
    prisma.task.delete({ where: { id } }).catch((error) => { throw error })
    return NextResponse.json({}, { status: 200 })
}