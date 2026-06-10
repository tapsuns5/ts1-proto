"use client";

import { useState, useMemo } from "react";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { ScheduleEvent } from "./ScheduleTab";

interface DataReportProps {
  events: ScheduleEvent[];
  onClose: () => void;
  initialScheduleFilter?: string;
}

export function DataReport({ events, onClose, initialScheduleFilter = "all" }: DataReportProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedSchedule, setSelectedSchedule] = useState<string>(initialScheduleFilter);
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [weekendsOnly, setWeekendsOnly] = useState(false);
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"matchups" | "gamesPerWeek" | "gamesPerTimeSlot">("matchups");

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

  const displayTeams = selectedTeam === "all" ? allTeams : allTeams.filter(t => t === selectedTeam);

  // Normalize any date string to YYYY-MM-DD (timezone-safe)
  const normalizeDate = (dateStr: string): string => {
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
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

  // Lookup count for a row/col team pair
  const getMatchupCount = (rowTeam: string, colTeam: string): number => {
    if (rowTeam === colTeam) return 0;
    const pair = [rowTeam, colTeam].sort().join(" vs ");
    return matchupFrequency[pair] || 0;
  };

  // Calculate ISO week number from date string
  const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Format date as MM/DD (timezone-safe)
  const formatShortDate = (dateStr: string): string => {
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${parseInt(match[2])}/${parseInt(match[3])}`;
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // Compute first ISO week for relative numbering
  const firstWeekNum = useMemo(() => {
    let min = Infinity;
    filteredEvents.forEach(event => {
      if (event.type === "game") {
        min = Math.min(min, getWeekNumber(event.date));
      }
    });
    return min === Infinity ? 1 : min;
  }, [filteredEvents]);

  // Games per week: team -> week -> count, plus week date ranges
  const { gamesPerWeek, weekRanges } = useMemo(() => {
    const weeks: { [weekKey: string]: { [team: string]: number } } = {};
    const ranges: { [weekKey: string]: { start: string; end: string } } = {};

    filteredEvents.forEach(event => {
      if (event.type !== "game" || !event.team) return;
      const isoWeek = getWeekNumber(event.date);
      const relativeWeek = isoWeek - firstWeekNum + 1;
      const weekKey = `Week ${relativeWeek}`;

      if (!weeks[weekKey]) weeks[weekKey] = {};
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
      teamsInGame.forEach((team: string) => {
        weeks[weekKey][team] = (weeks[weekKey][team] || 0) + 1;
      });

      const normDate = normalizeDate(event.date);
      if (!ranges[weekKey]) {
        ranges[weekKey] = { start: normDate, end: normDate };
      } else {
        if (normDate < ranges[weekKey].start) ranges[weekKey].start = normDate;
        if (normDate > ranges[weekKey].end) ranges[weekKey].end = normDate;
      }
    });

    return { gamesPerWeek: weeks, weekRanges: ranges };
  }, [filteredEvents, firstWeekNum]);

  const sortedWeekKeys = useMemo(() => {
    return Object.keys(gamesPerWeek).sort((a, b) => {
      const numA = parseInt(a.replace("Week ", ""));
      const numB = parseInt(b.replace("Week ", ""));
      return numA - numB;
    });
  }, [gamesPerWeek]);

  // Games per time slot: timeSlot -> team -> count
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const gamesPerTimeSlot = useMemo(() => {
    const slots: { [slotKey: string]: { [team: string]: number } } = {};

    filteredEvents.forEach(event => {
      if (event.type !== "game" || !event.team || !event.time) return;
      const d = new Date(normalizeDate(event.date) + "T12:00:00");
      const dayName = dayNames[d.getDay()];
      const slotKey = `${dayName} ${event.time}`;

      if (!slots[slotKey]) slots[slotKey] = {};
      const teamsInGame = event.team.split(" vs ").map((t: string) => t.trim());
      teamsInGame.forEach((team: string) => {
        slots[slotKey][team] = (slots[slotKey][team] || 0) + 1;
      });
    });

    return slots;
  }, [filteredEvents]);

  const sortedSlotKeys = useMemo(() => {
    return Object.keys(gamesPerTimeSlot).sort();
  }, [gamesPerTimeSlot]);

  return (
    <div className="sui-flex sui-flex-col sui-h-full">
      {/* Header - Compact */}
      <header className="sui-pl-6 sui-pr-14 sui-py-3 sui-border-b sui-border-neutral-border sui-flex-shrink-0">
        {/* Title + View toggle */}
        <div className="sui-flex sui-items-center sui-gap-4 sui-mb-2">
          <h2 className="sui-text-base sui-font-bold sui-text-neutral-primary">
            {viewMode === "matchups" && "Team Matchup Matrix"}
            {viewMode === "gamesPerWeek" && "Games Per Week"}
            {viewMode === "gamesPerTimeSlot" && "Games Per Time Slot"}
          </h2>
          <div className="sui-flex sui-items-center sui-bg-neutral-background-medium sui-border sui-border-neutral-border sui-rounded-full sui-p-0.5 sui-shadow-sm">
            {(["matchups", "gamesPerWeek", "gamesPerTimeSlot"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`sui-text-xs sui-font-medium sui-px-3 sui-py-1 sui-rounded-full sui-transition-colors ${
                  viewMode === mode
                    ? "sui-bg-white sui-text-neutral-primary sui-shadow-sm"
                    : "sui-text-neutral-text-medium hover:sui-text-neutral-primary"
                }`}
              >
                {mode === "matchups" && "Matchups"}
                {mode === "gamesPerWeek" && "Games Per Week"}
                {mode === "gamesPerTimeSlot" && "Time Slot"}
              </button>
            ))}
          </div>
        </div>

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

        {/* Subtitle */}
        <p className="sui-text-xs sui-text-neutral-text-medium sui-mt-1">
          {viewMode === "matchups" && "Number of matchups between each pair of teams"}
          {viewMode === "gamesPerWeek" && "Number of games each team plays per week"}
          {viewMode === "gamesPerTimeSlot" && "Number of games each team plays per time slot"}
        </p>
      </header>

      {/* Body - Matrix Grid */}
      <div className="sui-flex-1 sui-overflow-auto sui-bg-white">
        <div className="sui-p-4">
          <div className="sui-min-w-fit">
            <table className="sui-border-collapse sui-text-xs" style={{ width: 'max-content' }}>
              {/* Shared sticky column header */}
              <thead>
                <tr>
                  <th
                    className="sui-h-8 sui-p-1 sui-px-3 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                    style={{ minWidth: '120px', position: 'sticky', left: 0, top: 0, zIndex: 20 }}
                  >
                    {viewMode === "matchups" ? "Matchups" : "Team"}
                  </th>
                  {viewMode === "matchups" && allTeams.map((colTeam) => (
                    <th
                      key={colTeam}
                      className="sui-h-8 sui-p-1 sui-px-3 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-center sui-whitespace-nowrap"
                      style={{ minWidth: '100px', position: 'sticky', top: 0, zIndex: 10 }}
                    >
                      {colTeam}
                    </th>
                  ))}
                  {viewMode === "gamesPerWeek" && sortedWeekKeys.map((week) => {
                    const range = weekRanges[week];
                    const dateText = range ? `${formatShortDate(range.start)}${range.start !== range.end ? ` - ${formatShortDate(range.end)}` : ''}` : '';
                    return (
                      <th
                        key={week}
                        className="sui-p-1 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-center sui-align-middle sui-leading-tight"
                        style={{ minWidth: '110px', position: 'sticky', top: 0, zIndex: 10 }}
                      >
                        <div className="sui-flex sui-flex-col sui-items-center sui-gap-0">
                          <span className="sui-text-xs sui-font-bold">{week.replace("Week ", "W")}</span>
                          {dateText && <span className="sui-text-[9px]">{dateText}</span>}
                        </div>
                      </th>
                    );
                  })}
                  {viewMode === "gamesPerTimeSlot" && sortedSlotKeys.map((slot) => (
                    <th
                      key={slot}
                      className="sui-p-1 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-center sui-align-middle sui-leading-tight"
                      style={{ minWidth: '140px', position: 'sticky', top: 0, zIndex: 10 }}
                    >
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewMode === "matchups" && displayTeams.map((rowTeam, rowIdx) => (
                  <tr key={rowTeam} className={rowIdx % 2 === 1 ? "sui-bg-neutral-background-weak" : "sui-bg-white"}>
                    <td
                      className="sui-h-10 sui-p-1 sui-px-3 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                      style={{ minWidth: '120px', position: 'sticky', left: 0, zIndex: 10 }}
                    >
                      {rowTeam}
                    </td>
                    {allTeams.map((colTeam) => {
                      const count = getMatchupCount(rowTeam, colTeam);
                      const isDiagonal = rowTeam === colTeam;
                      return (
                        <td
                          key={`${rowTeam}-${colTeam}`}
                          className={`sui-h-10 sui-p-1 sui-text-center sui-border sui-border-neutral-border ${isDiagonal ? "sui-bg-[#e8e8e8]" : "sui-bg-transparent"}`}
                          style={{ minWidth: '100px' }}
                        >
                          {!isDiagonal && count > 0 && (
                            <span className="sui-text-xs sui-font-medium">{count}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {viewMode === "gamesPerWeek" && displayTeams.map((team, rowIdx) => (
                  <tr key={team} className={rowIdx % 2 === 1 ? "sui-bg-neutral-background-weak" : "sui-bg-white"}>
                    <td
                      className="sui-h-10 sui-p-1 sui-px-3 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                      style={{ minWidth: '120px', position: 'sticky', left: 0, zIndex: 10 }}
                    >
                      {team}
                    </td>
                    {sortedWeekKeys.map((week) => {
                      const count = gamesPerWeek[week]?.[team] || 0;
                      return (
                        <td
                          key={`${team}-${week}`}
                          className="sui-h-10 sui-p-1 sui-text-center sui-border sui-border-neutral-border"
                          style={{ minWidth: '110px' }}
                        >
                          <span className="sui-text-xs sui-font-medium">{count}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {viewMode === "gamesPerTimeSlot" && displayTeams.map((team, rowIdx) => (
                  <tr key={team} className={rowIdx % 2 === 1 ? "sui-bg-neutral-background-weak" : "sui-bg-white"}>
                    <td
                      className="sui-h-10 sui-p-1 sui-px-3 sui-bg-neutral-background-strongest sui-text-white sui-border sui-border-neutral-border sui-font-semibold sui-text-left sui-whitespace-nowrap"
                      style={{ minWidth: '120px', position: 'sticky', left: 0, zIndex: 10 }}
                    >
                      {team}
                    </td>
                    {sortedSlotKeys.map((slot) => {
                      const count = gamesPerTimeSlot[slot]?.[team] || 0;
                      return (
                        <td
                          key={`${team}-${slot}`}
                          className="sui-h-10 sui-p-1 sui-text-center sui-border sui-border-neutral-border"
                          style={{ minWidth: '140px' }}
                        >
                          <span className="sui-text-xs sui-font-medium">{count}</span>
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
