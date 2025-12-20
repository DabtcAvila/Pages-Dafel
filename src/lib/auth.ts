import bcrypt from 'bcryptjs';
import { AuditEventType } from '@prisma/client';
import prisma from './prisma';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createAuditLog(
  eventType: AuditEventType,
  userId: string | null,
  success: boolean,
  detail?: string,
  ip?: string,
  userAgent?: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        eventType,
        userId,
        success,
        eventDetail: detail,
        ip,
        userAgent,
        metadata,
        errorMessage: !success ? detail : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export async function checkAccountLock(email: string): Promise<{ isLocked: boolean; user: any }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { isLocked: false, user: null };
  }

  // For now, we skip lock checking since those fields don't exist
  // TODO: Add proper lock fields to database later
  return { isLocked: false, user };
}

export async function handleFailedLogin(userId: string): Promise<boolean> {
  // For now, we skip failed login tracking since those fields don't exist
  // TODO: Add proper lock fields to database later
  return false;
}

export async function handleSuccessfulLogin(
  userId: string,
  ip?: string
): Promise<void> {
  // For now, we skip login tracking since those fields don't exist
  // TODO: Add proper login tracking fields to database later
  console.log(`Successful login for user ${userId}`);
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side
    const crypto = require('crypto');
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}