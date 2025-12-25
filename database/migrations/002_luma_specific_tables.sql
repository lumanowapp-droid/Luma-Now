-- Luma Now Specific Tables
-- Migration: 002_luma_specific_tables.sql
-- Created: 2025-12-24
-- Description: ADHD-specific features for Luma Now (brain dumps, capacity, focus sessions)

-- Brain Dump Sessions
-- Stores raw brain dump text before AI compression
CREATE TABLE IF NOT EXISTS brain_dump_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    raw_text TEXT NOT NULL,
    compressed_tasks JSONB, -- Stores AI-generated tasks
    capacity VARCHAR(20) DEFAULT 'medium' CHECK (capacity IN ('light', 'medium', 'full')),
    ai_provider VARCHAR(50) DEFAULT 'cloudflare', -- Which AI model was used
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Capacity History
-- Tracks daily capacity selections for pattern recognition
CREATE TABLE IF NOT EXISTS capacity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    capacity VARCHAR(20) NOT NULL CHECK (capacity IN ('light', 'medium', 'full')),
    tasks_completed INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Focus Sessions
-- Tracks time spent in focus mode on specific tasks
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER, -- Calculated on end
    interruptions INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences (Luma-specific settings)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
    default_capacity VARCHAR(20) DEFAULT 'medium' CHECK (default_capacity IN ('light', 'medium', 'full')),
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    reduced_motion BOOLEAN DEFAULT FALSE,
    haptic_feedback BOOLEAN DEFAULT TRUE,
    voice_input_enabled BOOLEAN DEFAULT TRUE,
    ai_provider VARCHAR(50) DEFAULT 'cloudflare',
    ai_model VARCHAR(50) DEFAULT 'default',
    nudges_enabled BOOLEAN DEFAULT TRUE,
    work_hours_start TIME DEFAULT '09:00',
    work_hours_end TIME DEFAULT '17:00',
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Nudges Log
-- Tracks when gentle nudges are shown to users
CREATE TABLE IF NOT EXISTS ai_nudges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    nudge_type VARCHAR(100) NOT NULL, -- 'capacity_warning', 'break_reminder', 'celebration', etc.
    message TEXT NOT NULL,
    shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dismissed_at TIMESTAMP WITH TIME ZONE,
    action_taken VARCHAR(100), -- 'acknowledged', 'ignored', 'adjusted_capacity', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Color Categories (ADHD-friendly color coding)
CREATE TABLE IF NOT EXISTS task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE, -- NULL for system defaults
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL CHECK (color IN ('workBlue', 'personalGreen', 'carePurple', 'urgencyAmber', 'blue', 'coral', 'green', 'orange', 'purple')),
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brain_dump_sessions_user_id ON brain_dump_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_dump_sessions_session_id ON brain_dump_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_brain_dump_sessions_created_at ON brain_dump_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_capacity_history_user_id ON capacity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_capacity_history_date ON capacity_history(date);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_nudges_user_id ON ai_nudges(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_nudges_shown_at ON ai_nudges(shown_at);

CREATE INDEX IF NOT EXISTS idx_task_categories_user_id ON task_categories(user_id);

-- Enable Row Level Security
ALTER TABLE brain_dump_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY brain_dump_sessions_policy ON brain_dump_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY capacity_history_policy ON capacity_history
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY focus_sessions_policy ON focus_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY user_preferences_policy ON user_preferences
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY ai_nudges_policy ON ai_nudges
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY task_categories_policy ON task_categories
    FOR ALL USING (
        user_id = auth.uid() OR
        is_system = TRUE
    );

-- Insert default task categories
INSERT INTO task_categories (tenant_id, name, color, description, is_system)
SELECT
    t.id,
    category.name,
    category.color,
    category.description,
    TRUE
FROM tenants t
CROSS JOIN (
    VALUES
        ('Work', 'workBlue', 'Professional tasks, meetings, and work-related activities'),
        ('Personal', 'personalGreen', 'Personal care, health, and self-improvement'),
        ('Relationships', 'carePurple', 'Family, friends, and caregiving responsibilities'),
        ('Urgent', 'urgencyAmber', 'Time-sensitive items requiring immediate attention')
) AS category(name, color, description)
ON CONFLICT DO NOTHING;

-- Function to create default user preferences
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_user_preferences_trigger
    AFTER INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_user_preferences();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brain_dump_sessions_updated_at
    BEFORE UPDATE ON brain_dump_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
