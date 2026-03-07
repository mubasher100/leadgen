// Phase 2: TypeScript enrichment helper for leads (recommended over JS version)
export function enrichLead(lead: any) {
  if (!lead) return lead
  const domain = lead.domain || (lead.name ? lead.name.toLowerCase().replace(/\s+/g, '') + ".com" : '')
  return {
    ...lead,
    enrichment: {
      domain,
      industry: 'Digital Marketing',
      notes: 'enriched',
    },
  }
}
