'use server';

import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI ?? `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`
);

export async function getGmailClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'google' },
  });

  if (!account?.access_token) {
    throw new Error('Gmail not connected. Please authorize in Settings → Integrations.');
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function checkUnsubscribe(_userId: string, _email: string): Promise<boolean> {
  return false;
}

export async function logMessage(userId: string, messageData: {
  leadId?: string;
  threadId: string;
  subject: string;
  body: string;
  to: string;
  status: 'sent' | 'received' | 'failed';
}) {
  await prisma.communicationLog.create({
    data: {
      type: 'EMAIL',
      recipient: messageData.to,
      subject: messageData.subject,
      status: messageData.status,
      sentAt: messageData.status === 'sent' ? new Date() : undefined,
      metadata: {
        threadId: messageData.threadId,
        leadId: messageData.leadId,
        bodyPreview: messageData.body.slice(0, 200),
      },
    },
  });
}
