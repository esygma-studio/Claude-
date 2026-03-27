import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, from: 0, to: 1 });
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [30, 60], [20, 0], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });

  const dot1 = spring({ frame, fps, config: { stiffness: 200, damping: 12 }, from: 0, to: 1, delay: 10 });
  const dot2 = spring({ frame, fps, config: { stiffness: 200, damping: 12 }, from: 0, to: 1, delay: 20 });
  const dot3 = spring({ frame, fps, config: { stiffness: 200, damping: 12 }, from: 0, to: 1, delay: 30 });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {/* Animated background dots */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => {
          const pulse = interpolate(
            frame % 60,
            [0, 30, 60],
            [0.3, 0.6, 0.3],
          );
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i * 37 + 10) % 100}%`,
                top: `${(i * 53 + 5) % 100}%`,
                width: 4 + (i % 4) * 3,
                height: 4 + (i % 4) * 3,
                borderRadius: '50%',
                background: `rgba(139, 92, 246, ${pulse * 0.4})`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Skill badge */}
      <div style={{ transform: `scale(${dot1})`, marginBottom: 24 }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.5)',
          borderRadius: 999,
          padding: '8px 24px',
          color: '#a78bfa',
          fontSize: 22,
          fontFamily: 'monospace',
          letterSpacing: 3,
        }}>
          /remotion
        </div>
      </div>

      {/* Main title */}
      <div style={{ transform: `scale(${titleScale})`, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 120,
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'sans-serif',
          lineHeight: 1,
          letterSpacing: -2,
        }}>
          Remotion
        </h1>
        <h2 style={{
          fontSize: 48,
          fontWeight: 700,
          margin: '8px 0 0',
          color: 'white',
          fontFamily: 'sans-serif',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}>
          Skill
        </h2>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        {[dot1, dot2, dot3].map((s, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: '#a78bfa', transform: `scale(${s})` }} />
        ))}
      </div>

      {/* Tagline */}
      <p style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: 28,
        fontFamily: 'sans-serif',
        marginTop: 32,
        opacity: taglineOpacity,
      }}>
        Create videos programmatically with React
      </p>
    </AbsoluteFill>
  );
};
