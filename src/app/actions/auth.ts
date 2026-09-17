"use server";

import { loginSchema } from '@/lib/schemas/auth';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compareSync } from 'bcryptjs';
import { createSession, deleteSession, getVerifiedSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData): Promise<void> {
  const email = formData.get('email');
  const password = formData.get('password');

  const result = loginSchema.safeParse({ email, password });
  
  if (!result.success) {
    throw new Error('Invalid email or password');
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, result.data.email));
  
  const isValid = user 
    ? compareSync(result.data.password, user.passwordHash)
    : compareSync(result.data.password, '$2a$12$00000000000000000000000000000000000000000000000000000'); 

  if (!user || !isValid) {
    throw new Error('Invalid email or password');
  }

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));

  await createSession(user.id, user.email);
  redirect('/admin/services');
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect('/admin/login');
}

export async function requireAdmin() {
  const session = await getVerifiedSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}
