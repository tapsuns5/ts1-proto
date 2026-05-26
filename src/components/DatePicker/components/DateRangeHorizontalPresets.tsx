import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { DateRangePreset } from "../DatePicker.types";
import { ACTION_ID, FIXED_DATES_LIST } from "../utils";

export function DateRangeHorizontalPresets({
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
  const presets = customPresets?.length
    ? customPresets.map((preset) => ({
        label: preset.label,
        onClick: () => onSelectCustomDate(preset.label),
      }))
    : FIXED_DATES_LIST.map((fixedDate) => ({
        label: fixedDate.label,
        onClick: () => onSelectFixedDate(fixedDate.value),
      }));

  return (
    <ScrollArea.Root className="sui-w-full sui-border-b sui-border-solid sui-border-gray-90" aria-label="Preset date ranges">
      <ScrollArea.Viewport className="sui-w-full sui-px-2 sui-py-3">
        <div className="sui-flex sui-flex-row sui-gap-2 sui-w-max">
          {presets.map((preset) => (
            <button
              key={`horizontal-preset-${preset.label}`}
              className="sui-whitespace-nowrap sui-label sui-cursor-pointer sui-text-neutral-text-medium"
              type="button"
              onClick={preset.onClick}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="sui-flex sui-h-1.5 sui-touch-none sui-select-none sui-flex-col sui-bg-transparent sui-p-0.5"
      >
        <ScrollArea.Thumb className="sui-relative sui-flex-1 sui-rounded-full sui-bg-gray-80" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
