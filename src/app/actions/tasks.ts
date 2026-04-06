'use server';

import { prisma } from '@/lib/prisma';

export async function completeTaskAction(_userId: string, taskId: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'COMPLETED', completedAt: new Date(), updatedAt: new Date() },
  });
  return { success: true };
}

export async function snoozeTaskAction(_userId: string, taskId: string, days: number) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);
  await prisma.task.update({
    where: { id: taskId },
    data: { dueDate, status: 'PENDING', updatedAt: new Date() },
  });
  return { success: true };
}

export async function archiveTaskAction(_userId: string, taskId: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'CANCELLED', updatedAt: new Date() },
  });
  return { success: true };
}
