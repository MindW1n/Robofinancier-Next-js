import NextAuth from "next-auth/next"
import prismaAdapter from "@/prisma/adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import VkProvider from "next-auth/providers/vk"
import { signIn, signUp } from "../../../../utils/database/database"

export const authOptions = {

    adapter: prismaAdapter,
    providers: [

        GoogleProvider({

            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        VkProvider({

            clientId: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_CLIENT_SECRET,

            profile: (profile, tokens) => {

                return {

                    id: profile.response[0].id,
                    name: profile.response[0].first_name + ' ' + profile.response[0].last_name,
                    image: profile.response[0].photo_100,
                    expires_at: tokens.expires_at,
                    access_token: tokens.access_token
                }
            }
        }),

        CredentialsProvider({

            name: "Credentials",
            authorize: async (credentials) => {

                if(credentials.signUp == "true") return await signUp(credentials.name, credentials.email, credentials.password)

                else return await signIn(credentials.login, credentials.password) 
            }
        })
    ],

    callbacks: {

        session: ({ session, token }) => {

            return { ...session, user: { id: token.id, ...session.user, role: token.role }}
        },

        jwt: ({ token, user }) => {

            if(user) return { id: user.id, ...token, role: user.role } 
            return token
        }
    },

    pages: { signIn: false },

    secret: process.env.SECRET,
    session: {

        strategy: "jwt"
    },
    debug: false
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }