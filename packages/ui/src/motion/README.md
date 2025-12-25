# Motion System

Calm, purposeful animations for Luma Now that respect ADHD-friendly design principles.

## Philosophy

- **Calm Computing**: Animations should feel intentional, not demanding
- **Accessibility First**: Always respect `prefers-reduced-motion`
- **Calm Duration Range**: 150-400ms (no aggressive fast animations)
- **No Bounce**: Predictable, gentle easing only
- **Purposeful Motion**: Every animation serves a clear purpose

## Components

### Motion Primitives

Platform-agnostic animation components that work on both web and native.

#### FadeIn / FadeOut

Gentle opacity animations.

```tsx
import { FadeIn, FadeOut } from '@multi-platform-app/ui';

// Basic usage
<FadeIn>
  <div>Content fades in</div>
</FadeIn>

// Custom duration
<FadeIn duration={400}>
  <div>Slower fade</div>
</FadeIn>

// Custom opacity range
<FadeIn from={0.5} to={1}>
  <div>Fades from 50% to 100%</div>
</FadeIn>
```

#### SlideIn / SlideOut

Directional entrance/exit animations.

```tsx
import { SlideIn, SlideOut } from '@multi-platform-app/ui';

// Slide in from bottom (default)
<SlideIn direction="up">
  <div>Slides up</div>
</SlideIn>

// Slide in from top
<SlideIn direction="down" distance={24}>
  <div>Slides down 24px</div>
</SlideIn>

// Slide in from sides
<SlideIn direction="left">
  <div>Slides from left</div>
</SlideIn>
```

#### ScaleIn / ScaleOut

Subtle grow/shrink animations.

```tsx
import { ScaleIn, ScaleOut } from '@multi-platform-app/ui';

// Basic scale in
<ScaleIn>
  <button>Button scales in</button>
</ScaleIn>

// Custom scale range
<ScaleIn from={0.9} to={1}>
  <div>More pronounced scale</div>
</ScaleIn>
```

#### Collapse

Height animation for showing/hiding content.

```tsx
import { Collapse } from '@multi-platform-app/ui';
import { useState } from 'react';

function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle
      </button>
      <Collapse isOpen={isOpen}>
        <div>Collapsible content</div>
      </Collapse>
    </>
  );
}
```

#### AnimatedPresence

Handles enter/exit animations for conditionally rendered content.

```tsx
import { AnimatedPresence, FadeIn } from '@multi-platform-app/ui';

function ConditionalContent({ show }) {
  return (
    <AnimatedPresence>
      {show && (
        <FadeIn>
          <div>Appears and disappears smoothly</div>
        </FadeIn>
      )}
    </AnimatedPresence>
  );
}
```

### ProcessingDots

ADHD-friendly loading indicator - 3 animated dots, not a spinner.

```tsx
import { ProcessingDots, ProcessingText } from '@multi-platform-app/ui';

// Basic dots
<ProcessingDots />

// Custom styling
<ProcessingDots
  color="#6B85A6"
  size={10}
  spacing={8}
/>

// Text with dots
<ProcessingText text="Loading" />
```

## Hooks

### useReducedMotion

Detect if user prefers reduced motion.

```tsx
import { useReducedMotion } from '@multi-platform-app/ui';

function MyComponent() {
  const shouldReduce = useReducedMotion();

  return (
    <div className={shouldReduce ? 'no-animation' : 'with-animation'}>
      Content
    </div>
  );
}
```

### useAnimationDuration

Get adjusted animation duration based on reduced motion preference.

```tsx
import { useAnimationDuration } from '@multi-platform-app/ui';

function MyComponent() {
  const duration = useAnimationDuration(300); // Returns 0 if reduced motion

  return <div style={{ transitionDuration: `${duration}ms` }}>Content</div>;
}
```

### useShouldAnimate

Simple boolean for whether animations should play.

```tsx
import { useShouldAnimate } from '@multi-platform-app/ui';

function MyComponent() {
  const shouldAnimate = useShouldAnimate();

  return shouldAnimate ? (
    <FadeIn>Content</FadeIn>
  ) : (
    <div>Content</div>
  );
}
```

## Motion Presets

Pre-configured animation settings for common patterns.

```tsx
import { SlideIn, motionPresets } from '@multi-platform-app/ui';

// Use a preset
<SlideIn {...motionPresets.slideInUp}>
  <div>Slides up with preset config</div>
</SlideIn>
```

Available presets:
- `fadeIn` / `fadeOut`
- `slideInUp` / `slideInDown` / `slideInLeft` / `slideInRight`
- `scaleIn` / `scaleOut`
- `collapse` / `expand`

## Tokens

Access motion tokens directly for custom animations.

```tsx
import { duration, easing, cssEasing } from '@multi-platform-app/ui';

// Duration tokens
duration.fast    // 150ms
duration.normal  // 250ms
duration.slow    // 400ms

// Easing arrays (for Reanimated/Framer)
easing.calm     // [0.25, 0.1, 0.25, 1.0]
easing.gentle   // [0.4, 0.0, 0.2, 1.0]

// CSS easing strings
cssEasing.calm    // "cubic-bezier(0.25, 0.1, 0.25, 1.0)"
cssEasing.gentle  // "cubic-bezier(0.4, 0.0, 0.2, 1.0)"
```

## Platform Implementation

The motion system uses:
- **Web**: Framer Motion
- **Native**: React Native Reanimated 2

Platform-specific implementations are automatic - just import and use the components.

## Accessibility

All motion components:
- ✅ Respect `prefers-reduced-motion` system setting
- ✅ Provide instant transitions when motion is reduced
- ✅ Include proper ARIA labels where needed
- ✅ Work without JavaScript (graceful degradation)

## Best Practices

### DO ✅

- Use motion to provide feedback and guide attention
- Keep animations in the 150-400ms range
- Respect reduced motion preferences
- Use fade over slide when possible (less aggressive)
- Provide purpose for every animation

### DON'T ❌

- Create bouncing or spring animations
- Use animations longer than 400ms
- Animate continuously without user interaction
- Use parallax effects
- Animate just because you can

## Examples

### Card entrance animation

```tsx
import { FadeIn, motionPresets } from '@multi-platform-app/ui';

function TaskCard({ task }) {
  return (
    <FadeIn {...motionPresets.fadeIn}>
      <div className="task-card">
        {task.title}
      </div>
    </FadeIn>
  );
}
```

### Modal animation

```tsx
import { SlideIn, AnimatedPresence } from '@multi-platform-app/ui';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatedPresence>
      {isOpen && (
        <SlideIn direction="up" distance={20}>
          <div className="modal">
            {children}
            <button onClick={onClose}>Close</button>
          </div>
        </SlideIn>
      )}
    </AnimatedPresence>
  );
}
```

### Loading state

```tsx
import { ProcessingText } from '@multi-platform-app/ui';

function LoadingButton({ isLoading, onClick, children }) {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <ProcessingText text="Saving" />
      ) : (
        children
      )}
    </button>
  );
}
```

## Design Rationale

This motion system follows Dieter Rams' principle "As little design as possible" and the ADHD-friendly design tenet of "Calm Computing":

1. **Gentle durations** (150-400ms) prevent stress and urgency
2. **No bounce** creates predictability and calm
3. **Reduced motion support** respects neurological differences
4. **Purposeful motion** serves function, not decoration
5. **Consistent patterns** reduce cognitive load

The goal: Technology that serves, doesn't demand.
