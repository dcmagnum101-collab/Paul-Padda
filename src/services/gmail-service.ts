'use server';

import { google } from 'googleapis';
import { createHash } from 'crypto';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`
);

export async function getGmailClient(_userId: string) {
  // TODO: Load OAuth tokens from Prisma Account table
  const accessToken = process.env.GMAIL_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Gmail not connected');

  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function checkUnsubscribe(_userId: string, _email: string): Promise<boolean> {
  // TODO: Store unsubscribes in Prisma
  return false;
}

export async function logMessage(_userId: string, _messageData: {
  leadId?: string;
  threadId: string;
  subject: string;
  body: string;
  to: string;
  status: 'sent' | 'received' | 'failed';
}) {
  // TODO: Log to Prisma CommunicationLog model
}
