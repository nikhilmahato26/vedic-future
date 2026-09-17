import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '../db';
import { adminUsers } from '../db/schema';
import { eq } from 'drizzle-orm';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export const COOKIE_NAME = 'vf_session';

export async function createSession(userId: number, email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const now = Math.floor(Date.now() / 1000);
  
  const session = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime('7d')
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getVerifiedSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, key, { algorithms: ['HS256'] });
    const userId = payload.userId as number;
    const iat = payload.iat as number;

    const [user] = await db.select({ updatedAt: adminUsers.updatedAt }).from(adminUsers).where(eq(adminUsers.id, userId));
    if (!user) return null;

    const watermark = Math.floor(user.updatedAt.getTime() / 1000);
    if (iat < watermark) return null;

    return { userId, email: payload.email as string };
  } catch {
    return null;
  }
}
