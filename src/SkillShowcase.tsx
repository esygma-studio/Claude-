import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Scene1Intro } from './components/Scene1Intro';
import { Scene2Code } from './components/Scene2Code';
import { Scene3Features } from './components/Scene3Features';
import { Scene4Demo } from './components/Scene4Demo';
import { Scene5Outro } from './components/Scene5Outro';

// 20 seconds at 30fps = 600 frames total
// Scene timings:
//   Scene 1 - Intro:    0-150   (5s)
//   Scene 2 - Code:     150-270 (4s)
//   Scene 3 - Features: 270-420 (5s)
//   Scene 4 - Demo:     420-510 (3s)
//   Scene 5 - Outro:    510-600 (3s)

export const SkillShowcase: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={150} name="Intro">
          <Scene1Intro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120} name="Code">
          <Scene2Code />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150} name="Features">
          <Scene3Features />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90} name="Live Demo">
          <Scene4Demo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90} name="Outro">
          <Scene5Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
