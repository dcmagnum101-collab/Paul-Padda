'use server';

export async function sendNurtureEmail(payload: {
  userId: string;
  contactId: string;
  to: string;
  subject: string;
  body: string;
  isAiGenerated?: boolean;
}) {
  const { to, subject, body } = payload;

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body,
  ];

  const rawMessage = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // TODO: Load access token from Prisma Account table (OAuth tokens)
  const accessToken = process.env.GMAIL_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Gmail not connected. Please connect your account in Settings.');
  }

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawMessage }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) throw new Error('Gmail session expired. Please re-connect your Google account.');
    throw new Error(`Gmail API error: ${error.error?.message || 'Unknown failure'}`);
  }

  const result = await response.json();
  return { success: true, messageId: result.id };
}

export async function getGmailConnectionStatus(_userId: string) {
  return !!process.env.GMAIL_ACCESS_TOKEN;
}
