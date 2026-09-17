"use server";

import { requireAdmin } from './auth';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateEnquiryStatus(id: number, status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'lost') {
  await requireAdmin();
  
  await db.update(enquiries)
    .set({ 
      status, 
      contactedAt: status === 'contacted' ? new Date() : undefined,
      updatedAt: new Date() 
    })
    .where(eq(enquiries.id, id));
    
  revalidatePath('/admin/bookings');
}

export async function updateEnquiryNote(id: number, adminNote: string) {
  await requireAdmin();
  
  await db.update(enquiries)
    .set({ 
      adminNote, 
      updatedAt: new Date() 
    })
    .where(eq(enquiries.id, id));
    
  revalidatePath('/admin/bookings');
}
