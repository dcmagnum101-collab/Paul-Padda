'use server';

import { prisma } from '@/lib/prisma';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import Anthropic from '@anthropic-ai/sdk';

export async function generateMorningBriefing(_userId: string, date: string) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const sol30 = addDays(now, 30);

  const [activeCases, todayTasks, overdueTasks, solCases] = await Promise.all([
    prisma.case.count({ where: { status: 'ACTIVE' } }),
    prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { gte: todayStart, lte: todayEnd },
      },
      include: { case: { select: { caseNumber: true } } },
      orderBy: { priority: 'asc' },
      take: 8,
    }),
    prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: todayStart },
      },
      include: { case: { select: { caseNumber: true } } },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.case.findMany({
      where: { status: 'ACTIVE', statute: { lte: sol30 } },
      select: { caseNumber: true, title: true, statute: true },
      orderBy: { statute: 'asc' },
    }),
  ]);

  const solWarningText = solCases
    .map(c => {
      const days = Math.ceil((c.statute.getTime() - now.getTime()) / 86400000);
      return `${c.caseNumber}: SOL in ${days} days`;
    })
    .join(', ') || 'None';

  const todayTaskText = todayTasks
    .map(t => `[${t.priority}] ${t.title}${t.case ? ` (${t.case.caseNumber})` : ''}`)
    .join('\n') || 'None';

  const overdueText = overdueTasks
    .map(t => `${t.title}${t.case ? ` (${t.case.caseNumber})` : ''}`)
    .join(', ') || 'None';

  if (!process.env.ANTHROPIC_API_KEY) {
    const fallback = [
      `Good morning. Today you have ${activeCases} active cases.`,
      solCases.length > 0 ? `⚠️ SOL Warnings: ${solWarningText}.` : '',
      todayTasks.length > 0 ? `${todayTasks.length} task(s) due today.` : 'No tasks due today.',
      overdueTasks.length > 0 ? `${overdueTasks.length} overdue task(s) need attention.` : '',
    ].filter(Boolean).join(' ');

    return {
      date,
      briefing_text: fallback,
      stats: {
        active_cases: activeCases,
        sol_warnings: solCases.length,
        tasks_due_today: todayTasks.length,
        overdue_tasks: overdueTasks.length,
      },
      generated_at: new Date().toISOString(),
    };
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are the AI intelligence engine for Paul Padda Law, a personal injury firm in Las Vegas.

Generate a concise morning briefing (3-4 paragraphs) for ${date} based on the following data:

Active Cases: ${activeCases}
SOL Warnings (next 30 days): ${solWarningText}
Tasks Due Today (${todayTasks.length}):
${todayTaskText}
Overdue Tasks: ${overdueText}

Be direct, professional, and action-oriented. Lead with the most critical items. Use plain text only — no markdown headers or bullets.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const briefingText = message.content[0].type === 'text' ? message.content[0].text : '';

  return {
    date,
    briefing_text: briefingText,
    stats: {
      active_cases: activeCases,
      sol_warnings: solCases.length,
      tasks_due_today: todayTasks.length,
      overdue_tasks: overdueTasks.length,
    },
    generated_at: new Date().toISOString(),
  };
}
