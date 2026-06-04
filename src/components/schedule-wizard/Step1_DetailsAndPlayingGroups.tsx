import { useState } from 'react';
import { PROGRAM, ALL_TEAMS } from '@/components/schedule-wizard/mock-data';
import { SimpleIcon } from '@/components/SimpleIcon';

interface Step1Props {
  selectedDivision: string;
  onDivisionChange: (division: string) => void;
  scheduleName: string;
  onScheduleNameChange: (name: string) => void;
}

export function Step1_DetailsAndPlayingGroups({
  selectedDivision,
  onDivisionChange,
  scheduleName,
  onScheduleNameChange,
}: Step1Props) {
  const selectedDiv = PROGRAM.divisions.find(d => d.id === selectedDivision);

  const teamsInDivision = selectedDivision
    ? ALL_TEAMS.filter(t => t.divisionId === selectedDivision)
    : [];

  return (
    <div className="sui-flex sui-justify-center">
      <div className="sui-w-full sui-max-w-3xl sui-flex sui-flex-col sui-gap-6">
        {/* Schedule Details */}
        <div>
          {/* Schedule Name */}
          <div className="sui-mb-4">
            <label className="sui-block sui-text-sm sui-font-medium sui-text-neutral-text sui-mb-1">
              Schedule name
            </label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onScheduleNameChange(e.target.value)}
              placeholder="Ex: U10 2025 Fall"
              className="sui-w-full sui-border sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-border-admin-action-border"
            />
          </div>

          {/* Division Single-Select */}
          <div className="sui-mb-4">
            <label className="sui-block sui-text-sm sui-font-medium sui-text-neutral-text sui-mb-1">
              Schedule games for teams in
            </label>
            <div className="sui-flex sui-flex-col sui-gap-1">
              {PROGRAM.divisions.map((division) => (
                <label
                  key={division.id}
                  className="sui-flex sui-items-center sui-bg-white sui-border sui-rounded-full sui-p-1 sui-cursor-pointer sui-h-[56px] sui-border-neutral-border"
                >
                  <input
                    type="radio"
                    name="division"
                    value={division.id}
                    checked={selectedDivision === division.id}
                    onChange={() => onDivisionChange(division.id)}
                    className="sui-mr-3"
                  />
                  <div className="sui-flex sui-flex-col">
                    <span>{division.name} ({division.teamCount} teams)</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Teams in Division */}
        {selectedDivision && (
          <div>
            <h3 className="sui-text-sm sui-font-semibold sui-text-neutral-text sui-mb-3">
              Teams in {selectedDiv?.name} ({teamsInDivision.length})
            </h3>
            <div className="sui-grid sui-grid-cols-1 sm:sui-grid-cols-2 lg:sui-grid-cols-3 sui-gap-2">
              {teamsInDivision.map((team) => (
                <div
                  key={team.id}
                  className="sui-border sui-border-neutral-border sui-rounded-full sui-p-3 sui-bg-white sui-flex sui-items-center sui-gap-2"
                >
                  <div className="sui-w-8 sui-h-8 sui-bg-neutral-background-weak sui-rounded sui-flex sui-items-center sui-justify-center sui-text-xs sui-font-semibold sui-text-neutral-text">
                    {team.short}
                  </div>
                  <div>
                    <div className="sui-text-sm sui-font-medium sui-text-neutral-text">
                      {team.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
