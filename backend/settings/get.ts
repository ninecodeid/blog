import { api } from "encore.dev/api";
import { settingsDB } from "./db";
import type { Setting, GetSettingsResponse } from "./types";

// Retrieves all settings.
export const getSettings = api<void, GetSettingsResponse>(
  { expose: true, method: "GET", path: "/settings" },
  async () => {
    const settings = await settingsDB.rawQueryAll<Setting>(
      `SELECT 
        id, key, value, description, type,
        created_at as "createdAt", updated_at as "updatedAt"
      FROM settings 
      ORDER BY key ASC`
    );

    return { settings };
  }
);
