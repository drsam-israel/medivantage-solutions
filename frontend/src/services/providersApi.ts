import api from "./api";
import type { Provider } from "../types/provider";

export async function getProviders(): Promise<Provider[]> {
  const response = await api.get<Provider[]>("/providers", {
    params: {
      skip: 0,
      limit: 100,
    },
  });

  return response.data;
}

export async function getProvider(
  providerId: string,
): Promise<Provider> {
  const response = await api.get<Provider>(
    `/providers/${providerId}`,
  );

  return response.data;
}