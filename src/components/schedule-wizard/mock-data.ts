import type { Team, Division, Venue, ScheduleEvent } from './types';

export const PROGRAM: {
  id: string;
  name: string;
  organization: string;
  divisions: Division[];
} = {
  id: 'spring-2026',
  name: 'Spring 2026',
  organization: 'Riverbend Youth Soccer Club',
  divisions: [
    { id: 'u8', name: 'U8', teamCount: 14 },
    { id: 'u10', name: 'U10', teamCount: 14 },
    { id: 'u12-boys', name: 'U12 Boys', teamCount: 14 },
    { id: 'u12-girls', name: 'U12 Girls', teamCount: 14 },
  ],
};

export const ALL_TEAMS: Team[] = [
  // U12 Boys (14 teams: 12 regular + Staff + Select)
  { id: 'team-1', name: 'Wildcats', divisionId: 'u12-boys', short: 'WC' },
  { id: 'team-2', name: 'Rapids', divisionId: 'u12-boys', short: 'RA' },
  { id: 'team-3', name: 'Thunder', divisionId: 'u12-boys', short: 'TH' },
  { id: 'team-4', name: 'Comets', divisionId: 'u12-boys', short: 'CO' },
  { id: 'team-5', name: 'Rangers', divisionId: 'u12-boys', short: 'RG' },
  { id: 'team-6', name: 'Strikers', divisionId: 'u12-boys', short: 'ST' },
  { id: 'team-101', name: 'Titans', divisionId: 'u12-boys', short: 'TN' },
  { id: 'team-102', name: 'Vipers', divisionId: 'u12-boys', short: 'VI' },
  { id: 'team-103', name: 'Cobras', divisionId: 'u12-boys', short: 'CB' },
  { id: 'team-104', name: 'Bulldogs', divisionId: 'u12-boys', short: 'BD' },
  { id: 'team-105', name: 'Mustangs', divisionId: 'u12-boys', short: 'MU' },
  { id: 'team-106', name: 'Hornets', divisionId: 'u12-boys', short: 'HN' },
  { id: 'team-14', name: 'Staff Team', divisionId: 'u12-boys', short: 'SF' },
  { id: 'team-107', name: 'Select Team', divisionId: 'u12-boys', short: 'SEL' },

  // U12 Girls (14 teams: 12 regular + Staff + Select)
  { id: 'team-7', name: 'Hawks', divisionId: 'u12-girls', short: 'HK' },
  { id: 'team-8', name: 'Sparks', divisionId: 'u12-girls', short: 'SP' },
  { id: 'team-9', name: 'Tigers', divisionId: 'u12-girls', short: 'TI' },
  { id: 'team-10', name: 'Eagles', divisionId: 'u12-girls', short: 'EA' },
  { id: 'team-11', name: 'Phoenix', divisionId: 'u12-girls', short: 'PH' },
  { id: 'team-12', name: 'Falcons', divisionId: 'u12-girls', short: 'FA' },
  { id: 'team-108', name: 'Lynx', divisionId: 'u12-girls', short: 'LX' },
  { id: 'team-109', name: 'Storm', divisionId: 'u12-girls', short: 'SM' },
  { id: 'team-110', name: 'Cheetahs', divisionId: 'u12-girls', short: 'CH' },
  { id: 'team-111', name: 'Jaguars', divisionId: 'u12-girls', short: 'JG' },
  { id: 'team-112', name: 'Pumas', divisionId: 'u12-girls', short: 'PU' },
  { id: 'team-113', name: 'Raptors', divisionId: 'u12-girls', short: 'RP' },
  { id: 'team-114', name: 'Staff Team', divisionId: 'u12-girls', short: 'SF' },
  { id: 'team-115', name: 'Select Team', divisionId: 'u12-girls', short: 'SEL' },

  // U10 (14 teams)
  { id: 'team-15', name: 'Lightning', divisionId: 'u10', short: 'LG' },
  { id: 'team-16', name: 'Cyclones', divisionId: 'u10', short: 'CY' },
  { id: 'team-17', name: 'Hurricanes', divisionId: 'u10', short: 'HU' },
  { id: 'team-18', name: 'Tornadoes', divisionId: 'u10', short: 'TO' },
  { id: 'team-19', name: 'Blizzards', divisionId: 'u10', short: 'BZ' },
  { id: 'team-20', name: 'Twisters', divisionId: 'u10', short: 'TW' },
  { id: 'team-21', name: 'Volcanoes', divisionId: 'u10', short: 'VO' },
  { id: 'team-22', name: 'Avalanches', divisionId: 'u10', short: 'AV' },
  { id: 'team-23', name: 'Meteors', divisionId: 'u10', short: 'ME' },
  { id: 'team-24', name: 'Asteroids', divisionId: 'u10', short: 'AS' },
  { id: 'team-25', name: 'Comets', divisionId: 'u10', short: 'CM' },
  { id: 'team-26', name: 'Stars', divisionId: 'u10', short: 'ST' },
  { id: 'team-27', name: 'Novas', divisionId: 'u10', short: 'NV' },
  { id: 'team-28', name: 'Pulsars', divisionId: 'u10', short: 'PS' },

  // U8 (14 teams)
  { id: 'team-29', name: 'Cubs', divisionId: 'u8', short: 'CU' },
  { id: 'team-30', name: 'Kittens', divisionId: 'u8', short: 'KI' },
  { id: 'team-31', name: 'Lions', divisionId: 'u8', short: 'LI' },
  { id: 'team-32', name: 'Tigers', divisionId: 'u8', short: 'TI' },
  { id: 'team-33', name: 'Leopards', divisionId: 'u8', short: 'LE' },
  { id: 'team-34', name: 'Panthers', divisionId: 'u8', short: 'PA' },
  { id: 'team-35', name: 'Cheetahs', divisionId: 'u8', short: 'CH' },
  { id: 'team-36', name: 'Jaguars', divisionId: 'u8', short: 'JA' },
  { id: 'team-37', name: 'Bobcats', divisionId: 'u8', short: 'BO' },
  { id: 'team-38', name: 'Lynx', divisionId: 'u8', short: 'LY' },
  { id: 'team-39', name: 'Ocelots', divisionId: 'u8', short: 'OC' },
  { id: 'team-40', name: 'Servals', divisionId: 'u8', short: 'SE' },
  { id: 'team-41', name: 'Caracals', divisionId: 'u8', short: 'CA' },
  { id: 'team-42', name: 'Margays', divisionId: 'u8', short: 'MA' },
];

export const VENUES: Venue[] = [
  {
    id: 'riverbend-complex',
    name: 'Riverbend Soccer Complex',
    address: '4700 Riverbend Dr, Austin, TX 78746',
    subVenues: [
      { id: 'rb-field-1', name: 'Field 1 - Turf', surface: 'Turf', maxConcurrent: 2 },
      { id: 'rb-field-2', name: 'Field 2 - Grass', surface: 'Grass', maxConcurrent: 2 },
      { id: 'rb-field-3', name: 'Field 3 - Turf', surface: 'Turf', maxConcurrent: 1 },
    ],
  },
  {
    id: 'riverbend-stadium',
    name: 'Riverbend Stadium',
    address: '4720 Riverbend Dr, Austin, TX 78746',
    subVenues: [
      { id: 'stadium-field-1', name: 'Field 1 - Turf', surface: 'Turf', maxConcurrent: 1 },
      { id: 'stadium-field-2', name: 'Field 2 - Turf', surface: 'Turf', maxConcurrent: 1 },
    ],
  },
  {
    id: 'memorial-park',
    name: 'Memorial Park',
    address: '1501 Memorial Loop Dr, Austin, TX 78746',
    subVenues: [
      { id: 'mp-field-1', name: 'Field 1 - Grass', surface: 'Grass', maxConcurrent: 1 },
      { id: 'mp-field-2', name: 'Field 2 - Grass', surface: 'Grass', maxConcurrent: 1 },
      { id: 'mp-field-3', name: 'Field 3 - Grass', surface: 'Grass', maxConcurrent: 1 },
    ],
  },
  {
    id: 'lakeview-community',
    name: 'Lakeview Community Center',
    address: '820 Lakeview Blvd, Austin, TX 78732',
    subVenues: [
      { id: 'gym-1', name: 'Gym 1 - Indoor', surface: 'Indoor', maxConcurrent: 2 },
      { id: 'gym-2', name: 'Gym 2 - Indoor', surface: 'Indoor', maxConcurrent: 2 },
    ],
  },
];

// Helper functions
export function getTeamsByDivision(divisionId: string): Team[] {
  return ALL_TEAMS.filter(team => team.divisionId === divisionId);
}

export function getDivisionById(divisionId: string): Division | undefined {
  return PROGRAM.divisions.find(d => d.id === divisionId);
}

export function getTeamById(teamId: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === teamId);
}

export function getVenueById(venueId: string): Venue | undefined {
  return VENUES.find(v => v.id === venueId);
}
