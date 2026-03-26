import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GameData, Character } from "../types";
import { 
  fetchGameState, 
  adminLogin, 
  updateTeamScore, 
  updateRound,
  updateCharacter,
  addCharacter,
  deleteCharacter,
  bulkUpdateStatus
} from "../api";
import { CharacterCard } from "../components/CharacterCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Home, LogOut, Plus, Save, Target, X, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AdminView() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  
  // Form states
  const [scores, setScores] = useState({ black: 0, white: 0, red: 0, blue: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [newCharName, setNewCharName] = useState("");
  const [newCharImage, setNewCharImage] = useState("");
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadGameState();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (gameData) {
      setScores({
        black: gameData.state.teams.black.score,
        white: gameData.state.teams.white.score,
        red: gameData.state.teams.red.score,
        blue: gameData.state.teams.blue.score,
      });
      setCurrentRound(gameData.state.currentRound);
    }
  }, [gameData]);

  const loadGameState = async () => {
    try {
      setLoading(true);
      const data = await fetchGameState();
      setGameData(data);
    } catch (err) {
      toast.error("Nem sikerült betölteni az adatokat");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminLogin(password);
      setIsAuthenticated(true);
      toast.success("Sikeres bejelentkezés");
    } catch (err) {
      toast.error("Helytelen jelszó");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = async (team: string) => {
    try {
      await updateTeamScore(team, scores[team as keyof typeof scores]);
      await loadGameState();
      toast.success("Pontszám frissítve");
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  const handleUpdateRound = async () => {
    try {
      await updateRound(currentRound);
      await loadGameState();
      toast.success("Kör frissítve");
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  const handleToggleCharacter = (charId: string) => {
    const newSelected = new Set(selectedCharacters);
    if (newSelected.has(charId)) {
      newSelected.delete(charId);
    } else {
      newSelected.add(charId);
    }
    setSelectedCharacters(newSelected);
  };

  const handleBulkSetTargetable = async () => {
    if (selectedCharacters.size === 0) {
      toast.error("Válassz ki legalább egy karaktert");
      return;
    }
    try {
      await bulkUpdateStatus(Array.from(selectedCharacters), "targetable");
      await loadGameState();
      setSelectedCharacters(new Set());
      toast.success(`${selectedCharacters.size} karakter célponttá téve`);
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  const handleBulkSetEliminated = async () => {
    if (selectedCharacters.size === 0) {
      toast.error("Válassz ki legalább egy karaktert");
      return;
    }
    try {
      await bulkUpdateStatus(Array.from(selectedCharacters), "eliminated", gameData?.state.currentRound);
      await loadGameState();
      setSelectedCharacters(new Set());
      toast.success(`${selectedCharacters.size} karakter kiesettnek jelölve`);
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  const handleBulkSetUnavailable = async () => {
    if (selectedCharacters.size === 0) {
      toast.error("Válassz ki legalább egy karaktert");
      return;
    }
    try {
      await bulkUpdateStatus(Array.from(selectedCharacters), "unavailable");
      await loadGameState();
      setSelectedCharacters(new Set());
      toast.success(`${selectedCharacters.size} karakter zárolva`);
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  const handleAddCharacter = async () => {
    if (!newCharName.trim()) {
      toast.error("Add meg a karakter nevét");
      return;
    }
    try {
      await addCharacter(newCharName, newCharImage);
      await loadGameState();
      setNewCharName("");
      setNewCharImage("");
      toast.success("Karakter hozzáadva");
    } catch (err) {
      toast.error("Hozzáadás sikertelen");
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a karaktert?")) return;
    try {
      await deleteCharacter(id);
      await loadGameState();
      toast.success("Karakter törölve");
    } catch (err) {
      toast.error("Törlés sikertelen");
    }
  };

  const handleEditCharacter = async () => {
    if (!editingChar) return;
    try {
      await updateCharacter(editingChar.id, {
        name: editingChar.name,
        imageUrl: editingChar.imageUrl,
      });
      await loadGameState();
      setEditingChar(null);
      toast.success("Karakter frissítve");
    } catch (err) {
      toast.error("Frissítés sikertelen");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-stone-800 border-stone-700 p-8">
          <h1 className="text-2xl font-bold text-stone-100 mb-6 text-center">
            Admin Bejelentkezés
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-stone-200">Jelszó</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-stone-700 border-stone-600 text-stone-100"
                placeholder="Írd be a jelszót"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Bejelentkezés..." : "Bejelentkezés"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Vissza a főoldalra
            </Button>
          </form>
          <p className="text-stone-400 text-sm mt-4 text-center">
            Alapértelmezett jelszó: <code className="bg-stone-700 px-2 py-1 rounded">admin123</code>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <header className="bg-stone-900/80 backdrop-blur-sm border-b border-stone-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-stone-100">Admin Panel</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Főoldal
              </Button>
              <Button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword("");
                }}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Kijelentkezés
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="scores">Pontszámok</TabsTrigger>
            <TabsTrigger value="characters">Karakterek</TabsTrigger>
            <TabsTrigger value="manage">Kezelés</TabsTrigger>
          </TabsList>

          {/* Scores Tab */}
          <TabsContent value="scores">
            <div className="space-y-6">
              {/* Round Control */}
              <Card className="bg-stone-800 border-stone-700 p-6">
                <h2 className="text-xl font-bold text-stone-100 mb-4">Aktuális kör</h2>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="round" className="text-stone-200">Kör (1-5)</Label>
                    <Input
                      id="round"
                      type="number"
                      min="1"
                      max="5"
                      value={currentRound}
                      onChange={(e) => setCurrentRound(parseInt(e.target.value))}
                      className="bg-stone-700 border-stone-600 text-stone-100"
                    />
                  </div>
                  <Button onClick={handleUpdateRound}>
                    <Save className="w-4 h-4 mr-2" />
                    Mentés
                  </Button>
                </div>
              </Card>

              {/* Team Scores */}
              {gameData && Object.entries(gameData.state.teams).map(([key, team]) => (
                <Card key={key} className="bg-stone-800 border-stone-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-full border-2"
                      style={{
                        backgroundColor: team.color,
                        ...(key === 'white' && { border: '2px solid #374151' })
                      }}
                    />
                    <h2 className="text-xl font-bold text-stone-100">{team.name}</h2>
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`score-${key}`} className="text-stone-200">Pontszám</Label>
                      <Input
                        id={`score-${key}`}
                        type="number"
                        value={scores[key as keyof typeof scores]}
                        onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) || 0 })}
                        className="bg-stone-700 border-stone-600 text-stone-100"
                      />
                    </div>
                    <Button onClick={() => handleUpdateScore(key)}>
                      <Save className="w-4 h-4 mr-2" />
                      Mentés
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters">
            <div className="space-y-6">
              {/* Bulk Actions */}
              {selectedCharacters.size > 0 && (
                <Card className="bg-amber-900/20 border-amber-600/30 p-4">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <span className="text-amber-400 font-semibold">
                      {selectedCharacters.size} karakter kiválasztva
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={handleBulkSetTargetable} className="bg-amber-600 hover:bg-amber-700">
                        <Target className="w-4 h-4 mr-2" />
                        Célponttá tét
                      </Button>
                      <Button size="sm" onClick={handleBulkSetEliminated} className="bg-red-600 hover:bg-red-700">
                        <X className="w-4 h-4 mr-2" />
                        Kiesettnek jelölés
                      </Button>
                      <Button size="sm" onClick={handleBulkSetUnavailable} variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Zárolás
                      </Button>
                      <Button size="sm" onClick={() => setSelectedCharacters(new Set())} variant="outline">
                        Kijelölés törlése
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Characters Grid */}
              {gameData && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {gameData.characters.map((character: Character) => (
                    <div key={character.id} className="relative group">
                      <CharacterCard
                        character={character}
                        onClick={() => handleToggleCharacter(character.id)}
                        isSelectable
                        isSelected={selectedCharacters.has(character.id)}
                      />
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChar(character);
                              }}
                            >
                              ✏️
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-stone-800 border-stone-700">
                            <DialogHeader>
                              <DialogTitle className="text-stone-100">Karakter szerkesztése</DialogTitle>
                            </DialogHeader>
                            {editingChar && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-stone-200">Név</Label>
                                  <Input
                                    value={editingChar.name}
                                    onChange={(e) => setEditingChar({ ...editingChar, name: e.target.value })}
                                    className="bg-stone-700 border-stone-600 text-stone-100"
                                  />
                                </div>
                                <div>
                                  <Label className="text-stone-200">Kép URL</Label>
                                  <Input
                                    value={editingChar.imageUrl}
                                    onChange={(e) => setEditingChar({ ...editingChar, imageUrl: e.target.value })}
                                    className="bg-stone-700 border-stone-600 text-stone-100"
                                  />
                                </div>
                                <Button onClick={handleEditCharacter} className="w-full">
                                  Mentés
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(character.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card className="bg-stone-800 border-stone-700 p-6">
              <h2 className="text-xl font-bold text-stone-100 mb-4">Új karakter hozzáadása</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="char-name" className="text-stone-200">Név *</Label>
                  <Input
                    id="char-name"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    className="bg-stone-700 border-stone-600 text-stone-100"
                    placeholder="Karakter neve"
                  />
                </div>
                <div>
                  <Label htmlFor="char-image" className="text-stone-200">Kép URL (opcionális)</Label>
                  <Input
                    id="char-image"
                    value={newCharImage}
                    onChange={(e) => setNewCharImage(e.target.value)}
                    className="bg-stone-700 border-stone-600 text-stone-100"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-stone-400 text-xs mt-1">
                    Ha üresen hagyod, automatikusan generálunk egy képet
                  </p>
                </div>
                <Button onClick={handleAddCharacter} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Hozzáadás
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
