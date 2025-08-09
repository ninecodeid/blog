export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSettingRequest {
  value: string;
}

export interface GetSettingsResponse {
  settings: Setting[];
}
