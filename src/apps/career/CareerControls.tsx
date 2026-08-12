import type { FormEvent, JSX } from 'react';

export const CAREER_DIRECT_LABELS = ['2022', '2024', '2025', 'Now'] as const;

interface CareerControlsProps {
  readonly activeIndex: number;
  readonly stageLabel: string;
  readonly onStageChange: (index: number) => void;
  readonly classNames: {
    readonly controls: string;
    readonly count: string;
    readonly range: string;
    readonly directControls: string;
    readonly directControl: string;
  };
}

export function CareerControls({
  activeIndex,
  stageLabel,
  onStageChange,
  classNames,
}: CareerControlsProps): JSX.Element {
  const selectRangeStage = (event: FormEvent<HTMLInputElement>) => {
    onStageChange(Number(event.currentTarget.value));
  };

  return (
    <div className={classNames.controls}>
      <span className={classNames.count} aria-hidden="true">
        {String(activeIndex + 1).padStart(2, '0')} / {String(CAREER_DIRECT_LABELS.length).padStart(2, '0')}
      </span>
      <input
        className={classNames.range}
        type="range"
        min="0"
        max="3"
        step="1"
        value={activeIndex}
        aria-label="Career stage"
        aria-valuetext={stageLabel}
        onInput={selectRangeStage}
      />
      <div className={classNames.directControls} aria-label="Choose a career stage">
        {CAREER_DIRECT_LABELS.map((label, index) => (
          <button
            className={classNames.directControl}
            type="button"
            aria-pressed={index === activeIndex}
            onClick={() => onStageChange(index)}
            key={label}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
