"use client";

import { Participants, type Participant } from "./Participants";

interface TeamParticipantsProps {
  teamName: string;
  participants?: Participant[];
}

export function TeamParticipants({ teamName, participants }: TeamParticipantsProps) {
  return <Participants participants={participants || []} teamFilter={teamName} showAvailabilityColumns={true} />;
}
