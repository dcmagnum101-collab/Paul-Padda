'use server';
// Lead service — Firestore removed. Use Prisma Contact model.
// TODO: Reimplement each function using prisma.contact.*

import type { Lead, LeadStatus } from '@/lib/lead-types';
import { calculateLeadPriority, calculateAIScore, getNextFollowUpDate, getNextFollowUpMethod } from '@/lib/lead-types';

export async function createLead(_userId: string, _leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return 'stub-id';
}

export async function getLead(_userId: string, _id: string): Promise<Lead | null> {
  return null;
}

export async function updateLead(_userId: string, _id: string, _updates: Partial<Lead>): Promise<void> {}

export async function deleteLead(_userId: string, _id: string): Promise<void> {}

export async function getLeadsByStatus(_userId: string, _status: LeadStatus, _maxResults = 100): Promise<Lead[]> {
  return [];
}

export async function getAllLeads(_userId: string, _maxResults = 500): Promise<Lead[]> {
  return [];
}

export async function getLeadsDueForFollowUp(_userId: string, _maxResults = 50): Promise<Lead[]> {
  return [];
}

export async function getHotLeads(_userId: string, _maxResults = 50): Promise<Lead[]> {
  return [];
}

export async function getPipelineSummary(_userId: string): Promise<Record<string, number>> {
  return {};
}

export interface LeadActivity {
  contactId: string;
  type: 'call' | 'sms' | 'email' | 'note' | 'door-knock' | 'meeting' | 'status-change';
  notes: string;
  outcome?: string;
  duration?: number;
  agentId?: string;
  createdAt?: string;
}

export async function logLeadActivity(_userId: string, _activity: Omit<LeadActivity, 'createdAt'>): Promise<string> {
  return 'stub-id';
}

export async function searchLeads(_userId: string, _searchQuery: string, _maxResults = 50): Promise<Lead[]> {
  return [];
}

export async function batchImportLeads(_userId: string, _leads: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
  return 0;
}

export async function findLeadByField(_userId: string, _field: string, _value: string): Promise<Lead | null> {
  return null;
}

export async function upsertLead(_userId: string, _lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, _dedupeKey: 'address' | 'phone' = 'phone'): Promise<{ id: string; created: boolean }> {
  return { id: 'stub-id', created: true };
}

export async function getLeadStats(_userId: string) {
  return { total: 0, hot: 0, dueToday: 0, byStage: {}, recentlyAdded: 0 };
}
