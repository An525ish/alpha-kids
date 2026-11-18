import { CONCERN_STARTERS } from "../constants/starters";

type Props = {
  disabled: boolean;
  onPick: (fill: string) => void;
};

export function StarterChips({ disabled, onPick }: Props) {
  return (
    <div className="ak-starters" role="group" aria-label="Common concerns">
      {CONCERN_STARTERS.map((starter) => (
        <button
          key={starter.id}
          type="button"
          className="ak-chip"
          disabled={disabled}
          onClick={() => onPick(starter.fill)}
        >
          {starter.label}
        </button>
      ))}
    </div>
  );
}
