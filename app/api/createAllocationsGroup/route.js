import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {

    const { userId, name, allocationsIds } = await request.json()
    const allocationsGroup = await prisma.allocationsGroup.create({ data: { name, userId } }).catch(() => null)

    await allocationsIds.map((allocationId) => prisma.allocation.update({

        where: { id: allocationId },
        data: { allocationsGroupId: allocationsGroup.id}
    }))

    return NextResponse.json({ allocationsGroup })
}