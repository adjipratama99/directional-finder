import CredentialsProvider from 'next-auth/providers/credentials'
import { getUnixTime } from 'date-fns'
import { handlerRequest } from '@/db/handler'
import { User } from '@/models/user.model'

const modelName = "User"

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "signin",
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const { username, password } = credentials as {
                        username: string;
                        password: string;
                    };
        
                    if (username && password) {
                        const request = await handlerRequest({ body: { username, password }, type: "read", modelName, findByKey: "username" }) as User;
                        if(request) {
                            if(request?.password === password) {
                                return {
                                    id: String(request.id),
                                    username: request.username,
                                    role: request.role,
                                    satuan_wilayah: request.satuan_wilayah,
                                    wilayah: request.wilayah,
                                    nama_satuan: request.nama_satuan,
                                    dateUpdate: request.dateUpdate,
                                    dateCreate: request.dateCreate,
                                };
                            } else {
                                throw new Error("Username atau password salah.")
                            }
                        }
                    }
        
                    return null;
                } catch (e) {
                    console.error(e);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt(params) {
            let { token, user, session, trigger } = params
            // Set `exp` dynamically when the token is created or updated
            
            if (user) {
                token = { ...token, ...user, caseId: null };
                token.exp = ((getUnixTime(new Date()) * 1000) + (5 * 365 * 24 * 60 * 60)); // 5 years expiration
            }

            if(trigger === "update") {
                token = { ...token, ...user, caseId: session?.user?.caseId }
            }

            return token;
        },

        async session({ session, token }) {
            // Attach user data from the token
            const range_year = Math.floor((getUnixTime(new Date()) * 1000) + (5 * 365 * 24 * 60 * 60)) // 5 years expiration
            token.exp = range_year
            session.user = token;

            if (token?.exp) {
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const remainingTime = (token.exp * 1000) - currentTimeInSeconds;

                session.expires = new Date(token.exp * 1000).toISOString();
                session.maxAge = remainingTime > 0 ? remainingTime : 0; // Ensure non-negative
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            return url;
        }
    },
    pages: {
        signIn: '/',
        error: '/',
    },
    session: {
        updateAge: 7 * 24 * 60 * 60
    }
}