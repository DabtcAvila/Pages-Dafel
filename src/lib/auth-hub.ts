import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prismaHub } from '@/lib/prisma-hub';

export const authOptionsHub: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in Hub database
          const user = await prismaHub.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.isActive) {
            // Log failed attempt
            if (user) {
              await prismaHub.user.update({
                where: { id: user.id },
                data: {
                  loginAttempts: user.loginAttempts + 1,
                  updatedAt: new Date(),
                },
              });

              await prismaHub.auditLog.create({
                data: {
                  userId: user.id,
                  eventType: 'LOGIN_FAILED',
                  eventDetail: 'Invalid credentials',
                  ip: '127.0.0.1',
                  userAgent: 'Hub Client',
                  success: false,
                  errorMessage: 'Invalid credentials or inactive account',
                },
              });
            }
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            await prismaHub.auditLog.create({
              data: {
                userId: user.id,
                eventType: 'LOGIN_FAILED',
                eventDetail: 'Account locked',
                ip: '127.0.0.1',
                userAgent: 'Hub Client',
                success: false,
                errorMessage: 'Account is locked',
              },
            });
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            // Increment failed attempts
            const newAttempts = user.loginAttempts + 1;
            const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // Lock for 30 minutes after 5 attempts

            await prismaHub.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: newAttempts,
                lockedUntil: lockUntil,
                updatedAt: new Date(),
              },
            });

            await prismaHub.auditLog.create({
              data: {
                userId: user.id,
                eventType: 'LOGIN_FAILED',
                eventDetail: 'Invalid password',
                ip: '127.0.0.1',
                userAgent: 'Hub Client',
                success: false,
                errorMessage: 'Invalid password',
              },
            });

            return null;
          }

          // Successful login - reset attempts and update last login
          await prismaHub.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
              lastLogin: new Date(),
              lastLoginIp: '127.0.0.1',
              updatedAt: new Date(),
            },
          });

          // Log successful login
          await prismaHub.auditLog.create({
            data: {
              userId: user.id,
              eventType: 'LOGIN_SUCCESS',
              eventDetail: `Successful login for ${user.email}`,
              ip: '127.0.0.1',
              userAgent: 'Hub Client',
              success: true,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/hub/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};