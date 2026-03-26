import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-136f1722/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize game data if not exists
async function initializeGameData() {
  const gameState = await kv.get("game:state");
  if (!gameState) {
    const initialState = {
      currentRound: 1,
      teams: {
        black: { name: "Fekete", score: 0, color: "#1a1a1a" },
        white: { name: "Fehér", score: 0, color: "#ffffff" },
        red: { name: "Piros", score: 0, color: "#dc2626" },
        blue: { name: "Kék", score: 0, color: "#2563eb" }
      }
    };
    await kv.set("game:state", initialState);
  }

  const characters = await kv.get("game:characters");
  if (!characters) {
    // Initialize with 49 sample characters
    const initialCharacters = Array.from({ length: 49 }, (_, i) => ({
      id: `char-${i + 1}`,
      name: `Célpont ${i + 1}`,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
      status: "unavailable", // unavailable, targetable, eliminated
      eliminatedDay: null
    }));
    await kv.set("game:characters", initialCharacters);
  }

  const adminPassword = await kv.get("admin:password");
  if (!adminPassword) {
    await kv.set("admin:password", "admin123"); // Default password
  }
}

// Initialize on startup
initializeGameData();

// Get game state (public)
app.get("/make-server-136f1722/game-state", async (c) => {
  try {
    const state = await kv.get("game:state");
    const characters = await kv.get("game:characters");
    return c.json({ state, characters });
  } catch (error) {
    console.error("Error fetching game state:", error);
    return c.json({ error: "Failed to fetch game state" }, 500);
  }
});

// Admin authentication
app.post("/make-server-136f1722/admin/login", async (c) => {
  try {
    const { password } = await c.req.json();
    const adminPassword = await kv.get("admin:password");
    
    if (password === adminPassword) {
      return c.json({ success: true, token: "admin-authenticated" });
    } else {
      return c.json({ success: false, error: "Helytelen jelszó" }, 401);
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return c.json({ error: "Bejelentkezési hiba" }, 500);
  }
});

// Update team score (admin only)
app.post("/make-server-136f1722/admin/update-score", async (c) => {
  try {
    const { team, score } = await c.req.json();
    const state = await kv.get("game:state");
    
    if (state.teams[team]) {
      state.teams[team].score = parseInt(score);
      await kv.set("game:state", state);
      return c.json({ success: true, state });
    } else {
      return c.json({ error: "Érvénytelen csapat" }, 400);
    }
  } catch (error) {
    console.error("Error updating team score:", error);
    return c.json({ error: "Pontszám frissítése sikertelen" }, 500);
  }
});

// Update current round (admin only)
app.post("/make-server-136f1722/admin/update-round", async (c) => {
  try {
    const { round } = await c.req.json();
    const state = await kv.get("game:state");
    state.currentRound = parseInt(round);
    await kv.set("game:state", state);
    return c.json({ success: true, state });
  } catch (error) {
    console.error("Error updating round:", error);
    return c.json({ error: "Kör frissítése sikertelen" }, 500);
  }
});

// Update character (admin only)
app.post("/make-server-136f1722/admin/update-character", async (c) => {
  try {
    const { id, updates } = await c.req.json();
    const characters = await kv.get("game:characters");
    
    const charIndex = characters.findIndex((ch: any) => ch.id === id);
    if (charIndex !== -1) {
      characters[charIndex] = { ...characters[charIndex], ...updates };
      await kv.set("game:characters", characters);
      return c.json({ success: true, characters });
    } else {
      return c.json({ error: "Karakter nem található" }, 404);
    }
  } catch (error) {
    console.error("Error updating character:", error);
    return c.json({ error: "Karakter frissítése sikertelen" }, 500);
  }
});

// Add character (admin only)
app.post("/make-server-136f1722/admin/add-character", async (c) => {
  try {
    const { name, imageUrl } = await c.req.json();
    const characters = await kv.get("game:characters");
    
    const newCharacter = {
      id: `char-${Date.now()}`,
      name,
      imageUrl: imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      status: "unavailable",
      eliminatedDay: null
    };
    
    characters.push(newCharacter);
    await kv.set("game:characters", characters);
    return c.json({ success: true, character: newCharacter, characters });
  } catch (error) {
    console.error("Error adding character:", error);
    return c.json({ error: "Karakter hozzáadása sikertelen" }, 500);
  }
});

// Delete character (admin only)
app.post("/make-server-136f1722/admin/delete-character", async (c) => {
  try {
    const { id } = await c.req.json();
    const characters = await kv.get("game:characters");
    
    const filteredCharacters = characters.filter((ch: any) => ch.id !== id);
    await kv.set("game:characters", filteredCharacters);
    return c.json({ success: true, characters: filteredCharacters });
  } catch (error) {
    console.error("Error deleting character:", error);
    return c.json({ error: "Karakter törlése sikertelen" }, 500);
  }
});

// Bulk update character statuses (admin only)
app.post("/make-server-136f1722/admin/bulk-update-status", async (c) => {
  try {
    const { characterIds, status, eliminatedDay } = await c.req.json();
    const characters = await kv.get("game:characters");
    
    characters.forEach((ch: any) => {
      if (characterIds.includes(ch.id)) {
        ch.status = status;
        if (status === "eliminated" && eliminatedDay) {
          ch.eliminatedDay = eliminatedDay;
        }
      }
    });
    
    await kv.set("game:characters", characters);
    return c.json({ success: true, characters });
  } catch (error) {
    console.error("Error bulk updating character statuses:", error);
    return c.json({ error: "Tömeges frissítés sikertelen" }, 500);
  }
});

Deno.serve(app.fetch);