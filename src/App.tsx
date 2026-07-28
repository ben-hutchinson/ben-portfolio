import { LazyMotion, domAnimation } from 'framer-motion';
import { useState } from 'react';
import { TooltipProvider } from './components/ui/tooltip';
import { buildCrewMembers, characters } from './data/characters';
import { projects } from './data/projects';
import { timelineEvents } from './data/timeline';
import { CommandFooter } from './features/command-footer/CommandFooter';
import { CrewSection } from './features/crew/CrewSection';
import { ExperienceTimeline } from './features/experience/ExperienceTimeline';
import { HeroSection } from './features/hero/HeroSection';
import { MissionLogsSection } from './features/mission-logs/MissionLogsSection';
import { CommandNav } from './features/navigation/CommandNav';
import { ProofStrip } from './features/proof-strip/ProofStrip';
import { SystemsTopology } from './features/systems-topology/SystemsTopology';
import { TrainingDialog } from './features/training/TrainingDialog';
import { TrainingModule } from './features/training/TrainingModule';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import styles from './App.module.css';

const App = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [trainingOpen, setTrainingOpen] = useState(false);
  const crewMembers = buildCrewMembers(characters);

  return (
    <LazyMotion features={domAnimation} strict>
      <TooltipProvider delayDuration={150}>
        <div className={styles.app} data-reduced-motion={prefersReducedMotion}>
          <div className={styles.backgroundLayer} aria-hidden="true" />
          <div className={styles.backgroundLayerMid} aria-hidden="true" />
          <div className={styles.backgroundLayerFront} aria-hidden="true" />
          <CommandNav />
          <main className={styles.main}>
            <HeroSection benHeroSrc={crewMembers[0].heroSrc} />
            <ProofStrip />
            <MissionLogsSection id="work" projects={projects} />
            <SystemsTopology id="systems" />
            <ExperienceTimeline id="experience" events={timelineEvents} />
            <CrewSection members={crewMembers} />
            <TrainingModule onLaunch={() => setTrainingOpen(true)} />
          </main>
          <CommandFooter />
          <TrainingDialog open={trainingOpen} onOpenChange={setTrainingOpen} />
        </div>
      </TooltipProvider>
    </LazyMotion>
  );
};

export default App;
