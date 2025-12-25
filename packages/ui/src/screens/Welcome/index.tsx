import React, { useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { Text, Stack, Spacer } from '../../primitives';
import { Button } from '../../Button';
import { useAppStore } from '@luma/store';

interface WelcomeStep {
  title: string;
  description: string;
  emoji?: string;
}

const welcomeSteps: WelcomeStep[] = [
  {
    title: 'Welcome to Luma Now',
    description: 'A calm place to plan your day without overwhelm.',
    emoji: '✨',
  },
  {
    title: 'Brain Dump',
    description:
      'Pour out all your thoughts. AI will help you organize them into a realistic timeline.',
    emoji: '🧠',
  },
  {
    title: 'Choose Your Capacity',
    description:
      "How much energy do you have today? We'll help you plan accordingly.",
    emoji: '🔋',
  },
  {
    title: 'Focus Mode',
    description: 'One task at a time. No pressure, just progress.',
    emoji: '🎯',
  },
];

interface CapacityOption {
  value: 'light' | 'medium' | 'full';
  tasks: number;
  label: string;
  description: string;
  emoji: string;
}

const capacityOptions: CapacityOption[] = [
  {
    value: 'light',
    tasks: 3,
    label: 'Light Day',
    description: 'Taking it easy today',
    emoji: '🌙',
  },
  {
    value: 'medium',
    tasks: 5,
    label: 'Medium Day',
    description: 'Balanced and sustainable',
    emoji: '☀️',
  },
  {
    value: 'full',
    tasks: 7,
    label: 'Full Day',
    description: 'Ready to tackle more',
    emoji: '⚡',
  },
];

interface WelcomeProps {
  onComplete: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState<
    'light' | 'medium' | 'full'
  >('medium');
  const { updateSettings } = useAppStore();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === welcomeSteps.length - 1;

  const handleNext = () => {
    if (currentStep === 0 && !showTour) {
      // User chose to skip tour, go straight to capacity selection
      handleComplete();
      return;
    }

    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkipTour = () => {
    setShowTour(false);
    handleComplete();
  };

  const handleComplete = () => {
    // Save default capacity
    updateSettings({ defaultCapacity: selectedCapacity, hasCompletedOnboarding: true });
    onComplete();
  };

  if (!showTour && currentStep === 0) {
    // Welcome screen with option to take tour or skip
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          backgroundColor: '#FAFAF7',
        }}
      >
        <Stack spacing="xl" style={{ maxWidth: 400, width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              variant="display"
              style={{ fontSize: 48, marginBottom: 16, textAlign: 'center' }}
            >
              ✨
            </Text>
            <Text
              variant="heading"
              style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}
            >
              Welcome to Luma Now
            </Text>
            <Text
              variant="body"
              style={{ opacity: 0.7, textAlign: 'center', lineHeight: 24 }}
            >
              A calm place to plan your day without overwhelm.
            </Text>
          </View>

          <Spacer size="lg" />

          {/* Capacity Selection */}
          <View>
            <Text
              variant="label"
              style={{
                marginBottom: 16,
                textAlign: 'center',
                fontSize: 16,
                opacity: 0.8,
              }}
            >
              What feels right for most days?
            </Text>

            <Stack spacing="sm">
              {capacityOptions.map(option => (
                <Button
                  key={option.value}
                  variant={
                    selectedCapacity === option.value ? 'primary' : 'secondary'
                  }
                  onPress={() => setSelectedCapacity(option.value)}
                  style={{
                    paddingVertical: 16,
                    borderWidth: selectedCapacity === option.value ? 2 : 1,
                    borderColor:
                      selectedCapacity === option.value
                        ? '#6B85A6'
                        : 'rgba(0,0,0,0.1)',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, marginRight: 12 }}>
                        {option.emoji}
                      </Text>
                      <View>
                        <Text
                          variant="body"
                          style={{
                            fontWeight: '600',
                            color:
                              selectedCapacity === option.value
                                ? '#1A1A1A'
                                : '#4A4A4A',
                          }}
                        >
                          {option.label}
                        </Text>
                        <Text
                          variant="caption"
                          style={{
                            opacity: 0.6,
                            color:
                              selectedCapacity === option.value
                                ? '#1A1A1A'
                                : '#6B7280',
                          }}
                        >
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    <Text
                      variant="caption"
                      style={{
                        opacity: 0.5,
                        color:
                          selectedCapacity === option.value
                            ? '#1A1A1A'
                            : '#6B7280',
                      }}
                    >
                      {option.tasks} tasks
                    </Text>
                  </View>
                </Button>
              ))}
            </Stack>
          </View>

          <Spacer size="lg" />

          <Stack spacing="sm">
            <Button variant="primary" onPress={() => setShowTour(true)}>
              Take a Quick Tour
            </Button>
            <Button variant="ghost" onPress={handleComplete}>
              Skip Tour
            </Button>
          </Stack>
        </Stack>
      </View>
    );
  }

  // Tour screens
  const step = welcomeSteps[currentStep];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        padding: 32,
        backgroundColor: '#FAFAF7',
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack spacing="xl" style={{ maxWidth: 400, width: '100%' }}>
          {/* Progress indicator */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {welcomeSteps.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    index === currentStep
                      ? '#6B85A6'
                      : 'rgba(107, 133, 166, 0.2)',
                }}
              />
            ))}
          </View>

          <View style={{ alignItems: 'center' }}>
            {step.emoji && (
              <Text
                variant="display"
                style={{ fontSize: 64, marginBottom: 24, textAlign: 'center' }}
              >
                {step.emoji}
              </Text>
            )}
            <Text
              variant="heading"
              style={{ fontSize: 28, marginBottom: 16, textAlign: 'center' }}
            >
              {step.title}
            </Text>
            <Text
              variant="body"
              style={{
                opacity: 0.7,
                textAlign: 'center',
                lineHeight: 26,
                fontSize: 18,
              }}
            >
              {step.description}
            </Text>
          </View>
        </Stack>
      </View>

      {/* Navigation */}
      <Stack spacing="sm">
        <Button variant="primary" onPress={handleNext}>
          {isLastStep ? "Let's Start" : 'Next'}
        </Button>
        {!isLastStep && (
          <Button variant="ghost" onPress={handleSkipTour}>
            Skip Tour
          </Button>
        )}
      </Stack>
    </View>
  );
};
