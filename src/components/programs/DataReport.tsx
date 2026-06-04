"use client";

import { useState, useMemo } from "react";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { ScheduleEvent } from "./ScheduleTab";
import { getDeterministicScore } from "./scoreUtils";

interface DataReportProps {
  events: ScheduleEvent[];
  onClose: () => void;
  initialScheduleFilter?: string;
}

interface TeamGame {
  opponent: string;
  teamScore: number;
  opponentScore: number;
  isWin: boolean;
  date: string;
  hasScore: boolean;
}

interface WeekData {
  [team: string]: TeamGame | null;
}

interface SeasonMatrix {
  [weekKey: string]: WeekData;
}

export function DataReport({ events, onClose, initialScheduleFilter = "all" }: DataReportProps) {
  const [selectedWeek, setSelectedWeek] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedSchedule, setSelectedSchedule] = useState<string>(initialScheduleFilter);
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [weekendsOnly, setWeekendsOnly] = useState(false);
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);
  const [showMatchups, setShowMatchups] = useState(false);

  // Extract unique schedule names from events
  const scheduleNames = useMemo(() => {
    const names = new Set<string>();
    events.forEach((event) => {
      if (event.scheduleName) {
        names.add(event.scheduleName);
      }
    });
    return Array.from(names).sort();
  }, [events]);

  // Extract unique teams from game events
  const allTeams = useMemo(() => {
    const teamSet = new Set<string>();
    events.forEach((event) => {
      if (event.type === "game" && event.team) {
        const teamsInGame = event.team.split(" vs ");
        teamsInGame.forEach((t: string) => teamSet.add(t.trim()));
      }
    });
    return Array.from(teamSet).sort();
  }, [events]);

  const teams = selectedTeam === "all" ? allTeams : allTeams.filter(t => t === selectedTeam);

  // Normalize any date string to YYYY-MM-DD (timezone-safe)
  const normalizeDate = (dateStr: string): string => {
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  };

  // Format date as MM/DD (timezone-safe)
  const formatShortDate = (dateStr: string): string => {
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${parseInt(match[2])}/${parseInt(match[3])}`;
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // Get day name from date string (timezone-safe)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDayName = (dateStr: string): string => {
    const d = new Date(normalizeDate(dateStr) + "T12:00:00");
    return dayNames[d.getDay()];
  };

  // Filter events by schedule, team, date range, and day of week
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (event.type !== "game") return false;
      if (selectedSchedule !== "all" && event.scheduleName !== selectedSchedule) return false;
      if (selectedTeam !== "all" && event.team) {
        const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
        if (!teamsInGame.includes(selectedTeam)) return false;
      }
      // Day of week filtering
      if (event.date && (weekendsOnly || weekdaysOnly)) {
        const day = new Date(normalizeDate(event.date)).getDay();
        if (weekendsOnly && day !== 0 && day !== 6) return false;
        if (weekdaysOnly && (day === 0 || day === 6)) return false;
      }
      if (!dateStart && !dateEnd) return true;
      const eventDate = new Date(event.date);
      if (dateStart && eventDate < new Date(dateStart)) return false;
      if (dateEnd && eventDate > new Date(dateEnd)) return false;
      return true;
    });
  }, [events, selectedSchedule, selectedTeam, weekendsOnly, weekdaysOnly, dateStart, dateEnd]);

  // Calculate matchup frequency: how many times each pair plays
  const matchupFrequency = useMemo(() => {
    const freq: { [pair: string]: number } = {};
    filteredEvents.forEach(event => {
      if (!event.team) return;
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim()).sort();
      if (teamsInGame.length !== 2) return;
      const pair = `${teamsInGame[0]} vs ${teamsInGame[1]}`;
      freq[pair] = (freq[pair] || 0) + 1;
    });
    return freq;
  }, [filteredEvents]);

  // Unique games per team
  const teamGameCounts = useMemo(() => {
    const counts: { [team: string]: number } = {};
    filteredEvents.forEach(event => {
      if (!event.team) return;
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
      teamsInGame.forEach((team: string) => {
        counts[team] = (counts[team] || 0) + 1;
      });
    });
    return counts;
  }, [filteredEvents]);

  // Calculate ISO week number from date string
  const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Get team abbreviation (first 3 letters uppercase)
  const getTeamAbbr = (teamName: string): string => {
    return teamName.substring(0, 3).toUpperCase();
  };

  // Generate consistent mock scores for a game
  const generateScore = (seed: string) => {
    return getDeterministicScore(seed);
  };

  // Compute first ISO week of the season for relative numbering
  const firstWeekNum = useMemo(() => {
    let min = Infinity;
    filteredEvents.forEach(event => {
      if (event.type === "game") {
        min = Math.min(min, getWeekNumber(event.date));
      }
    });
    return min === Infinity ? 1 : min;
  }, [filteredEvents]);

  // Build season matrix: weeks as columns, teams as rows
  const seasonMatrix = useMemo(() => {
    const matrix: SeasonMatrix = {};
    
    filteredEvents.forEach((event) => {
      if (event.type !== "game" || !event.team) return;
      
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
      if (teamsInGame.length !== 2) return;
      
      const isoWeek = getWeekNumber(event.date);
      const relativeWeek = isoWeek - firstWeekNum + 1;
      const weekKey = `Week ${relativeWeek}`;
      
      if (!matrix[weekKey]) {
        matrix[weekKey] = {};
      }
      
      const { score1, score2 } = generateScore(`${event.date}-${event.team}-${event.id || ''}`);
      
      const [homeTeam, awayTeam] = teamsInGame;
      
      matrix[weekKey][homeTeam] = {
        opponent: awayTeam,
        teamScore: score1,
        opponentScore: score2,
        isWin: score1 > score2,
        date: event.date,
        hasScore: true,
      };
      
      matrix[weekKey][awayTeam] = {
        opponent: homeTeam,
        teamScore: score2,
        opponentScore: score1,
        isWin: score2 > score1,
        date: event.date,
        hasScore: true,
      };
    });
    
    return matrix;
  }, [filteredEvents, firstWeekNum]);

  // Compute date range per relative week from actual events
  const weekDateRanges = useMemo(() => {
    const ranges: { [week: string]: { start: string; end: string } } = {};
    filteredEvents.forEach(event => {
      if (event.type !== "game") return;
      const isoWeek = getWeekNumber(event.date);
      const relativeWeek = isoWeek - firstWeekNum + 1;
      const weekKey = `Week ${relativeWeek}`;
      const normDate = normalizeDate(event.date);
      if (!ranges[weekKey]) {
        ranges[weekKey] = { start: normDate, end: normDate };
      } else {
        if (normDate < ranges[weekKey].start) ranges[weekKey].start = normDate;
        if (normDate > ranges[weekKey].end) ranges[weekKey].end = normDate;
      }
    });
    return ranges;
  }, [filteredEvents, firstWeekNum]);

  // Get all weeks sorted
  const weeks = useMemo(() => {
    return Object.keys(seasonMatrix).sort((a, b) => {
      const numA = parseInt(a.replace("Week ", ""));
      const numB = parseInt(b.replace("Week ", ""));
      return numA - numB;
    });
  }, [seasonMatrix]);

  // Filter weeks based on selection
  const displayWeeks = selectedWeek === "all" 
    ? weeks 
    : weeks.filter(w => w === `Week ${selectedWeek}`);

  // Day-level view: when a single week is selected, show individual days as columns
  const isSingleWeekView = selectedWeek !== "all" && displayWeeks.length === 1;

  const dayMatrix = useMemo(() => {
    if (!isSingleWeekView || displayWeeks.length === 0) return {} as SeasonMatrix;
    const selectedWeekKey = displayWeeks[0];
    const matrix: SeasonMatrix = {};
    filteredEvents.forEach((event) => {
      if (event.type !== "game" || !event.team) return;
      const eventIsoWeek = getWeekNumber(event.date);
      const eventRelativeWeek = eventIsoWeek - firstWeekNum + 1;
      const eventWeekKey = `Week ${eventRelativeWeek}`;
      if (eventWeekKey !== selectedWeekKey) return;
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
      if (teamsInGame.length !== 2) return;
      const dateKey = normalizeDate(event.date);
      if (!matrix[dateKey]) matrix[dateKey] = {};
      const { score1, score2 } = generateScore(`${event.date}-${event.team}-${event.id || ''}`);
      const [homeTeam, awayTeam] = teamsInGame;
      matrix[dateKey][homeTeam] = {
        opponent: awayTeam,
        teamScore: score1,
        opponentScore: score2,
        isWin: score1 > score2,
        date: event.date,
        hasScore: true,
      };
      matrix[dateKey][awayTeam] = {
        opponent: homeTeam,
        teamScore: score2,
        opponentScore: score1,
        isWin: score2 > score1,
        date: event.date,
        hasScore: true,
      };
    });
    return matrix;
  }, [filteredEvents, isSingleWeekView, displayWeeks, firstWeekNum]);

  const displayDays = useMemo(() => {
    if (!isSingleWeekView) return [];
    return Object.keys(dayMatrix).sort();
  }, [dayMatrix, isSingleWeekView]);

  // Get cell styling based on game result
  const getCellStyling = (game: TeamGame | null | undefined) => {
    if (!game) {
      return "sui-bg-white sui-border sui-border-neutral-border";
    }
    
    if (game.isWin) {
      return "sui-bg-[#c8e6c9] sui-text-[#1b5e20] sui-border sui-border-[#a5d6a7]";
    } else {
      return "sui-bg-[#ffcdd2] sui-text-[#b71c1c] sui-border sui-border-[#ef9a9a]";
    }
  };

  return (
    <div className="sui-flex sui-flex-col sui-h-full">
      {/* Header - Compact */}
      <header className="sui-pl-6 sui-pr-14 sui-py-3 sui-border-b sui-border-neutral-border sui-flex-shrink-0">
        {/* Title */}
        <h2 className="sui-text-base sui-font-bold sui-text-neutral-primary sui-mb-2">Team Matchup Matrix</h2>

        {/* Filters row - all left aligned */}
        <div className="sui-flex sui-items-center sui-gap-2 sui-flex-wrap">
          {scheduleNames.length > 0 && (
            <div className="sui-flex sui-items-center sui-gap-1">
              <label className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">Schedule:</label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="sui-border sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-1 sui-text-xs sui-min-w-[120px]"
              >
                <option value="all">All Schedules</option>
                {scheduleNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="sui-flex sui-items-center sui-gap-1">
            <label className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">Team:</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="sui-border sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-1 sui-text-xs sui-min-w-[100px]"
            >
              <option value="all">All Teams</option>
              {allTeams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <label className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">Week:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="sui-border sui-border-neutral-border sui-rounded-full sui-px-2 sui-py-1 sui-text-xs sui-w-[150px]"
            >
              <option value="all">All Weeks</option>
              {weeks.map((week) => {
                const range = weekDateRanges[week];
                const dateLabel = range
                  ? ` (${getDayName(range.start)} ${formatShortDate(range.start)}${range.start !== range.end ? ` - ${getDayName(range.end)} ${formatShortDate(range.end)}` : ''})`
                  : '';
                return (
                  <option key={week} value={week.replace("Week ", "")}>
                    {week}{dateLabel}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <label className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">From:</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="sui-border sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-1 sui-text-xs sui-w-[130px]"
            />
          </div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <label className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">To:</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="sui-border sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-1 sui-text-xs sui-w-[130px]"
            />
          </div>

          <div className="sui-w-px sui-h-4 sui-bg-neutral-border"></div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <input
              type="checkbox"
              id="weekendsOnly"
              checked={weekendsOnly}
              onChange={(e) => {
                setWeekendsOnly(e.target.checked);
                if (e.target.checked) setWeekdaysOnly(false);
              }}
              className="sui-w-3 sui-h-3"
            />
            <label htmlFor="weekendsOnly" className="sui-text-xs sui-font-medium sui-text-neutral-text-medium sui-cursor-pointer">Weekends Only</label>
          </div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <input
              type="checkbox"
              id="weekdaysOnly"
              checked={weekdaysOnly}
              onChange={(e) => {
                setWeekdaysOnly(e.target.checked);
                if (e.target.checked) setWeekendsOnly(false);
              }}
              className="sui-w-3 sui-h-3"
            />
            <label htmlFor="weekdaysOnly" className="sui-text-xs sui-font-medium sui-text-neutral-text-medium sui-cursor-pointer">Weekdays Only</label>
          </div>
        </div>

        {/* Legend + matchup toggle inline */}
        <div className="sui-flex sui-items-center sui-gap-4 sui-mt-2">
          <div className="sui-flex sui-items-center sui-gap-3 sui-text-xs sui-text-neutral-text">
            <div className="sui-flex sui-items-center sui-gap-1">
              <div className="sui-w-3 sui-h-3 sui-bg-[#c8e6c9] sui-border sui-border-[#a5d6a7] sui-rounded-sm"></div>
              <span>Win</span>
            </div>
            <div className="sui-flex sui-items-center sui-gap-1">
              <div className="sui-w-3 sui-h-3 sui-bg-[#ffcdd2] sui-border sui-border-[#ef9a9a] sui-rounded-sm"></div>
              <span>Loss</span>
            </div>
          </div>

          <div className="sui-w-px sui-h-4 sui-bg-neutral-border"></div>

          <button
            onClick={() => setShowMatchups(!showMatchups)}
            className="sui-text-xs sui-text-admin-action sui-font-medium sui-flex sui-items-center sui-gap-1 hover:sui-underline"
          >
            {showMatchups ? "Hide" : "Show"} matchup details
            <SimpleIcon name={showMatchups ? "expand_less" : "expand_more"} size="s" />
          </button>
        </div>

        {/* Matchup Details Panel */}
        {showMatchups && (
          <div className="sui-mt-2 sui-p-2 sui-bg-neutral-background-weak sui-rounded sui-text-xs">
            <div className="sui-grid sui-grid-cols-2 sui-gap-4">
              {/* Team game counts */}
              <div>
                <span className="sui-font-semibold sui-text-neutral-text">Games per team:</span>
                <div className="sui-flex sui-flex-wrap sui-gap-1 sui-mt-1">
                  {allTeams.map(team => (
                    <span key={team} className="sui-inline-flex sui-items-center sui-px-2 sui-py-0.5 sui-bg-white sui-rounded-full sui-border sui-border-neutral-border">
                      {team}: {teamGameCounts[team] || 0}
                    </span>
                  ))}
                </div>
              </div>
              {/* Matchup frequencies */}
              <div>
                <span className="sui-font-semibold sui-text-neutral-text">Matchup frequency:</span>
                <div className="sui-flex sui-flex-wrap sui-gap-1 sui-mt-1">
                  {Object.entries(matchupFrequency).map(([pair, count]) => (
                    <span key={pair} className="sui-inline-flex sui-items-center sui-px-2 sui-py-0.5 sui-bg-white sui-rounded-full sui-border sui-border-neutral-border">
                      {pair}: {count}x
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Body - Matrix Grid */}
      <div className="sui-flex-1 sui-overflow-auto sui-bg-white">
        <div className="sui-p-4">
          <div className="sui-min-w-fit">
            <table className="sui-border-collapse sui-text-xs" style={{ width: 'max-content' }}>
              <thead>
                <tr>
                  <th
                    className="sui-h-8 sui-p-1 sui-px-3 sui-bg-neutral-background-weak sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                    style={{ minWidth: '120px', position: 'sticky', left: 0, top: 0, zIndex: 20 }}
                  >
                    Team
                  </th>
                  {isSingleWeekView
                    ? displayDays.map((dateStr) => {
                        const dayName = getDayName(dateStr);
                        return (
                          <th
                            key={dateStr}
                            className="sui-p-1 sui-bg-neutral-background-weak sui-border sui-border-neutral-border sui-font-semibold sui-text-center sui-align-middle sui-leading-tight"
                            style={{ minWidth: '110px', position: 'sticky', top: 0, zIndex: 10 }}
                          >
                            <div className="sui-flex sui-flex-col sui-items-center sui-gap-0">
                              <span className="sui-text-xs sui-font-bold">{dayName}</span>
                              <span className="sui-text-[9px] sui-text-neutral-text-medium">{formatShortDate(dateStr)}</span>
                            </div>
                          </th>
                        );
                      })
                    : displayWeeks.map((week) => {
                        const range = weekDateRanges[week];
                        const dateText = range ? `${formatShortDate(range.start)}${range.start !== range.end ? `-${formatShortDate(range.end)}` : ''}` : '';
                        return (
                          <th
                            key={week}
                            className="sui-p-1 sui-bg-neutral-background-weak sui-border sui-border-neutral-border sui-font-semibold sui-text-center sui-align-middle sui-leading-tight"
                            style={{ minWidth: '110px', position: 'sticky', top: 0, zIndex: 10 }}
                          >
                            <div className="sui-flex sui-flex-col sui-items-center sui-gap-0">
                              <span className="sui-text-xs sui-font-bold">{week.replace("Week ", "W")}</span>
                              {dateText && <span className="sui-text-[9px] sui-text-neutral-text-medium">{dateText}</span>}
                            </div>
                          </th>
                        );
                      })}
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team}>
                    <td
                      className="sui-h-10 sui-p-1 sui-px-3 sui-bg-white sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                      style={{ minWidth: '120px', position: 'sticky', left: 0, zIndex: 10 }}
                    >
                      {team}
                      <span className="sui-text-[10px] sui-font-normal sui-text-neutral-text-medium sui-ml-1">
                        ({teamGameCounts[team] || 0})
                      </span>
                    </td>
                    {(isSingleWeekView ? displayDays : displayWeeks).map((colKey) => {
                      const game = isSingleWeekView
                        ? dayMatrix[colKey]?.[team]
                        : seasonMatrix[colKey]?.[team];
                      const weekNum = isSingleWeekView ? 1 : parseInt(colKey.replace("Week ", ""));
                      const showScore = weekNum < 9;
                      const cellStyle = showScore ? getCellStyling(game) : "sui-bg-white sui-border sui-border-neutral-border";
                      const cellKey = isSingleWeekView ? `${team}-${colKey}` : `${team}-${colKey}`;
                      return (
                        <td
                          key={cellKey}
                          className={`sui-h-10 sui-p-0.5 sui-text-center sui-border sui-border-neutral-border ${cellStyle}`}
                          style={{ minWidth: '110px' }}
                        >
                          {game && (
                            <div className="sui-flex sui-flex-col sui-items-center sui-gap-0">
                              {showScore ? (
                                <span className="sui-text-xs sui-font-bold">
                                  {game.teamScore}-{game.opponentScore}
                                </span>
                              ) : (
                                <span className="sui-text-[9px] sui-font-normal">
                                  {formatShortDate(game.date)}
                                </span>
                              )}
                              <span className="sui-text-[9px] sui-font-normal sui-opacity-70 sui-leading-none sui-whitespace-nowrap">
                                vs {game.opponent}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <footer className="sui-px-6 sui-py-2 sui-border-t sui-border-neutral-border sui-flex-shrink-0">
        <div className="sui-flex sui-justify-between sui-items-center">
          <div className="sui-text-xs sui-text-neutral-text-medium">
            {allTeams.length} teams · {filteredEvents.length} games
            {Object.keys(matchupFrequency).length > 0 && (
              <span className="sui-ml-2">
                · {Object.keys(matchupFrequency).length} unique matchups
              </span>
            )}
          </div>
          <div className="sui-flex sui-gap-2">
            <SimpleLabelButton
              type="secondary"
              size="small"
              label="Export"
              onClick={() => console.log("Export matrix")}
            />
            <SimpleLabelButton
              type="primary"
              size="small"
              label="Close"
              onClick={onClose}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
