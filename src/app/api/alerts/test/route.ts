import { NextResponse } from 'next/server'
import { triggerAlert } from '@/lib/communications/alerts'

export async function POST(request: Request) {

  // Fires a test alert with dummy data — skips throttle by using unique fake IDs
  const result = await triggerAlert({
    alertType: 'SOL_WARNING',
    caseId: 'test-alert-' + Date.now(),
    caseNumber: 'PPL-TEST-99999',
    caseTitle: 'Test Case — Alert System Verification',
    clientName: 'Test Client',
    caseStage: 'DEMAND',
    contextMessage: 'This is a test alert to verify the alert delivery system is working correctly.',
  })

  return NextResponse.json({ success: true, ...result })
}
