import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

const CODE = `import { useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame, [0, 30], [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div style={{ opacity }}>
      Hello, Remotion!
    </div>
  );
};`;

export const Scene2Code: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const headerY = interpolate(frame, [0, 20], [-30, 0], { extrapolateRight: 'clamp' });

  const totalChars = CODE.length;
  const charsToShow = Math.floor(interpolate(frame, [15, 90], [0, totalChars], { extrapolateRight: 'clamp' }));
  const codeOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

  const cursorBlink = frame % 20 < 10 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px' }}>
      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 48, textAlign: 'center' }}>
        <div style={{ color: '#a78bfa', fontSize: 20, fontFamily: 'monospace', letterSpacing: 4, marginBottom: 12 }}>
          WRITE REACT · GET VIDEO
        </div>
        <h2 style={{ color: 'white', fontSize: 52, margin: 0, fontFamily: 'sans-serif', fontWeight: 800 }}>
          Just write a component
        </h2>
      </div>

      {/* Code block */}
      <div style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 16,
        padding: '32px 40px',
        width: '100%',
        maxWidth: 900,
        opacity: codeOpacity,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: 14, marginLeft: 12 }}>MyVideo.tsx</span>
        </div>
        <pre style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 22,
          lineHeight: 1.7,
          color: '#e6edf3',
          whiteSpace: 'pre-wrap',
        }}>
          <code>
            {CODE.slice(0, charsToShow)
              .split('\n')
              .map((line, i) => {
                const colored = line
                  .replace(/(import|from|export|const|return)/g, '<kw>$1</kw>')
                  .replace(/('remotion'|'MyVideo')/g, '<str>$1</str>');
                return (
                  <span key={i}>
                    {line
                      .replace(/\b(import|from|export|const|return)\b/g, '§KW§$1§END§')
                      .replace(/'([^']+)'/g, '§STR§\'$1\'§END§')
                      .split('§')
                      .map((part, j) => {
                        if (part.startsWith('KW§')) return <span key={j} style={{ color: '#ff7b72' }}>{part.slice(3)}</span>;
                        if (part.startsWith('STR§')) return <span key={j} style={{ color: '#a5d6ff' }}>{part.slice(4)}</span>;
                        if (part === 'END§') return null;
                        return <span key={j}>{part}</span>;
                      })
                    }
                    {'\n'}
                  </span>
                );
              })}
            <span style={{ opacity: cursorBlink, background: '#a78bfa', width: 12, height: '1.2em', display: 'inline-block', verticalAlign: 'text-bottom' }} />
          </code>
        </pre>
      </div>
    </AbsoluteFill>
  );
};
