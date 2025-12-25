import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { Text, Stack, Surface, Toggle, Touchable } from '../../primitives';
import { useAppStore } from '@luma/store';

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  children?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onPress,
  showChevron = false,
  children,
}) => {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
      }}
    >
      <Text variant="body">{label}</Text>
      {children || (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {value && (
            <Text variant="caption" style={{ opacity: 0.6 }}>
              {value}
            </Text>
          )}
          {showChevron && (
            <Text variant="caption" style={{ opacity: 0.4 }}>
              ›
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <Touchable onPress={onPress}>{content}</Touchable>;
  }

  return content;
};

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text
        variant="label"
        style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
          opacity: 0.6,
          textTransform: 'uppercase',
          fontSize: 13,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <Surface elevation={0} style={{ borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </Surface>
    </View>
  );
};

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  // TODO: Implement actual premium check
  const isPremium = false;

  const updateSetting = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  const getSystemPreference = (setting: string): string => {
    // This would ideally detect actual system preferences
    // For now, return placeholder
    if (setting === 'theme') {
      return 'Dark';
    }
    if (setting === 'reducedMotion') {
      return 'Off';
    }
    return 'Unknown';
  };

  const getThemeLabel = (): string => {
    if (settings.theme === 'system') {
      return `System (${getSystemPreference('theme')})`;
    }
    return settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1);
  };

  const handleThemeChange = () => {
    // Cycle through theme options
    const themes = ['system', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(settings.theme as any);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSetting('theme', themes[nextIndex]);
  };

  const getAIProviderLabel = (): string => {
    if (!settings.aiProvider) return 'Cloudflare';
    return settings.aiProvider.charAt(0).toUpperCase() + settings.aiProvider.slice(1);
  };

  const handleAIProviderChange = () => {
    if (!isPremium) return; // Only premium users can change AI provider

    // Cycle through AI provider options for premium users
    const providers = ['anthropic', 'openai'] as const;
    const current = settings.aiProvider || 'anthropic';
    const currentIndex = providers.indexOf(current as any);
    const nextIndex = (currentIndex + 1) % providers.length;
    updateSetting('aiProvider', providers[nextIndex]);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Platform.OS === 'web' ? 'transparent' : '#FAFAF7',
      }}
      contentContainerStyle={{ padding: 16, paddingTop: 24 }}
    >
      <Stack spacing="lg">
        {/* Appearance */}
        <SettingSection title="Appearance">
          <SettingRow
            label="Theme"
            value={getThemeLabel()}
            onPress={handleThemeChange}
            showChevron
          />
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
              marginHorizontal: 16,
            }}
          />
          <SettingRow label="Reduced Motion">
            <Toggle
              value={settings.reducedMotion}
              onValueChange={value => updateSetting('reducedMotion', value)}
            />
          </SettingRow>
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
              marginHorizontal: 16,
            }}
          />
          <SettingRow label="High Contrast">
            <Toggle
              value={settings.highContrast || false}
              onValueChange={value => updateSetting('highContrast', value)}
            />
          </SettingRow>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingRow label="Gentle Nudges">
            <Toggle
              value={settings.gentleNudges || true}
              onValueChange={value => updateSetting('gentleNudges', value)}
            />
          </SettingRow>
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
              marginHorizontal: 16,
            }}
          />
          <SettingRow label="Daily Reflection">
            <Toggle
              value={settings.dailyReflection || false}
              onValueChange={value => updateSetting('dailyReflection', value)}
            />
          </SettingRow>
        </SettingSection>

        {/* Accessibility */}
        <SettingSection title="Accessibility">
          <SettingRow
            label="Font Size"
            value={
              settings.fontSize
                ? settings.fontSize.charAt(0).toUpperCase() +
                  settings.fontSize.slice(1)
                : 'Medium'
            }
            onPress={() => {
              const sizes = ['small', 'medium', 'large'] as const;
              const current = settings.fontSize || 'medium';
              const currentIndex = sizes.indexOf(current as any);
              const nextIndex = (currentIndex + 1) % sizes.length;
              updateSetting('fontSize', sizes[nextIndex]);
            }}
            showChevron
          />
          {Platform.OS !== 'web' && (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  marginHorizontal: 16,
                }}
              />
              <SettingRow label="Haptic Feedback">
                <Toggle
                  value={settings.hapticFeedback}
                  onValueChange={value => updateSetting('hapticFeedback', value)}
                />
              </SettingRow>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  marginHorizontal: 16,
                }}
              />
              <SettingRow label="Voice Input">
                <Toggle
                  value={settings.voiceInput}
                  onValueChange={value => updateSetting('voiceInput', value)}
                />
              </SettingRow>
            </>
          )}
        </SettingSection>

        {/* Capacity Default */}
        <SettingSection title="Planning">
          <SettingRow
            label="Default Capacity"
            value={
              settings.defaultCapacity
                ? settings.defaultCapacity.charAt(0).toUpperCase() +
                  settings.defaultCapacity.slice(1)
                : 'Medium'
            }
            onPress={() => {
              const capacities = ['light', 'medium', 'full'] as const;
              const current = settings.defaultCapacity || 'medium';
              const currentIndex = capacities.indexOf(current as any);
              const nextIndex = (currentIndex + 1) % capacities.length;
              updateSetting('defaultCapacity', capacities[nextIndex]);
            }}
            showChevron
          />
        </SettingSection>

        {/* AI Provider (Premium only) */}
        {isPremium && (
          <SettingSection title="AI Provider">
            <SettingRow
              label="AI Model"
              value={getAIProviderLabel()}
              onPress={handleAIProviderChange}
              showChevron
            />
          </SettingSection>
        )}

        {/* Account */}
        <SettingSection title="Account">
          <SettingRow label="Email" value="user@example.com" />
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
              marginHorizontal: 16,
            }}
          />
          <SettingRow
            label="Sign Out"
            onPress={() => {
              // Handle sign out
              console.log('Sign out');
            }}
            showChevron
          />
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
              marginHorizontal: 16,
            }}
          />
          <SettingRow
            label="Delete Account"
            onPress={() => {
              // Handle delete account with confirmation
              console.log('Delete account');
            }}
          >
            <Text variant="caption" style={{ color: '#DC2626' }}>
              Delete
            </Text>
          </SettingRow>
        </SettingSection>
      </Stack>
    </ScrollView>
  );
};
