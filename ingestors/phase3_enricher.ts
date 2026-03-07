// Phase 3: Enrichment enricher (proto)
export function enrichLeadPhase3(lead: any) {
  if (!lead) return lead
  // Minimal enrichment: derive a domain if missing, and add a phase3 tag
  const domain = lead.domain || (lead.name ? lead.name.toLowerCase().replace(/\s+/g, '') + ".com" : '')
  return {
    ...lead,
    enrichment: {
      ...(lead.enrichment || {}),
      phase3: true,
      domain,
    },
  }
}
