import prisma from "@/libs/prisma"
const bcrypt = require("bcrypt")

export async function signIn(login, password)
{
    var user = await prisma.user.findFirst({

        where: {

            OR: [

                {name: login},
                {email: login}
            ]
        }
    })

    if(!user) throw new Error("The user with this login doesn't exist!")

    if(await bcrypt.compare(password, user.hashedPassword)) return user

    else throw new Error("Incorrect password!")
}

export async function signUp(data)
{
    if(data.password) var hashedPassword = await bcrypt.hash(data.password, 10)

    return await prisma.user.create({

        data: {

            name: data.name,
            email: data.email,
            hashedPassword: hashedPassword,
            image: data.image
        }   
    }).catch(() => { throw new Error("User with this email is already signed up!") })
}

export async function getUserByAccount(provider_providerAccountId) 
{
    return (await prisma.account.findUnique({

        where: { provider_providerAccountId },
        select: { user: true }

    }))?.user || null
}

export async function getUserByEmail(email)
{
    return await prisma.user.findUnique({ where: { email } })
}

export async function linkAccount(data)
{
    return await prisma.account.create({

        data: {

            userId: data.userId,
            type: data.type,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            expiresAt: data.expires_at,
            tokenType: data.token_type,
            scope: data.scope,
            idToken: data.id_token,
            sessionState: data.session_state
        }
    })
}

export async function getUser(id) 
{
    return prisma.user.findUnique({ where: { id } })
}

export async function editUser(id, name, email, emailVerified, image, hashedPassword, money)
{
    await prisma.user.update({

        where: { id: id },
        data: {

            name: name,
            email: email,
            emailVerified: emailVerified,
            image: image,
            hashedPassword: hashedPassword,
            money: money
        }
    })
}

export async function createAllocation(userId, name, percent, money, currency, remindToPutTo)
{
    return await prisma.allocation.create({

        data: {

            userId: userId,
            name: name,
            percent: percent,
            money: money,
            currency: currency,
            remindToPutTo: remindToPutTo
        }

    }).catch(() => { return null })
}

export async function editAllocation(data) 
{
    return await prisma.allocation.update({

        where: {

            id: data.id
        },

        data: data
    })
}

export async function deleteAllocation(id)
{
    await prisma.allocation.delete({

        where: { id: id }
    }).catch(() => { return null })
}

export async function updateAllocationsGroupIds(allocationIds, allocationsGroupId)
{
    allocationIds.map(async (allocationId) => await prisma.allocation.update({

        where: { id: allocationId },
        data: { allocationsGroupId: allocationsGroupId }
    }))
}

export async function getAllocation(id)
{
    return prisma.allocation.findFirst({

        where: {

            id: id
        }
    })
}

export async function getAllocations(userId)
{
    return await prisma.allocation.findMany({

        where: {

            userId: userId
        },

        orderBy: [
            
            { id: "asc" }
        ]
    })
}

export async function getMaxAllocationPercent(userId, currentAllocationId)
{
    const allocations = await getAllocations(userId)
    let maxValue = 100

    for(let i = 0; i < allocations.length; i++) { 
        
        if(allocations[i].id == currentAllocationId) continue
        maxValue -= allocations[i].percent
    }
    
    return maxValue
}

export async function createAllocationsGroup(userId, name, allocationsIds) 
{
    const allocationsGroup = await prisma.allocationsGroup.create({

        data: { name: name, userId: userId }

    }).catch(() => { return null })

    if(!allocationsGroup) return null

    await updateAllocationsGroupIds(allocationsIds, allocationsGroup.id)
    return allocationsGroup
}

export async function getAllocationsGroups(userId)
{
    return await prisma.allocationsGroup.findMany({

        where: { userId: userId }
    })
}

export async function deleteAllocationsGroup(id)
{
    await prisma.allocationsGroup.delete({

        where: { id: id }
    })
}

export async function createCategory(userId, name, type)
{
    return await prisma.category.create({

        data: {

            userId: userId,
            name: name,
            type: type
        }
    })
}

export async function createCategories(data)
{
    return prisma.category.createMany({

        data: data
    })
}

export async function getCategories(userId)
{
    return await prisma.category.findMany({

        where: { userId: userId }
    })
}

export async function getCategory(categoryId)
{
    return await prisma.category.findFirst({

        where: { id: categoryId }
    })
}

export async function createLedgerEntry(userId, date, allocationId, categoryId, amount, record)
{
    return 
}

export async function editLedgerEntry(id, date, allocationId, amount, categoryId, record)
{
    return prisma.ledgerEntry.update({

        where: { id: id },
        data: {

            date: date,
            allocationId: allocationId,
            amount: amount,
            categoryId: categoryId, 
            record: record
        },
        include: {

            allocation: true,
            category: true
        }
    })
}

export async function deleteLedgerEntry(ledgerEntryId)
{
    await prisma.ledgerEntry.delete({

        where: { id: ledgerEntryId }
    })
}

export async function getLedgerEntry(ledgerEntryId)
{
    return await prisma.ledgerEntry.findFirst({

        where: { id: ledgerEntryId }
    })
}

export async function getLedgerEntries(userId, orderBy)
{
    return await prisma.ledgerEntry.findMany({

        where: { userId: userId },
        orderBy: orderBy,
        include: {

            allocation: true,
            category: true
        }
    })
}

export async function createTask(userId, record)
{
    return await prisma.task.create({

        data: { 
            
            record: record,
            userId: userId
        }
    })
}

export async function getTasks(userId)
{
    return await prisma.task.findMany({

        where: { userId: userId },
        orderBy: { updatedAt: "desc"}
    })
}

export async function editTask(id, record)
{
    return await prisma.task.update({

        where: { id: id},
        data: { record: record }
    })
}

export async function deleteTask(id)
{
    await prisma.task.delete({

        where: { id: id }
    })
}