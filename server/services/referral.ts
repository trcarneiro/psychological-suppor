const REFERRAL_KEYWORDS = [
  'não aguento mais',
  'quero morrer',
  'suicídio',
  'me matar',
  'sem saída',
  'piorou',
  'piorando',
  'não consigo',
  'preciso de ajuda',
  'vou desistir',
  'desistir de tudo',
  'matar',
  'autoagress',
]

export function shouldSuggestReferral(message: string) {
  const normalized = message.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return REFERRAL_KEYWORDS.some(keyword => normalized.includes(keyword))
}
