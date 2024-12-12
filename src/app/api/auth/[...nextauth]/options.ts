import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import DbConnect from '@/lib/DbConnect';
import UserModel, { User } from '@/Model/User';
import { User as NextAuthUser } from "next-auth";




export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials: Record<"email" | "password", string>): Promise<NextAuthUser | null> {
        await DbConnect();
        try {
          const userDoc = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });
          if (!userDoc) {
            throw new Error('No user found with this email');
          }
          if (!userDoc.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            userDoc.password
          );



          if (isPasswordCorrect) {
            const user: User = userDoc.toObject();
            return {

              _id: user._id.toString(),
              id: user._id.toString(),
              username: user.username,
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
              email : user.email

            } as NextAuthUser

          } else {
            throw new Error('Incorrect password');
          }

        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.email = user.email
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.email = token.email
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};