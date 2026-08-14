import api from "./api";

import type {
  FraudCase,
} from "../types/fraud";


export interface FraudCaseListParams {
  skip?: number;
  limit?: number;

  status?: string;
  priority?: string;
  risk_level?: string;
  investigation_stage?: string;

  member_id?: string;
  provider_id?: string;

  assigned_investigator?: string;
}


export async function getFraudCases(
  params: FraudCaseListParams = {},
): Promise<FraudCase[]> {
  const response = await api.get<FraudCase[]>(
    "/fraud-cases",
    {
      params: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 100,

        status: params.status,
        priority: params.priority,
        risk_level: params.risk_level,
        investigation_stage:
          params.investigation_stage,

        member_id: params.member_id,
        provider_id: params.provider_id,

        assigned_investigator:
          params.assigned_investigator,
      },
    },
  );

  return response.data;
}


export async function getFraudCase(
  fraudCaseId: string,
): Promise<FraudCase> {
  const response = await api.get<FraudCase>(
    `/fraud-cases/${fraudCaseId}`,
  );

  return response.data;
}


export async function createFraudCase(
  payload: Omit<
    FraudCase,
    | "id"
    | "created_at"
    | "updated_at"
  >,
): Promise<FraudCase> {
  const response = await api.post<FraudCase>(
    "/fraud-cases",
    payload,
  );

  return response.data;
}


export async function updateFraudCase(
  fraudCaseId: string,
  payload: Partial<
    Omit<
      FraudCase,
      | "id"
      | "case_number"
      | "created_at"
      | "updated_at"
    >
  >,
): Promise<FraudCase> {
  const response = await api.put<FraudCase>(
    `/fraud-cases/${fraudCaseId}`,
    payload,
  );

  return response.data;
}


export async function deleteFraudCase(
  fraudCaseId: string,
): Promise<void> {
  await api.delete(
    `/fraud-cases/${fraudCaseId}`,
  );
}