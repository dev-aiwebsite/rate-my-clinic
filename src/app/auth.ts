import NextAuth, { CredentialsSignin, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from './authconfig';
import { connectToDb } from "./lib/utils";
import { Users } from './lib/models';
import bcrypt from 'bcrypt';
interface CustomSession extends Session {
    user_role: string;
  }

const login = async (credentials:any) => {
    try {
        connectToDb()
        const user = await Users.findOne({useremail:credentials.useremail})
        if(!user) throw new Error('wrong credentials')
        const isPasswordCorrect = await bcrypt.compare(credentials.userpass, user.password)
        if(!isPasswordCorrect) throw new Error('wrong credentials')
        return user

    } catch (error:any) {
        return false
    }
}   
class CustomError extends CredentialsSignin {
    code = "custom_error"
}

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await login(credentials)
                if(user){
                    return user
                }  else {
                    throw new CustomError()
                }
              
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username
                token.useremail = user.useremail
                token.img = user.img
                token.user_id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user_id = token.user_id
                session.user_name = token.username
                session.user_email = token.useremail
                session.user_img = token.img
                session.user_role = token.role
            }
            return session
        }
    }
})