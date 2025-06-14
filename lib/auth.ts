/**
 * Authentication configuration for NextAuth
 * 
 * This file configures authentication providers and callbacks for the application.
 * We use JWT for session management and handle user information through tokens.
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { connectToDatabase } from "./db";
import User from "@/models/User";

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/', // Redirect to home page for sign in
    error: '/', // Redirect to home page on error
  },
  callbacks: {
    /**
     * Add user ID and role to the session
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    /**
     * Add user ID and role to the JWT token
     */
    async jwt({ token, user, account }) {
      // If this is the first sign-in
      if (account && user) {
        try {
          await connectToDatabase();
          
          // Check if user exists in database
          let dbUser = await User.findOne({ email: user.email });
          
          // If not, create a new user
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'user',
            });
          }
          
          token.id = dbUser._id.toString();
          token.role = dbUser.role || 'user';
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
