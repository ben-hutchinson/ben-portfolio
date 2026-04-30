import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FooterBar } from './components/FooterBar';
import { PanelTabs } from './components/PanelTabs';
import { CharacterRoster } from './features/character-select/CharacterRoster';
import { CharacterViewer } from './features/character-viewer/CharacterViewer';
import { AudioManager } from './features/audio/AudioManager';
import { IntroScreen } from './features/intro/IntroScreen';
import { LoadingScreen } from './features/intro/LoadingScreen';
import { MissionRunner } from './features/mission-runner/MissionRunner';
import { ContentPanel } from './features/panels/ContentPanel';
import { characters, defaultCharacterId } from './data/characters';
import { projects } from './data/projects';
import { sections } from './data/sections';
import { skillCategories } from './data/skills';
import { timelineEvents } from './data/timeline';
import type { SectionId } from './data/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { cvAssetPath } from './utils/assets';
import styles from './App.module.css';

type AppStage = 'intro' | 'loading' | 'main' | 'missionLoading' | 'mission';

const LOADING_DURATION_MS = 1800;
const MISSION_LOADING_DURATION_MS = 1200;

const App = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const [skipIntro, setSkipIntro] = useLocalStorage<boolean>('portfolio.skipIntro', false);
  const [isMuted, setIsMuted] = useLocalStorage<boolean>('portfolio.muted', true);
  const [stage, setStage] = useState<AppStage>(skipIntro ? 'main' : 'intro');
  const [selectedCharacterId, setSelectedCharacterId] =
    useState<(typeof characters)[number]['id']>(defaultCharacterId);
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (stage !== 'loading' && stage !== 'missionLoading') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStage(stage === 'loading' ? 'main' : 'mission');
    }, stage === 'loading' ? LOADING_DURATION_MS : MISSION_LOADING_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [stage]);

  const selectedCharacter = useMemo(() => {
    return characters.find((character) => character.id === selectedCharacterId) ?? characters[0];
  }, [selectedCharacterId]);

  const beginExperience = (rememberSkip: boolean) => {
    setSkipIntro(rememberSkip);
    setStage('loading');
  };

  const startMission = () => {
    setStage('missionLoading');
  };

  const exitMission = () => {
    setStage('main');
  };

  const toggleMute = () => {
    setIsMuted((currentState) => !currentState);
  };

  useEffect(() => {
    const appElement = appRef.current;

    if (!appElement) {
      return;
    }

    appElement.style.setProperty('--parallax-x', '0');
    appElement.style.setProperty('--parallax-y', '0');

    if (prefersReducedMotion) {
      return;
    }

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;

    const applyParallax = () => {
      rafId = 0;
      appElement.style.setProperty('--parallax-x', nextX.toFixed(4));
      appElement.style.setProperty('--parallax-y', nextY.toFixed(4));
    };

    const onPointerMove = (event: PointerEvent) => {
      nextX = event.clientX / window.innerWidth - 0.5;
      nextY = event.clientY / window.innerHeight - 0.5;

      if (rafId === 0) {
        rafId = window.requestAnimationFrame(applyParallax);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);

      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div className={styles.app} ref={appRef}>
      <div className={styles.backgroundLayer} aria-hidden="true" />
      <div className={styles.backgroundLayerMid} aria-hidden="true" />
      <div className={styles.backgroundLayerFront} aria-hidden="true" />

      <AudioManager enabled={stage === 'main' || stage === 'mission'} muted={isMuted} />

      <div className={styles.mainContent}>
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              className={styles.stageContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
            >
              <IntroScreen onStart={beginExperience} initialRememberSkip={skipIntro} />
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div
              key="loading"
              className={styles.stageContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
            >
              <LoadingScreen durationMs={LOADING_DURATION_MS} reducedMotion={prefersReducedMotion} />
            </motion.div>
          )}

          {stage === 'missionLoading' && (
            <motion.div
              key="mission-loading"
              className={styles.stageContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
            >
              <LoadingScreen
                durationMs={MISSION_LOADING_DURATION_MS}
                reducedMotion={prefersReducedMotion}
                title={`Loading ${selectedCharacter.name}'s Mission...`}
              />
            </motion.div>
          )}

          {stage === 'main' && (
            <motion.main
              key="main"
              className={styles.gameScreen}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', damping: 20, stiffness: 210, mass: 0.95 }
              }
              aria-label="Character select portfolio"
            >
              <header className={styles.screenHeader}>
                <h1 className={styles.screenTitle}>BEN PORTFOLIO: CHARACTER SELECT</h1>
                <div className={styles.screenActions}>
                  <p className={styles.screenMeta}>
                    Selected: <span>{selectedCharacter.name}</span> · Section:{' '}
                    <span>{selectedCharacter.panelLabels[activeSection]}</span>
                  </p>
                  <button type="button" className={styles.startMissionButton} onClick={startMission}>
                    Start Mission
                  </button>
                </div>
              </header>

              <section className={styles.layoutFrame}>
                <aside className={styles.rosterTop} aria-label="Character roster panel">
                  <CharacterRoster
                    characters={characters}
                    selectedCharacterId={selectedCharacter.id}
                    onSelectCharacter={setSelectedCharacterId}
                  />
                </aside>

                <section className={styles.bodyGrid}>
                  <section className={styles.viewerColumn} aria-label="Character viewer panel">
                    <CharacterViewer character={selectedCharacter} reducedMotion={prefersReducedMotion} />
                  </section>

                  <section className={styles.panelColumn} aria-label="Content panel">
                    <PanelTabs
                      sections={sections}
                      activeSection={activeSection}
                      onSelectSection={setActiveSection}
                    />
                    <ContentPanel
                      selectedCharacter={selectedCharacter}
                      activeSection={activeSection}
                      timelineEvents={timelineEvents}
                      skillCategories={skillCategories}
                      projects={projects}
                      reducedMotion={prefersReducedMotion}
                    />
                  </section>
                </section>
              </section>
            </motion.main>
          )}

          {stage === 'mission' && (
            <motion.div
              key="mission"
              className={`${styles.stageContainer} ${styles.missionStage}`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', damping: 20, stiffness: 210, mass: 0.95 }
              }
            >
              <MissionRunner
                character={selectedCharacter}
                reducedMotion={prefersReducedMotion}
                onExit={exitMission}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBar
        muted={isMuted}
        onToggleMute={toggleMute}
        cvHref={cvAssetPath('ben-hutchinson-cv.pdf')}
      />
    </div>
  );
};

export default App;
