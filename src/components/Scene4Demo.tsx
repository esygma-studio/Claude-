import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const Bar: React.FC<{ label: string; targetPct: number; color: string; delay: number }> = ({ label, targetPct, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const width = spring({ frame, fps, config: { stiffness: 80, damping: 18 }, from: 0, to: targetPct, delay });
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' });
  const value = Math.round(width);

  return (
    <div style={{ opacity, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontFamily: 'sans-serif', fontSize: 20 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 20, overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, height: '100%', background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: 8, transition: 'none' }} />
      </div>
    </div>
  );
};

export const Scene4Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Animated ball using spring + interpolate
  const ballX = interpolate(frame, [0, 90], [0, 600], { extrapolateRight: 'clamp', easing: (t) => t });
  const ballBounceY = Math.abs(Math.sin(frame * 0.15)) * -80;
  const ballColor = `hsl(${interpolate(frame, [0, 90], [260, 160], { extrapolateRight: 'clamp' })}, 80%, 65%)`;
  const ballScale = spring({ frame, fps, config: { stiffness: 300, damping: 10 }, from: 0.5, to: 1 });

  // Rotating ring
  const rotation = interpolate(frame, [0, 90], [0, 360], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0d0221, #1a0533, #0d0221)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 100px',
      gap: 60,
    }}>
      <div style={{ opacity: headerOpacity, textAlign: 'center' }}>
        <div style={{ color: '#34d399', fontSize: 18, fontFamily: 'monospace', letterSpacing: 4, marginBottom: 8 }}>LIVE ANIMATION DEMO</div>
        <h2 style={{ color: 'white', fontSize: 52, margin: 0, fontFamily: 'sans-serif', fontWeight: 800 }}>
          Everything reacts to the frame
        </h2>
      </div>

      {/* Animated ball demo */}
      <div style={{ width: '100%', height: 120, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: ballX,
          top: 40 + ballBounceY,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: ballColor,
          transform: `scale(${ballScale})`,
          boxShadow: `0 0 30px ${ballColor}80`,
        }} />
        {/* Shadow */}
        <div style={{
          position: 'absolute',
          left: ballX + 10,
          bottom: 0,
          width: 40,
          height: 10,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)',
          transform: `scaleX(${1 + Math.abs(ballBounceY) / 200})`,
        }} />
      </div>

      {/* Spinning ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div style={{
          width: 120, height: 120,
          border: '4px solid transparent',
          borderTopColor: '#a78bfa',
          borderRightColor: '#60a5fa',
          borderRadius: '50%',
          transform: `rotate(${rotation}deg)`,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'monospace', fontSize: 14,
        }}>
          {Math.round(frame)}f
        </div>
      </div>

      {/* Data bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Bar label="interpolate" targetPct={92} color="#f59e0b" delay={10} />
        <Bar label="spring" targetPct={87} color="#34d399" delay={18} />
        <Bar label="Sequence" targetPct={95} color="#60a5fa" delay={26} />
      </div>
    </AbsoluteFill>
  );
};
