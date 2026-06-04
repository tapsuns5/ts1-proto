import { useState } from 'react';
import { SimpleIcon } from '@/components/SimpleIcon';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import type { VenueAvailability, Game } from '@/components/schedule-wizard/types';

interface Step4Props {
  selectedDivision: string;
  gamesPerTeam: number;
  gameDuration: number;
  startDate: string;
  endDate: string;
  venueAvailability: Record<string, VenueAvailability>;
  onVenueAvailabilityChange: (value: Record<string, VenueAvailability>) => void;
  onEndDateChange: (value: string) => void;
  onGamesGenerated: (games: Game[]) => void;
  onManageGames: () => void;
}

export function Step4_GenerateDraftGames({
  selectedDivision,
  gamesPerTeam,
  gameDuration,
  startDate,
  endDate,
  venueAvailability,
  onVenueAvailabilityChange,
  onEndDateChange,
  onGamesGenerated,
  onManageGames,
}: Step4Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateMockGames = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockGames: Game[] = [];
      const teams = ['team-1', 'team-2', 'team-3', 'team-4', 'team-5', 'team-6'];
      const venues = ['venue-1', 'venue-2'];
      const subVenues = ['field-1', 'field-2', 'field-a', 'field-b'];
      
      let gameIndex = 0;
      const totalGames = gamesPerTeam * teams.length / 2; // Each game involves 2 teams
      
      for (let week = 1; week <= 8; week++) {
        for (let gameNum = 0; gameNum < Math.min(3, totalGames - gameIndex); gameNum++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + (week - 1) * 7 + gameNum * 2);
          
          const homeTeam = teams[(gameIndex * 2) % teams.length];
          const awayTeam = teams[(gameIndex * 2 + 1) % teams.length];
          const venue = venues[gameIndex % venues.length];
          const subVenue = subVenues[gameIndex % subVenues.length];
          
          mockGames.push({
            id: `game-${gameIndex + 1}`,
            week,
            homeTeamId: homeTeam,
            awayTeamId: awayTeam,
            date: date.toISOString().split('T')[0],
            time: `${9 + gameNum}:00`,
            venueId: venue,
            subVenueId: subVenue,
            playingGroupId: 'pg-1',
          });
          
          gameIndex++;
        }
      }
      
      setGames(mockGames);
      setHasGenerated(true);
      setIsGenerating(false);
      onGamesGenerated(mockGames);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="sui-flex sui-justify-center">
      <div className="sui-w-full sui-max-w-6xl sui-flex sui-flex-col sui-gap-6">
        {!hasGenerated ? (
          <div className="sui-text-center sui-py-12">
            <div className="sui-flex sui-justify-center sui-mb-6">
              <div className="sui-w-16 sui-h-16 sui-bg-admin-action-background sui-rounded-full sui-flex sui-items-center sui-justify-center">
                <SimpleIcon name="sports_soccer" size="l" className="sui-text-white" />
              </div>
            </div>
            <h3 className="sui-text-lg sui-font-semibold sui-text-neutral-text sui-mb-2">
              Generate Draft Games
            </h3>
            <p className="sui-text-sm sui-text-neutral-text-medium sui-mb-6 sui-max-w-md sui-mx-auto">
              Based on your configuration, we'll generate a complete schedule with games, venues, and times.
              You can review and adjust before publishing.
            </p>
            
            <SimpleLabelButton
              type="primary"
              label={isGenerating ? "Generating..." : "Generate Draft Games"}
              onClick={generateMockGames}
              disabled={isGenerating}
              className="sui-mx-auto"
            />
            
            {isGenerating && (
              <div className="sui-flex sui-items-center sui-justify-center sui-gap-2 sui-mt-4">
                <div className="sui-animate-spin sui-w-4 sui-h-4 sui-border-2 sui-border-admin-action-border sui-border-t-transparent sui-rounded-full"></div>
                <span className="sui-text-sm sui-text-neutral-text-medium">
                  Creating optimal schedule...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Success Message */}
            <div className="sui-bg-green-50 sui-border sui-border-green-200 sui-rounded-lg sui-p-4 sui-mb-6">
              <div className="sui-flex sui-items-center sui-gap-2 sui-mb-2">
                <SimpleIcon name="check_circle" size="s" className="sui-text-green-600" />
                <h3 className="sui-text-sm sui-font-semibold sui-text-green-800">Schedule Generated Successfully</h3>
              </div>
              <p className="sui-text-sm sui-text-green-700">
                Generated {games.length} games across 8 weeks. Review the schedule below and publish when ready.
              </p>
            </div>

            {/* Games Preview */}
            <div className="sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white">
              <div className="sui-px-4 sui-py-3 sui-border-b sui-border-neutral-border">
                <div className="sui-flex sui-items-center sui-justify-between">
                  <h3 className="sui-text-sm sui-font-semibold sui-text-neutral-text">Generated Games</h3>
                  <SimpleLabelButton
                    type="secondary"
                    label="Regenerate"
                    onClick={generateMockGames}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="sui-max-h-96 sui-overflow-y-auto">
                <div className="sui-divide-y sui-divide-neutral-border">
                  {games.map((game) => (
                    <div key={game.id} className="sui-p-4 sui-flex sui-items-center sui-justify-between sui-hover:sui-bg-neutral-background-weak">
                      <div className="sui-flex sui-items-center sui-gap-4">
                        <div className="sui-text-sm sui-font-medium sui-text-neutral-text sui-w-16">
                          Week {game.week}
                        </div>
                        <div className="sui-text-sm sui-text-neutral-text">
                          {formatDate(game.date || '')} at {game.time}
                        </div>
                        <div className="sui-text-sm sui-font-medium sui-text-neutral-text">
                          {game.homeTeamId} vs {game.awayTeamId}
                        </div>
                        <div className="sui-text-xs sui-text-neutral-text-medium sui-bg-neutral-background-weak sui-px-2 sui-py-1 sui-rounded">
                          {game.venueId} - {game.subVenueId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sui-flex sui-items-center sui-justify-center sui-gap-4 sui-mt-6">
              <SimpleLabelButton
                type="secondary"
                label="Manage Games"
                onClick={onManageGames}
              />
              <SimpleLabelButton
                type="primary"
                label="Publish Schedule"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
