"use client";

import { useMemo } from 'react';
import { SimpleIcon } from '@/components/SimpleIcon';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import type { Game } from '@/components/schedule-wizard/types';
import { getTeamById, PROGRAM } from '@/components/schedule-wizard/mock-data';

interface FairnessStat {
  teamId: string;
  totalGames: number;
  weekendGames: number;
  homeGames: number;
  awayGames: number;
}

interface DraftGamesReadyModalProps {
  open: boolean;
  onPublishNow: () => void;
  onViewGames: () => void;
  games: Game[];
  gamesPerTeam: number;
}

function calculateFairnessStats(games: Game[]): FairnessStat[] {
  const statsMap = new Map<string, FairnessStat>();

  games.forEach((game) => {
    if (!statsMap.has(game.homeTeamId)) {
      statsMap.set(game.homeTeamId, { teamId: game.homeTeamId, totalGames: 0, weekendGames: 0, homeGames: 0, awayGames: 0 });
    }
    if (!statsMap.has(game.awayTeamId)) {
      statsMap.set(game.awayTeamId, { teamId: game.awayTeamId, totalGames: 0, weekendGames: 0, homeGames: 0, awayGames: 0 });
    }

    const homeStat = statsMap.get(game.homeTeamId)!;
    const awayStat = statsMap.get(game.awayTeamId)!;

    homeStat.totalGames++;
    awayStat.totalGames++;
    homeStat.homeGames++;
    awayStat.awayGames++;

    const gameDate = game.date ? new Date(game.date) : null;
    const isWeekend = gameDate ? gameDate.getDay() === 0 || gameDate.getDay() === 6 : false;
    if (isWeekend) {
      homeStat.weekendGames++;
      awayStat.weekendGames++;
    }
  });

  return Array.from(statsMap.values());
}

export function DraftGamesReadyModal({ open, onPublishNow, onViewGames, games, gamesPerTeam }: DraftGamesReadyModalProps) {
  const fairnessStats = useMemo(() => {
    if (games.length === 0) return [];
    return calculateFairnessStats(games);
  }, [games]);

  const sortedStats = useMemo(() => {
    return [...fairnessStats].sort((a, b) => {
      const teamA = getTeamById(a.teamId);
      const teamB = getTeamById(b.teamId);
      const divA = teamA?.divisionId || '';
      const divB = teamB?.divisionId || '';
      if (divA !== divB) return divA.localeCompare(divB);
      return (teamA?.name || '').localeCompare(teamB?.name || '');
    });
  }, [fairnessStats]);

  if (!open) return null;

  return (
    <div className="sui-fixed sui-inset-0 sui-z-50 sui-flex sui-items-center sui-justify-center">
      <div className="sui-fixed sui-inset-0 sui-bg-black/50" onClick={onViewGames} />
      <div className="sui-relative sui-bg-white sui-rounded-3xl sui-shadow-lg sui-w-full sui-max-w-2xl sui-z-10 sui-mx-4">
        {/* Header with icon */}
        <div className="sui-flex sui-items-center sui-gap-2 sui-pt-5 sui-px-5">
          <div className="sui-flex sui-items-center sui-justify-center sui-w-8 sui-h-8 sui-text-positive-text">
            <SimpleIcon name="check_circle" size="l" />
          </div>
          <h2 className="sui-text-heading-md sui-text-neutral-text">
            Draft games are ready
          </h2>
        </div>

        {/* Body */}
        <div className="sui-px-5 sui-py-4">
          <p className="sui-text-body sui-text-neutral-text sui-mb-3">
            Review your draft games before publishing, or publish now to share the schedule with your teams.
          </p>

          {/* Team Distribution Table */}
          {sortedStats.length > 0 && (
            <div>
              <h3 className="sui-text-label sui-font-semibold sui-text-neutral-text sui-mb-1">Team game distribution</h3>
              <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white sui-overflow-hidden">
                <div className="sui-overflow-y-auto" style={{ maxHeight: '280px' }}>
                  <table className="sui-w-full">
                    <thead className="sui-sticky sui-top-0 sui-bg-neutral-background-weak sui-z-10">
                      <tr>
                        <th className="sui-text-left sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Team</th>
                        <th className="sui-text-left sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Division</th>
                        <th className="sui-text-center sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Total</th>
                        <th className="sui-text-center sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Home</th>
                        <th className="sui-text-center sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Away</th>
                        <th className="sui-text-center sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-p-2">Weekend</th>
                      </tr>
                    </thead>
                    <tbody className="sui-divide-y sui-divide-neutral-border">
                      {sortedStats.map((stat) => {
                        const team = getTeamById(stat.teamId);
                        const divName = PROGRAM.divisions.find((d) => d.id === team?.divisionId)?.name || '—';
                        const isImbalanced = stat.totalGames !== gamesPerTeam;

                        return (
                          <tr
                            key={stat.teamId}
                            className={isImbalanced ? 'sui-bg-caution-background-weak' : ''}
                          >
                            <td className="sui-p-2 sui-text-body sui-text-neutral-text sui-font-medium">
                              <div className="sui-flex sui-items-center sui-gap-1">
                                {team?.name || 'Unknown'}
                                {isImbalanced && (
                                  <SimpleIcon name="warning" size="s" className="sui-text-warning-text" />
                                )}
                              </div>
                            </td>
                            <td className="sui-p-2 sui-text-caption sui-text-neutral-text-medium">{divName}</td>
                            <td className={`sui-p-2 sui-text-body sui-text-center sui-font-medium ${isImbalanced ? 'sui-text-warning-text' : 'sui-text-neutral-text'}`}>
                              {stat.totalGames}
                            </td>
                            <td className="sui-p-2 sui-text-body sui-text-center sui-text-neutral-text">{stat.homeGames}</td>
                            <td className="sui-p-2 sui-text-body sui-text-center sui-text-neutral-text">{stat.awayGames}</td>
                            <td className="sui-p-2 sui-text-body sui-text-center sui-text-neutral-text">{stat.weekendGames}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sui-flex sui-items-center sui-justify-end sui-gap-1 sui-px-5 sui-pb-4 sui-pt-2">
          <SimpleLabelButton
            type="secondary"
            label="Publish now"
            onClick={onPublishNow}
          />
          <SimpleLabelButton
            type="primary"
            label="View & manage games"
            onClick={onViewGames}
          />
        </div>
      </div>
    </div>
  );
}
