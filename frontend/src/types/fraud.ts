export interface FraudCase {
  id: string;
  case_number: string;

  title: string;
  case_type: string;

  status: string;
  priority: string;
  risk_level: string;
  investigation_stage: string;
  source: string;

  description: string | null;

  member_id: string | null;
  provider_id: string | null;
  primary_claim_id: string | null;

  assigned_investigator: string | null;
  investigation_unit: string | null;

  opened_date: string;
  target_resolution_date: string | null;
  closed_date: string | null;

  ai_confidence: number | null;

  suspected_exposure: number;
  validated_exposure: number;
  prevented_loss: number;
  recovery_potential: number;
  recovered_amount: number;

  currency: string;

  fraud_summary: string | null;
  ai_rationale: string | null;

  final_outcome: string | null;
  closure_rationale: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudAlert {
  id: string;
  alert_number: string;
  fraud_case_id: string;

  source: string;

  title: string;
  description: string | null;

  detected_date: string;

  risk_level: string;
  confidence_score: number | null;

  model_name: string | null;
  model_version: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}


export interface FraudEvidence {
  id: string;
  evidence_number: string;
  fraud_case_id: string;

  evidence_type: string;

  title: string;
  description: string | null;

  source_reference: string | null;

  uploaded_by: string | null;
  uploaded_date: string;

  status: string;

  verification_notes: string | null;
  storage_reference: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudInvestigatorNote {
  id: string;
  note_number: string;
  fraud_case_id: string;

  author: string;
  author_role: string | null;

  note_date: string;
  note_text: string;

  visibility: string;

  created_at: string;
  updated_at: string;
}


export interface FraudAction {
  id: string;
  action_number: string;
  fraud_case_id: string;

  action_type: string;
  action_description: string;

  owner: string;

  due_date: string | null;

  priority: string;
  status: string;

  estimated_recovery: number;

  rationale: string | null;
  approved_by: string | null;

  completed_date: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudRecovery {
  id: string;
  recovery_number: string;
  fraud_case_id: string;

  recovery_type: string;
  recovery_status: string;

  identified_date: string;
  target_recovery_date: string | null;
  recovered_date: string | null;

  identified_amount: number;
  approved_amount: number;
  recovered_amount: number;

  currency: string;

  recovery_owner: string;

  counterparty: string | null;
  reference_number: string | null;

  recovery_notes: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudTimelineEvent {
  id: string;
  event_number: string;
  fraud_case_id: string;

  event_type: string;

  title: string;
  description: string | null;

  performed_by: string;

  event_timestamp: string;

  source_reference: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}


export interface FraudDashboardMetrics {
  totalCases: number;
  activeInvestigations: number;
  criticalCases: number;
  highRiskCases: number;
  aiAlerts: number;

  suspectedExposure: number;
  preventedLoss: number;
  recoveryPotential: number;
  recoveredAmount: number;

  investigationBacklog: number;
  closedCases: number;

  averageConfidenceScore: number;
}


export interface FraudCaseWorkspace {
  fraudCase: FraudCase;

  alerts: FraudAlert[];
  evidence: FraudEvidence[];
  investigatorNotes: FraudInvestigatorNote[];
  actions: FraudAction[];
  recoveries: FraudRecovery[];
  timeline: FraudTimelineEvent[];
}export interface FraudCase {
  id: string;
  case_number: string;

  title: string;
  case_type: string;

  status: string;
  priority: string;
  risk_level: string;
  investigation_stage: string;
  source: string;

  description: string | null;

  member_id: string | null;
  provider_id: string | null;
  primary_claim_id: string | null;

  assigned_investigator: string | null;
  investigation_unit: string | null;

  opened_date: string;
  target_resolution_date: string | null;
  closed_date: string | null;

  ai_confidence: number | null;

  suspected_exposure: number;
  validated_exposure: number;
  prevented_loss: number;
  recovery_potential: number;
  recovered_amount: number;

  currency: string;

  fraud_summary: string | null;
  ai_rationale: string | null;

  final_outcome: string | null;
  closure_rationale: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudAlert {
  id: string;
  alert_number: string;
  fraud_case_id: string;

  source: string;

  title: string;
  description: string | null;

  detected_date: string;

  risk_level: string;
  confidence_score: number | null;

  model_name: string | null;
  model_version: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}


export interface FraudEvidence {
  id: string;
  evidence_number: string;
  fraud_case_id: string;

  evidence_type: string;

  title: string;
  description: string | null;

  source_reference: string | null;

  uploaded_by: string | null;
  uploaded_date: string;

  status: string;

  verification_notes: string | null;
  storage_reference: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudInvestigatorNote {
  id: string;
  note_number: string;
  fraud_case_id: string;

  author: string;
  author_role: string | null;

  note_date: string;
  note_text: string;

  visibility: string;

  created_at: string;
  updated_at: string;
}


export interface FraudAction {
  id: string;
  action_number: string;
  fraud_case_id: string;

  action_type: string;
  action_description: string;

  owner: string;

  due_date: string | null;

  priority: string;
  status: string;

  estimated_recovery: number;

  rationale: string | null;
  approved_by: string | null;

  completed_date: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudRecovery {
  id: string;
  recovery_number: string;
  fraud_case_id: string;

  recovery_type: string;
  recovery_status: string;

  identified_date: string;
  target_recovery_date: string | null;
  recovered_date: string | null;

  identified_amount: number;
  approved_amount: number;
  recovered_amount: number;

  currency: string;

  recovery_owner: string;

  counterparty: string | null;
  reference_number: string | null;

  recovery_notes: string | null;

  created_at: string;
  updated_at: string;
}


export interface FraudTimelineEvent {
  id: string;
  event_number: string;
  fraud_case_id: string;

  event_type: string;

  title: string;
  description: string | null;

  performed_by: string;

  event_timestamp: string;

  source_reference: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}


export interface FraudDashboardMetrics {
  totalCases: number;
  activeInvestigations: number;
  criticalCases: number;
  highRiskCases: number;
  aiAlerts: number;

  suspectedExposure: number;
  preventedLoss: number;
  recoveryPotential: number;
  recoveredAmount: number;

  investigationBacklog: number;
  closedCases: number;

  averageConfidenceScore: number;
}


export interface FraudCaseWorkspace {
  fraudCase: FraudCase;

  alerts: FraudAlert[];
  evidence: FraudEvidence[];
  investigatorNotes: FraudInvestigatorNote[];
  actions: FraudAction[];
  recoveries: FraudRecovery[];
  timeline: FraudTimelineEvent[];
}