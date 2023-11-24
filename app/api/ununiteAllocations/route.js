import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { allocationsIds } = await request.json()

    Promise.all(allocationsIds.map((allocationId) => prisma.allocation.update({

        where: { id: allocationId },
        data: { allocationsGroupId: null }

    }))).catch((error) => { throw error })

    return NextResponse.json({ }, { status: 200 })
}