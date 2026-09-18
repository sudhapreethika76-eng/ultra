import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import FrameCanvas from './components/FrameCanvas';
import ScrambleText from './components/ScrambleText';
import DashboardClimax from './components/DashboardClimax';

// 6 SCENE STAGES CONFIG (EXACT REFERENCE VIDEO TEXT ANALYSIS & SEQUENCING)
const STAGES = [
  {
    id: 1,
    progressStart: 0.00,
    progressEnd: 0.17,
    name: 'Origin & Fan Expansion',
    badge: 'CHAIN INTELLIGENCE',
    title: 'Next-Generation Data Infrastructure',
    subtext: 'A scalable infrastructure for analytics, security, and data management in Web3. Build, analyze, and scale blockchain products without limits.',
    ctaPrimary: 'GET STARTED',
    ctaSecondary: 'REQUEST DEMO',
    positionClass: 'pos-right'
  },
  {
    id: 2,
    progressStart: 0.17,
    progressEnd: 0.34,
    name: 'Lateral Sweep & Left Arc',
    badge: 'ABOUT THE PLATFORM',
    title: 'One Platform.\nEndless Data Possibilities.',
    subtext: 'We unify blockchain data, analytics, and security into a single solution — so you can focus on building, not maintaining infrastructure.',
    ctaPrimary: 'EXPLORE PIPELINES',
    ctaSecondary: 'READ SPECS',
    positionClass: 'pos-left-center'
  },
  {
    id: 3,
    progressStart: 0.34,
    progressEnd: 0.50,
    name: 'Planar Laser Compression',
    badge: 'THE PROBLEM',
    title: 'Blockchain Data Is Complex.\nWe Make It Simple.',
    subtext: 'Fragmented sources, slow processing, and difficult integrations are holding Web3 back.',
    ctaPrimary: 'SEE BENCHMARKS',
    ctaSecondary: 'COMPARE INDEXERS',
    positionClass: 'pos-bottom-left'
  },
  {
    id: 4,
    progressStart: 0.50,
    progressEnd: 0.67,
    name: 'Hyperboloid Lattice',
    badge: 'THE SOLUTION',
    title: 'The Future of On-Chain Data Starts Here',
    subtext: 'Interlocking hyperbolic matrix topology routes sub-block signals across decentralized validator nodes with cryptographic consensus.',
    ctaPrimary: 'START BUILDING',
    ctaSecondary: 'ARCHITECTURE PAPER',
    positionClass: 'pos-bottom-center'
  },
  {
    id: 5,
    progressStart: 0.67,
    progressEnd: 0.83,
    name: 'Single Ribbon Coiling',
    badge: 'SYNTHESIS & ROUTING',
    title: 'Unified Topological Stream Mesh',
    subtext: 'Continuous spatial knot routing turns fragmented RPC data into single-pass vector embeddings ready for LLMs and DeFi protocols.',
    ctaPrimary: 'VIEW STREAM API',
    ctaSecondary: 'SDK INTEGRATION',
    positionClass: 'pos-bottom-center'
  },
  {
    id: 6,
    progressStart: 0.83,
    progressEnd: 1.00,
    name: 'Toroidal Singularity & Dashboard Climax',
    badge: 'CLIMAX ANALYTICS',
    title: 'Real-Time Web3 Intelligence Engine',
    subtext: 'Live liquidity monitoring, risk profiling, portfolio yield optimization, and cross-chain execution locked into one unified glass dashboard.',
    ctaPrimary: 'LAUNCH APP',
    ctaSecondary: 'CONNECT WALLET',
    positionClass: 'pos-dashboard'
  }
];

export default function App() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const progressRef = useRef(0.00);
  const targetProgressRef = useRef(0.00);
  const currentStageIdxRef = useRef(0);
  const heroTextRef = useRef(null);

  // GSAP smooth text entry animation on stage transition
  useEffect(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto' }
      );
    }
  }, [currentStageIdx]);

  // Global wheel, touch, and key listeners for ultra-fluid 60fps scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 32; // Line mode
      else if (e.deltaMode === 2) deltaY *= 320; // Page mode

      // Clamp single wheel event delta for ultra-smooth responsiveness across trackpad and mouse wheel
      const clampedDelta = Math.sign(deltaY) * Math.min(Math.abs(deltaY), 120);
      const step = clampedDelta * 0.00028;

      let nextP = targetProgressRef.current + step;
      if (nextP < 0) nextP = 0;
      if (nextP > 1) nextP = 1;
      targetProgressRef.current = nextP;
    };

    let touchStartY = 0;
    let touchLastY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchLastY - touchY;
        touchLastY = touchY;

        let nextP = targetProgressRef.current + deltaY * 0.0012;
        if (nextP < 0) nextP = 0;
        if (nextP > 1) nextP = 1;
        targetProgressRef.current = nextP;
      }
    };

    const handleKeyDown = (e) => {
      let step = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') step = 0.05;
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') step = -0.05;
      else if (e.key === ' ') step = e.shiftKey ? -0.1 : 0.1;
      else if (e.key === 'Home') targetProgressRef.current = 0;
      else if (e.key === 'End') targetProgressRef.current = 1;

      if (step !== 0) {
        e.preventDefault();
        let nextP = targetProgressRef.current + step;
        if (nextP < 0) nextP = 0;
        if (nextP > 1) nextP = 1;
        targetProgressRef.current = nextP;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // GSAP Ticker driven framerate-independent lerp loop
  useEffect(() => {
    let lastTime = performance.now();

    const updateProgress = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const diff = targetProgressRef.current - progressRef.current;
      if (Math.abs(diff) > 0.00001) {
        // Smooth exponential lerp (60fps to 144fps screen adaptive)
        const lerpFactor = 1 - Math.exp(-14 * dt);
        progressRef.current += diff * lerpFactor;

        // Update active stage index only when stage boundaries are crossed
        const currentP = progressRef.current;
        const idx = STAGES.findIndex(s => currentP >= s.progressStart && currentP <= s.progressEnd);
        if (idx !== -1 && idx !== currentStageIdxRef.current) {
          currentStageIdxRef.current = idx;
          setCurrentStageIdx(idx);
        }
      }
    };

    gsap.ticker.add(updateProgress);
    return () => {
      gsap.ticker.remove(updateProgress);
    };
  }, []);

  // GSAP smooth jump transition when clicking nav links
  const jumpToStage = (idx) => {
    const stage = STAGES[idx];
    const targetP = (stage.progressStart + stage.progressEnd) / 2;

    gsap.to(targetProgressRef, {
      current: targetP,
      duration: 0.8,
      ease: 'power3.inOut'
    });
  };

  const activeStage = STAGES[currentStageIdx] || STAGES[0];

  return (
    <div className="obsidian-page-wrapper">
      {/* AMBIENT PURPLE BACK-GLOW */}
      <div className="ambient-backglow" />

      {/* FULL DESKTOP VIEW CONTAINER */}
      <div className="floating-browser-card">
        {/* SIMPLE NAV BAR */}
        <nav className="card-top-nav">
          <div className="nav-brand" onClick={() => jumpToStage(0)}>
            <span className="brand-name">Pegasus</span>
          </div>

          <ul className="card-nav-links">
            <li>
              <button 
                className={`card-nav-item ${currentStageIdx === 0 ? 'active' : ''}`} 
                onClick={() => jumpToStage(0)}
              >
                Product
              </button>
            </li>
            <li>
              <button 
                className={`card-nav-item ${currentStageIdx === 1 ? 'active' : ''}`} 
                onClick={() => jumpToStage(1)}
              >
                Features
              </button>
            </li>
            <li>
              <button 
                className={`card-nav-item ${currentStageIdx === 2 || currentStageIdx === 3 ? 'active' : ''}`} 
                onClick={() => jumpToStage(2)}
              >
                Solutions
              </button>
            </li>
            <li>
              <button 
                className={`card-nav-item ${currentStageIdx >= 4 ? 'active' : ''}`} 
                onClick={() => jumpToStage(4)}
              >
                Pricing
              </button>
            </li>
          </ul>

          <div className="nav-cta-group">
            <button className="pill-cta-btn" onClick={() => jumpToStage(5)}>
              Get Started
            </button>
          </div>
        </nav>

        {/* FRAME CANVAS VIEWPORT CONTAINER */}
        <div className="card-viewport-container">
          <FrameCanvas progressRef={progressRef} />

          {/* DYNAMIC TEXT OVERLAYS BASED ON TEXT ANALYSIS */}
          <div className={`card-stage-overlay ${activeStage.positionClass}`}>
            {currentStageIdx < 5 && (
              <div className="card-hero-text" ref={heroTextRef}>
                <div className="hero-badge-pill">
                  <span className="badge-pulse-dot" />
                  <ScrambleText text={`[${activeStage.badge}]`} key={`badge-${activeStage.id}`} />
                </div>

                <h1 className="card-hero-heading">
                  <ScrambleText text={activeStage.title} key={`title-${activeStage.id}`} />
                </h1>

                <p className="card-hero-subtext">
                  {activeStage.subtext}
                </p>

                <div className="hero-button-group">
                  <button className="btn-solid-white" onClick={() => jumpToStage((currentStageIdx + 1) % 6)}>
                    <span>{activeStage.ctaPrimary}</span>
                  </button>
                  <button className="btn-glass-outline" onClick={() => jumpToStage(5)}>
                    <span>{activeStage.ctaSecondary}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 6: WEB3 SAAS DASHBOARD CLIMAX */}
            {currentStageIdx === 5 && (
              <div className="card-dashboard-wrapper">
                <DashboardClimax />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

