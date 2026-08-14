import api from "./api";

import type { Claim } from "../types/claim";


export async function getClaims(): Promise<Claim[]> {
  const response = await api.get<Claim[]>(
    "/claims",
  );

  return response.data;
}


export async function getClaimById(
  claimId: string,
): Promise<Claim> {
  const response = await api.get<Claim>(
    `/claims/${encodeURIComponent(
      claimId,
    )}`,
  );

  return response.data;
}


export async function getClaimByNumber(
  claimNumber: string,
): Promise<Claim> {
  const response = await api.get<Claim>(
    `/claims/number/${encodeURIComponent(
      claimNumber,
    )}`,
  );

  return response.data;
}