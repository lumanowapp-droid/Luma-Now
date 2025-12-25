-- OAuth Provider Configuration
-- Migration: 003_oauth_providers.sql
-- Created: 2025-12-24
-- Description: Support for Google and Apple OAuth, social authentication tracking

-- OAuth Providers Table
-- Tracks which OAuth providers users have connected
CREATE TABLE IF NOT EXISTS oauth_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('google', 'apple', 'github', 'microsoft')),
    provider_user_id VARCHAR(255) NOT NULL, -- User ID from OAuth provider
    provider_email VARCHAR(255),
    provider_name VARCHAR(255),
    provider_avatar_url TEXT,
    access_token_encrypted TEXT, -- Store encrypted tokens
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    scopes TEXT[], -- Granted OAuth scopes
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_primary BOOLEAN DEFAULT FALSE, -- Primary login method
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider),
    UNIQUE(provider, provider_user_id)
);

-- Sign-in Methods Tracking
-- Analytics for understanding how users authenticate
CREATE TABLE IF NOT EXISTS sign_in_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL CHECK (method IN ('google', 'apple', 'email', 'phone', 'magic_link')),
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50), -- 'mobile', 'desktop', 'tablet'
    location_country VARCHAR(2), -- ISO country code
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON oauth_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_provider ON oauth_connections(provider);
CREATE INDEX IF NOT EXISTS idx_sign_in_methods_user_id ON sign_in_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_sign_in_methods_created_at ON sign_in_methods(created_at);

-- Enable Row Level Security
ALTER TABLE oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_in_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY oauth_connections_policy ON oauth_connections
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY sign_in_methods_policy ON sign_in_methods
    FOR ALL USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_oauth_connections_updated_at
    BEFORE UPDATE ON oauth_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
