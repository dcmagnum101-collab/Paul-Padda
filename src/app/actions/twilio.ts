'use server';

import twilio from 'twilio';

export async function sendSMSAction(payload: {
  userId: string;
  contactId: string;
  to: string;
  body: string;
}) {
  const { to, body } = payload;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !phoneNumber) {
    throw new Error('Twilio credentials not configured in environment variables.');
  }

  const client = twilio(sid, token);
  const message = await client.messages.create({ body, from: phoneNumber, to });

  return { success: true, sid: message.sid };
}
