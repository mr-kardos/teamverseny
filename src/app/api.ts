import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-136f1722`;

export async function fetchGameState() {
  const response = await fetch(`${API_BASE}/game-state`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error fetching game state:", error);
    throw new Error(error.error || "Failed to fetch game state");
  }
  
  return response.json();
}

export async function adminLogin(password: string) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error("Admin login error:", data);
    throw new Error(data.error || "Login failed");
  }
  
  return data;
}

export async function updateTeamScore(team: string, score: number) {
  const response = await fetch(`${API_BASE}/admin/update-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ team, score }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error updating team score:", error);
    throw new Error(error.error || "Failed to update score");
  }
  
  return response.json();
}

export async function updateRound(round: number) {
  const response = await fetch(`${API_BASE}/admin/update-round`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ round }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error updating round:", error);
    throw new Error(error.error || "Failed to update round");
  }
  
  return response.json();
}

export async function updateCharacter(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/admin/update-character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ id, updates }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error updating character:", error);
    throw new Error(error.error || "Failed to update character");
  }
  
  return response.json();
}

export async function addCharacter(name: string, imageUrl?: string) {
  const response = await fetch(`${API_BASE}/admin/add-character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ name, imageUrl }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error adding character:", error);
    throw new Error(error.error || "Failed to add character");
  }
  
  return response.json();
}

export async function deleteCharacter(id: string) {
  const response = await fetch(`${API_BASE}/admin/delete-character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ id }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error deleting character:", error);
    throw new Error(error.error || "Failed to delete character");
  }
  
  return response.json();
}

export async function bulkUpdateStatus(characterIds: string[], status: string, eliminatedDay?: number) {
  const response = await fetch(`${API_BASE}/admin/bulk-update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ characterIds, status, eliminatedDay }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Error bulk updating character statuses:", error);
    throw new Error(error.error || "Failed to bulk update");
  }
  
  return response.json();
}
