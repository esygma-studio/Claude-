import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({ frame, fps, config: { stiffness: 180, damping: 14 }, from: 0, to: 1, delay: 5 });
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const titleScale = spring({ frame, fps, config: { stiffness: 120, damping: 20 }, from: 0.7, to: 1, delay: 20 });

  const cmd1Opacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });
  const cmd1Y = interpolate(frame, [45, 65], [20, 0], { extrapolateRight: 'clamp' });
  const cmd2Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' });
  const cmd2Y = interpolate(frame, [60, 80], [20, 0], { extrapolateRight: 'clamp' });

  const glowPulse = interpolate(frame % 60, [0, 30, 60], [0.4, 1, 0.4]);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
    }}>
      {/* Glow background */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(139,92,246,${glowPulse * 0.15}) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Check badge */}
      <div style={{ transform: `scale(${checkScale})` }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6d28d9, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 56,
          boxShadow: `0 0 60px rgba(139,92,246,${glowPulse * 0.8})`,
        }}>
          ✓
        </div>
      </div>

      {/* Ready message */}
      <div style={{ opacity: titleOpacity, transform: `scale(${titleScale})`, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 90,
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'sans-serif',
          lineHeight: 1,
        }}>
          Skill is Ready.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 30, fontFamily: 'sans-serif', margin: '16px 0 0' }}>
          Start building videos with React today
        </p>
      </div>

      {/* Commands */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ opacity: cmd1Opacity, transform: `translateY(${cmd1Y}px)` }}>
          <code style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: 10,
            padding: '12px 28px',
            color: '#a78bfa',
            fontSize: 26,
            fontFamily: 'monospace',
          }}>
            /remotion
          </code>
        </div>
        <div style={{ opacity: cmd2Opacity, transform: `translateY(${cmd2Y}px)` }}>
          <code style={{
            background: 'rgba(96,165,250,0.1)',
            border: '1px solid rgba(96,165,250,0.3)',
            borderRadius: 10,
            padding: '12px 28px',
            color: '#60a5fa',
            fontSize: 22,
            fontFamily: 'monospace',
          }}>
            npx create-video@latest
          </code>
        </div>
      </div>
    </AbsoluteFill>
  );
};
