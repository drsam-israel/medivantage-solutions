import api from "./api";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  database?: string;
  timestamp?: string;
}

export async function getHealthStatus(): Promise<HealthResponse> {
  const response =
    await api.get<HealthResponse>(
      "/health",
    );

  return response.data;
}