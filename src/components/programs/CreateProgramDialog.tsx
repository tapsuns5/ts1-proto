"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Toggle from "@/components/Toggle/Toggle";
import HelpText from "@/components/HelpText/HelpText";
import LabelButton from "@/components/LabelButton/LabelButton";
import Icon from "@/components/Icon/Icon";
import DatePicker from "@/components/DatePicker/DatePicker";

interface League {
  league_id: string;
  child_account_id: string;
  league_name: string;
}

interface CreateProgramDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (program: {
    id: string;
    name: string;
    status: string;
    startDate: Date;
    endDate: Date;
    totalParticipants: number;
    players: number;
    staff: number;
    teams: number;
    isRCX?: boolean;
    rcxLeagueName?: string;
  }) => void;
}

export function CreateProgramDialog({ open, onClose, onCreate }: CreateProgramDialogProps) {
  const [programName, setProgramName] = useState("");
  const [activeDates, setActiveDates] = useState<[Date | undefined, Date | undefined] | undefined>(undefined);
  const [sportId, setSportId] = useState<string | null>(null);
  const [programTypeId, setProgramTypeId] = useState<string | null>(null);
  const [enableStandings, setEnableStandings] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const mockAddresses = [
    "999 SW 10th St, Fort Lauderdale, FL 33315",
    "123 Main St, Fort Lauderdale, FL 33301",
    "456 Beach Blvd, Miami, FL 33139",
    "789 Ocean Dr, Miami Beach, FL 33139",
  ];

  const sportOptions = [
    { value: "football", label: "Football" },
    { value: "baseball", label: "Baseball" },
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
  ];

  const typeOptions = [
    { value: "league", label: "League" },
    { value: "tournament", label: "Tournament" },
    { value: "camp", label: "Camp" },
    { value: "clinic", label: "Clinic" },
  ];

  const leagues: League[] = [
    { league_id: "RCX-LEAGUE-123", child_account_id: "RCX-CHILD-456", league_name: "U10 Boys Soccer Spring" },
    { league_id: "RCX-LEAGUE-124", child_account_id: "RCX-CHILD-457", league_name: "U12 Girls Soccer Fall" },
    { league_id: "RCX-LEAGUE-125", child_account_id: "RCX-CHILD-458", league_name: "U8 Coed Baseball Summer" },
    { league_id: "RCX-LEAGUE-126", child_account_id: "RCX-CHILD-459", league_name: "U14 Boys Football Winter" },
  ];

  useEffect(() => {
    if (!showLocationSuggestions) return;
    const handleClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLocationSuggestions]);

  const locationSuggestions = mockAddresses.filter((addr) =>
    addr.toLowerCase().includes(location.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreate && activeDates && activeDates[0] && activeDates[1]) {
      const selectedLeagueData = leagues.find((l) => l.league_id === selectedLeague);
      onCreate({
        id: crypto.randomUUID().slice(0, 5),
        name: programName,
        status: "active",
        startDate: activeDates[0],
        endDate: activeDates[1],
        totalParticipants: 0,
        players: 0,
        staff: 0,
        teams: 0,
        isRCX: true,
        rcxLeagueName: selectedLeagueData?.league_name,
      });
    }
    onClose();
    // Reset form
    setProgramName("");
    setActiveDates(undefined);
    setSportId(null);
    setProgramTypeId(null);
    setEnableStandings(false);
    setLocation("");
    setSelectedLeague(null);
    setStep(1);
  };

  const isStep1Valid =
    programName.trim().length > 0 &&
    location.trim().length > 0 &&
    activeDates !== undefined &&
    activeDates[0] !== undefined &&
    activeDates[1] !== undefined &&
    sportId !== null &&
    programTypeId !== null;

  const isStep2Valid = selectedLeague !== null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="md" showCloseIconButton={false}>
        {/* Header */}
        <div className="sui-flex sui-items-center sui-gap-6 sui-pt-5 sui-px-4">
          <DialogTitle className="sui-text-heading-md sui-text-neutral-text sui-flex-1">
            Create Program
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

        {/* Stepper */}
        <div className="sui-flex sui-items-center sui-justify-center sui-gap-1 sui-pl-2 sui-pr-2 sui-py-3 sui-border-b sui-border-solid sui-border-neutral-border">
          <div className="sui-flex sui-items-center sui-gap-1">
            <div className={`sui-flex sui-items-center sui-justify-center sui-w-5 sui-h-5 sui-rounded-full sui-text-xs sui-font-medium ${step === 1 ? 'sui-bg-admin-action-background sui-text-white' : 'sui-bg-admin-action-background sui-text-white'}`}>
              {step > 1 ? (
                <Icon name="check" size="s" />
              ) : (
                "1"
              )}
            </div>
            <span className={`sui-text-sm sui-font-medium ${step === 1 ? 'sui-text-neutral-text' : 'sui-text-neutral-text'}`}>
              Create Program
            </span>
          </div>
          <div className="sui-h-px sui-w-4 sui-bg-neutral-border" />
          <div className="sui-flex sui-items-center sui-gap-1">
            <div className={`sui-flex sui-items-center sui-justify-center sui-w-5 sui-h-5 sui-rounded-full sui-text-xs sui-font-medium ${step === 2 ? 'sui-bg-admin-action-background sui-text-white' : 'sui-bg-neutral-background sui-text-neutral-text-medium sui-border sui-border-neutral-border'}`}>
              2
            </div>
            <div className="sui-flex sui-flex-col sui-items-center sui-gap-0.5">
              <span className={`sui-text-sm sui-font-medium ${step === 2 ? 'sui-text-neutral-text' : 'sui-text-neutral-text-medium'}`}>
                Select League
              </span>
              <img
                alt="RCX Sports"
                className="sui-h-2 sui-w-auto"
                src="/RCXSports_Vert_CMYK.png"
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="sui-flex sui-flex-col sui-gap-2 sui-px-4 sui-py-4"
        >
          {step === 1 && (
            <>
              {/* Program Name */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
                <label
                  htmlFor="programName"
                  className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
                >
                  Program Name<span className="sui-text-negative-text">*</span>
                </label>
                <Input
                  type="text"
                  name="programName"
                  value={programName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramName(e.target.value)}
                  size="small"
                />
              </div>

              {/* Location */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
                <label
                  htmlFor="location"
                  className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
                >
                  Primary Location<span className="sui-text-negative-text">*</span>
                </label>
                <div ref={locationRef} className="sui-relative sui-w-full">
                  <Input
                    id="location"
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setLocation(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    size="small"
                  />
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="sui-absolute sui-z-50 sui-w-full sui-bg-white sui-border sui-border-solid sui-border-neutral-border sui-rounded-lg sui-mt-1 sui-shadow-lg sui-max-h-[200px] sui-overflow-y-auto">
                      {locationSuggestions.map((addr) => (
                        <button
                          key={addr}
                          type="button"
                          className="sui-w-full sui-text-left sui-px-3 sui-py-2 sui-text-sm sui-text-neutral-text hover:sui-bg-neutral-background-weak sui-cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setLocation(addr);
                            setShowLocationSuggestions(false);
                          }}
                        >
                          {addr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Dates */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
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
                  onChange={(date) => setActiveDates(date as [Date | undefined, Date | undefined] | undefined)}
                  className="sui-w-full"
                  showApplyButton
                  fixedDatesShortcut
                />
              </div>

              {/* Sport */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
                <label
                  htmlFor="sportId"
                  className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
                >
                  Sport<span className="sui-text-negative-text">*</span>
                </label>
                <Select
                  name="sportId"
                  placeholder="Select..."
                  options={sportOptions}
                  value={sportId ?? ""}
                  onChange={(value) => setSportId(value)}
                  size="small"
                  menuPortalTarget={null}
                />
              </div>

              {/* Type */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
                <label
                  htmlFor="programTypeId"
                  className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5 sui-whitespace-nowrap sui-min-w-[120px]"
                >
                  Type<span className="sui-text-negative-text">*</span>
                </label>
                <Select
                  name="programTypeId"
                  placeholder="Select..."
                  options={typeOptions}
                  value={programTypeId ?? ""}
                  onChange={(value) => setProgramTypeId(value)}
                  size="small"
                  menuPortalTarget={null}
                />
              </div>

              {/* Enable Standings */}
              <div className="sui-flex sui-gap-2 sui-items-start [&>label]:sui-top-[7px]">
                <label
                  htmlFor="enableStandings"
                  className="sui-rounded sui-label sui-inline-block sui-relative sui-mb-0 sui-whitespace-nowrap sui-min-w-[120px]"
                >
                  Enable Standings
                </label>
                <div className="sui-flex sui-flex-col sui-gap-2">
                  <Toggle
                    name="enableStandings"
                    on={enableStandings}
                    onClick={() => setEnableStandings(!enableStandings)}
                  />
                  <HelpText>
                    Shows team rankings on your website for families and visitors.
                  </HelpText>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="sui-flex sui-flex-col sui-gap-3 sui-min-h-[200px]">
                <p className="sui-text-body sui-text-neutral-text-medium">
                  Select the league this program belongs to.
                </p>
                <div className="sui-grid sui-grid-cols-1 sui-gap-2">
                  {leagues.map((league) => (
                    <button
                      key={league.league_id}
                      type="button"
                      onClick={() => setSelectedLeague(league.league_id)}
                      className={`sui-text-left sui-rounded-lg sui-border sui-border-solid sui-p-3 sui-cursor-pointer sui-transition-all ${
                        selectedLeague === league.league_id
                          ? 'sui-border-admin-action-border sui-bg-admin-action-background-weak-hover'
                          : 'sui-border-neutral-border sui-bg-white hover:sui-bg-neutral-background-weak'
                      }`}
                    >
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
                        {selectedLeague === league.league_id && (
                          <div className="sui-flex sui-items-center sui-justify-center sui-w-5 sui-h-5 sui-rounded-full sui-bg-admin-action-background">
                            <Icon name="check" size="s" className="sui-text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="sui-flex sui-justify-center sui-pt-2">
                <img
                  alt="RCX Sports"
                  className="sui-h-2 sui-w-auto"
                  src="/RCXSports_Vert_CMYK.png"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="sui-flex sui-items-center sui-justify-end sui-gap-1 sui-pt-2">
            {step === 1 ? (
              <>
                <LabelButton
                  variantType="tertiary"
                  labelText="Cancel"
                  onClick={onClose}
                  type="button"
                />
                <LabelButton
                  variantType="primary"
                  labelText="Next"
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)}
                  type="button"
                />
              </>
            ) : (
              <>
                <LabelButton
                  variantType="tertiary"
                  labelText="Back"
                  onClick={() => setStep(1)}
                  type="button"
                />
                <LabelButton
                  variantType="tertiary"
                  labelText="Skip"
                  onClick={() => {
                    onClose();
                    setStep(1);
                    setProgramName("");
                    setActiveDates(undefined);
                    setSportId(null);
                    setProgramTypeId(null);
                    setEnableStandings(false);
                    setLocation("");
                    setSelectedLeague(null);
                  }}
                  type="button"
                />
                <LabelButton
                  variantType="primary"
                  labelText="Finish"
                  disabled={!isStep2Valid}
                  type="submit"
                />
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
