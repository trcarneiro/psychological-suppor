import type { LeadDataPayload } from './leadExtractor'

export function calculateLeadScore(data: LeadDataPayload | null): number {
  if (!data) return 0

  const urgency = (data.urgencyLevel ?? 0) * 10

  let emotionalWeight = 0
  switch (data.emotionalState) {
    case 'critical':
      emotionalWeight = 30
      break
    case 'high':
      emotionalWeight = 20
      break
    case 'moderate':
      emotionalWeight = 10
      break
    default:
      emotionalWeight = 0
  }

  const symptomBonus = Array.isArray(data.symptoms) ? Math.min(data.symptoms.length, 5) * 2 : 0

  return Math.min(urgency + emotionalWeight + symptomBonus, 100)
}
