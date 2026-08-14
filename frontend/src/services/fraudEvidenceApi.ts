import api from "./api";

import type {
  FraudEvidence,
} from "../types/fraud";


export async function getFraudEvidence(
  fraudCaseId?: string,
): Promise<FraudEvidence[]> {
  const response = await api.get<FraudEvidence[]>(
    "/fraud-evidence",
    {
      params: {
        skip: 0,
        limit: 500,
        fraud_case_id: fraudCaseId,
      },
    },
  );

  return response.data;
}