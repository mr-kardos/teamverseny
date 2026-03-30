import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GameData, Character } from "../types";
import { fetchGameState } from "../api";
import { Scoreboard } from "../components/Scoreboard";
import { CharacterCard } from "../components/CharacterCard";
import { Settings, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

export function PublicView() {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGameState = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGameState();
      setGameData(data);
    } catch (err) {
      console.error("Failed to load game state:", err);
      setError("Nem sikerült betölteni a játék állapotát");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameState();
    
    // Auto-refresh every 10 seconds
    // const interval = setInterval(loadGameState, 300000);
    // return () => clearInterval(interval);
  }, []);

  const getCharactersByStatus = (status: string) => {
    return gameData?.characters.filter((c: Character) => c.status === status) || [];
  };

  const targetableCharacters = getCharactersByStatus("targetable");
  const eliminatedToday = gameData?.characters.filter(
    (c: Character) => c.status === "eliminated" && c.eliminatedDay === gameData.state.currentRound
  ) || [];

  if (loading && !gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-300 text-lg">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (error && !gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={loadGameState} variant="outline" className="bg-red-900/30">
            Újrapróbálkozás
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      {/* Header */}
      <header className="bg-stone-900/80 backdrop-blur-sm border-b border-stone-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-100 mb-1">
                Teamverseny
              </h1>
              <p className="text-stone-400 text-sm">Eredmények követése</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadGameState}
                variant="ghost"
                size="icon"
                className="text-stone-300 hover:text-stone-100"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="ghost"
                size="icon"
                className="text-stone-300 hover:text-stone-100"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {gameData && (
          <>
            {/* Scoreboard */}
            <div className="mb-8">
              <Scoreboard 
                teams={gameData.state.teams} 
                currentRound={gameData.state.currentRound} 
              />
            </div>

            {/* Current Targets */}
            {targetableCharacters.length > 0 && (
              <div className="mb-8">
                <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-4">
                    Még heti játékban ({targetableCharacters.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {targetableCharacters.map((character: Character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Eliminated Today */}
            {eliminatedToday.length > 0 && (
              <div className="mb-8">
                <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-4">
                    Ma kiesett ({eliminatedToday.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {eliminatedToday.map((character: Character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Characters */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4">
                Összes karakter ({gameData.characters.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
                {gameData.characters.map((character: Character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
