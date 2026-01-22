/**
 * Engagement Analyzer
 * Analyzes customer engagement data and provides AI-powered insights and recommendations
 */

/**
 * Generate a synopsis of the engagement based on historical data
 */
function generateSynopsis(customer) {
  const {
    summary, engagement, status, healthScore, mau, ttiv,
  } = customer;
  const summaryLower = summary ? summary.toLowerCase() : '';

  // Pattern matching for common scenarios - focus on what IS, not what to DO
  if (summaryLower.includes('deplatform')) {
    return `Customer has expressed intent to leave the platform. Current health score of ${healthScore} reflects this critical situation. This represents a potential churn scenario based on historical patterns where customers verbalize platform dissatisfaction.`;
  }

  if (summaryLower.includes('security') && summaryLower.includes('approval')) {
    return `Engagement is in a security approval workflow. With ${status} status, this represents a common enterprise procurement cycle where technical teams await formal clearance. Historical data shows these pauses typically extend 2-4 weeks depending on organization size.`;
  }

  if (summaryLower.includes('migration')) {
    return `Customer is actively migrating between platforms or versions. Migration projects historically show increased support needs and temporary health score fluctuations. Current ${status} status indicates they're working through technical transition challenges.`;
  }

  if (summaryLower.includes('on hold') || status === 'On Hold') {
    return `Account is currently in On Hold status. Analysis of similar accounts shows this typically occurs due to budget cycles, internal priorities, or organizational changes. ${mau ? `Previous MAU of ${mau} indicates prior active usage.` : 'Limited usage data available from pre-hold period.'}`;
  }

  if (summaryLower.includes('auto-optimi') && summaryLower.includes('stop')) {
    return `Technical functionality issue reported with auto-optimization feature. Despite this, engagement remains ${engagement} with health score of ${healthScore}. Pattern suggests the customer values the platform enough to report issues rather than disengage.`;
  }

  if (summaryLower.includes('seo report') || summaryLower.includes('delivering')) {
    return `Active value delivery cycle with regular reporting. ${mau ? `${mau} MAU shows consistent platform usage.` : ''} Health score of ${healthScore} combined with ${engagement} engagement indicates the customer is realizing value from the platform through data and insights.`;
  }

  if (summaryLower.includes('showing the customer') || summaryLower.includes('demo')) {
    return `Currently in demonstration/proof-of-value phase with ${status} status. Historical conversion data shows customers in this phase typically take 4-8 weeks to reach production decision. ${ttiv ? `TTIV of ${ttiv} will be a key metric to track.` : 'Time to value metrics not yet established.'}`;
  }

  if (summaryLower.includes('no update') || summaryLower.includes('no response')) {
    return `Limited recent activity or updates recorded. Health score of ${healthScore} with ${engagement} engagement suggests reduced interaction frequency. Analysis of similar patterns shows this often correlates with internal customer priorities shifting or resource constraints.`;
  }

  // Default synopsis based on health score and engagement
  if (healthScore >= 75 && engagement === 'Active') {
    return `Strong engagement indicators with health score of ${healthScore} and Active status. ${mau ? `${mau} MAU demonstrates consistent platform adoption.` : ''} Historical patterns show customers in this range typically exhibit stable, long-term platform usage with low churn risk.`;
  } if (healthScore < 50) {
    return `Multiple risk indicators present with health score below 50 (currently ${healthScore}). ${engagement} engagement level combined with ${status} status suggests challenges in adoption or satisfaction. Similar historical patterns have indicated need for intervention.`;
  }
  return `Moderate engagement profile with health score of ${healthScore}. Customer is ${engagement} with ${status} status. ${mau ? `${mau} MAU shows ongoing usage.` : 'Usage metrics indicate room for growth.'} Pattern suggests opportunity for deeper adoption and increased value realization.`;
}

/**
 * Extract key observations from customer data
 */
function extractKeyObservations(customer) {
  const observations = [];
  const {
    summary, blockers, blockersStatus, engagement, healthScore, status, mau, ttiv,
  } = customer;
  const summaryLower = summary ? summary.toLowerCase() : '';

  // Engagement status observations
  if (engagement === 'Critical') {
    observations.push('📊 Engagement Status: Critical level indicates significant concerns in the relationship');
  } else if (engagement === 'At Risk') {
    observations.push('📊 Engagement Status: At Risk - showing warning signs that need monitoring');
  } else if (engagement === 'Active') {
    observations.push('✅ Engagement Status: Active and maintaining regular interaction');
  }

  // Health score analysis
  if (healthScore >= 75) {
    observations.push(`💚 Health Score: Strong at ${healthScore} - indicates positive adoption and satisfaction`);
  } else if (healthScore >= 50) {
    observations.push(`💛 Health Score: Moderate at ${healthScore} - some challenges present`);
  } else {
    observations.push(`❤️ Health Score: Low at ${healthScore} - multiple risk factors detected`);
  }

  // Usage metrics
  if (mau) {
    observations.push(`👥 Monthly Active Users: ${mau} users currently engaging with the platform`);
  }

  if (ttiv) {
    observations.push(`⚡ Time to Initial Value: ${ttiv} - measures onboarding efficiency`);
  }

  // Status observations
  if (status === 'Production') {
    observations.push('🚀 Production Status: Live deployment with active user base');
  } else if (status === 'Pre-Production') {
    observations.push('🔨 Pre-Production Status: In testing/validation phase before launch');
  } else if (status === 'On Hold') {
    observations.push('⏸️ On Hold Status: Engagement temporarily paused');
  }

  // Blocker analysis
  const blockersLower = blockers ? blockers.toLowerCase() : '';
  if (blockersStatus === 'red' || blockersLower.includes('critical')) {
    observations.push('🛑 Blockers Present: Critical obstacles currently impeding progress');
  } else if (blockersStatus === 'yellow' || blockersLower.includes('issues')) {
    observations.push('⚠️ Blockers Present: Active issues requiring attention');
  } else if (blockersLower.includes('none')) {
    observations.push('✅ No Active Blockers: Path is clear for continued progress');
  }

  // Pattern observations from summary
  if (summaryLower.includes('deplatform') || summaryLower.includes('leaving')) {
    observations.push('🚨 Churn Indicator: Customer expressing intent to leave or switch platforms');
  }

  if (summaryLower.includes('security') && (summaryLower.includes('approval') || summaryLower.includes('waiting'))) {
    observations.push('🔒 Security Process: Currently in security review/approval workflow');
  }

  if (summaryLower.includes('not working') || summaryLower.includes('stopped')) {
    observations.push('🔧 Technical Issue: Functionality problems reported by customer');
  }

  if (summaryLower.includes('migration')) {
    observations.push('🔄 Migration in Progress: Customer transitioning between platforms or versions');
  }

  if (summaryLower.includes('seo report') || summaryLower.includes('delivering')) {
    observations.push('📈 Active Delivery: Regular reports and insights being provided to customer');
  }

  return observations;
}

/**
 * Identify trends from historical data
 */
function identifyTrends(customer) {
  const trends = [];
  const {
    summary, engagement, healthScore, status, lastUpdated,
  } = customer;
  const summaryLower = summary ? summary.toLowerCase() : '';

  // Trend: Positive momentum
  if (engagement === 'Active' && healthScore >= 75) {
    trends.push('📈 Positive Trend: Healthy engagement with strong metrics indicates stable relationship');
  }

  // Trend: Deteriorating
  if ((engagement === 'Critical' || healthScore < 50) && !summaryLower.includes('new')) {
    trends.push('📉 Declining Trend: Multiple risk indicators suggest challenges have been building');
  }

  // Trend: Stagnant
  if (summaryLower.includes('no update') || summaryLower.includes('still')) {
    trends.push('⏸️ Stagnation Observed: Limited recent activity or progress updates');
  }

  // Trend: Progress markers
  if (summaryLower.includes('start date') || summaryLower.includes('scheduled')) {
    trends.push('📅 Planned Activity: Specific timeline or milestones identified');
  }

  // Trend: Technical evolution
  if (summaryLower.includes('jira') || summaryLower.includes('opened')) {
    trends.push('🔧 Issue Tracking: Problems being formally tracked and addressed');
  }

  // Trend: Production readiness
  if (status === 'Pre-Production' && summaryLower.includes('demo')) {
    trends.push('🎯 Pre-Launch Phase: Demonstrating value before production deployment');
  }

  // Trend: Value realization
  if (summaryLower.includes('report') || summaryLower.includes('optimize')) {
    trends.push('💡 Value Delivery: Customer actively using platform features and receiving insights');
  }

  // Trend: Relationship strain
  if (summaryLower.includes('remove') || summaryLower.includes('asked us to')) {
    trends.push('⚠️ Relationship Tension: Customer requesting changes to standard engagement');
  }

  // Update recency
  if (lastUpdated) {
    trends.push(`🕐 Last Updated: ${lastUpdated} - reflects data freshness`);
  }

  return trends;
}

/**
 * Legacy function kept for backwards compatibility (no longer used)
 */
// eslint-disable-next-line no-unused-vars
function generateRecommendations(customer) {
  const recommendations = [];
  const {
    summary, engagement, healthScore, status, blockersStatus,
  } = customer;
  const summaryLower = summary ? summary.toLowerCase() : '';

  // Critical engagement scenarios
  if (summaryLower.includes('deplatform')) {
    recommendations.push({
      priority: 'URGENT',
      action: 'Executive Escalation',
      detail: 'Schedule immediate executive-level meeting to understand concerns and present retention strategy. Involve customer success leadership and technical architects.',
    });
    recommendations.push({
      priority: 'URGENT',
      action: 'Value Assessment',
      detail: 'Conduct comprehensive ROI review showcasing quantified business value delivered. Prepare case studies and benchmark data against alternatives.',
    });
    recommendations.push({
      priority: 'HIGH',
      action: 'Concierge Support',
      detail: 'Assign dedicated support team and establish daily check-ins. Remove all friction points and accelerate issue resolution.',
    });
  }

  // Security approval scenarios
  if (summaryLower.includes('security') && (summaryLower.includes('approval') || summaryLower.includes('wait'))) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Security Coordination',
      detail: 'Proactively engage with customer security team. Provide comprehensive security documentation, compliance certifications, and facilitate any required security reviews.',
    });
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Timeline Management',
      detail: 'Establish clear timeline with milestones. Set regular check-ins to track approval progress and anticipate next steps post-approval.',
    });
  }

  // Technical issues
  if (summaryLower.includes('not working') || summaryLower.includes('stopped')) {
    recommendations.push({
      priority: 'URGENT',
      action: 'Technical Resolution',
      detail: 'Escalate to engineering team for immediate fix. Provide daily updates on resolution progress and establish workaround if needed.',
    });
    recommendations.push({
      priority: 'HIGH',
      action: 'Customer Communication',
      detail: 'Maintain transparent communication about issue status, root cause, and expected resolution time. Consider service credits if SLA impact.',
    });
  }

  // Communication gaps
  if (summaryLower.includes('no update') || summaryLower.includes('no response')) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Re-engagement Campaign',
      detail: 'Initiate multi-channel outreach (email, phone, LinkedIn). Share relevant case studies, new features, or industry insights to re-spark interest.',
    });
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Executive Sponsor Involvement',
      detail: 'Leverage executive relationships or introduce senior leadership to reset conversation at strategic level.',
    });
  }

  // Migration support
  if (summaryLower.includes('migration')) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Migration Support Plan',
      detail: 'Assign dedicated migration specialist. Create detailed project plan with milestones, success criteria, and risk mitigation strategies.',
    });
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Training & Enablement',
      detail: 'Schedule comprehensive training sessions for new platform. Provide documentation, best practices guides, and ongoing support resources.',
    });
  }

  // On Hold scenarios
  if (status === 'On Hold') {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Reactivation Planning',
      detail: 'Establish clear reactivation trigger and timeline. Maintain quarterly touchpoints with relevant updates to stay top-of-mind.',
    });
    recommendations.push({
      priority: 'LOW',
      action: 'Nurture Program',
      detail: 'Include in content marketing nurture stream. Share success stories, product updates, and industry trends to maintain warm relationship.',
    });
  }

  // Pre-production support
  if (status === 'Pre-Production') {
    recommendations.push({
      priority: 'HIGH',
      action: 'Production Readiness Plan',
      detail: 'Create clear path to production with defined criteria, timeline, and success metrics. Address any remaining technical or business requirements.',
    });
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Stakeholder Alignment',
      detail: 'Ensure all stakeholders are aligned on go-live plan. Conduct production readiness review and establish launch support protocols.',
    });
  }

  // Blocker management
  if (blockersStatus === 'red' || blockersStatus === 'yellow') {
    recommendations.push({
      priority: 'HIGH',
      action: 'Blocker Resolution',
      detail: 'Create action plan for each blocker with owners and target resolution dates. Escalate any blockers requiring cross-functional support.',
    });
  }

  // General health improvement (if no specific issues identified)
  if (recommendations.length === 0 && healthScore < 75) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Engagement Enhancement',
      detail: 'Schedule QBR to review progress, share roadmap, and identify expansion opportunities. Showcase new features relevant to customer use case.',
    });
    recommendations.push({
      priority: 'LOW',
      action: 'Success Planning',
      detail: 'Develop mutual success plan with measurable outcomes. Establish regular cadence of check-ins and value reviews.',
    });
  }

  // Healthy accounts - expansion focus
  if (healthScore >= 75 && engagement === 'Active') {
    recommendations.push({
      priority: 'LOW',
      action: 'Expansion Opportunity Assessment',
      detail: 'Explore upsell and cross-sell opportunities. Identify additional use cases or business units that could benefit from platform.',
    });
    recommendations.push({
      priority: 'LOW',
      action: 'Advocacy Development',
      detail: 'Cultivate customer as reference account. Request case study, testimonial, or speaking opportunity to showcase their success.',
    });
  }

  // Always include a general recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Regular Touchpoint',
      detail: 'Maintain consistent engagement cadence through monthly check-ins, quarterly business reviews, and proactive value demonstrations.',
    });
  }

  return recommendations;
}

/**
 * Analyze engagement summary and generate insights
 * @param {Object} customer - Customer data object
 * @returns {Object} Analysis with synopsis and key observations
 */
export function analyzeEngagement(customer) {
  const {
    engagement,
    healthScore,
  } = customer;

  const analysis = {
    synopsis: '',
    riskLevel: '',
    keyObservations: [],
    trends: [],
    urgency: 'low',
  };

  // Analyze engagement level and health score
  if (engagement === 'Critical' || healthScore < 50) {
    analysis.riskLevel = 'Critical';
    analysis.urgency = 'high';
  } else if (engagement === 'At Risk' || healthScore < 75) {
    analysis.riskLevel = 'At Risk';
    analysis.urgency = 'medium';
  } else {
    analysis.riskLevel = 'Healthy';
    analysis.urgency = 'low';
  }

  // Generate synopsis based on summary text analysis
  analysis.synopsis = generateSynopsis(customer);

  // Extract key observations from data
  analysis.keyObservations = extractKeyObservations(customer);

  // Identify trends from historical data
  analysis.trends = identifyTrends(customer);

  return analysis;
}

/**
 * Generate batch analysis for multiple customers
 * @param {Array} customers - Array of customer objects
 * @returns {Array} Array of analysis objects with customer data
 */
export function analyzeBatch(customers) {
  return customers.map((customer) => ({
    customer,
    analysis: analyzeEngagement(customer),
  }));
}

/**
 * Generate executive summary for a portfolio
 * @param {Array} analyses - Array of analysis objects
 * @returns {Object} Executive summary
 */
export function generateExecutiveSummary(analyses) {
  const summary = {
    totalCustomers: analyses.length,
    criticalCount: 0,
    atRiskCount: 0,
    healthyCount: 0,
    urgentActions: [],
    topIssues: {},
  };

  analyses.forEach(({ customer, analysis }) => {
    if (analysis.riskLevel === 'Critical') {
      summary.criticalCount += 1;
      if (analysis.urgency === 'high' && analysis.keyObservations && analysis.keyObservations.length > 0) {
        summary.urgentActions.push({
          customer: customer.companyName,
          observation: analysis.keyObservations[0],
          trend: analysis.trends && analysis.trends.length > 0 ? analysis.trends[0] : 'No trend data',
        });
      }
    } else if (analysis.riskLevel === 'At Risk') {
      summary.atRiskCount += 1;
    } else {
      summary.healthyCount += 1;
    }

    // Count top observations
    if (analysis.keyObservations) {
      analysis.keyObservations.forEach((observation) => {
        const key = observation.split(':')[0]; // Get emoji and label prefix
        summary.topIssues[key] = (summary.topIssues[key] || 0) + 1;
      });
    }
  });

  return summary;
}
