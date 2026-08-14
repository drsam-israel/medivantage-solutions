export interface ClaimIntelligence {
  id: string;
  claim_id: string;

  fraud_risk_score: number | null;
  fraud_risk_level: string | null;
  fraud_risk_reason: string | null;

  clinical_review_status: string;
  clinical_review_summary: string | null;

  sla_status: string;
  sla_due_at: string | null;
  sla_breached: boolean;

  decision_recommendation: string | null;
  decision_confidence: number | null;
  decision_reason: string | null;

  requires_manual_review: boolean;

  reviewed_by: string | null;
  reviewed_at: string | null;

  model_name: string | null;
  model_version: string | null;

  created_at: string;
  updated_at: string;
}

export interface ClaimIntelligenceCreate {
  claim_id: string;

  fraud_risk_score?: number | null;
  fraud_risk_level?: string | null;
  fraud_risk_reason?: string | null;

  clinical_review_status?: string;
  clinical_review_summary?: string | null;

  sla_status?: string;
  sla_due_at?: string | null;
  sla_breached?: boolean;

  decision_recommendation?: string | null;
  decision_confidence?: number | null;
  decision_reason?: string | null;

  requires_manual_review?: boolean;

  reviewed_by?: string | null;
  reviewed_at?: string | null;

  model_name?: string | null;
  model_version?: string | null;
}

export interface ClaimIntelligenceUpdate {
  fraud_risk_score?: number | null;
  fraud_risk_level?: string | null;
  fraud_risk_reason?: string | null;

  clinical_review_status?: string | null;
  clinical_review_summary?: string | null;

  sla_status?: string | null;
  sla_due_at?: string | null;
  sla_breached?: boolean | null;

  decision_recommendation?: string | null;
  decision_confidence?: number | null;
  decision_reason?: string | null;

  requires_manual_review?: boolean | null;

  reviewed_by?: string | null;
  reviewed_at?: string | null;

  model_name?: string | null;
  model_version?: string | null;
}