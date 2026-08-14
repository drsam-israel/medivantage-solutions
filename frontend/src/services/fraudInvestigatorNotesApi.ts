import api from "./api";

import type {
  FraudInvestigatorNote,
} from "../types/fraud";


export async function getFraudInvestigatorNotes(
  fraudCaseId?: string,
): Promise<FraudInvestigatorNote[]> {
  const response = await api.get<
    FraudInvestigatorNote[]
  >(
    "/fraud-investigator-notes",
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