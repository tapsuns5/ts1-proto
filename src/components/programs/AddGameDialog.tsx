"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "../Dialog/Dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "../DropdownMenu/DropdownMenu";
import { SimpleLabelButton } from "../SimpleLabelButton";
import Label from "../Label/Label";
import Input from "../Input/Input";
import Select from "../Select/Select";
import ReactSelect from "react-select";
import LabelButton from "../LabelButton/LabelButton";

// Production Select styling helper
const getProductionSelectStyles = () => ({
  control: (base: any) => ({
    ...base,
    width: '100%',
    borderRadius: '9999px',
    paddingLeft: '4px',
    fontFamily: 'Urbanist, sans-serif',
    color: 'var(--sui-colors-neutral-text)',
    minHeight: '32px',
    lineHeight: '25px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--sui-colors-neutral-border)',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: 'var(--sui-colors-action-border-hover)',
    },
    '&:focus, &:focus-within': {
      outline: 'none',
      boxShadow: 'none',
      borderColor: 'var(--sui-colors-action-border-pressed)',
    },
  }),
  input: (base: any) => ({
    ...base,
    margin: '0px',
    padding: '0px',
    color: 'var(--sui-colors-neutral-text)',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'var(--sui-colors-neutral-text-disabled)',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'var(--sui-colors-neutral-text)',
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: '0px',
    color: '#666666',
  }),
});

export default function AddGameDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  
  // Form state
  const [team1Type, setTeam1Type] = useState('internal');
  const [team1, setTeam1] = useState('');
  const [team1HomeAway, setTeam1HomeAway] = useState('home');
  const [team2Type, setTeam2Type] = useState('internal');
  const [team2, setTeam2] = useState('');
  const [team2HomeAway, setTeam2HomeAway] = useState('away');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('tbd');
  const [timeZone, setTimeZone] = useState('ET - Eastern');
  const [durationHours, setDurationHours] = useState('1');
  const [durationMinutes, setDurationMinutes] = useState('0');
  const [arrivalTime, setArrivalTime] = useState('');
  const [venue, setVenue] = useState('tbd');
  const [notes, setNotes] = useState('');
  const [showSuggestedTimes, setShowSuggestedTimes] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset form when dialog closes
    if (!open) {
      setTeam1Type('internal');
      setTeam1('');
      setTeam1HomeAway('home');
      setTeam2Type('internal');
      setTeam2('');
      setTeam2HomeAway('away');
      setDate('');
      setStartTime('tbd');
      setTimeZone('ET - Eastern');
      setDurationHours('1');
      setDurationMinutes('0');
      setArrivalTime('');
      setVenue('tbd');
      setNotes('');
    }
  };

  // Mock data
  const teamOptions = [
    { value: 'eagles', label: 'Eagles' },
    { value: 'tigers', label: 'Tigers' },
    { value: 'lions', label: 'Lions' },
    { value: 'bears', label: 'Bears' },
    { value: 'wolves', label: 'Wolves' },
    { value: 'hawks', label: 'Hawks' },
    { value: 'sharks', label: 'Sharks' },
    { value: 'panthers', label: 'Panthers' },
  ];

  const timeOptions = [
    { value: 'tbd', label: 'TBD' },
    { value: '6:00 AM', label: '6:00 AM' },
    { value: '7:00 AM', label: '7:00 AM' },
    { value: '8:00 AM', label: '8:00 AM' },
    { value: '9:00 AM', label: '9:00 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '11:00 AM', label: '11:00 AM' },
    { value: '12:00 PM', label: '12:00 PM' },
    { value: '1:00 PM', label: '1:00 PM' },
    { value: '2:00 PM', label: '2:00 PM' },
    { value: '3:00 PM', label: '3:00 PM' },
    { value: '4:00 PM', label: '4:00 PM' },
    { value: '5:00 PM', label: '5:00 PM' },
    { value: '6:00 PM', label: '6:00 PM' },
    { value: '7:00 PM', label: '7:00 PM' },
    { value: '8:00 PM', label: '8:00 PM' },
    { value: '9:00 PM', label: '9:00 PM' },
  ];

  const venueOptions = [
    { value: 'tbd', label: 'TBD' },
    { value: 'main-stadium', label: 'Main Stadium' },
    { value: 'field-a', label: 'Field A' },
    { value: 'field-b', label: 'Field B' },
    { value: 'field-c', label: 'Field C' },
    { value: 'gym', label: 'Gymnasium' },
    { value: 'practice-field', label: 'Practice Field' },
    { value: 'community-center', label: 'Community Center' },
  ];

  // Mock availability data: venueId -> unavailable times with conflict details
  const VENUE_AVAILABILITY: Record<string, { time: string; conflict: string }[]> = {
    'main-stadium': [
      { time: '10:00 AM', conflict: 'Eagles U12 vs Tigers U12 at Main Stadium' },
      { time: '11:00 AM', conflict: 'Lions U12 vs Panthers U12 at Main Stadium' },
    ],
    'field-a': [
      { time: '2:00 PM', conflict: 'Hawks U12 vs Falcons U12 at Field A' },
    ],
    'field-b': [
      { time: '3:00 PM', conflict: 'Eagles U12 vs Lions U12 at Field B' },
      { time: '4:00 PM', conflict: 'Tigers U12 vs Panthers U12 at Field B' },
    ],
  };

  const conflict = venue && startTime && venue !== 'tbd' && startTime !== 'tbd' && 
    VENUE_AVAILABILITY[venue]?.find(c => c.time === startTime);

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
        <DialogTrigger asChild data-testid="add-game-button">
          <DropdownMenuItem
            onSelect={(event) => event.preventDefault()}
            data-testid="add-game-button"
          >
            Add game
          </DropdownMenuItem>
        </DialogTrigger>
      <DialogContent showCloseIconButton className="sui-w-full sui-max-w-full md:!sui-max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Game</DialogTitle>
        </DialogHeader>
        <DialogBody className="sui-px-3 sui-mb-3">
          <p className="sui-body sui-font-bold">
            There must be at least one internal team in a game.
          </p>
        </DialogBody>
        <form>
          <div className="sui-px-3 sui-grid sui-gap-1">
            <fieldset>
              <Label htmlFor="add-game-team-type-1" required>
                Team 1
              </Label>
              <div className="sui-flex sui-gap-1">
                <ReactSelect
                  id="add-game-team-type-1"
                  name="team1Type"
                  options={[
                    { value: 'internal', label: 'Internal' },
                    { value: 'external', label: 'External' },
                  ]}
                  value={team1Type ? { value: team1Type, label: team1Type === 'internal' ? 'Internal' : 'External' } : null}
                  onChange={(selectedOption) => setTeam1Type(selectedOption?.value || '')}
                  className="sui-max-w-[120px]"
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
                <div className="sui-flex-1 sui-min-w-0">
                  <ReactSelect
                    name="team1"
                    placeholder="Select a team"
                    options={teamOptions}
                    value={team1 ? teamOptions.find(opt => opt.value === team1) : null}
                    onChange={(selectedOption) => setTeam1(selectedOption?.value || '')}
                    classNamePrefix="sui-react-select"
                    styles={getProductionSelectStyles()}
                  />
                </div>
                <ReactSelect
                  name="homeAwayStatus1"
                  options={[
                    { value: 'home', label: 'Home' },
                    { value: 'away', label: 'Away' },
                  ]}
                  value={team1HomeAway ? { value: team1HomeAway, label: team1HomeAway === 'home' ? 'Home' : 'Away' } : null}
                  onChange={(selectedOption) => setTeam1HomeAway(selectedOption?.value || '')}
                  className="sui-max-w-[120px]"
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
              </div>
            </fieldset>
            <fieldset>
              <Label htmlFor="add-game-team-type-2" required>
                Team 2
              </Label>
              <div className="sui-flex sui-gap-1">
                <ReactSelect
                  id="add-game-team-type-2"
                  name="team2Type"
                  options={[
                    { value: 'internal', label: 'Internal' },
                    { value: 'external', label: 'External' },
                  ]}
                  value={team2Type ? { value: team2Type, label: team2Type === 'internal' ? 'Internal' : 'External' } : null}
                  onChange={(selectedOption) => setTeam2Type(selectedOption?.value || '')}
                  className="sui-max-w-[120px]"
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
                <div className="sui-flex-1 sui-min-w-0">
                  <ReactSelect
                    name="team2"
                    placeholder="Select a team"
                    options={teamOptions}
                    value={team2 ? teamOptions.find(opt => opt.value === team2) : null}
                    onChange={(selectedOption) => setTeam2(selectedOption?.value || '')}
                    classNamePrefix="sui-react-select"
                    styles={getProductionSelectStyles()}
                  />
                </div>
                <ReactSelect
                  name="homeAwayStatus2"
                  options={[
                    { value: 'home', label: 'Home' },
                    { value: 'away', label: 'Away' },
                  ]}
                  value={team2HomeAway ? { value: team2HomeAway, label: team2HomeAway === 'home' ? 'Home' : 'Away' } : null}
                  onChange={(selectedOption) => setTeam2HomeAway(selectedOption?.value || '')}
                  className="sui-max-w-[120px]"
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
              </div>
            </fieldset>
          </div>
          <DropdownMenuSeparator className="sui-my-2" />
          <div className="sui-px-3 sui-grid sui-gap-1">
            <fieldset>
              <Label htmlFor="date-input" required>
                Date
              </Label>
              <Input
                id="date-input"
                name="date"
                type="date"
                placeholder="MM/DD/YYYY"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                size="small"
              />
            </fieldset>
            <fieldset>
              <Label htmlFor="add-game-venue">Venue</Label>
              <ReactSelect
                id="add-game-venue"
                name="venue"
                placeholder="TBD"
                options={venueOptions}
                value={venue ? venueOptions.find(opt => opt.value === venue) : null}
                onChange={(selectedOption) => setVenue(selectedOption?.value || '')}
                classNamePrefix="sui-react-select"
                styles={getProductionSelectStyles()}
              />
            </fieldset>
            <fieldset>
              <div className="sui-flex sui-gap-1 sui-items-end sui-mb-0.5">
                <div className="sui-max-w-[250px]">
                  <Label htmlFor="startTime">Start Time</Label>
                  <ReactSelect
                    id="startTime"
                    name="startTime"
                    placeholder="Select time..."
                    options={timeOptions}
                    value={startTime ? timeOptions.find(opt => opt.value === startTime) : null}
                    onChange={(selectedOption) => setStartTime(selectedOption?.value || '')}
                    classNamePrefix="sui-react-select"
                    styles={getProductionSelectStyles()}
                  />
                </div>
                <div>
                  <LabelButton
                    size="small"
                    variantType="tertiary"
                    labelText={timeZone ?? 'ET - Eastern'}
                    className="sui-mb-[3px]"
                  />
                </div>
              </div>
              <div className="sui-flex sui-items-center sui-gap-2 sui-mt-1">
                <span className="sui-body sui-text-neutral-text-weak sui-text-sm">Leave empty for TBD start time</span>
                {venue && venue !== 'tbd' && (
                  <LabelButton
                    variantType="tertiary"
                    labelText="Find a time"
                    size="small"
                    onClick={() => setShowSuggestedTimes(!showSuggestedTimes)}
                  />
                )}
              </div>
              {conflict && (
                <div className="sui-mt-2 sui-p-2 sui-bg-negative-background-weak sui-rounded-lg sui-border sui-border-negative-border">
                  <p className="sui-body sui-text-negative-text sui-font-bold">
                    ⚠️ {venueOptions.find(v => v.value === venue)?.label} is not available at {startTime}
                  </p>
                  <p className="sui-body sui-text-negative-text sui-text-sm sui-mt-1">
                    Conflict: {conflict.conflict}
                  </p>
                </div>
              )}
              {showSuggestedTimes && venue && venue !== 'tbd' && (
                <div className="sui-mt-2 sui-p-2 sui-bg-neutral-background-weak sui-rounded-lg sui-border sui-border-neutral-border">
                  <p className="sui-body sui-font-bold sui-mb-2">Suggested times for {venueOptions.find(v => v.value === venue)?.label}</p>
                  <div className="sui-flex sui-flex-wrap sui-gap-1">
                    {['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '5:00 PM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setStartTime(time)}
                        className="sui-px-2 sui-py-1 sui-text-body sui-bg-white sui-border sui-border-neutral-border sui-rounded-full hover:sui-border-action-border-hover sui-cursor-pointer"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>
            <fieldset>
              <Label htmlFor="duration-in-hours-input">Duration</Label>
              <div className="sui-flex sui-flex-col sm:sui-flex-row sui-gap-1">
                <ReactSelect
                  id="duration-in-hours-input"
                  name="durationInHours"
                  options={[
                    { value: '0', label: '0 hours' },
                    { value: '1', label: '1 hour' },
                    { value: '2', label: '2 hours' },
                    { value: '3', label: '3 hours' },
                  ]}
                  value={durationHours ? { value: durationHours, label: durationHours === '0' ? '0 hours' : durationHours === '1' ? '1 hour' : `${durationHours} hours` } : null}
                  onChange={(selectedOption) => setDurationHours(selectedOption?.value || '')}
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
                <ReactSelect
                  id="duration-in-minutes-input"
                  name="durationInMinutes"
                  options={[
                    { value: '0', label: '0 minutes' },
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '45', label: '45 minutes' },
                  ]}
                  value={durationMinutes ? { value: durationMinutes, label: `${durationMinutes} minutes` } : null}
                  onChange={(selectedOption) => setDurationMinutes(selectedOption?.value || '')}
                  classNamePrefix="sui-react-select"
                  styles={getProductionSelectStyles()}
                />
              </div>
            </fieldset>
            <fieldset>
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <ReactSelect
                id="arrivalTime"
                name="arrivalTime"
                placeholder="Select..."
                options={[
                  { value: '15', label: '15 min before' },
                  { value: '30', label: '30 min before' },
                  { value: '45', label: '45 min before' },
                  { value: '60', label: '1 hour before' },
                ]}
                value={arrivalTime ? { value: arrivalTime, label: arrivalTime === '15' ? '15 min before' : arrivalTime === '30' ? '30 min before' : arrivalTime === '45' ? '45 min before' : '1 hour before' } : null}
                onChange={(selectedOption) => setArrivalTime(selectedOption?.value || '')}
                classNamePrefix="sui-react-select"
                styles={getProductionSelectStyles()}
              />
            </fieldset>
          </div>
          <DropdownMenuSeparator className="sui-my-2" />
          <div className="sui-px-3 sui-grid sui-gap-1">
            <fieldset className="sui-pb-4">
              <Label htmlFor="add-game-notes">Notes</Label>
              <Input
                id="add-game-notes"
                name="notes"
                type="textarea"
                placeholder="Add notes"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                rows={3}
              />
            </fieldset>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <SimpleLabelButton type="secondary" label="Cancel" />
            </DialogClose>
            <SimpleLabelButton type="primary" label="Add" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
