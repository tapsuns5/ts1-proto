import { useState, useMemo, useEffect, useCallback } from 'react';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import type { WizardState, VenueAvailability, DayAvailability } from '@/components/schedule-wizard/types';
import { Step1_DetailsAndPlayingGroups } from '@/components/schedule-wizard/Step1_DetailsAndPlayingGroups';
import { Step2_Availability } from '@/components/schedule-wizard/Step2_Availability';
import { Step3_Review } from '@/components/schedule-wizard/Step3_Review';
import { PublishModal } from '@/components/schedule-wizard/PublishModal';
import { VENUES, getTeamById, getTeamsByDivision } from '@/components/schedule-wizard/mock-data';
import type { Game } from '@/components/schedule-wizard/types';
import { saveDraft, getDraftById } from '@/components/schedule-wizard/utils/draftStorage';
import { saveCreatedSchedule, replaceEventsForSchedule, updateScheduleStatus } from '@/components/schedule-wizard/utils/scheduleStorage';
import type { ScheduleEvent } from '@/components/schedule-wizard/types';

const WIZARD_STEPS = [
  'Details & playing groups',
  'Availability & venues',
  'Review & generate',
];

const WIZARD_DESCRIPTIONS = [
  'Select divisions and configure team playing groups for scheduling.',
  'Set schedule rules, time window, and venue availability.',
  'Review your schedule configuration before generating game matchups.',
];

interface ScheduleWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated?: (scheduleName: string, scheduleId: string, gamesPerTeam: number) => void;
  draftId?: string;
}

export default function ScheduleWizard({ isOpen, onClose, onGenerated, draftId }: ScheduleWizardProps) {
  const [step, setStep] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [scheduleId] = useState(() => `sched-${crypto.randomUUID().slice(0, 8)}`);

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize venue availability
  const initializeVenueAvailability = () => {
    const initial: Record<string, VenueAvailability> = {};
    const duration = 75; // matches default scheduleRules.duration
    const startTime = '09:00';
    const endH = Math.floor((9 * 60 + duration) / 60) % 24;
    const endM = (9 * 60 + duration) % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    VENUES.forEach((venue: any) => {
      initial[venue.id] = {};
      venue.subVenues.forEach((subVenue: any, svIdx: number) => {
        const weekAvailability: { [day: string]: DayAvailability } = {};
        const slotId = `gs-init-${venue.id}-${svIdx}`;
        DAYS_OF_WEEK.forEach(day => {
          const isSatOrSun = day === 'Saturday' || day === 'Sunday';
          weekAvailability[day] = {
            enabled: isSatOrSun,
            timeSlots: isSatOrSun
              ? [{ id: `${slotId}-${day}`, startTime, endTime }]
              : [],
          };
        });

        initial[venue.id][subVenue.id] = {
          enabled: true,
          maxConcurrent: subVenue.maxConcurrent,
          showAvailabilityEditor: false,
          weekAvailability,
          blackoutDates: [],
        };
      });
    });
    return initial;
  };

  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    scheduleName: '',
    selectedDivision: '',
    selectedDivisions: [],
    playingGroupAssignments: {},

    scheduleRules: {
      gamesPerTeam: 8,
      gamesPerDay: 1,
      duration: 75,
      allowByes: true,
      allowBackToBack: true,
    },
    timeWindow: {
      startDate: '2026-04-05',
      endDate: '2026-06-13',
      timezone: 'America/New_York',
    },
    venueAvailability: initializeVenueAvailability(),
  });

  // Load draft data when draftId is provided
  useEffect(() => {
    if (draftId && isOpen) {
      const draft = getDraftById(draftId);
      if (draft) {
        setWizardState(draft.wizardState);
        setStep(draft.currentStep);
      }
    }
  }, [draftId, isOpen]);

  const isLastStep = step === WIZARD_STEPS.length - 1;

  const getNextLabel = () => {
    switch (step) {
      case 2: return 'Generate draft games →';
      case 3: return 'Publish';
      default: return 'Next →';
    }
  };

  const handleSaveAndExit = () => {
    const id = crypto.randomUUID();
    saveDraft({
      id,
      name: wizardState.scheduleName || 'Untitled draft',
      wizardState,
      lastModified: new Date().toISOString(),
      currentStep: step,
    });
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleGenerateGames();
    } else {
      setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1));
    }
  };

  const handleGenerateGames = () => {
    const scheduleName = wizardState.scheduleName || 'Untitled schedule';
    const teams = getTeamsByDivision(wizardState.selectedDivision);
    const teamIds = teams.map((t: any) => t.id);
    const totalGamesNeeded = teams.length * wizardState.scheduleRules.gamesPerTeam;

    // Generate mock games
    const mockGames: Game[] = [];
    const enabledVenues = VENUES.filter((v: any) =>
      Object.values(wizardState.venueAvailability[v.id] || {}).some((sv: any) => sv.enabled)
    );

    let gameIndex = 0;
    const weeksInWindow = Math.max(1, Math.ceil(
      (new Date(wizardState.timeWindow.endDate).getTime() - new Date(wizardState.timeWindow.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
    ));

    for (let week = 1; week <= weeksInWindow && gameIndex < totalGamesNeeded; week++) {
      const gamesThisWeek = Math.min(
        3,
        totalGamesNeeded - gameIndex
      );
      for (let gameNum = 0; gameNum < gamesThisWeek; gameNum++) {
        const date = new Date(wizardState.timeWindow.startDate);
        date.setDate(date.getDate() + (week - 1) * 7 + gameNum * 2);

        const homeTeam = teamIds[(gameIndex * 2) % teamIds.length];
        const awayTeam = teamIds[(gameIndex * 2 + 1) % teamIds.length];
        const venue = enabledVenues[gameIndex % enabledVenues.length];
        const subVenue = venue?.subVenues[gameIndex % (venue?.subVenues.length || 1)];

        mockGames.push({
          id: `game-${scheduleId}-${gameIndex + 1}`,
          week,
          homeTeamId: homeTeam,
          awayTeamId: awayTeam,
          date: date.toISOString().split('T')[0],
          time: `${9 + gameNum}:00`,
          venueId: venue?.id || '',
          subVenueId: subVenue?.id || '',
          playingGroupId: 'pg-1',
        });

        gameIndex++;
      }
    }

    handleGamesGenerated(mockGames);
    onGenerated?.(scheduleName, scheduleId, wizardState.scheduleRules.gamesPerTeam);
    onClose();
  };

  // Called by Step4 whenever games are generated or re-generated
  const handleGamesGenerated = useCallback((games: Game[]) => {
    const scheduleName = wizardState.scheduleName || 'Untitled schedule';

    // Convert Game objects to ScheduleEvent records
    const events: ScheduleEvent[] = games
      .filter(game => game.date && game.time)
      .map((game, idx) => {
        const homeTeam = getTeamById(game.homeTeamId);
        const awayTeam = getTeamById(game.awayTeamId);
        const venue = VENUES.find((v: any) => v.id === game.venueId);
        const subVenue = venue?.subVenues.find((sv: any) => sv.id === game.subVenueId);

        const formatTime = (t: string) => {
          const [h, m] = t.split(':').map(Number);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hour12 = h % 12 || 12;
          return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
        };

        const [startH, startM] = (game.time as string).split(':').map(Number);
        const endMinutes = startH * 60 + startM + wizardState.scheduleRules.duration;
        const endH = Math.floor(endMinutes / 60) % 24;
        const endM = endMinutes % 60;
        const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

        return {
          id: `gen-${scheduleId}-${idx}`,
          date: new Date(game.date + 'T00:00:00'),
          time: formatTime(game.time as string),
          title: `${homeTeam?.name || 'TBD'} vs ${awayTeam?.name || 'TBD'}`,
          homeTeam: homeTeam?.name || 'TBD',
          awayTeam: awayTeam?.name || 'TBD',
          divisionId: wizardState.selectedDivision,
          divisionLabel: wizardState.selectedDivision,
          venueId: game.venueId || '',
          venueLabel: venue?.name || 'TBD',
          eventType: 'game',
          status: 'draft',
          scheduleId,
        };
      });

    // Persist schedule and events (replaces previous events for this scheduleId on re-generate)
    saveCreatedSchedule({
      id: scheduleId,
      name: scheduleName,
      createdAt: new Date().toISOString(),
      status: 'draft',
    });
    replaceEventsForSchedule(scheduleId, events);
  }, [scheduleId, wizardState.scheduleName, wizardState.scheduleRules.duration, wizardState.selectedDivision]);

  const handlePublish = () => {
    setShowPublishModal(false);
    updateScheduleStatus(scheduleId, 'published');
    onClose();
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      onClose();
    }
  };

  const updateScheduleName = (name: string) => {
    setWizardState((prev: WizardState) => ({ ...prev, scheduleName: name }));
  };

  const updateSelectedDivision = (division: string) => {
    setWizardState((prev: WizardState) => ({ ...prev, selectedDivision: division }));
  };

  const updateGamesPerTeam = (value: number) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      scheduleRules: { ...prev.scheduleRules, gamesPerTeam: value },
    }));
  };

  const updateGamesPerDay = (value: number) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      scheduleRules: { ...prev.scheduleRules, gamesPerDay: value },
    }));
  };

  const updateGameDuration = (value: number) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      scheduleRules: { ...prev.scheduleRules, duration: value },
    }));
  };

  const updateAllowByes = (value: boolean) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      scheduleRules: { ...prev.scheduleRules, allowByes: value },
    }));
  };

  const updateAllowBackToBack = (value: boolean) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      scheduleRules: { ...prev.scheduleRules, allowBackToBack: value },
    }));
  };

  const updateStartDate = (value: string) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      timeWindow: { ...prev.timeWindow, startDate: value },
    }));
  };

  const updateEndDate = (value: string) => {
    setWizardState((prev: WizardState) => ({
      ...prev,
      timeWindow: { ...prev.timeWindow, endDate: value },
    }));
  };

  const updateVenueAvailability = (value: Record<string, VenueAvailability>) => {
    setWizardState((prev: WizardState) => ({ ...prev, venueAvailability: value }));
  };

  // Simple navigation steps
  const navSteps = useMemo(() => {
    return WIZARD_STEPS.map((label, index) => ({
      id: `step-${index}`,
      label,
      isCompleted: index < step,
      isActive: index === step,
    }));
  }, [step]);

  const handleStepClick = (stepId: string) => {
    const stepIndex = parseInt(stepId.replace('step-', ''));
    setStep(stepIndex);
  };

  const stepComponents = [
    <Step1_DetailsAndPlayingGroups
      key={0}
      selectedDivision={wizardState.selectedDivision}
      onDivisionChange={updateSelectedDivision}
      scheduleName={wizardState.scheduleName}
      onScheduleNameChange={updateScheduleName}
    />,
    <Step2_Availability
      key={1}
      selectedDivision={wizardState.selectedDivision}
      gamesPerTeam={wizardState.scheduleRules.gamesPerTeam}
      gamesPerDay={wizardState.scheduleRules.gamesPerDay}
      gameDuration={wizardState.scheduleRules.duration}
      allowByes={wizardState.scheduleRules.allowByes}
      allowBackToBack={wizardState.scheduleRules.allowBackToBack}
      startDate={wizardState.timeWindow.startDate}
      endDate={wizardState.timeWindow.endDate}
      venueAvailability={wizardState.venueAvailability}
      onGamesPerTeamChange={updateGamesPerTeam}
      onGamesPerDayChange={updateGamesPerDay}
      onGameDurationChange={updateGameDuration}
      onAllowByesChange={updateAllowByes}
      onAllowBackToBackChange={updateAllowBackToBack}
      onStartDateChange={updateStartDate}
      onEndDateChange={updateEndDate}
      onVenueAvailabilityChange={updateVenueAvailability}
    />,
    <Step3_Review
      key={2}
      selectedDivision={wizardState.selectedDivision}
      scheduleName={wizardState.scheduleName}
      gamesPerTeam={wizardState.scheduleRules.gamesPerTeam}
      gameDuration={wizardState.scheduleRules.duration}
      gamesPerDay={wizardState.scheduleRules.gamesPerDay}
      allowByes={wizardState.scheduleRules.allowByes}
      allowBackToBack={wizardState.scheduleRules.allowBackToBack}
      startDate={wizardState.timeWindow.startDate}
      endDate={wizardState.timeWindow.endDate}
      venueAvailability={wizardState.venueAvailability}
      onVenueAvailabilityChange={updateVenueAvailability}
      onEndDateChange={updateEndDate}
      onGamesGenerated={handleGamesGenerated}
      onManageGames={() => onClose()}
    />,
  ];

  if (!isOpen) {
    return null;
  }
  return (
    <div className="sui-fixed sui-inset-0 sui-z-50 sui-bg-neutral-background sui-flex sui-flex-col sui-overflow-hidden">
      {/* Header */}
      <header className="sui-flex sui-shrink-0 sui-items-center sui-justify-between sui-border-b sui-border-neutral-border sui-bg-white sui-px-4 sui-py-2">
        <div className="sui-flex sui-items-center sui-gap-2">
          <h1 className="sui-text-heading-lg sui-text-neutral-text">
            Create game schedule
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="sui-flex sui-items-center sui-gap-2">
          <SimpleLabelButton
            type="tertiary"
            label="Cancel"
            onClick={handleCancel}
          />
          <SimpleLabelButton
            type="tertiary"
            label="Save & exit"
            onClick={handleSaveAndExit}
          />
          <SimpleLabelButton
            type="secondary"
            label="Back"
            onClick={handleBack}
            disabled={step === 0}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          />
          <SimpleLabelButton
            type="primary"
            label={getNextLabel()}
            onClick={handleNext}
            disabled={step === 0 && !wizardState.selectedDivision}
          />
        </div>
      </header>

      <div className="sui-flex sui-flex-1 sui-overflow-hidden">
        {/* Left Sidebar - Simple Navigation */}
        <div className="sui-flex sui-w-[300px] sui-border-r sui-border-neutral-border sui-flex-col sui-flex-shrink-0 sui-overflow-hidden">
          <nav className="sui-w-full sui-max-w-[344px] sui-h-full sui-bg-neutral-background-weak">
            {navSteps.map((step, index) => (
              <div
                key={step.id}
                className={`sui-relative sui-flex sui-items-center sui-h-[74px] sui-min-h-[74px] sui-px-6 sui-cursor-pointer sui-transition-colors hover:sui-bg-admin-action-background-weak-hover sui-border-l-[4px] ${
                  step.isActive 
                    ? 'sui-bg-admin-action-background-weak-hover sui-border-admin-action-border' 
                    : 'sui-bg-white sui-border-0'
                }`}
                role="button"
                onClick={() => handleStepClick(step.id)}
              >
                <div className="sui-flex sui-items-center sui-justify-between sui-w-full sui-py-2">
                  <span className="sui-flex-1 sui-text-label sui-text-neutral-text">
                    {step.label}
                  </span>
                  <div className={`sui-w-[24px] sui-h-[24px] sui-block sui-border sui-border-solid sui-rounded-full sui-relative sui-flex-shrink-0 ${
                    step.isActive 
                      ? 'sui-bg-white sui-border-neutral-border sui-border-admin-action-border'
                      : step.isCompleted
                      ? 'sui-bg-admin-action-background sui-border-admin-action-border'
                      : 'sui-bg-white sui-border-neutral-border'
                  }`}>
                    {step.isCompleted && (
                      <div className="sui-absolute sui-inset-0 sui-flex sui-items-center sui-justify-center">
                        <span className="sui-text-xs sui-text-white">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="sui-flex-1 sui-flex sui-flex-col sui-overflow-hidden sui-bg-neutral-background">
          {/* Step Header */}
          <div className="sui-p-4 sui-flex-shrink-0 sui-flex sui-justify-center">
            <div className={`sui-w-full ${step >= 2 ? 'sui-max-w-6xl' : 'sui-max-w-3xl'}`}>
              <h2 className="sui-text-heading-lg sui-mb-1">
                {WIZARD_STEPS[step]}
              </h2>
              <p className="sui-text-body sui-text-neutral-text-medium">
                {WIZARD_DESCRIPTIONS[step]}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="sui-flex-1 sui-overflow-y-auto sui-px-4 sui-pb-3">
            {stepComponents[step]}

            {/* Navigation Button in content flow */}
            <div className="sui-mt-4 sui-flex sui-justify-center">
              <div className={`sui-w-full ${step >= 2 ? 'sui-max-w-6xl' : 'sui-max-w-3xl'}`}>
                <SimpleLabelButton
                  type="primary"
                  label={getNextLabel()}
                  onClick={handleNext}
                  disabled={step === 0 && !wizardState.selectedDivision}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
