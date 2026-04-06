'use server';

import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  userId: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  contactId?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const result = await transporter.sendMail({
      from: `"Paul Padda Law" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || process.env.GMAIL_USER,
    });
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Email send failure:', error);
    return { success: false, error: error.message };
  }
}

export async function sendBulkEmail(recipients: EmailOptions[]): Promise<{ sent: number; failed: number; queued: number }> {
  let sent = 0;
  let failed = 0;
  for (const recipient of recipients) {
    const result = await sendEmail(recipient);
    if (result.success) sent++;
    else failed++;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return { sent, failed, queued: 0 };
}
