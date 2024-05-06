import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getUser } from './src/lib/data';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const isValid = await bcrypt.compare(password, user.pass_hash);
                if (isValid) return user;
            }

            console.log('Invalid credentials');
            return null;
        },
        credentials: {
            email: {},
            password: {},
        },
    }),
  ],
});