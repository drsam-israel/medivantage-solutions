export interface UnderwritingApplication {
  id: string;
  member_id: string;

  application_number: string;
  product: string;
  submitted_date: string;

  risk_score: number | null;

  status:
    | "PENDING_REVIEW"
    | "AI_REVIEW"
    | "MANUAL_REVIEW"
    | "APPROVED"
    | "DECLINED"
    | "REFERRED";

  assigned_underwriter: string | null;

  clinical_summary: string | null;
  ai_recommendation: string | null;

  decision: string | null;
  decision_rationale: string | null;

  reviewed_at: string | null;

  created_at: string;
  updated_at: string;
}