import type { CharacterProfile } from '../../data/types';
import styles from './CharacterRoster.module.css';

interface CharacterRosterProps {
  characters: CharacterProfile[];
  selectedCharacterId: CharacterProfile['id'];
  onSelectCharacter: (id: CharacterProfile['id']) => void;
}

export const CharacterRoster = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
}: CharacterRosterProps) => {
  return (
    <div className={styles.roster}>
      <h2 className={styles.heading}>Roster</h2>
      <div className={styles.grid}>
        {characters.map((character) => {
          const isSelected = character.id === selectedCharacterId;
          return (
            <button
              key={character.id}
              type="button"
              onClick={() => onSelectCharacter(character.id)}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`.trim()}
              aria-pressed={isSelected}
            >
              <img src={character.assets.thumb} alt={`${character.name} thumbnail`} className={styles.thumb} />
              <span className={styles.name}>{character.name}</span>
              <span className={styles.subtitle}>{character.rosterSubtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
