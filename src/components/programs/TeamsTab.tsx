"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import Toggle from "../Toggle/Toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "../Dialog/Dialog";

interface Team {
  id: string;
  name: string;
  players: number;
  staff: number;
  division?: string;
}

interface Division {
  id: string;
  name: string;
  teams: Team[];
  totalPlayers: number;
  totalStaff: number;
}

interface TeamsTabProps {
  divisions?: Division[];
  orgId?: string;
  programId?: string;
  onCreateTeam?: (divisionId: string) => void;
  onEditTeam?: (teamId: string) => void;
  onArchiveTeam?: (teamId: string) => void;
  onEditDivision?: (divisionId: string) => void;
  onManageDivisions?: () => void;
  onCreateTeamGlobal?: () => void;
}

export function TeamsTab({
  divisions = [],
  orgId,
  programId,
  onCreateTeam,
  onEditTeam,
  onArchiveTeam,
  onEditDivision,
  onManageDivisions,
  onCreateTeamGlobal,
}: TeamsTabProps) {
  const router = useRouter();
  const [groupByDivision, setGroupByDivision] = useState(true);
  const [selectedUxOption, setSelectedUxOption] = useState("Current");
  const [selectedTeamForDialog, setSelectedTeamForDialog] = useState<Team | null>(null);
  const [accessOption, setAccessOption] = useState("temporary");
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({});
  const [redirecting, setRedirecting] = useState(false);
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(
    new Set(divisions.map((d) => d.id))
  );

  const toggleDivision = (divisionId: string) => {
    setExpandedDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(divisionId)) {
        next.delete(divisionId);
      } else {
        next.add(divisionId);
      }
      return next;
    });
  };

  // Flatten all teams with their division names for the flat view
  const allTeams = divisions.flatMap((division) =>
    division.teams.map((team) => ({
      ...team,
      division: division.name,
    }))
  );

  return (
    <section className="sui-pb-[100px]">
      <div className="sui-mx-auto sui-pt-4" >
        <header className="sui-flex sui-flex-col-reverse sui-justify-between sui-gap-2 sui-mb-3 d:sui-flex-row">
          <div className="sui-flex sui-gap-2 sui-flex-1 sui-items-center sui-flex-wrap">
            <div>
              <button
                type="button"
                className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-border-solid sui-border-neutral-border sui-bg-white sui-pl-2 sui-pr-1 sui-max-w-[215px]"
              >
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  Status
                </div>
                <span className="sui-block sui-h-2 sui-w-[1px] sui-bg-neutral-border" />
                <p className="sui-truncate !sui-font-semibold sui-text-admin-action-text sui-text-label">
                  <span className="sui-truncate">Active</span>
                </p>
                <span className="sui-flex">
                  <SimpleIcon name="keyboard_arrow_down" size="default" />
                </span>
              </button>
            </div>
            <fieldset className="sui-flex sui-items-center sui-gap-1">
              <Toggle
                on={groupByDivision}
                onClick={() => setGroupByDivision(!groupByDivision)}
                name="groupByDivision"
                className="sui-caption"
              />
              <label htmlFor="groupByDivision" className="sui-whitespace-nowrap">
                Group by Division
              </label>
            </fieldset>
          </div>
          <div className="sui-flex sui-gap-2 sui-flex-wrap" data-testid="filters-bar">
            <SimpleLabelButton
              type="primary"
              size="small"
              label="Add/Manage Divisions"
              onClick={onManageDivisions}
              dataTestId="manage-divisions-button"
            />
            <SimpleLabelButton
              type="primary"
              size="small"
              label="Teams"
              iconLeft="add"
              onClick={onCreateTeamGlobal}
              dataTestId="create-teams-button-default"
            />
          </div>
        </header>

        <section className="sui-grid sui-gap-3">
          {groupByDivision ? (
            // Grouped by division view
            divisions.map((division) => (
              <div
                key={division.id}
                data-state={expandedDivisions.has(division.id) ? "open" : "closed"}
                className="sui-rounded-xl sui-overflow-x-auto sui-pt-0 sui-shadow-2 sui-border sui-border-solid sui-border-neutral-border sui-bg-white"
              >
                <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense">
                  <thead
                    className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak [&_tr]:sui-border-b [&_tr]:sui-border-solid [&_tr]:sui-border-neutral-border sui-cursor-pointer"
                    onClick={() => toggleDivision(division.id)}
                  >
                    <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak">
                      <th className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left sui-w-[40%]">
                        <div className="sui-flex sui-items-center sui-gap-2">
                          <div className="sui-flex sui-gap-1 sui-items-center sui-mb-0.5">
                            <h5 className="sui-heading-sm sui-font-bold">{division.name}</h5>
                            <div className="sui-flex sui-gap-0.5 sui-items-center">
                              <SimpleIcon name="groups" size="default" />
                              <button
                                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditDivision?.(division.id);
                                }}
                                type="button"
                                title="Edit"
                              >
                                <SimpleIcon name="edit" size="s" />
                              </button>
                            </div>
                          </div>
                          <p className="sui-label sui-text-neutral-text-medium">
                            {division.teams.length} TEAMS
                          </p>
                        </div>
                      </th>
                      <th className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-w-[100px] sui-text-right">
                        <div className="sui-flex sui-items-center sui-gap-2">
                          <p className="sui-caption sui-uppercase sui-bold sui-text-neutral-text-medium">
                            Players
                          </p>
                          <h4 className="sui-heading-md">{division.totalPlayers}</h4>
                        </div>
                      </th>
                      <th className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-w-[100px] sui-text-right">
                        <div className="sui-flex sui-items-center sui-gap-2">
                          <p className="sui-caption sui-uppercase sui-bold sui-text-neutral-text-medium">
                            Staff
                          </p>
                          <h4 className="sui-heading-md">{division.totalStaff}</h4>
                        </div>
                      </th>
                      <th className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left">
                        <div className="sui-flex sui-items-center sui-gap-2">
                          <div className="sui-w-full sui-flex sui-justify-end sui-items-center">
                            <SimpleIcon
                              name={
                                expandedDivisions.has(division.id)
                                  ? "expand_less"
                                  : "expand_more"
                              }
                              size="l"
                              className={
                                expandedDivisions.has(division.id)
                                  ? "sui-icon-rotate sui-transition-transform"
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {expandedDivisions.has(division.id) && (
                    <tbody className="[&_tr:last-child]:sui-border-0">
                      {division.teams.map((team) => (
                        <tr
                          key={team.id}
                          className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak sui-border-b sui-border-solid sui-border-neutral-border last:sui-border-0"
                          data-testid={`grouped-by-division-team-${team.id}`}
                        >
                          <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-w-[40%] sui-max-w-0">
                            <div className="sui-flex sui-gap-1 sui-items-center sui-min-w-0">
                              {selectedUxOption === "Option 1" ? (
                                <button
                                  onClick={() => setSelectedTeamForDialog({ ...team, division: division.name })}
                                  className="sui-truncate sui-text-left sui-bg-transparent sui-border-none sui-cursor-pointer sui-text-admin-action-text hover:sui-underline"
                                  title={team.name}
                                >
                                  {team.name}
                                </button>
                              ) : selectedUxOption === "Option 2" ? (
                                <button
                                  onClick={() => router.push(`/organizations/${divisions[0]?.id || 'org'}/programs/${divisions[0]?.teams[0]?.id || 'prog'}/teams/${team.id}?teamName=${encodeURIComponent(team.name)}&division=${encodeURIComponent(division.name)}&teamId=${team.id}`)}
                                  className="sui-truncate sui-text-left sui-bg-transparent sui-border-none sui-cursor-pointer sui-text-admin-action-text hover:sui-underline"
                                  title={team.name}
                                >
                                  {team.name}
                                </button>
                              ) : (
                                <span className="sui-truncate" title={team.name}>
                                  {team.name}
                                </span>
                              )}
                              {teamRoles[team.id] && (
                                <span className="sui-inline-flex sui-items-center sui-px-2 sui-py-0.5 sui-rounded-full sui-bg-neutral-background-strong sui-text-black sui-text-caption sui-font-medium sui-whitespace-nowrap sui-flex-shrink-0">
                                  {teamRoles[team.id]}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-w-[100px] sui-text-right">
                            {team.players}
                          </td>
                          <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-w-[100px] sui-text-right">
                            {team.staff}
                          </td>
                          <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0">
                            <div className="sui-flex sui-gap-1 sui-items-center sui-justify-end">
                              {selectedUxOption === "Option 1" && (
                                <button
                                  onClick={() => setSelectedTeamForDialog({ ...team, division: division.name })}
                                  className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                                  type="button"
                                  data-testid={`external-link-${team.name}`}
                                  title="Open external link"
                                >
                                  <SimpleIcon name="open_in_new" size="s" />
                                </button>
                              )}
                              <button
                                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                                onClick={() => onEditTeam?.(team.id)}
                                type="button"
                                data-testid={`edit-${team.name}`}
                              >
                                <SimpleIcon name="edit" size="s" />
                              </button>
                              <button
                                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                                onClick={() => onArchiveTeam?.(team.id)}
                                type="button"
                                data-testid={`archive-${team.name}`}
                              >
                                <SimpleIcon name="archive" size="s" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                  <tfoot className="sui-border-t sui-border-solid sui-border-neutral-border [&>tr]:last:sui-border-b-0">
                    <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak">
                      <td
                        className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-pt-4"
                        colSpan={4}
                      >
                        <SimpleLabelButton
                          type="secondary"
                          size="small"
                          label="Teams"
                          iconLeft="add"
                          onClick={() => onCreateTeam?.(division.id)}
                          dataTestId={`create-teams-button-${division.id}`}
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))
          ) : (
            // Flat table view
            <div className="sui-rounded-xl sui-overflow-x-auto sui-shadow-2 sui-border sui-border-solid sui-border-neutral-border sui-bg-white">
              <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense">
                <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
                  <tr>
                    <th className="sui-p-2 sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left" style={{ flexBasis: '40%' }}>
                      Team
                    </th>
                    <th className="sui-p-2 sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left">
                      Players
                    </th>
                    <th className="sui-p-2 sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left">
                      Staff
                    </th>
                    <th className="sui-p-2 sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left">
                      Division
                    </th>
                    <th className="sui-p-2 sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:sui-border-0">
                  {allTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak sui-border-b sui-border-solid sui-border-neutral-border last:sui-border-0"
                      data-testid={`flat-view-team-${team.id}`}
                    >
                      <td className="sui-p-2 sui-align-middle sui-w-[40%] sui-max-w-0">
                        <div className="sui-flex sui-gap-1 sui-items-center sui-min-w-0 sui-overflow-hidden">
                          {selectedUxOption === "Option 1" ? (
                            <button
                              onClick={() => setSelectedTeamForDialog({ ...team, division: team.division || "" })}
                              className="sui-truncate sui-text-left sui-bg-transparent sui-border-none sui-cursor-pointer sui-text-admin-action-text hover:sui-underline"
                              title={team.name}
                            >
                              {team.name}
                            </button>
                          ) : selectedUxOption === "Option 2" ? (
                            <button
                              onClick={() => router.push(`/organizations/${divisions[0]?.id || 'org'}/programs/${divisions[0]?.teams[0]?.id || 'prog'}/teams/${team.id}`)}
                              className="sui-truncate sui-text-left sui-bg-transparent sui-border-none sui-cursor-pointer sui-text-admin-action-text hover:sui-underline"
                              title={team.name}
                            >
                              {team.name}
                            </button>
                          ) : (
                            <span className="sui-truncate" title={team.name}>
                              {team.name}
                            </span>
                          )}
                          {teamRoles[team.id] && (
                            <span className="sui-inline-flex sui-items-center sui-px-2 sui-py-0.5 sui-rounded-full sui-bg-neutral-background-strong sui-text-black sui-text-caption sui-font-medium sui-whitespace-nowrap sui-flex-shrink-0">
                              {teamRoles[team.id]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="sui-p-2 sui-align-middle sui-text-left">
                        {team.players}
                      </td>
                      <td className="sui-p-2 sui-align-middle sui-text-left">
                        {team.staff}
                      </td>
                      <td className="sui-p-2 sui-align-middle sui-text-left">
                        {team.division}
                      </td>
                      <td className="sui-p-2 sui-align-middle sui-text-left">
                        <div className="sui-flex sui-gap-1">
                          {selectedUxOption === "Option 1" && (
                            <button
                              onClick={() => setSelectedTeamForDialog({ ...team, division: team.division || "" })}
                              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                              type="button"
                              data-testid={`external-link-${team.name}`}
                              title="Open external link"
                            >
                              <SimpleIcon name="open_in_new" size="s" />
                            </button>
                          )}
                          <button
                            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                            onClick={() => onEditTeam?.(team.id)}
                            type="button"
                            data-testid={`edit-${team.name}`}
                          >
                            <SimpleIcon name="edit" size="s" />
                          </button>
                          <button
                            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                            onClick={() => onArchiveTeam?.(team.id)}
                            type="button"
                            data-testid={`archive-${team.name}`}
                          >
                            <SimpleIcon name="archive" size="s" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Floating UX Toggle */}
      <div className="sui-fixed sui-bottom-4 sui-left-1/2 sui--translate-x-1/2 sui-z-50 sui-bg-white sui-rounded-full sui-shadow-2 sui-border sui-border-solid sui-border-neutral-border sui-p-1 sui-flex sui-gap-1">
        {["Current", "Option 1", "Option 2", "Additional"].map((option) => (
          <button
            key={option}
            onClick={() => setSelectedUxOption(option)}
            className={`sui-px-4 sui-py-2 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
              selectedUxOption === option
                ? "sui-bg-admin-action-background sui-text-white"
                : "sui-text-neutral-text-medium hover:sui-bg-neutral-background-weak"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Team Access Dialog */}
      <Dialog open={!!selectedTeamForDialog} onOpenChange={(open: boolean) => !open && setSelectedTeamForDialog(null)}>
        <DialogContent showCloseIconButton className="sui-w-full sui-max-w-full md:!sui-max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Open {selectedTeamForDialog?.name}</DialogTitle>
          </DialogHeader>
          <DialogBody className="sui-px-3 sui-mb-3">
            <p className="sui-body">
              You don&apos;t currently have a role on this team. How would you like to access it?
            </p>
          </DialogBody>
          <div className="sui-px-3 sui-grid sui-gap-3">
            <label className="sui-flex sui-items-start sui-gap-3 sui-cursor-pointer sui-group">
              <input
                type="radio"
                name="access-option"
                value="manager"
                checked={accessOption === "manager"}
                onChange={(e) => setAccessOption(e.target.value)}
                className="sui-mt-1 sui-h-4 sui-w-4 sui-border sui-border-solid sui-border-neutral-border sui-text-admin-action-background focus:sui-ring-2 focus:sui-ring-admin-action-background focus:sui-ring-offset-2"
              />
              <div className="sui-flex sui-flex-col sui-gap-1">
                <span className="sui-body sui-font-medium">Add me as a Team Manager</span>
                <span className="sui-caption sui-text-neutral-text-medium">Full team access - you&apos;ll be added to the team&apos;s staff.</span>
              </div>
            </label>
            <label className="sui-flex sui-items-start sui-gap-3 sui-cursor-pointer sui-group">
              <input
                type="radio"
                name="access-option"
                value="coach"
                checked={accessOption === "coach"}
                onChange={(e) => setAccessOption(e.target.value)}
                className="sui-mt-1 sui-h-4 sui-w-4 sui-border sui-border-solid sui-border-neutral-border sui-text-admin-action-background focus:sui-ring-2 focus:sui-ring-admin-action-background focus:sui-ring-offset-2"
              />
              <div className="sui-flex sui-flex-col sui-gap-1">
                <span className="sui-body sui-font-medium">Add me as a Coach</span>
                <span className="sui-caption sui-text-neutral-text-medium">Full team access - you&apos;ll be added to the team&apos;s staff.</span>
              </div>
            </label>
            <label className="sui-flex sui-items-start sui-gap-3 sui-cursor-pointer sui-group">
              <input
                type="radio"
                name="access-option"
                value="temporary"
                checked={accessOption === "temporary"}
                onChange={(e) => setAccessOption(e.target.value)}
                className="sui-mt-1 sui-h-4 sui-w-4 sui-border sui-border-solid sui-border-neutral-border sui-text-admin-action-background focus:sui-ring-2 focus:sui-ring-admin-action-background focus:sui-ring-offset-2"
              />
              <div className="sui-flex sui-flex-col sui-gap-1">
                <span className="sui-body sui-font-medium">Just give me temporary access (1 hour)</span>
                <span className="sui-caption sui-text-neutral-text-medium">View and manage without joining the staff. Access expires automatically.</span>
              </div>
            </label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <SimpleLabelButton type="secondary" label="Cancel" />
            </DialogClose>
            <SimpleLabelButton
              type="primary"
              label="Open team"
              onClick={() => {
                if (!selectedTeamForDialog) {
                  setSelectedTeamForDialog(null);
                  return;
                }
                if (accessOption === "manager" || accessOption === "coach") {
                  setTeamRoles((prev) => ({
                    ...prev,
                    [selectedTeamForDialog.id]: accessOption === "manager" ? "Team Manager" : "Coach",
                  }));
                  setSelectedTeamForDialog(null);
                  setRedirecting(true);
                  window.setTimeout(() => {
                    const org = orgId || "org";
                    const program = programId || "program";
                    const teamNameParam = encodeURIComponent(selectedTeamForDialog.name);
                    const divisionParam = encodeURIComponent(selectedTeamForDialog.division || "");
                    const url = `/organizations/${org}/programs/${program}/teams/${selectedTeamForDialog.id}/staff?teamName=${teamNameParam}&division=${divisionParam}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    setRedirecting(false);
                  }, 1200);
                } else {
                  setSelectedTeamForDialog(null);
                }
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {redirecting && (
        <div className="sui-fixed sui-inset-0 sui-z-[1000] sui-flex sui-flex-col sui-items-center sui-justify-center sui-bg-white/90 sui-gap-4">
          <SimpleIcon
            name="progress_activity"
            size="l"
            className="sui-animate-spin sui-text-admin-action-text"
          />
          <p className="sui-text-body sui-font-medium">
            Redirecting you to the Staff Page
          </p>
        </div>
      )}
    </section>
  );
}
