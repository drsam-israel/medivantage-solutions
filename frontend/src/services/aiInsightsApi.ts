import api from "./api";

export interface AIInsightApiRecord {
  id: string;
  insight_number: string;
  title: string;
  insight_type: string;
  status: string;
  priority: string;
  risk_level: string;
  description: string | null;
  recommendation: string | null;
  ai_rationale: string | null;
  confidence_score: number | null;
  model_name: string | null;
  model_version: string | null;
  source_module: string | null;
  source_reference: string | null;
  assigned_reviewer: string | null;
  review_status: string | null;
  review_comment: string | null;
  review_date: string | null;
  detected_date: string;
  created_at: string;
  updated_at: string;
}

export interface AIInsightApprovalPayload {
  reviewer: string;
  comment?: string | null;
}

export interface AIInsightApprovalResponse {
  id: string;
  insight_number: string;
  status: string;
  assigned_reviewer: string | null;
  review_status: string | null;
  review_comment: string | null;
  review_date: string | null;
  updated_at: string;
}

export interface AIInsightListParams {
  skip?: number;
  limit?: number;
  status?: string;
  priority?: string;
  risk_level?: string;
  insight_type?: string;
  source_module?: string;
  assigned_reviewer?: string;
  review_status?: string;
}

export interface AIInsightUpdatePayload {
  title?: string;
  insight_type?: string;
  status?: string;
  priority?: string;
  risk_level?: string;
  description?: string | null;
  recommendation?: string | null;
  ai_rationale?: string | null;
  confidence_score?: number | null;
  model_name?: string | null;
  model_version?: string | null;
  source_module?: string | null;
  source_reference?: string | null;
  assigned_reviewer?: string | null;
  review_status?: string | null;
  review_comment?: string | null;
  review_date?: string | null;
  detected_date?: string;
}

export interface AssignHumanReviewPayload {
  reviewer: string;
  comment?: string | null;
}

export async function getAIInsights(
  params: AIInsightListParams = {},
): Promise<AIInsightApiRecord[]> {
  const response = await api.get<AIInsightApiRecord[]>(
    "/ai-insights",
    {
      params: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 100,
        status: params.status,
        priority: params.priority,
        risk_level: params.risk_level,
        insight_type: params.insight_type,
        source_module: params.source_module,
        assigned_reviewer:
          params.assigned_reviewer,
        review_status: params.review_status,
      },
    },
  );

  return response.data;
}

export async function getAIInsight(
  insightId: string,
): Promise<AIInsightApiRecord> {
  const response = await api.get<AIInsightApiRecord>(
    `/ai-insights/${insightId}`,
  );

  return response.data;
}

export async function updateAIInsight(
  insightId: string,
  payload: AIInsightUpdatePayload,
): Promise<AIInsightApiRecord> {
  const response = await api.put<AIInsightApiRecord>(
    `/ai-insights/${insightId}`,
    payload,
  );

  return response.data;
}

export async function assignAIInsightHumanReview(
  insightId: string,
  payload: AssignHumanReviewPayload,
): Promise<AIInsightApiRecord> {
  return updateAIInsight(
    insightId,
    {
      assigned_reviewer: payload.reviewer,
      review_status: "ASSIGNED",
      review_comment: payload.comment ?? null,
      review_date: null,
    },
  );
}

export async function approveAIInsightRecommendation(
  insightId: string,
  payload: AIInsightApprovalPayload,
): Promise<AIInsightApprovalResponse> {
  const response =
    await api.post<AIInsightApprovalResponse>(
      `/ai-insights/${insightId}/approve`,
      payload,
    );

  return response.data;
}