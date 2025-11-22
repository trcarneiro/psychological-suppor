import { prisma } from '../prisma'
import type { Lead } from '@prisma/client'

interface MatchScore {
  agentId: string
  score: number
  reasons: string[]
}

export async function findBestMatches(lead: Lead): Promise<MatchScore[]> {
  const agents = await prisma.agent.findMany({
    where: { active: true },
  })

  const scores: MatchScore[] = agents.map(agent => {
    let score = 0
    const reasons: string[] = []

    // 1. Location Match (High Priority for Presencial)
    if (lead.modality === 'presencial' || lead.modality === 'hibrido') {
      if (agent.city && lead.city && agent.city.toLowerCase() === lead.city.toLowerCase()) {
        score += 30
        reasons.push(`Atende em ${agent.city}`)
        
        if (agent.neighborhood && lead.neighborhood && agent.neighborhood.toLowerCase() === lead.neighborhood.toLowerCase()) {
          score += 10
          reasons.push(`Bairro ${agent.neighborhood} compatível`)
        }
      }
    }

    // 2. Modality Match
    if (lead.modality && agent.modalities) {
      const agentModalities = agent.modalities as string[] // JSON array
      if (agentModalities.includes(lead.modality)) {
        score += 20
        reasons.push(`Atende na modalidade ${lead.modality}`)
      }
    }

    // 3. Budget Match
    if (lead.budgetMax && agent.priceMin) {
      if (lead.budgetMax >= agent.priceMin) {
        score += 25
        reasons.push('Dentro do orçamento')
      } else if (lead.budgetMax >= (agent.priceMin * 0.8)) {
        // Within 20% range
        score += 10
        reasons.push('Próximo do orçamento')
      }
    }

    // 4. Availability Match (Simple string check for now)
    if (lead.availability && agent.availability) {
      const leadAvail = lead.availability.toLowerCase()
      const agentAvail = (agent.availability as string[]).map(a => a.toLowerCase())
      
      const hasMatch = agentAvail.some(a => leadAvail.includes(a) || a.includes(leadAvail))
      if (hasMatch) {
        score += 15
        reasons.push('Horário compatível')
      }
    }

    return {
      agentId: agent.id,
      score,
      reasons
    }
  })

  // Filter out zero scores and sort by score desc
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
}
