import { createServerSupabaseClient } from '../supabase'

export interface LogEntry {
  id?: string
  tenant_id: string
  user_id?: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string
  context?: Record<string, any>
  timestamp: string
  service: string
  environment: 'development' | 'staging' | 'production'
  request_id?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  duration_ms?: number
  error_code?: string
  stack_trace?: string
}

export interface PerformanceMetric {
  id?: string
  tenant_id: string
  metric_name: string
  metric_value: number
  metric_unit: string
  tags: Record<string, any>
  timestamp: string
  service: string
  environment: 'development' | 'staging' | 'production'
}

export interface AlertRule {
  id?: string
  tenant_id: string
  name: string
  description: string
  metric_name: string
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  notification_channels: string[]
  created_at?: string
  updated_at?: string
}

export class EnterpriseLogger {
  private static instance: EnterpriseLogger
  private supabase: any = null
  private isProduction: boolean = process.env.NODE_ENV === 'production'
  private serviceName: string = 'enterprise-saas'

  private constructor() {}

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger()
    }
    return EnterpriseLogger.instance
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createServerSupabaseClient()
    }
    return this.supabase
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      error_code?: string
      stack_trace?: string
      duration_ms?: number
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
    } = {} as any
  ): LogEntry {
    return {
      tenant_id: options.tenant_id,
      user_id: options.user_id,
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      environment: this.isProduction ? 'production' : 'development',
      request_id: options.request_id,
      session_id: options.session_id,
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      duration_ms: options.duration_ms,
      error_code: options.error_code,
      stack_trace: options.stack_trace
    }
  }

  /**
   * Log debug message
   */
  async debug(
    message: string,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
    } = {} as any
  ) {
    const logEntry = this.createLogEntry('debug', message, context, options)
    
    // Always log debug in development
    if (!this.isProduction) {
      console.debug(`[DEBUG] ${message}`, context)
    }
    
    // Store in database
    await this.storeLogEntry(logEntry)
  }

  /**
   * Log info message
   */
  async info(
    message: string,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
      duration_ms?: number
    } = {} as any
  ) {
    const logEntry = this.createLogEntry('info', message, context, options)
    
    console.log(`[INFO] ${message}`, context)
    
    // Store in database
    await this.storeLogEntry(logEntry)
  }

  /**
   * Log warning message
   */
  async warn(
    message: string,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
    } = {} as any
  ) {
    const logEntry = this.createLogEntry('warn', message, context, options)
    
    console.warn(`[WARN] ${message}`, context)
    
    // Store in database
    await this.storeLogEntry(logEntry)
  }

  /**
   * Log error message
   */
  async error(
    message: string,
    error?: Error,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
      error_code?: string
    } = {} as any
  ) {
    const errorContext = {
      ...context,
      error_message: error?.message,
      error_stack: error?.stack,
      error_name: error?.name
    }

    const logEntry = this.createLogEntry('error', message, errorContext, {
      ...options,
      stack_trace: error?.stack,
      error_code: options.error_code || error?.name
    })
    
    console.error(`[ERROR] ${message}`, errorContext)
    
    // Store in database
    await this.storeLogEntry(logEntry)

    // Check if this error should trigger an alert
    await this.checkAlertConditions(logEntry)
  }

  /**
   * Log fatal message
   */
  async fatal(
    message: string,
    error?: Error,
    context: Record<string, any> = {},
    options: {
      user_id?: string
      tenant_id: string
      request_id?: string
      session_id?: string
      ip_address?: string
      user_agent?: string
      error_code?: string
    } = {} as any
  ) {
    const errorContext = {
      ...context,
      error_message: error?.message,
      error_stack: error?.stack,
      error_name: error?.name
    }

    const logEntry = this.createLogEntry('fatal', message, errorContext, {
      ...options,
      stack_trace: error?.stack,
      error_code: options.error_code || error?.name
    })
    
    console.error(`[FATAL] ${message}`, errorContext)
    
    // Store in database
    await this.storeLogEntry(logEntry)

    // Always trigger critical alerts for fatal errors
    await this.triggerCriticalAlert(logEntry)
  }

  /**
   * Store log entry in database
   */
  private async storeLogEntry(logEntry: LogEntry) {
    try {
      const supabase = await this.getSupabaseClient()
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          tenant_id: logEntry.tenant_id,
          user_id: logEntry.user_id,
          action: logEntry.level,
          resource_type: 'log_entry',
          new_values: {
            message: logEntry.message,
            context: logEntry.context,
            service: logEntry.service,
            environment: logEntry.environment,
            request_id: logEntry.request_id,
            session_id: logEntry.session_id,
            ip_address: logEntry.ip_address,
            user_agent: logEntry.user_agent,
            duration_ms: logEntry.duration_ms,
            error_code: logEntry.error_code
          }
        })

      if (error) {
        console.error('Failed to store log entry:', error)
      }
    } catch (error) {
      console.error('Error storing log entry:', error)
    }
  }

  /**
   * Record performance metric
   */
  async recordMetric(
    metricName: string,
    value: number,
    unit: string,
    tags: Record<string, any> = {},
    options: {
      tenant_id: string
      service?: string
    } = {} as any
  ) {
    const metric: PerformanceMetric = {
      tenant_id: options.tenant_id,
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
      tags,
      timestamp: new Date().toISOString(),
      service: options.service || this.serviceName,
      environment: this.isProduction ? 'production' : 'development'
    }

    try {
      const supabase = await this.getSupabaseClient()
      const { error } = await supabase
        .from('performance_metrics')
        .insert(metric)

      if (error) {
        console.error('Failed to store performance metric:', error)
      }

      // Check alert conditions
      await this.checkMetricAlertConditions(metric)
    } catch (error) {
      console.error('Error recording metric:', error)
    }
  }

  /**
   * Check alert conditions for log entries
   */
  private async checkAlertConditions(logEntry: LogEntry) {
    if (logEntry.level !== 'error' && logEntry.level !== 'fatal') {
      return
    }

    try {
      const supabase = await this.getSupabaseClient()
      const { data: alertRules } = await supabase
        .from('alert_rules')
        .select('*')
        .eq('tenant_id', logEntry.tenant_id)
        .eq('enabled', true)

      if (!alertRules) return

      for (const rule of alertRules) {
        if (rule.metric_name === 'error_rate' && logEntry.level === 'error') {
          await this.evaluateAlertRule(rule, logEntry)
        }
      }
    } catch (error) {
      console.error('Error checking alert conditions:', error)
    }
  }

  /**
   * Check alert conditions for metrics
   */
  private async checkMetricAlertConditions(metric: PerformanceMetric) {
    try {
      const supabase = await this.getSupabaseClient()
      const { data: alertRules } = await supabase
        .from('alert_rules')
        .select('*')
        .eq('tenant_id', metric.tenant_id)
        .eq('metric_name', metric.metric_name)
        .eq('enabled', true)

      if (!alertRules) return

      for (const rule of alertRules) {
        await this.evaluateAlertRule(rule, metric)
      }
    } catch (error) {
      console.error('Error checking metric alert conditions:', error)
    }
  }

  /**
   * Evaluate alert rule
   */
  private async evaluateAlertRule(rule: AlertRule, data: any) {
    let shouldAlert = false

    if ('metric_value' in data) {
      // Metric-based alert
      const value = data.metric_value
      switch (rule.condition) {
        case 'gt': shouldAlert = value > rule.threshold; break
        case 'lt': shouldAlert = value < rule.threshold; break
        case 'eq': shouldAlert = value === rule.threshold; break
        case 'gte': shouldAlert = value >= rule.threshold; break
        case 'lte': shouldAlert = value <= rule.threshold; break
      }
    } else if (data.level === 'error' && rule.metric_name === 'error_rate') {
      // Error-based alert
      shouldAlert = true
    }

    if (shouldAlert) {
      await this.triggerAlert(rule, data)
    }
  }

  /**
   * Trigger alert
   */
  private async triggerAlert(rule: AlertRule, data: any) {
    const alert = {
      tenant_id: rule.tenant_id,
      alert_rule_id: rule.id,
      severity: rule.severity,
      message: `Alert: ${rule.name} - ${rule.description}`,
      data: data,
      triggered_at: new Date().toISOString()
    }

    // Log the alert
    await this.error(
      `ALERT TRIGGERED: ${rule.name}`,
      undefined,
      { alert_rule: rule, data },
      { tenant_id: rule.tenant_id }
    )

    // Here you would integrate with notification services
    // (email, Slack, PagerDuty, etc.)
    console.log(`ALERT TRIGGERED: ${rule.name}`, alert)
  }

  /**
   * Trigger critical alert for fatal errors
   */
  private async triggerCriticalAlert(logEntry: LogEntry) {
    // Log to security events table for critical issues
    try {
      const supabase = await this.getSupabaseClient()
      await supabase
        .from('security_events')
        .insert({
          tenant_id: logEntry.tenant_id,
          event_type: 'fatal_error',
          severity: 'critical',
          description: logEntry.message,
          user_id: logEntry.user_id,
          metadata: {
            log_entry: logEntry,
            service: logEntry.service,
            environment: logEntry.environment
          }
        })
    } catch (error) {
      console.error('Failed to log critical alert:', error)
    }
  }

  /**
   * Create alert rule
   */
  async createAlertRule(rule: Omit<AlertRule, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('alert_rules')
        .insert({
          ...rule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating alert rule:', error)
      throw error
    }
  }

  /**
   * Get logs with filtering
   */
  async getLogs(filters: {
    tenant_id: string
    level?: LogEntry['level']
    start_date?: string
    end_date?: string
    user_id?: string
    service?: string
    limit?: number
  }) {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', filters.tenant_id)
        .order('created_at', { ascending: false })

      if (filters.level) {
        query = query.eq('action', filters.level)
      }

      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date)
      }

      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date)
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching logs:', error)
      throw error
    }
  }

  /**
   * Get performance metrics
   */
  async getMetrics(filters: {
    tenant_id: string
    metric_name?: string
    start_date?: string
    end_date?: string
    service?: string
    limit?: number
  }) {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .eq('tenant_id', filters.tenant_id)
        .order('recorded_at', { ascending: false })

      if (filters.metric_name) {
        query = query.eq('metric_name', filters.metric_name)
      }

      if (filters.start_date) {
        query = query.gte('recorded_at', filters.start_date)
      }

      if (filters.end_date) {
        query = query.lte('recorded_at', filters.end_date)
      }

      if (filters.service) {
        query = query.eq('service', filters.service)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const logger = EnterpriseLogger.getInstance()