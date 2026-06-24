"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import Input from "@/components/Input/Input";
import Toggle from "@/components/Toggle/Toggle";
import HelpText from "@/components/HelpText/HelpText";
import LabelButton from "@/components/LabelButton/LabelButton";
import Icon from "@/components/Icon/Icon";
import DatePicker from "@/components/DatePicker/DatePicker";

interface EditProgramDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    programName: string;
    activeDates: [Date | undefined, Date | undefined] | undefined;
    enableStandings: boolean;
    rcxLeague: string | null;
  }) => void;
  initialData: {
    programName: string;
    sport: string;
    type: string;
    activeDates?: [Date | undefined, Date | undefined] | undefined;
    enableStandings?: boolean;
    rcxLeague?: string | null;
  };
}

export function EditProgramDialog({
  open,
  onClose,
  onSave,
  initialData,
}: EditProgramDialogProps) {
  const [programName, setProgramName] = useState(initialData.programName);
  const [activeDates, setActiveDates] = useState<
    [Date | undefined, Date | undefined] | undefined
  >(initialData.activeDates);
  const [enableStandings, setEnableStandings] = useState(
    initialData.enableStandings ?? false
  );
  const [rcxLeague, setRcxLeague] = useState<string | null>(
    initialData.rcxLeague ?? null
  );

  const leagues = [
    { league_id: "RCX-LEAGUE-123", child_account_id: "RCX-CHILD-456", league_name: "U10 Boys Soccer Spring" },
    { league_id: "RCX-LEAGUE-124", child_account_id: "RCX-CHILD-457", league_name: "U12 Girls Soccer Fall" },
    { league_id: "RCX-LEAGUE-125", child_account_id: "RCX-CHILD-458", league_name: "U8 Coed Baseball Summer" },
    { league_id: "RCX-LEAGUE-126", child_account_id: "RCX-CHILD-459", league_name: "U14 Boys Football Winter" },
  ];

  useEffect(() => {
    if (open) {
      setProgramName(initialData.programName);
      setActiveDates(initialData.activeDates);
      setEnableStandings(initialData.enableStandings ?? false);
      setRcxLeague(initialData.rcxLeague ?? null);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        programName,
        activeDates,
        enableStandings,
        rcxLeague: rcxLeague,
      });
    }
    onClose();
  };

  const isValid =
    programName.trim().length > 0 &&
    activeDates !== undefined &&
    activeDates[0] !== undefined &&
    activeDates[1] !== undefined;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="md" showCloseIconButton={false}>
        {/* Header */}
        <div className="sui-flex sui-items-center sui-gap-6 sui-pt-5 sui-px-4">
          <DialogTitle className="sui-text-heading-md sui-text-neutral-text sui-flex-1">
            Edit Program
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="sui-flex sui-items-center sui-justify-center sui-text-neutral-text hover:sui-text-neutral-text-medium"
            >
              <Icon name="close" size="s" />
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="sui-flex sui-flex-col sui-gap-2 sui-px-4 sui-py-4"
        >
          {/* Program Name */}
          <fieldset className="sui-flex sui-gap-2 sui-items-center">
            <label
              htmlFor="programName"
              className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
            >
              Program Name<span className="sui-text-negative-text">*</span>
            </label>
            <Input
              id="programName"
              type="text"
              name="programName"
              value={programName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProgramName(e.target.value)
              }
              size="small"
            />
          </fieldset>

          {/* Active Dates */}
          <fieldset className="sui-flex sui-gap-2 sui-items-center">
            <label
              htmlFor="activeDates"
              className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
            >
              Active Dates<span className="sui-text-negative-text">*</span>
            </label>
            <DatePicker
              id="activeDates"
              range
              size="small"
              placeholder="Select a date range"
              value={activeDates}
              onChange={(date) =>
                setActiveDates(date as [Date | undefined, Date | undefined] | undefined)
              }
              className="sui-w-full"
              showApplyButton
              fixedDatesShortcut
            />
          </fieldset>

          {/* Sport */}
          <fieldset className="sui-flex sui-gap-2 sui-items-center" disabled>
            <label
              htmlFor="sportId"
              className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
            >
              Sport
            </label>
            <p className="sui-text-sm sui-text-neutral-text">{initialData.sport}</p>
          </fieldset>

          {/* Type */}
          <fieldset className="sui-flex sui-gap-2 sui-items-center" disabled>
            <label
              htmlFor="programTypeId"
              className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
            >
              Type
            </label>
            <p className="sui-text-sm sui-text-neutral-text">{initialData.type}</p>
          </fieldset>

          {/* Info banner */}
          <p className="sui-bg-neutral-background-medium sui-caption sui-px-2 sui-py-[12px] sui-rounded sui-text-neutral-text-medium">
            Sport and type cannot be changed. To set up a program with a
            different sport or type, create a new program or duplicate the
            program that has the desired sport type combination.
          </p>

          {/* Enable Standings */}
          <fieldset className="sui-flex sui-gap-2">
            <label
              htmlFor="enableStandings"
              className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0 sui-whitespace-nowrap sui-min-w-[120px]"
            >
              Enable Standings
            </label>
            <div className="sui-flex sui-flex-col sui-gap-1">
              <Toggle
                name="enableStandings"
                id="enableStandings"
                on={enableStandings}
                onClick={() => setEnableStandings(!enableStandings)}
              />
              <HelpText>
                Shows team rankings on your website for families and visitors.
              </HelpText>
            </div>
          </fieldset>

          {/* RCX League */}
          <fieldset className="sui-flex sui-flex-col sui-gap-2">
            <label className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]">
              RCX League
            </label>
            <div className="sui-grid sui-grid-cols-1 sui-gap-2">
              {/* None option */}
              <button
                type="button"
                onClick={() => setRcxLeague(null)}
                className={`sui-relative sui-text-left sui-rounded-lg sui-border sui-border-solid sui-p-3 sui-cursor-pointer sui-transition-all ${
                  rcxLeague === null
                    ? 'sui-border-admin-action-border sui-bg-admin-action-background-weak-hover'
                    : 'sui-border-neutral-border sui-bg-white hover:sui-bg-neutral-background-weak'
                }`}
              >
               
                <div className="sui-flex sui-items-center sui-justify-between">
                  <p className="sui-text-sm sui-font-medium sui-text-neutral-text">
                    None
                  </p>
                  {rcxLeague === null && (
                    <div className="sui-flex sui-items-center sui-justify-center sui-w-5 sui-h-5 sui-rounded-full sui-bg-admin-action-background">
                      <Icon name="check" size="s" className="sui-text-white" />
                    </div>
                  )}
                </div>
              </button>
              {leagues.map((league) => (
                <button
                  key={league.league_id}
                  type="button"
                  onClick={() => setRcxLeague(league.league_id)}
                  className={`sui-relative sui-text-left sui-rounded-lg sui-border sui-border-solid sui-p-3 sui-cursor-pointer sui-transition-all ${
                    rcxLeague === league.league_id
                      ? 'sui-border-admin-action-border sui-bg-admin-action-background-weak-hover'
                      : 'sui-border-neutral-border sui-bg-white hover:sui-bg-neutral-background-weak'
                  }`}
                >
                  <img
                    alt="RCX Sports"
                    className="sui-absolute sui-top-2 sui-right-2 sui-h-2 sui-w-auto"
                    src="/RCXSports_Vert_CMYK.png"
                  />
                  <div className="sui-flex sui-items-center sui-justify-between">
                    <div>
                      <p className="sui-text-sm sui-font-medium sui-text-neutral-text">
                        League Name: {league.league_name}
                      </p>
                      <p className="sui-text-xs sui-text-neutral-text-medium sui-mt-0.5">
                        League ID: {league.league_id}
                      </p>
                      <p className="sui-text-xs sui-text-neutral-text-medium sui-mt-0.5">
                        Child Account ID: {league.child_account_id}
                      </p>
                    </div>
                    {rcxLeague === league.league_id && (
                      <div className="sui-flex sui-items-center sui-justify-center sui-w-5 sui-h-5 sui-rounded-full sui-bg-admin-action-background">
                        <Icon name="check" size="s" className="sui-text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Footer */}
          <div className="sui-flex sui-items-center sui-justify-end sui-gap-2 sui-pt-2 sui-mt-1">
            <LabelButton
              variantType="tertiary"
              labelText="Cancel"
              onClick={onClose}
              type="button"
            />
            <LabelButton
              variantType="primary"
              labelText="Save"
              disabled={!isValid}
              type="submit"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
