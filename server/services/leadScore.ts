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

  // Data Completeness Bonus
  let completenessBonus = 0
  if (data.name) completenessBonus += 5
  if (data.phone || data.email) completenessBonus += 10
  if (data.city || data.state || data.cep) completenessBonus += 5
  if (data.budget || data.budgetMin || data.budgetMax) completenessBonus += 10
  if (data.modality) completenessBonus += 5

  return Math.min(urgency + emotionalWeight + symptomBonus + completenessBonus, 100)
}

export function shouldTriggerLeadAlert(params: {
  score: number
  emotionalState?: 'low' | 'moderate' | 'high' | 'critical' | null
  urgencyLevel?: number | null
}): boolean {
  // Trigger if score is high (>= 70)
  if (params.score >= 70) return true
  
  // Trigger if emotional state is critical
  if (params.emotionalState === 'critical') return true
  
  // Trigger if urgency level is very high (>= 8 out of 10)
  if (params.urgencyLevel && params.urgencyLevel >= 8) return true
  
  return false
}
