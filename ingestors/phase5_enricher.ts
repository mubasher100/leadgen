// Phase 5: Enrichment enricher (prototype)
export function enrichLeadPhase5(lead: any) {
  if (!lead) return lead
  const domain = lead.domain || (lead.name ? lead.name.toLowerCase().replace(/\s+/g, '') + ".com" : '')
  return {
    ...lead,
    enrichment: {
      ...(lead.enrichment || {}),
      phase5: true,
      domain,
      notes: 'phase5-enriched',
    },
  }
}
