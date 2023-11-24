import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function POST(request) {
    
    const { userId, orderBy } = await request.json()

    return NextResponse.json({ ledgerEntries: await prisma.ledgerEntry.findMany({ 

        where: { userId }, 
        orderBy: orderBy, 
        
        include: {

            allocation: true,
            allocationsGroup: true,
            category: true
        } 

    }) })
}