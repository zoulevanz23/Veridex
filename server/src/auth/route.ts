import { authOptions, NextAuthOptions } from './options';

export function handler(_req: any, res: any) {
  return res.json({ message: 'Auth handler endpoint', options: authOptions });
}

export { handler as GET, handler as POST };
export type { NextAuthOptions };