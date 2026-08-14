import api from "./api";

import type {
  UnderwritingApplication,
} from "../types/underwriting";


export async function getUnderwritingApplications(): Promise<
  UnderwritingApplication[]
> {
  const response = await api.get<
    UnderwritingApplication[]
  >("/underwriting", {
    params: {
      skip: 0,
      limit: 500,
    },
  });

  return response.data;
}


export async function getUnderwritingApplication(
  applicationId: string,
): Promise<UnderwritingApplication> {
  const response =
    await api.get<UnderwritingApplication>(
      `/underwriting/${applicationId}`,
    );

  return response.data;
}


export async function getUnderwritingApplicationByNumber(
  applicationNumber: string,
): Promise<UnderwritingApplication> {
  const response =
    await api.get<UnderwritingApplication>(
      `/underwriting/number/${encodeURIComponent(
        applicationNumber,
      )}`,
    );

  return response.data;
}

export interface UpdateUnderwritingApplicationPayload {
  product?: string;
  submitted_date?: string;
  risk_score?: number | null;
  status?: string;
  assigned_underwriter?: string | null;
  clinical_summary?: string | null;
  ai_recommendation?: string | null;
  decision?: string | null;
  decision_rationale?: string | null;
  reviewed_at?: string | null;
}


export async function updateUnderwritingApplication(
  applicationId: string,
  payload: UpdateUnderwritingApplicationPayload,
): Promise<UnderwritingApplication> {
  const response =
    await api.patch<UnderwritingApplication>(
      `/underwriting/${applicationId}`,
      payload,
    );

  return response.data;
}