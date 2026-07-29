import { m } from 'framer-motion';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { topologyGroups, topologyNodes } from '@/data/topology';
import type { TopologyGroupId, TopologyNode } from '@/data/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './SystemsTopology.module.css';

interface SystemsTopologyProps {
  id: string;
}

const nodeClassNames: Record<TopologyNode['id'], string> = {
  skao: styles.nodeSkao,
  flutter: styles.nodeFlutter,
  pokeleximon: styles.nodePokeleximon,
  safelog: styles.nodeSafelog,
  observability: styles.nodeObservability,
};

export const SystemsTopology = ({ id }: SystemsTopologyProps) => {
  const [activeGroup, setActiveGroup] = useState<TopologyGroupId>('platform');
  const reducedMotion = usePrefersReducedMotion();
  const isActive = (node: TopologyNode) => node.groups.includes(activeGroup);

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Systems topology</p>
          <h2 id={`${id}-heading`}>Connected by operating context.</h2>
          <p>
            A few systems, viewed through the platform, product, and tooling
            work that connects them.
          </p>
        </div>

        <div className={styles.filters} aria-label="Topology focus">
          {topologyGroups.map((group) => (
            <button
              className={styles.filter}
              type="button"
              key={group.id}
              aria-pressed={activeGroup === group.id}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className={styles.topology}>
          <svg
            className={styles.connections}
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M 156 105 H 374 L 500 210 H 844" />
            <path d="M 500 105 V 315 H 156" />
            <path d="M 500 315 H 844" />
          </svg>

          <div className={styles.nodes}>
            {topologyNodes.map((node) => {
              const active = isActive(node);

              return (
                <m.article
                  className={`${styles.node} ${nodeClassNames[node.id]}`}
                  data-active={active}
                  data-testid={`topology-node-${node.id}`}
                  key={node.id}
                  animate={{ opacity: active ? 1 : 0.46, y: active ? 0 : 3 }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                >
                  <div className={styles.nodeHeader}>
                    <h3>{node.label}</h3>
                    <Tooltip>
                      <TooltipTrigger
                        className={styles.infoButton}
                        aria-label={`More information about ${node.label}`}
                      >
                        i
                      </TooltipTrigger>
                      <TooltipContent>{node.description}</TooltipContent>
                    </Tooltip>
                  </div>
                  <p>{node.description}</p>
                </m.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
