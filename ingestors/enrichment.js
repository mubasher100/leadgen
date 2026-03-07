// Simple enrichment helper (Phase 2-ready)
// This is a placeholder to enrich lead data with additional fields.
function enrichLead(lead) {
  if (!lead) return lead
  const domain = lead.domain || (lead.name ? lead.name.toLowerCase().replace(/\s+/g, '') + ".com" : '')
  lead.enrichment = {
    domain,
    industry: 'Digital Marketing',
    notes: 'auto-enriched',
  }
  return lead
}

module.exports = { enrichLead }
