export interface Team {
  name: string;
  score: number;
  color: string;
}

export interface Teams {
  black: Team;
  white: Team;
  red: Team;
  blue: Team;
}

export interface GameState {
  currentRound: number;
  teams: Teams;
}

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  status: "unavailable" | "targetable" | "eliminated";
  eliminatedDay: number | null;
}

export interface GameData {
  state: GameState;
  characters: Character[];
}
