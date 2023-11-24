import prisma from "@/libs/prisma"
const bcrypt = require("bcrypt")

export async function signIn(login, password) {

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

export async function signUp(data) {

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

export async function getUserByAccount(provider_providerAccountId) {

    return (await prisma.account.findUnique({

        where: { provider_providerAccountId },
        select: { user: true }

    }))?.user || null
}

export async function getUserByEmail(email) { return await prisma.user.findUnique({ where: { email } }) }

export async function linkAccount(data) {

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

export async function getUser(id) { return prisma.user.findUnique({ where: { id } }) }