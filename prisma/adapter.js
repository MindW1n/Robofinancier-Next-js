import { signUp, linkAccount, getUser, getUserByAccount, getUserByEmail } from "@/utils/database/database"

const prismaAdapter = {

    getUser: async (id) => getUser(id),
    createUser: async (data) => await signUp(data),
    linkAccount: async (data) => linkAccount(data),
    getUserByAccount: async (provider_providerAccountId) => getUserByAccount(provider_providerAccountId),
    getUserByEmail: async (email) => getUserByEmail(email)
}

export default prismaAdapter