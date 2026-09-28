export interface AuthOptions {
  providers: any[];
  session: { strategy: string; maxAge: number };
  jwt: { maxAgeInSeconds: number };
  secret?: string;
  debug?: boolean;
}

export const authOptions: AuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAgeInSeconds: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret',
  debug: process.env.NODE_ENV === 'development',
};

export type NextAuthOptions = typeof authOptions;