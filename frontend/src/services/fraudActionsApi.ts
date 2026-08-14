import api from "./api";

import type {
  FraudAction,
} from "../types/fraud";


export async function getFraudActions(
  fraudCaseId?: string,
): Promise<FraudAction[]> {
  const response = await api.get<FraudAction[]>(
    "/fraud-actions",
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