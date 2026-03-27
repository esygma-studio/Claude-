---
name: remotion
description: Build, scaffold, and iterate on Remotion video projects using React and TypeScript. Use when the user wants to create programmatic videos, animate React components, set up a Remotion project, render videos, or work with Remotion's animation APIs (interpolate, spring, Sequence, Composition).
---

# Remotion Skill

Remotion lets you create videos programmatically with React. You write React components that describe each frame, and Remotion renders them into MP4/WebM files.

## Workflow

Make a todo list and work through the tasks one at a time.

### 1. Understand the Goal

Ask (or infer) what kind of video the user wants:
- New project setup or adding to existing project?
- Video type: animation, data visualization, presentation, explainer, social media clip?
- Dimensions: landscape (1920×1080), square (1080×1080), portrait (1080×1920)?
- Duration and FPS (default: 30fps)
- Any specific assets: images, audio, fonts?

### 2. Project Setup

**New project:**
```bash
npx create-video@latest
# Choose a template: Hello World, Blank, React Three Fiber, etc.
cd my-video
npm run dev   # Opens Remotion Studio at http://localhost:3000
```

**Add to existing project:**
```bash
npm install remotion @remotion/cli
npx remotion init
```

**Key files after setup:**
```
src/
  Root.tsx          # Registers all compositions via registerRoot()
  MyVideo.tsx       # Your main composition component
  index.ts          # Entry point
remotion.config.ts  # Remotion configuration
```

### 3. Core Concepts

#### registerRoot & Composition

`Root.tsx` registers every video you want to render:

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}   // 5 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: 'Hello World' }}
      />
    </>
  );
};
```

Then in `index.ts`:
```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
registerRoot(RemotionRoot);
```

#### useCurrentFrame & useVideoConfig

Every animation is driven by the current frame number:

```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();         // 0-indexed frame number
  const { fps, durationInFrames, width, height } = useVideoConfig();

  return <div>Frame: {frame}</div>;
};
```

#### interpolate — Map frames to values

```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

// Fade in over first 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',  // Don't go above 1 after frame 30
});

// Move left-to-right across the screen
const x = interpolate(frame, [0, 90], [0, 1280], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// With easing
import { Easing } from 'remotion';
const eased = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  extrapolateRight: 'clamp',
});
```

#### spring — Physics-based animation

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Bouncy scale-in animation
const scale = spring({
  frame,
  fps,
  config: {
    stiffness: 200,   // Higher = snappier
    damping: 20,      // Higher = less bounce
    mass: 1,
  },
  from: 0,
  to: 1,
  delay: 10,          // Start after 10 frames
});
```

#### Sequence — Compose timing layers

`<Sequence>` shifts the time context for its children. `useCurrentFrame()` inside returns frames relative to the sequence start:

```tsx
import { Sequence } from 'remotion';

export const MyVideo: React.FC = () => {
  return (
    <div style={{ flex: 1 }}>
      {/* Title appears from frame 0, lasts 60 frames */}
      <Sequence from={0} durationInFrames={60} name="Title">
        <Title />
      </Sequence>

      {/* Body appears at frame 30 (overlaps with title) */}
      <Sequence from={30} durationInFrames={90} name="Body">
        <Body />
      </Sequence>

      {/* Outro starts at frame 90 */}
      <Sequence from={90} durationInFrames={60} name="Outro">
        <Outro />
      </Sequence>
    </div>
  );
};
```

#### AbsoluteFill — Full-size overlay

```tsx
import { AbsoluteFill } from 'remotion';

// Stacks children as full-size layers (like CSS position:absolute, inset:0)
<AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
  <BackgroundLayer />
</AbsoluteFill>
<AbsoluteFill>
  <ForegroundContent />
</AbsoluteFill>
```

#### Series — Sequential clips

```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={40}><Intro /></Series.Sequence>
  <Series.Sequence durationInFrames={80}><Main /></Series.Sequence>
  <Series.Sequence durationInFrames={40}><Outro /></Series.Sequence>
</Series>
```

### 4. Common Animation Patterns

#### Fade In / Out

```tsx
const fadeIn = (frame: number, startFrame: number, duration: number) =>
  interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const fadeOut = (frame: number, endFrame: number, duration: number) =>
  interpolate(frame, [endFrame - duration, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
```

#### Slide In from Left

```tsx
const slideX = interpolate(frame, [0, 30], [-200, 0], {
  easing: Easing.out(Easing.cubic),
  extrapolateRight: 'clamp',
});

<div style={{ transform: `translateX(${slideX}px)` }}>Hello</div>
```

#### Text Character-by-Character Reveal

```tsx
const text = "Hello Remotion";
const charsToShow = Math.floor(interpolate(frame, [0, 60], [0, text.length], {
  extrapolateRight: 'clamp',
}));

<span>{text.slice(0, charsToShow)}</span>
```

#### Counter / Number Animation

```tsx
const count = Math.round(interpolate(frame, [0, 90], [0, 100], {
  extrapolateRight: 'clamp',
}));

<h1>{count}%</h1>
```

### 5. Audio & Video Assets

```tsx
import { Audio, Video, Img, staticFile } from 'remotion';

// Audio (place files in public/)
<Audio src={staticFile('music.mp3')} volume={0.5} />

// Video clip (with timing)
<Video src={staticFile('clip.mp4')} startFrom={30} endAt={90} />

// Image
<Img src={staticFile('logo.png')} style={{ width: 200 }} />
```

### 6. Rendering

**Via Remotion Studio UI:**
1. Run `npm run dev`
2. Click "Render" in the top-right
3. Choose codec, quality, output path

**Via CLI:**
```bash
npx remotion render src/index.ts MyVideo out/video.mp4

# Render a still (single frame)
npx remotion still src/index.ts MyVideo --frame=30 out/still.png

# With options
npx remotion render src/index.ts MyVideo out/video.mp4 \
  --codec=h264 \
  --crf=18 \
  --frames=0-60
```

**Via Node.js API (@remotion/renderer):**
```ts
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const bundled = await bundle({ entryPoint: './src/index.ts' });

const composition = await selectComposition({
  serveUrl: bundled,
  id: 'MyVideo',
});

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
});
```

### 7. TypeScript Props with Zod

Remotion supports typed, validated props via Zod (enables editing props in the Studio UI):

```tsx
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

const schema = z.object({
  title: z.string(),
  accentColor: zColor(),
  durationInSeconds: z.number().min(1).max(60),
});

type Props = z.infer<typeof schema>;

export const MyVideo: React.FC<Props> = ({ title, accentColor }) => {
  // ...
};

// In Root.tsx:
<Composition
  id="MyVideo"
  component={MyVideo}
  schema={schema}
  defaultProps={{ title: 'Hello', accentColor: '#06b6d4', durationInSeconds: 5 }}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

### 8. @remotion/player — Embed in React Apps

```tsx
import { Player } from '@remotion/player';
import { MyVideo } from './MyVideo';

<Player
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  compositionWidth={1920}
  compositionHeight={1080}
  style={{ width: '100%' }}
  controls
  autoPlay
  loop
/>
```

### 9. Best Practices

- **Pure rendering**: Components must be deterministic — given the same frame, always produce the same output. No `Math.random()`, `Date.now()`, or async side effects during render.
- **`delayRender` / `continueRender`**: For async data fetching (e.g., fonts, remote images), use these to pause rendering until data is ready.
- **`prefetch`**: Preload assets before they appear to avoid frame drops.
- **Avoid layout thrashing**: Keep styles as inline objects, avoid CSS transitions (use `interpolate` instead).
- **`staticFile()`**: Always use this for assets in `public/` — it handles path differences between dev and production.
- **Frame math**: `durationInFrames = seconds * fps`. Use `useVideoConfig().fps` rather than hardcoding.

### 10. Quick Reference

| Task | Code |
|------|------|
| Get current frame | `const frame = useCurrentFrame()` |
| Get video metadata | `const { fps, width, height, durationInFrames } = useVideoConfig()` |
| Linear animation | `interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })` |
| Spring animation | `spring({ frame, fps, config: { stiffness: 200 } })` |
| Delay a clip | `<Sequence from={60}>` |
| Sequential clips | `<Series>` |
| Full-size layer | `<AbsoluteFill>` |
| Audio track | `<Audio src={staticFile('file.mp3')} />` |
| Render video | `npx remotion render src/index.ts MyVideo out/video.mp4` |
| Open Studio | `npm run dev` |

## Resources

- Docs: https://www.remotion.dev/docs
- Examples/Templates: https://www.remotion.dev/templates
- GitHub: https://github.com/remotion-dev/remotion
- Discord: https://remotion.dev/discord
