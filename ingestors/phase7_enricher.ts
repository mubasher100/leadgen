// Phase 7: Enrichment enricher (prototype)
export function enrichLeadPhase7(lead: any) {
  if (!lead) return lead
  const domain = lead.domain || (lead.name ? lead.name.toLowerCase().replace(/\s+/g, '') + ".com" : '')
  return {
    ...lead,
    enrichment: {
      ...(lead.enrichment || {}),
      phase7: true,
      domain,
      notes: 'phase7-enriched',
    },
  }
}
