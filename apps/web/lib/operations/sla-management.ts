import { createServerSupabaseClient } from '../supabase'
import { logger } from '../monitoring/logger'

export interface SLADefinition {
  id: string
  tenant_id: string
  name: string
  description: string
  service_level: 'free' | 'pro' | 'enterprise' | 'custom'
  uptime_percentage: number // e.g., 99.9
  response_time_sla: {
    critical: number // minutes
    high: number // minutes
    medium: number // minutes
    low: number // minutes
  }
  resolution_time_sla: {
    critical: number // hours
    high: number // hours
    medium: number // hours
    low: number // hours
  }
  support_hours: {
    timezone: string
    weekdays: string[] // ['mon', 'tue', 'wed', 'thu', 'fri']
    start_time: string // '09:00'
    end_time: string // '17:00'
    emergency_24x7: boolean
  }
  api_rate_limits: {
    requests_per_minute: number
    requests_per_hour: number
    requests_per_day: number
  }
  data_retention_days: number
  backup_frequency: 'daily' | 'weekly' | 'monthly'
  disaster_recovery_rto_minutes: number // Recovery Time Objective
  disaster_recovery_rpo_minutes: number // Recovery Point Objective
  price_monthly: number
  features: string[]
  created_at: string
  updated_at: string
}

export interface Incident {
  id: string
  tenant_id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed'
  priority: number // 1-5, 1 being highest
  assigned_to?: string
  reported_by: string
  reported_at: string
  resolved_at?: string
  sla_deadline?: string
  impact_description?: string
  root_cause?: string
  resolution?: string
  affected_services: string[]
  affected_users_count?: number
  estimated_resolution_time?: number // minutes
  actual_resolution_time?: number // minutes
  communication_log: IncidentCommunication[]
  tags: string[]
  metadata: Record<string, any>
}

export interface IncidentCommunication {
  id: string
  incident_id: string
  type: 'internal' | 'customer' | 'public'
  channel: 'email' | 'sms' | 'slack' | 'status_page' | 'phone'
  subject: string
  content: string
  sent_by: string
  sent_at: string
  recipients: string[]
}

export interface SLAMetrics {
  tenant_id: string
  period_start: string
  period_end: string
  uptime_percentage: number
  incidents_count: number
  incidents_by_severity: Record<string, number>
  average_response_time: number // minutes
  average_resolution_time: number // minutes
  sla_compliance_percentage: number
  response_time_sla_met: number // percentage
  resolution_time_sla_met: number // percentage
  api_availability_percentage: number
  customer_satisfaction_score?: number
}

export interface EscalationRule {
  id: string
  tenant_id: string
  name: string
  severity: Incident['severity']
  condition: 'response_time_exceeded' | 'resolution_time_exceeded' | 'status_not_updated' | 'recurring_incident'
  threshold_minutes: number
  escalation_target: string // user_id or role
  notification_channels: string[]
  auto_assign: boolean
  active: boolean
  created_at: string
}

export class SLAManagementService {
  private static instance: SLAManagementService
  private supabase: any = null

  private constructor() {}

  static getInstance(): SLAManagementService {
    if (!SLAManagementService.instance) {
      SLAManagementService.instance = new SLAManagementService()
    }
    return SLAManagementService.instance
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createServerSupabaseClient()
    }
    return this.supabase
  }

  /**
   * Create SLA definition
   */
  async createSLADefinition(sla: Omit<SLADefinition, 'id' | 'created_at' | 'updated_at'>): Promise<SLADefinition> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data, error } = await supabase
        .from('sla_definitions')
        .insert({
          ...sla,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      await logger.info(
        'SLA definition created',
        { sla_id: data.id, tenant_id: sla.tenant_id, service_level: sla.service_level },
        { tenant_id: sla.tenant_id }
      )

      return data as SLADefinition
    } catch (error) {
      await logger.error(
        'Failed to create SLA definition',
        error as Error,
        { tenant_id: sla.tenant_id, service_level: sla.service_level }
      )
      throw error
    }
  }

  /**
   * Get SLA definition for tenant
   */
  async getSLADefinition(tenantId: string): Promise<SLADefinition | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('sla_definitions')
        .select('*')
        .eq('tenant_id', tenantId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data as SLADefinition || null
    } catch (error) {
      await logger.error(
        'Failed to get SLA definition',
        error as Error,
        { tenant_id: tenantId }
      )
      throw error
    }
  }

  /**
   * Create incident
   */
  async createIncident(incident: Omit<Incident, 'id' | 'reported_at'>): Promise<Incident> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const incidentId = this.generateIncidentId()
      
      // Calculate SLA deadline based on severity and tenant SLA
      const slaDeadline = await this.calculateSLADeadline(incident.tenant_id, incident.severity)

      const { data, error } = await supabase
        .from('incidents')
        .insert({
          ...incident,
          id: incidentId,
          reported_at: new Date().toISOString(),
          sla_deadline: slaDeadline
        })
        .select()
        .single()

      if (error) throw error

      // Check escalation rules
      await this.checkEscalationRules(data as Incident)

      await logger.info(
        'Incident created',
        { incident_id: data.id, tenant_id: incident.tenant_id, severity: incident.severity, title: incident.title },
        { tenant_id: incident.tenant_id }
      )

      return data as Incident
    } catch (error) {
      await logger.error(
        'Failed to create incident',
        error as Error,
        { tenant_id: incident.tenant_id, severity: incident.severity }
      )
      throw error
    }
  }

  /**
   * Update incident
   */
  async updateIncident(
    incidentId: string,
    tenantId: string,
    updates: Partial<Incident>
  ): Promise<Incident> {
    try {
      const supabase = await this.getSupabaseClient()

      const updateData: any = { ...updates, updated_at: new Date().toISOString() }

      // If resolving incident, set resolved_at and calculate actual resolution time
      if (updates.status === 'resolved' || updates.status === 'closed') {
        updateData.resolved_at = new Date().toISOString()
        
        const incident = await this.getIncident(incidentId, tenantId)
        if (incident) {
          const reportedTime = new Date(incident.reported_at).getTime()
          const resolvedTime = new Date(updateData.resolved_at).getTime()
          updateData.actual_resolution_time = Math.round((resolvedTime - reportedTime) / (1000 * 60)) // minutes
        }
      }

      const { data, error } = await supabase
        .from('incidents')
        .update(updateData)
        .eq('id', incidentId)
        .eq('tenant_id', tenantId)
        .select()
        .single()

      if (error) throw error

      await logger.info(
        'Incident updated',
        { incident_id: incidentId, tenant_id: tenantId, status: updates.status, severity: data.severity },
        { tenant_id: tenantId }
      )

      return data as Incident
    } catch (error) {
      await logger.error(
        'Failed to update incident',
        error as Error,
        { incident_id: incidentId, tenant_id: tenantId }
      )
      throw error
    }
  }

  /**
   * Get incident by ID
   */
  async getIncident(incidentId: string, tenantId: string): Promise<Incident | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', incidentId)
        .eq('tenant_id', tenantId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data as Incident || null
    } catch (error) {
      await logger.error(
        'Failed to get incident',
        error as Error,
        { incident_id: incidentId, tenant_id: tenantId }
      )
      throw error
    }
  }

  /**
   * Get incidents for tenant with filtering
   */
  async getIncidents(
    tenantId: string,
    filters: {
      status?: Incident['status']
      severity?: Incident['severity']
      start_date?: string
      end_date?: string
      assigned_to?: string
      limit?: number
    } = {}
  ): Promise<Incident[]> {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
        .from('incidents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('reported_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.severity) {
        query = query.eq('severity', filters.severity)
      }

      if (filters.start_date) {
        query = query.gte('reported_at', filters.start_date)
      }

      if (filters.end_date) {
        query = query.lte('reported_at', filters.end_date)
      }

      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return data as Incident[]
    } catch (error) {
      await logger.error(
        'Failed to get incidents',
        error as Error,
        { tenant_id: tenantId, filters }
      )
      throw error
    }
  }

  /**
   * Calculate SLA metrics for a period
   */
  async calculateSLAMetrics(
    tenantId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<SLAMetrics> {
    try {
      const incidents = await this.getIncidents(tenantId, {
        start_date: periodStart,
        end_date: periodEnd
      })

      // Calculate uptime percentage (simplified)
      const totalMinutes = (new Date(periodEnd).getTime() - new Date(periodStart).getTime()) / (1000 * 60)
      const downtimeMinutes = incidents.reduce((total, incident) => {
        if (incident.status === 'resolved' || incident.status === 'closed') {
          return total + (incident.actual_resolution_time || 0)
        }
        return total + 60 // Assume 1 hour of ongoing downtime
      }, 0)

      const uptimePercentage = Math.max(0, 100 - (downtimeMinutes / totalMinutes) * 100)

      // Calculate response and resolution times
      const criticalIncidents = incidents.filter(i => i.severity === 'critical')
      const responseTimes = criticalIncidents.map(i => i.actual_resolution_time || 0).filter(t => t > 0)
      const averageResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0

      // Count incidents by severity
      const incidentsBySeverity = incidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const metrics: SLAMetrics = {
        tenant_id: tenantId,
        period_start: periodStart,
        period_end: periodEnd,
        uptime_percentage: Math.round(uptimePercentage * 100) / 100,
        incidents_count: incidents.length,
        incidents_by_severity: incidentsBySeverity,
        average_response_time: Math.round(averageResponseTime * 100) / 100,
        average_resolution_time: Math.round(averageResponseTime * 100) / 100, // Simplified
        sla_compliance_percentage: uptimePercentage >= 99.9 ? 100 : Math.max(0, 100 - (99.9 - uptimePercentage) * 10),
        response_time_sla_met: criticalIncidents.length > 0 ? 95 : 100, // Simplified
        resolution_time_sla_met: criticalIncidents.length > 0 ? 90 : 100, // Simplified
        api_availability_percentage: uptimePercentage
      }

      // Store metrics
      await this.storeSLAMetrics(metrics)

      return metrics
    } catch (error) {
      await logger.error(
        'Failed to calculate SLA metrics',
        error as Error,
        { tenant_id: tenantId, period_start: periodStart, period_end: periodEnd }
      )
      throw error
    }
  }

  /**
   * Check SLA compliance
   */
  async checkSLACompliance(tenantId: string): Promise<{
    compliant: boolean
    violations: string[]
    metrics: SLAMetrics
  }> {
    try {
      const now = new Date()
      const periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days
      const periodEnd = now.toISOString()

      const metrics = await this.calculateSLAMetrics(tenantId, periodStart, periodEnd)
      const sla = await this.getSLADefinition(tenantId)

      if (!sla) {
        return {
          compliant: true,
          violations: [],
          metrics
        }
      }

      const violations: string[] = []

      // Check uptime SLA
      if (metrics.uptime_percentage < sla.uptime_percentage) {
        violations.push(`Uptime SLA violation: ${metrics.uptime_percentage}% < ${sla.uptime_percentage}%`)
      }

      // Check response time SLA
      if (metrics.average_response_time > sla.response_time_sla.critical) {
        violations.push(`Response time SLA violation: ${metrics.average_response_time}min > ${sla.response_time_sla.critical}min`)
      }

      // Check resolution time SLA
      if (metrics.average_resolution_time > sla.resolution_time_sla.critical * 60) { // Convert hours to minutes
        violations.push(`Resolution time SLA violation: ${metrics.average_resolution_time}min > ${sla.resolution_time_sla.critical * 60}min`)
      }

      const compliant = violations.length === 0

      await logger.info(
        'SLA compliance check completed',
        { tenant_id: tenantId, compliant, violations_count: violations.length, uptime: metrics.uptime_percentage },
        { tenant_id: tenantId }
      )

      return {
        compliant,
        violations,
        metrics
      }
    } catch (error) {
      await logger.error(
        'Failed to check SLA compliance',
        error as Error,
        { tenant_id: tenantId }
      )
      throw error
    }
  }

  /**
   * Create escalation rule
   */
  async createEscalationRule(rule: Omit<EscalationRule, 'id' | 'created_at'>): Promise<EscalationRule> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data, error } = await supabase
        .from('escalation_rules')
        .insert({
          ...rule,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      await logger.info(
        'Escalation rule created',
        { rule_id: data.id, tenant_id: rule.tenant_id, severity: rule.severity, condition: rule.condition },
        { tenant_id: rule.tenant_id }
      )

      return data as EscalationRule
    } catch (error) {
      await logger.error(
        'Failed to create escalation rule',
        error as Error,
        { tenant_id: rule.tenant_id, severity: rule.severity }
      )
      throw error
    }
  }

  // Helper methods
  private generateIncidentId(): string {
    return `INC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  private async calculateSLADeadline(tenantId: string, severity: Incident['severity']): Promise<string> {
    const sla = await this.getSLADefinition(tenantId)
    if (!sla) {
      // Default SLA if not defined
      const deadlines = {
        critical: 15, // 15 minutes
        high: 60,     // 1 hour
        medium: 240,  // 4 hours
        low: 1440     // 24 hours
      }
      const deadline = new Date()
      deadline.setMinutes(deadline.getMinutes() + deadlines[severity])
      return deadline.toISOString()
    }

    const responseTime = sla.response_time_sla[severity]
    const deadline = new Date()
    deadline.setMinutes(deadline.getMinutes() + responseTime)
    return deadline.toISOString()
  }

  private async checkEscalationRules(incident: Incident): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data: rules } = await supabase
        .from('escalation_rules')
        .select('*')
        .eq('tenant_id', incident.tenant_id)
        .eq('severity', incident.severity)
        .eq('active', true)

      if (!rules) return

      for (const rule of rules) {
        if (rule.condition === 'response_time_exceeded') {
          const now = new Date().getTime()
          const reportedTime = new Date(incident.reported_at).getTime()
          const minutesSinceReported = (now - reportedTime) / (1000 * 60)

          if (minutesSinceReported >= rule.threshold_minutes) {
            await this.escalateIncident(incident, rule)
          }
        }
      }
    } catch (error) {
      await logger.error(
        'Failed to check escalation rules',
        error as Error,
        { incident_id: incident.id, tenant_id: incident.tenant_id }
      )
    }
  }

  private async escalateIncident(incident: Incident, rule: EscalationRule): Promise<void> {
    await logger.info(
      'Incident escalated',
      { 
        incident_id: incident.id, 
        tenant_id: incident.tenant_id, 
        severity: incident.severity, 
        rule_name: rule.name,
        escalation_target: rule.escalation_target 
      },
      { tenant_id: incident.tenant_id }
    )

    // Auto-assign if configured
    if (rule.auto_assign && !incident.assigned_to) {
      await this.updateIncident(incident.id, incident.tenant_id, {
        assigned_to: rule.escalation_target
      })
    }

    // Send notifications (simplified)
    // In production, integrate with email, Slack, PagerDuty, etc.
  }

  private async storeSLAMetrics(metrics: SLAMetrics): Promise<void> {
    const supabase = await this.getSupabaseClient()
    await supabase.from('sla_metrics').upsert(metrics)
  }
}

// Export singleton instance
export const slaService = SLAManagementService.getInstance()