import type { DateRangePreset } from "../DatePicker.types";
import { ACTION_ID, FIXED_DATES_LIST } from "../utils";

export function DateRangeFixedPresets({
  customPresets,
  onSelectFixedDate,
  onSelectCustomDate,
}: {
  customPresets?: DateRangePreset[];
  onSelectFixedDate: (
    date: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>,
  ) => void;
  onSelectCustomDate: (label: string) => void;
}) {
  return (
    <div className="sui-border-r sui-border-solid sui-border-gray-90 sui-p-2">
      {customPresets?.length
        ? customPresets.map((customPreset) => (
            <DatePresetButton
              key={`snap-ui-fixed-date-${customPreset.label}`}
              {...{
                customPresets,
                onSelectCustomDate,
                label: customPreset.label,
              }}
            />
          ))
        : FIXED_DATES_LIST.map((fixedDate) => (
            <DatePresetButton
              key={`snap-ui-fixed-date-${fixedDate.label}`}
              {...{
                customPresets,
                onSelectFixedDate,
                value: fixedDate.value,
                label: fixedDate.label,
              }}
            />
          ))}
    </div>
  );
}

const DatePresetButton = ({
  customPresets,
  label,
  value,
  onSelectCustomDate,
  onSelectFixedDate,
}: {
  customPresets?: DateRangePreset[];
  label: string;
  value?: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>;
  onSelectFixedDate?: (
    date: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>,
  ) => void;
  onSelectCustomDate?: (label: string) => void;
}) => (
  <button
    data-testid={label?.toLowerCase()}
    className="sui-mb-2 sui-block sui-w-full sui-cursor-pointer sui-border-0 sui-bg-transparent sui-p-0 sui-pr-2 sui-text-left sui-text-gray-40/100 sui-outline-none"
    type="button"
    onClick={() => {
      customPresets
        ? onSelectCustomDate?.(label)
        : value !== undefined && onSelectFixedDate?.(value);
    }}
  >
    {label}
  </button>
);
