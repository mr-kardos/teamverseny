import { Teams } from "../types";
import { Trophy, Medal } from "lucide-react";

interface ScoreboardProps {
  teams: Teams;
  currentRound: number;
}

export function Scoreboard({ teams, currentRound }: ScoreboardProps) {
  const sortedTeams = Object.entries(teams)
    .map(([key, team]) => ({ key, ...team }))
    .sort((a, b) => b.score - a.score);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-stone-100">
          Eredménytábla
        </h2>
        <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg px-3 py-1.5">
          <span className="text-amber-400 font-semibold text-sm">
            {currentRound}. nap
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTeams.map((team, index) => (
          <div
            key={team.key}
            className="bg-stone-800/50 rounded-lg p-4 flex items-center justify-between transition-all hover:bg-stone-800"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8">
                {getMedalIcon(index)}
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-8 h-8 rounded-full border-2 border-stone-600"
                  style={{
                    backgroundColor: team.color,
                    ...(team.key === 'white' && { border: '2px solid #374151' })
                  }}
                />
                <span className="text-stone-100 font-semibold text-base md:text-lg">
                  {team.name}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-stone-100">
                {team.score}
              </div>
              <div className="text-xs text-stone-400">pont</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
