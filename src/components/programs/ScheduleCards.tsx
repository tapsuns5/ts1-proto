"use client";

import Badge from "../Badge/Badge";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleIcon } from "../SimpleIcon";

export interface ScheduleCardItem {
  type: 'in-progress' | 'draft' | 'published';
  id: string;
  name: string;
  subtitle: string;
  divisions?: string[];
  draftEventCount?: number;
  draftEventIds?: string[];
}

interface ScheduleCardsProps {
  items: ScheduleCardItem[];
  onContinueSetup: (draftId: string) => void;
  onViewGames: (scheduleId: string) => void;
  onPublish: (scheduleId: string, eventIds: string[]) => void;
  onDelete: (scheduleId: string) => void;
}

function ScheduleCard({
  item,
  onContinueSetup,
  onViewGames,
  onPublish,
  onDelete,
}: {
  item: ScheduleCardItem;
  onContinueSetup: (id: string) => void;
  onViewGames: (id: string) => void;
  onPublish: (id: string, eventIds: string[]) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="sui-border sui-border-neutral-border sui-rounded-2xl sui-bg-white sui-p-2 sui-flex sui-flex-col sui-gap-1">
      <div className="sui-flex sui-items-start sui-justify-between sui-gap-2">
        <div className="sui-min-w-0">
          <div className="sui-text-label sui-font-normal sui-text-neutral-text sui-truncate">{item.name}</div>
          <div className="sui-text-caption sui-text-neutral-text-medium">{item.subtitle}</div>
        </div>
        {item.type === 'in-progress' && (
          <Badge labelText="Setup" variant="neutral" />
        )}
        {item.type === 'draft' && (
          <Badge labelText="Draft" variant="caution1" />
        )}
      </div>
      <div className="sui-flex sui-justify-between sui-flex-wrap sui-items-center sui-gap-1">
        {item.type === 'in-progress' && (
          <>
            <button
              onClick={() => onDelete(item.id)}
              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-text-negative-text hover:sui-border-negative-border hover:sui-bg-negative-background-weak sui-h-[28px] sui-w-[28px] sui-min-w-[28px]"
              type="button"
              aria-label="Delete"
            >
              <SimpleIcon name="delete" size="s" />
            </button>
            <SimpleLabelButton
              type="primary"
              size="small"
              label="Continue setup"
              className="!sui-font-normal !sui-text-label"
              onClick={() => onContinueSetup(item.id)}
            />
          </>
        )}
        {item.type === 'draft' && (
          <>
            <SimpleLabelButton
              type="secondary"
              size="small"
              label="View games"
              className="!sui-font-normal !sui-text-label"
              onClick={() => onViewGames(item.id)}
            />
            {(item.draftEventCount ?? 0) > 0 && (
              <SimpleLabelButton
                type="primary"
                size="small"
                label={`Publish ${item.draftEventCount}`}
                className="!sui-font-normal !sui-text-label"
                onClick={() => onPublish(item.id, item.draftEventIds ?? [])}
              />
            )}
          </>
        )}
        {item.type === 'published' && (
          <>
            <SimpleLabelButton
              type="secondary"
              size="small"
              label="View games"
              className="!sui-font-normal !sui-text-label"
              onClick={() => onViewGames(item.id)}
            />
            {(item.draftEventCount ?? 0) > 0 && (
              <SimpleLabelButton
                type="primary"
                size="small"
                label={`Publish ${item.draftEventCount}`}
                className="!sui-font-normal !sui-text-label"
                onClick={() => onPublish(item.id, item.draftEventIds ?? [])}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ScheduleCards({ items, onContinueSetup, onViewGames, onPublish, onDelete }: ScheduleCardsProps) {
  if (items.length === 0) return null;

  return (
    <div className="sui-grid sui-grid-cols-1 sm:sui-grid-cols-2 lg:sui-grid-cols-3 xl:sui-grid-cols-4 sui-gap-2 sui-pt-2 sui-pb-0">
      {items.map((item) => (
        <ScheduleCard
          key={item.id}
          item={item}
          onContinueSetup={onContinueSetup}
          onViewGames={onViewGames}
          onPublish={onPublish}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
