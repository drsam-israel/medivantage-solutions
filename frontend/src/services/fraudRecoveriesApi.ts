import api from "./api";

import type {
  FraudRecovery,
} from "../types/fraud";


export async function getFraudRecoveries(
  fraudCaseId?: string,
): Promise<FraudRecovery[]> {
  const response = await api.get<FraudRecovery[]>(
    "/fraud-recoveries",
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