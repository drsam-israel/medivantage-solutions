export type PriorAuthorizationStatus =
  | "PENDING_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "ESCALATED"
  | "APPROVED"
  | "DENIED";

export type PriorAuthorizationDecisionAction =
  | "APPROVE"
  | "REQUEST_MORE_INFORMATION"
  | "ESCALATE"
  | "DENY";

export interface PriorAuthorization {
  id: string;
  authorization_number: string;

  member_id: string;
  provider_id: string;
  enrollment_id: string | null;

  diagnosis_code: string | null;
  diagnosis_description: string | null;

  procedure_code: string | null;
  procedure_description: string;

  requested_service_date: string | null;

  priority: string;
  status: PriorAuthorizationStatus;

  clinical_summary: string | null;

  coverage_status: string | null;
  benefit_category: string | null;
  service_covered: string | null;
  authorization_required: string | null;

  ai_recommendation: string | null;
  ai_confidence: number | null;
  medical_necessity_score: number | null;
  ai_rationale: string | null;

  assigned_reviewer: string | null;
  review_due_at: string | null;

  final_decision: string | null;
  decision_rationale: string | null;

  information_requested: string | null;

  escalation_reason: string | null;
  escalated_to: string | null;

  decided_by: string | null;
  decided_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface PriorAuthorizationDecisionRequest {
  action: PriorAuthorizationDecisionAction;
  reviewer: string;
  rationale: string;

  information_requested?: string | null;
  escalation_reason?: string | null;
  escalated_to?: string | null;
}