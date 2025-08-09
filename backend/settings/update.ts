import { api, APIError } from "encore.dev/api";
import { settingsDB } from "./db";
import type { UpdateSettingRequest, Setting } from "./types";

interface UpdateSettingParams {
  key: string;
}

// Updates a setting value.
export const updateSetting = api<UpdateSettingParams & UpdateSettingRequest, Setting>(
  { expose: true, method: "PUT", path: "/settings/:key" },
  async (params) => {
    const setting = await settingsDB.rawQueryRow<Setting>(
      `UPDATE settings 
       SET value = $1, updated_at = NOW()
       WHERE key = $2
       RETURNING 
         id, key, value, description, type,
         created_at as "createdAt", updated_at as "updatedAt"`,
      params.value,
      params.key
    );

    if (!setting) {
      throw APIError.notFound("setting not found");
    }

    return setting;
  }
);
