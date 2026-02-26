/**
 * History Storage Utility
 * Manages local storage of analysis history
 */

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string; // base64 data URL
  predictions: {
    condition: string;
    confidence: number;
    severity: "low" | "moderate" | "high";
  }[];
  healthScore: number;
  healthGrade: string;
}

const STORAGE_KEY = "dental_analysis_history";
const MAX_HISTORY_ITEMS = 50; // Limit to prevent storage issues

/**
 * Get all history items
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored) as HistoryItem[];
    // Sort by timestamp, newest first
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
}

/**
 * Add a new history item
 */
export function addToHistory(item: Omit<HistoryItem, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();

    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    // Add to beginning of array
    history.unshift(newItem);

    // Keep only the most recent items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

/**
 * Delete a specific history item
 */
export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting history item:", error);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

/**
 * Get history item by ID
 */
export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
