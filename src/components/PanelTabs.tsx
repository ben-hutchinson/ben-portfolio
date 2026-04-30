import type { SectionDefinition, SectionId } from '../data/types';
import styles from './PanelTabs.module.css';

interface PanelTabsProps {
  sections: SectionDefinition[];
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
}

export const PanelTabs = ({
  sections,
  activeSection,
  onSelectSection,
}: PanelTabsProps) => {
  return (
    <div className={styles.tabRow} role="tablist" aria-label="Content sections">
      {sections.map((section) => {
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-label={section.ariaLabel}
            aria-selected={isActive}
            className={`${styles.tabButton} ${isActive ? styles.active : ''}`.trim()}
            onClick={() => onSelectSection(section.id)}
          >
            <span>{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};
