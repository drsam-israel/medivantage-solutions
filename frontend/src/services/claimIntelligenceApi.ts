import api from "./api";

import type {
  ClaimIntelligence,
  ClaimIntelligenceCreate,
  ClaimIntelligenceUpdate,
} from "../types/claimIntelligence";


export async function getClaimIntelligence(
  claimId: string,
): Promise<ClaimIntelligence> {
  const response =
    await api.get<ClaimIntelligence>(
      `/claims/${encodeURIComponent(
        claimId,
      )}/intelligence`,
    );

  return response.data;
}


export async function createClaimIntelligence(
  claimId: string,
  payload: ClaimIntelligenceCreate,
): Promise<ClaimIntelligence> {
  const response =
    await api.post<ClaimIntelligence>(
      `/claims/${encodeURIComponent(
        claimId,
      )}/intelligence`,
      payload,
    );

  return response.data;
}


export async function updateClaimIntelligence(
  claimId: string,
  payload: ClaimIntelligenceUpdate,
): Promise<ClaimIntelligence> {
  const response =
    await api.put<ClaimIntelligence>(
      `/claims/${encodeURIComponent(
        claimId,
      )}/intelligence`,
      payload,
    );

  return response.data;
}