import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const FEATURES = [
  { icon: '🎬', title: 'interpolate()', desc: 'Map frames to any value — opacity, position, color, scale', color: '#f59e0b' },
  { icon: '🌊', title: 'spring()', desc: 'Physics-based animations with natural bounce and damping', color: '#34d399' },
  { icon: '⏱️', title: '<Sequence>', desc: 'Layer and time-shift components like an NLE timeline', color: '#60a5fa' },
  { icon: '🎵', title: '<Audio> & <Video>', desc: 'Embed media with frame-perfect sync', color: '#f472b6' },
  { icon: '☁️', title: 'Render anywhere', desc: 'CLI, Node.js API, or serverless with @remotion/lambda', color: '#a78bfa' },
  { icon: '🧩', title: 'Zod Props', desc: 'Type-safe, editable props in the Remotion Studio UI', color: '#fb923c' },
];

const FeatureCard: React.FC<{ feature: typeof FEATURES[0]; delay: number }> = ({ feature, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { stiffness: 160, damping: 16 }, from: 0, to: 1, delay });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      transform: `scale(${scale})`,
      opacity,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${feature.color}40`,
      borderRadius: 16,
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ fontSize: 36 }}>{feature.icon}</div>
      <div style={{ color: feature.color, fontFamily: 'monospace', fontSize: 22, fontWeight: 700 }}>{feature.title}</div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif', fontSize: 18, lineHeight: 1.4 }}>{feature.desc}</div>
    </div>
  );
};

export const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const headerY = interpolate(frame, [0, 20], [-30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(160deg, #0a0a1a 0%, #111827 100%)',
      padding: '50px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 36,
    }}>
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, textAlign: 'center' }}>
        <div style={{ color: '#a78bfa', fontSize: 18, fontFamily: 'monospace', letterSpacing: 4, marginBottom: 8 }}>
          WHAT THE SKILL UNLOCKS
        </div>
        <h2 style={{ color: 'white', fontSize: 52, margin: 0, fontFamily: 'sans-serif', fontWeight: 800 }}>
          Powerful APIs, zero effort
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, flex: 1 }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} delay={i * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
