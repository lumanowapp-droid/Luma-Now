# Epic 8: Native Features Implementation

## Overview

Epic 8 implements voice input, haptic feedback, and gesture support for the Luma Now ADHD planner. These features leverage mobile device intimacy to create an embodied planning experience that reduces cognitive load.

## ADHD-Critical Design Principles

- **Voice removes typing friction** at moments of overwhelm - speak thoughts faster than typing them
- **Haptics provide visceral feedback** without demanding visual attention
- **Gestures create muscle memory patterns**, reducing cognitive load vs. visual search for buttons

## Implementation Summary

### ✅ Completed Features

1. **Haptic Feedback System** ([packages/core/src/haptics/](packages/core/src/haptics/))
   - Platform abstraction with web and native implementations
   - 6 haptic types: light, medium, heavy, success, error, warning
   - Respects user preferences from settings store
   - Graceful degradation on web (no-op)

2. **Voice Input Service** ([packages/core/src/voice/](packages/core/src/voice/))
   - Hold-to-record pattern for intentional input
   - OpenAI Whisper transcription via API
   - Platform-specific implementations for web and native
   - Supports both FormData (web) and base64 (native) formats

3. **Swipeable Gestures** ([packages/ui/src/gestures/](packages/ui/src/gestures/))
   - React Native Gesture Handler integration
   - Swipe-right (complete task) and swipe-left (delete task)
   - Visual feedback with color-coded action backgrounds
   - Haptic feedback on swipe completion

4. **VoiceInput UI Component** ([packages/ui/src/components/VoiceInput/](packages/ui/src/components/VoiceInput/))
   - Hold-to-record button with visual states
   - State management: idle → recording → processing → success/error
   - ADHD-friendly design using design tokens
   - Haptic feedback on press/release

5. **Transcription API** ([apps/web/app/api/transcribe/route.ts](apps/web/app/api/transcribe/route.ts))
   - Next.js Edge Runtime endpoint
   - OpenAI Whisper integration
   - Supports both web (multipart/form-data) and native (JSON with base64)
   - Proper error handling and validation

6. **Mobile App Permissions** ([apps/mobile/app.json](apps/mobile/app.json))
   - iOS: NSMicrophoneUsageDescription
   - Android: RECORD_AUDIO permission
   - User-friendly permission descriptions

## File Structure

```
packages/
├── core/src/
│   ├── haptics/
│   │   ├── index.ts                    # Main haptic API
│   │   ├── platformHaptics.web.ts      # Web implementation (no-op)
│   │   └── platformHaptics.native.ts   # Native implementation (expo-haptics)
│   └── voice/
│       ├── index.ts                     # Main voice API
│       ├── platformVoice.web.ts         # Web implementation (MediaRecorder)
│       └── platformVoice.native.ts      # Native implementation (expo-av)
├── ui/src/
│   ├── gestures/
│   │   ├── Swipeable.tsx                # Base component
│   │   ├── Swipeable.web.tsx            # Web implementation (no-op)
│   │   └── Swipeable.native.tsx         # Native implementation (gesture-handler)
│   └── components/VoiceInput/
│       ├── index.tsx                    # Type definitions
│       ├── VoiceInput.web.tsx           # Web implementation (MediaRecorder)
│       └── VoiceInput.native.tsx        # Native implementation (expo-av)
apps/
├── mobile/
│   └── app.json                         # Expo config with permissions
└── web/app/api/
    └── transcribe/route.ts              # Transcription endpoint
```

## Usage Examples

### Haptic Feedback

```typescript
import { haptic, HapticPatterns } from '@multi-platform-app/core';

// Simple usage
await haptic('medium');

// Using patterns
await HapticPatterns.buttonPress();
await HapticPatterns.taskComplete();
await HapticPatterns.error();
```

### Voice Input

```typescript
import { VoiceInput } from '@multi-platform-app/ui';

function BrainDumpScreen() {
  const [text, setText] = useState('');

  return (
    <VoiceInput
      onTranscription={(newText) => setText(prev => prev + ' ' + newText)}
      onError={(error) => console.error('Voice error:', error)}
    />
  );
}
```

### Swipeable Gestures

```typescript
import { Swipeable } from '@multi-platform-app/ui';

function TaskList() {
  return (
    <Swipeable
      onSwipeRight={() => completeTask(task.id)}
      onSwipeLeft={() => deleteTask(task.id)}
      rightActionLabel="Complete"
      leftActionLabel="Delete"
      rightActionColor="#7A9B8E"  // personalGreen
      leftActionColor="#C89B5C"    // urgencyAmber
    >
      <TaskCard task={task} />
    </Swipeable>
  );
}
```

## Platform-Specific Implementations

### Web vs Native

| Feature | Web | Native |
|---------|-----|--------|
| **Haptics** | No-op (not supported) | expo-haptics (iOS/Android) |
| **Voice** | MediaRecorder API + Whisper | expo-av + Whisper |
| **Gestures** | No-op (click/tap only) | react-native-gesture-handler |

### Platform Detection

All platform-specific code uses `.web.tsx` and `.native.tsx` file extensions. Metro bundler automatically selects the correct implementation.

## Dependencies

### Already Installed in Mobile App

- `expo-av` ~16.0.8 (audio recording)
- `expo-haptics` ~15.0.8 (haptic feedback)
- `expo-speech` ~14.0.8 (future: TTS support)
- `react-native-gesture-handler` ~2.28.0 (gestures)
- `react-native-reanimated` ~4.1.1 (smooth animations)

### Required for Transcription

Add to `.env`:
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

## Design Tokens Used

All components follow the ADHD-aware design system:

- **Colors**: workBlue (#6B85A6), personalGreen (#7A9B8E), urgencyAmber (#C89B5C)
- **Typography**: 16px body, 15px small, 500 weight
- **Spacing**: 8px, 12px, 16px, 24px (consistent rhythm)
- **Motion**: 200-400ms duration (calm, not aggressive)
- **Tap Targets**: 44pt minimum (iOS HIG compliance)

## Accessibility

- ✅ Haptic feedback respects user settings (can be disabled)
- ✅ Voice input has clear permission descriptions
- ✅ Gestures include fallback tap actions
- ✅ All interactive elements meet 44pt minimum tap target
- ✅ Color-blind safe (uses labels + colors)
- ✅ Screen reader support via proper ARIA/accessibility labels

## Future Enhancements (Not in Scope)

- **Share Extension**: Share to brain dump from other apps
- **Widgets**: Quick brain dump widget
- **Shortcuts**: Siri/Google Assistant integration
- **3D Touch**: Quick actions from app icon
- **Background Recording**: Continue recording in background

## Testing

### Haptic Feedback
- Test on physical iOS device (simulator doesn't support haptics)
- Test on physical Android device
- Verify user settings are respected
- Verify graceful degradation on web

### Voice Input
- Test microphone permissions flow
- Test hold-to-record pattern
- Test transcription accuracy
- Test error handling (permission denied, transcription failed)
- Test on both iOS and Android

### Gestures
- Test swipe thresholds (100px default)
- Test haptic feedback on swipe completion
- Test visual feedback (action backgrounds)
- Verify no interference with scrolling

## Performance Considerations

- Haptic calls are async but non-blocking
- Voice transcription happens in background (shows processing state)
- Gestures use native thread (react-native-reanimated)
- API endpoint uses Edge Runtime for fast cold starts

## Error Handling

All services include comprehensive error handling:

- **Permission Denied**: Clear user message, option to retry
- **Recording Failed**: Fallback to typing, error logged
- **Transcription Failed**: Retry option, error reported
- **API Errors**: Graceful degradation, user notification

## ADHD-Specific Features

1. **Hold-to-Record Pattern**: Prevents accidental recordings while keeping friction low
2. **Visual State Feedback**: Always shows current state (recording, processing, error)
3. **Haptic Confirmation**: Visceral feedback without demanding attention
4. **One Action Per Gesture**: Swipe right = complete, swipe left = delete (no confusion)
5. **Calm Motion**: 6 bounciness (calm), not 8+ (aggressive)

## Integration with Existing Features

- **Brain Dump**: Add VoiceInput button next to textarea
- **Timeline**: Wrap TaskCard components with Swipeable
- **Settings**: Add haptic feedback and voice input toggles
- **Focus Mode**: Haptic on task completion

## Next Steps

1. Add VoiceInput to BrainDump screen
2. Wrap TaskCard with Swipeable in Timeline
3. Add haptic feedback to all button presses
4. Test on physical devices
5. Add OpenAI API key to environment variables
6. Deploy and test transcription endpoint

---

**Status**: ✅ Epic 8 Complete

All native features implemented with platform abstraction, ADHD-aware design, and comprehensive error handling. Ready for integration into core screens.
