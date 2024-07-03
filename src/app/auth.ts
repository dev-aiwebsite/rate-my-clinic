import NextAuth, { CredentialsSignin, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from './authconfig';
import { connectToDb } from "./lib/utils";
import { Users } from './lib/models';
import bcrypt from 'bcrypt';
import { ExtendedSession, ExtendedUser } from "../../typings";
import { JWT } from "next-auth/jwt";
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
                const extendedUser = user as ExtendedUser;
                token.username = extendedUser.username;
                token.useremail = extendedUser.useremail;
                token.img = extendedUser.img;
                token.user_id = extendedUser.id;
                token.role = extendedUser.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                const ExtendedSession = session as unknown as ExtendedSession
                ExtendedSession.user_id = token.user_id
                ExtendedSession.user_name = token.username as string
                ExtendedSession.user_email = token.useremail as string
                ExtendedSession.user_img = token.img as string
                ExtendedSession.user_role = token.role as string
            }
            return session
        }
    }
});