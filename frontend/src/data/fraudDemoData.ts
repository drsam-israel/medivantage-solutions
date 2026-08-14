export type FraudCaseStatus =
  | "New"
  | "Under Review"
  | "Investigation"
  | "Escalated"
  | "Recovery Initiated"
  | "Closed"
  | "False Positive";

export type FraudPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type FraudRiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type FraudCategory =
  | "Duplicate Claims"
  | "Upcoding"
  | "Unbundling"
  | "Phantom Billing"
  | "Identity Fraud"
  | "Provider Collusion"
  | "Prescription Abuse"
  | "Medical Necessity Abuse"
  | "Laboratory Abuse"
  | "Billing Pattern Anomaly"
  | "Provider Overutilization"
  | "Member Shopping";

export type AlertSource =
  | "AI Detection Engine"
  | "Claims Rules Engine"
  | "Provider Audit"
  | "Member Complaint"
  | "Payment Reconciliation"
  | "Clinical Review"
  | "External Referral"
  | "Internal Audit";

export type EvidenceType =
  | "Claim Record"
  | "Clinical Document"
  | "Invoice"
  | "Payment Record"
  | "Provider Contract"
  | "Member Statement"
  | "Investigator Note"
  | "Network Analysis"
  | "Audit Report";

export type EvidenceStatus =
  | "Verified"
  | "Pending Review"
  | "Inconclusive"
  | "Rejected";

export type RecommendedActionStatus =
  | "Recommended"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Rejected";

export type TimelineEventStatus =
  | "Completed"
  | "Pending"
  | "Warning"
  | "Escalated";

export interface FraudMember {
  memberId: string;
  memberName: string;
  policyId: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  city: string;
  membershipStatus: string;
  riskLevel: FraudRiskLevel;
  riskScore: number;
  totalClaims: number;
  suspiciousClaims: number;
  totalClaimValue: number;
  lastClaimDate: string;
}

export interface FraudProvider {
  providerId: string;
  providerName: string;
  providerType: string;
  specialty: string;
  city: string;
  networkTier: string;
  contractStatus: string;
  riskLevel: FraudRiskLevel;
  riskScore: number;
  totalClaims: number;
  suspiciousClaims: number;
  totalPaidAmount: number;
  peerVariancePercentage: number;
}

export interface RelatedClaim {
  claimId: string;
  serviceDate: string;
  diagnosisCode: string;
  procedureCode: string;
  procedureDescription: string;
  billedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  claimStatus: string;
  anomalyType: string;
  anomalyScore: number;
  duplicateReference?: string;
}

export interface FraudAlert {
  alertId: string;
  source: AlertSource;
  title: string;
  description: string;
  detectedDate: string;
  riskLevel: FraudRiskLevel;
  confidenceScore: number;
  modelName: string;
  modelVersion: string;
  status: "Open" | "Reviewed" | "Dismissed" | "Escalated";
}

export interface PatternFinding {
  findingId: string;
  category: string;
  title: string;
  description: string;
  observedValue: string;
  expectedValue: string;
  variance: string;
  riskLevel: FraudRiskLevel;
  confidenceScore: number;
}

export interface NetworkRelationship {
  relationshipId: string;
  sourceEntity: string;
  sourceType: "Provider" | "Member" | "Claim" | "Pharmacy";
  targetEntity: string;
  targetType: "Provider" | "Member" | "Claim" | "Pharmacy";
  relationshipType: string;
  interactionCount: number;
  financialValue: number;
  riskLevel: FraudRiskLevel;
  description: string;
}

export interface FraudEvidence {
  evidenceId: string;
  evidenceType: EvidenceType;
  title: string;
  description: string;
  uploadedBy: string;
  uploadedDate: string;
  status: EvidenceStatus;
  sourceReference: string;
}

export interface InvestigatorNote {
  noteId: string;
  author: string;
  role: string;
  date: string;
  note: string;
  visibility: "Internal" | "Legal" | "Audit";
}

export interface RecommendedAction {
  actionId: string;
  action: string;
  owner: string;
  dueDate: string;
  priority: FraudPriority;
  status: RecommendedActionStatus;
  estimatedRecovery: number;
  rationale: string;
}

export interface RecoveryRecord {
  recoveryId: string;
  recoveryType:
    | "Provider Recovery"
    | "Payment Offset"
    | "Claim Reversal"
    | "Legal Recovery"
    | "Contractual Deduction";
  amount: number;
  initiatedDate: string;
  status:
    | "Identified"
    | "Initiated"
    | "In Progress"
    | "Recovered"
    | "Written Off";
  reference: string;
  owner: string;
  notes: string;
}

export interface FraudTimelineEvent {
  eventId: string;
  date: string;
  event: string;
  description: string;
  actor: string;
  status: TimelineEventStatus;
}

export interface FraudCase {
  caseId: string;
  caseTitle: string;
  category: FraudCategory;
  alertSource: AlertSource;
  status: FraudCaseStatus;
  priority: FraudPriority;
  riskLevel: FraudRiskLevel;
  aiConfidenceScore: number;
  fraudRiskScore: number;
  createdDate: string;
  lastUpdatedDate: string;
  assignedInvestigator: string;
  investigatorRole: string;
  investigationUnit: string;
  region: string;
  claimId: string;
  paymentId?: string;
  authorizationId?: string;
  estimatedExposure: number;
  confirmedExposure: number;
  identifiedSavings: number;
  recoveryPotential: number;
  recoveredAmount: number;
  description: string;
  executiveSummary: string;
  allegation: string;
  investigationObjective: string;
  member: FraudMember;
  provider: FraudProvider;
  relatedClaims: RelatedClaim[];
  alerts: FraudAlert[];
  patternFindings: PatternFinding[];
  networkRelationships: NetworkRelationship[];
  evidence: FraudEvidence[];
  investigatorNotes: InvestigatorNote[];
  recommendedActions: RecommendedAction[];
  recoveries: RecoveryRecord[];
  timeline: FraudTimelineEvent[];
}

export interface FraudDashboardMetrics {
  totalCases: number;
  activeInvestigations: number;
  criticalCases: number;
  highRiskClaims: number;
  suspectedFraudRings: number;
  aiAlerts: number;
  estimatedExposure: number;
  identifiedSavings: number;
  recoveryPotential: number;
  recoveredAmount: number;
  investigationBacklog: number;
  closedCases: number;
  averageConfidenceScore: number;
}

export const fraudDemoData: FraudCase[] = [
  {
    caseId: "FWA-2026-001",
    caseTitle:
      "Suspected Upcoding and Procedure Inflation",
    category: "Upcoding",
    alertSource: "AI Detection Engine",
    status: "Investigation",
    priority: "Critical",
    riskLevel: "Critical",
    aiConfidenceScore: 96,
    fraudRiskScore: 94,
    createdDate: "2026-07-04",
    lastUpdatedDate: "2026-07-29",
    assignedInvestigator: "Fatimah Al-Harbi",
    investigatorRole: "Senior FWA Investigator",
    investigationUnit:
      "Provider Integrity and Clinical Coding",
    region: "Riyadh",
    claimId: "CLM-10042",
    paymentId: "PAY-10001",
    authorizationId: "PA-2026-0081",
    estimatedExposure: 486000,
    confirmedExposure: 174000,
    identifiedSavings: 312000,
    recoveryPotential: 174000,
    recoveredAmount: 58000,
    description:
      "A tertiary hospital submitted repeated high-complexity procedure codes that exceeded documented clinical severity and peer utilization benchmarks.",
    executiveSummary:
      "The AI fraud engine identified a sustained pattern of procedure upcoding across cardiology and internal medicine claims. Clinical documentation supports lower-complexity services in multiple reviewed cases. The provider's billing profile is materially above specialty peers, with a 212% variance in high-severity coding.",
    allegation:
      "The provider may have intentionally selected higher-reimbursing diagnosis-related and procedural codes that were not fully supported by the clinical documentation.",
    investigationObjective:
      "Determine the extent of unsupported coding, quantify financial exposure, validate clinical documentation and initiate provider recovery where overpayment is confirmed.",
    member: {
      memberId: "MEM-10021",
      memberName: "Abdulrahman Al-Qahtani",
      policyId: "POL-2026-0042",
      dateOfBirth: "1972-09-16",
      gender: "Male",
      nationality: "Saudi",
      city: "Riyadh",
      membershipStatus: "Active",
      riskLevel: "Medium",
      riskScore: 46,
      totalClaims: 28,
      suspiciousClaims: 3,
      totalClaimValue: 184500,
      lastClaimDate: "2026-06-24",
    },
    provider: {
      providerId: "PRV-10001",
      providerName: "Al Noor Specialist Hospital",
      providerType: "Hospital",
      specialty: "Multi-Specialty",
      city: "Riyadh",
      networkTier: "Tier 1",
      contractStatus: "Active",
      riskLevel: "Critical",
      riskScore: 93,
      totalClaims: 3284,
      suspiciousClaims: 214,
      totalPaidAmount: 28760000,
      peerVariancePercentage: 212,
    },
    relatedClaims: [
      {
        claimId: "CLM-10042",
        serviceDate: "2026-06-14",
        diagnosisCode: "I25.10",
        procedureCode: "99223",
        procedureDescription:
          "Initial hospital care, high complexity",
        billedAmount: 68500,
        approvedAmount: 61200,
        paidAmount: 61200,
        claimStatus: "Paid",
        anomalyType: "High complexity unsupported",
        anomalyScore: 97,
      },
      {
        claimId: "CLM-10058",
        serviceDate: "2026-06-18",
        diagnosisCode: "R07.9",
        procedureCode: "99233",
        procedureDescription:
          "Subsequent hospital care, high complexity",
        billedAmount: 54200,
        approvedAmount: 48900,
        paidAmount: 48900,
        claimStatus: "Paid",
        anomalyType: "Coding severity mismatch",
        anomalyScore: 94,
      },
      {
        claimId: "CLM-10077",
        serviceDate: "2026-06-24",
        diagnosisCode: "I10",
        procedureCode: "99233",
        procedureDescription:
          "Subsequent hospital care, high complexity",
        billedAmount: 61800,
        approvedAmount: 57400,
        paidAmount: 57400,
        claimStatus: "Under Review",
        anomalyType: "Peer utilization outlier",
        anomalyScore: 91,
      },
    ],
    alerts: [
      {
        alertId: "ALT-90001",
        source: "AI Detection Engine",
        title: "High-Severity Coding Outlier",
        description:
          "Provider high-complexity coding rate is 3.1 times the regional specialty average.",
        detectedDate: "2026-07-03",
        riskLevel: "Critical",
        confidenceScore: 96,
        modelName: "MediVantage Coding Integrity AI",
        modelVersion: "3.2.1",
        status: "Escalated",
      },
      {
        alertId: "ALT-90002",
        source: "Clinical Review",
        title: "Clinical Documentation Mismatch",
        description:
          "Clinical records reviewed do not consistently support the billed service intensity.",
        detectedDate: "2026-07-08",
        riskLevel: "High",
        confidenceScore: 92,
        modelName: "Clinical NLP Validation Engine",
        modelVersion: "2.6.0",
        status: "Reviewed",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10001",
        category: "Coding Distribution",
        title: "Excessive High-Complexity Coding",
        description:
          "High-complexity evaluation and management codes are used substantially more often than peer providers.",
        observedValue: "68% of inpatient encounters",
        expectedValue: "22% peer benchmark",
        variance: "+209%",
        riskLevel: "Critical",
        confidenceScore: 97,
      },
      {
        findingId: "PAT-10002",
        category: "Documentation Integrity",
        title: "Insufficient Supporting Documentation",
        description:
          "Clinical notes lack the documented severity, decision complexity or resource utilization required for the submitted codes.",
        observedValue: "19 of 26 reviewed claims",
        expectedValue: "Less than 5%",
        variance: "+630%",
        riskLevel: "Critical",
        confidenceScore: 94,
      },
      {
        findingId: "PAT-10003",
        category: "Financial Pattern",
        title: "Elevated Reimbursement Per Encounter",
        description:
          "Average reimbursement per inpatient encounter is materially above comparable providers.",
        observedValue: "SAR 41,850",
        expectedValue: "SAR 19,700",
        variance: "+112%",
        riskLevel: "High",
        confidenceScore: 91,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10001",
        sourceEntity: "Al Noor Specialist Hospital",
        sourceType: "Provider",
        targetEntity: "Riyadh Advanced Diagnostics",
        targetType: "Provider",
        relationshipType: "High-frequency referral",
        interactionCount: 486,
        financialValue: 2180000,
        riskLevel: "High",
        description:
          "Referral volume is significantly above peer patterns and concentrated among a small group of physicians.",
      },
      {
        relationshipId: "REL-10002",
        sourceEntity: "Al Noor Specialist Hospital",
        sourceType: "Provider",
        targetEntity: "CLM-10042",
        targetType: "Claim",
        relationshipType: "Suspected upcoding",
        interactionCount: 1,
        financialValue: 61200,
        riskLevel: "Critical",
        description:
          "Claim contains unsupported high-complexity procedural coding.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10001",
        evidenceType: "Clinical Document",
        title: "Clinical Documentation Review",
        description:
          "Independent clinical review of 26 sampled inpatient encounters.",
        uploadedBy: "Dr. Lina Al-Salem",
        uploadedDate: "2026-07-08",
        status: "Verified",
        sourceReference: "AUD-CLN-2026-084",
      },
      {
        evidenceId: "EVD-10002",
        evidenceType: "Claim Record",
        title: "High-Risk Claim Extract",
        description:
          "Claims identified by the coding anomaly detection model.",
        uploadedBy: "MediVantage AI",
        uploadedDate: "2026-07-04",
        status: "Verified",
        sourceReference: "ALT-90001",
      },
      {
        evidenceId: "EVD-10003",
        evidenceType: "Provider Contract",
        title: "Provider Reimbursement Contract",
        description:
          "Applicable coding, billing and audit provisions.",
        uploadedBy: "Provider Contracting Team",
        uploadedDate: "2026-07-10",
        status: "Verified",
        sourceReference: "CNT-PRV-10001",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10001",
        author: "Fatimah Al-Harbi",
        role: "Senior FWA Investigator",
        date: "2026-07-09",
        note:
          "Initial review confirms that the provider's high-complexity coding profile is substantially outside expected clinical and peer patterns.",
        visibility: "Internal",
      },
      {
        noteId: "NOTE-10002",
        author: "Dr. Lina Al-Salem",
        role: "Clinical Coding Auditor",
        date: "2026-07-18",
        note:
          "Nineteen sampled claims lack sufficient documentation to support the submitted evaluation and management complexity.",
        visibility: "Audit",
      },
      {
        noteId: "NOTE-10003",
        author: "Omar Al-Mutairi",
        role: "Legal Counsel",
        date: "2026-07-25",
        note:
          "Contractual recovery provisions are enforceable after formal provider notification and rebuttal period.",
        visibility: "Legal",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10001",
        action: "Issue formal provider audit notification",
        owner: "Provider Integrity Unit",
        dueDate: "2026-08-02",
        priority: "Critical",
        status: "Approved",
        estimatedRecovery: 174000,
        rationale:
          "Confirmed unsupported coding requires formal provider response and recovery initiation.",
      },
      {
        actionId: "ACT-10002",
        action: "Place high-risk claims on prepayment review",
        owner: "Claims Operations",
        dueDate: "2026-07-31",
        priority: "High",
        status: "In Progress",
        estimatedRecovery: 96000,
        rationale:
          "Prepayment controls will prevent additional exposure while the investigation remains open.",
      },
      {
        actionId: "ACT-10003",
        action: "Expand retrospective audit to 12 months",
        owner: "Clinical Audit Team",
        dueDate: "2026-08-14",
        priority: "High",
        status: "Recommended",
        estimatedRecovery: 312000,
        rationale:
          "Current findings indicate a recurring provider-level pattern rather than isolated coding errors.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10001",
        recoveryType: "Payment Offset",
        amount: 58000,
        initiatedDate: "2026-07-26",
        status: "Recovered",
        reference: "PAY-OFFSET-2026-0118",
        owner: "Finance Recovery Unit",
        notes:
          "Recovery applied against the provider's July payment cycle.",
      },
      {
        recoveryId: "REC-10002",
        recoveryType: "Provider Recovery",
        amount: 116000,
        initiatedDate: "2026-07-28",
        status: "Initiated",
        reference: "REC-NOTICE-2026-0072",
        owner: "Provider Integrity Unit",
        notes:
          "Formal recovery notice issued pending provider rebuttal.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10001",
        date: "2026-07-03",
        event: "AI Alert Generated",
        description:
          "Coding Integrity AI detected an extreme high-complexity coding pattern.",
        actor: "MediVantage AI",
        status: "Completed",
      },
      {
        eventId: "TML-10002",
        date: "2026-07-04",
        event: "Investigation Case Created",
        description:
          "Case automatically created and routed to the Provider Integrity Unit.",
        actor: "FWA Case Orchestration Engine",
        status: "Completed",
      },
      {
        eventId: "TML-10003",
        date: "2026-07-08",
        event: "Clinical Audit Completed",
        description:
          "Clinical coding audit identified unsupported codes in 19 sampled claims.",
        actor: "Dr. Lina Al-Salem",
        status: "Completed",
      },
      {
        eventId: "TML-10004",
        date: "2026-07-25",
        event: "Legal Review Completed",
        description:
          "Legal counsel confirmed contractual recovery rights.",
        actor: "Omar Al-Mutairi",
        status: "Completed",
      },
      {
        eventId: "TML-10005",
        date: "2026-07-28",
        event: "Provider Recovery Initiated",
        description:
          "Formal recovery notice issued for confirmed overpayment.",
        actor: "Fatimah Al-Harbi",
        status: "Escalated",
      },
    ],
  },
  {
    caseId: "FWA-2026-002",
    caseTitle:
      "Duplicate Claims Across Multiple Submission Channels",
    category: "Duplicate Claims",
    alertSource: "Claims Rules Engine",
    status: "Recovery Initiated",
    priority: "High",
    riskLevel: "High",
    aiConfidenceScore: 99,
    fraudRiskScore: 88,
    createdDate: "2026-07-09",
    lastUpdatedDate: "2026-07-27",
    assignedInvestigator: "Khalid Al-Otaibi",
    investigatorRole: "FWA Investigator",
    investigationUnit: "Claims Payment Integrity",
    region: "Jeddah",
    claimId: "CLM-10118",
    paymentId: "PAY-10003",
    estimatedExposure: 142500,
    confirmedExposure: 118000,
    identifiedSavings: 24500,
    recoveryPotential: 118000,
    recoveredAmount: 72000,
    description:
      "Multiple claims with identical member, provider, service date and procedure combinations were submitted through both portal and batch channels.",
    executiveSummary:
      "The duplicate detection engine identified seven paid claims and two pending claims with identical service attributes. Submission timestamps and provider invoice references indicate repeated billing rather than corrected claim activity.",
    allegation:
      "The provider may have resubmitted paid claims through alternative channels without clearly identifying them as corrected or replacement claims.",
    investigationObjective:
      "Validate duplicate submissions, reverse unpaid duplicates and recover confirmed duplicate payments.",
    member: {
      memberId: "MEM-10067",
      memberName: "Noura Al-Zahrani",
      policyId: "POL-2026-0098",
      dateOfBirth: "1986-04-08",
      gender: "Female",
      nationality: "Saudi",
      city: "Jeddah",
      membershipStatus: "Active",
      riskLevel: "Low",
      riskScore: 22,
      totalClaims: 14,
      suspiciousClaims: 2,
      totalClaimValue: 96700,
      lastClaimDate: "2026-06-30",
    },
    provider: {
      providerId: "PRV-10018",
      providerName: "Jeddah Horizon Medical Center",
      providerType: "Medical Center",
      specialty: "Outpatient Multi-Specialty",
      city: "Jeddah",
      networkTier: "Tier 2",
      contractStatus: "Active",
      riskLevel: "High",
      riskScore: 82,
      totalClaims: 1840,
      suspiciousClaims: 76,
      totalPaidAmount: 14360000,
      peerVariancePercentage: 88,
    },
    relatedClaims: [
      {
        claimId: "CLM-10118",
        serviceDate: "2026-06-21",
        diagnosisCode: "M54.5",
        procedureCode: "97110",
        procedureDescription:
          "Therapeutic exercises",
        billedAmount: 18500,
        approvedAmount: 16000,
        paidAmount: 16000,
        claimStatus: "Paid",
        anomalyType: "Exact duplicate",
        anomalyScore: 100,
        duplicateReference: "CLM-10119",
      },
      {
        claimId: "CLM-10119",
        serviceDate: "2026-06-21",
        diagnosisCode: "M54.5",
        procedureCode: "97110",
        procedureDescription:
          "Therapeutic exercises",
        billedAmount: 18500,
        approvedAmount: 16000,
        paidAmount: 16000,
        claimStatus: "Paid",
        anomalyType: "Exact duplicate",
        anomalyScore: 100,
        duplicateReference: "CLM-10118",
      },
      {
        claimId: "CLM-10142",
        serviceDate: "2026-06-25",
        diagnosisCode: "M25.5",
        procedureCode: "97140",
        procedureDescription:
          "Manual therapy techniques",
        billedAmount: 24000,
        approvedAmount: 20000,
        paidAmount: 20000,
        claimStatus: "Paid",
        anomalyType: "Cross-channel duplicate",
        anomalyScore: 99,
        duplicateReference: "CLM-10143",
      },
    ],
    alerts: [
      {
        alertId: "ALT-90011",
        source: "Claims Rules Engine",
        title: "Exact Claim Duplicate",
        description:
          "Identical claim attributes identified across portal and batch submission channels.",
        detectedDate: "2026-07-08",
        riskLevel: "High",
        confidenceScore: 99,
        modelName: "Duplicate Claim Detection Engine",
        modelVersion: "4.1.0",
        status: "Escalated",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10011",
        category: "Submission Behavior",
        title: "Cross-Channel Resubmission Pattern",
        description:
          "The provider repeatedly submits identical claims through different channels within 48 hours.",
        observedValue: "9 duplicate pairs",
        expectedValue: "0–1 corrected claims monthly",
        variance: "+800%",
        riskLevel: "High",
        confidenceScore: 99,
      },
      {
        findingId: "PAT-10012",
        category: "Payment Integrity",
        title: "Paid Duplicate Exposure",
        description:
          "Seven duplicate claims passed adjudication before the duplicate relationship was detected.",
        observedValue: "SAR 118,000",
        expectedValue: "SAR 0",
        variance: "Full exposure",
        riskLevel: "High",
        confidenceScore: 100,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10011",
        sourceEntity: "Jeddah Horizon Medical Center",
        sourceType: "Provider",
        targetEntity: "CLM-10118",
        targetType: "Claim",
        relationshipType: "Duplicate submission",
        interactionCount: 2,
        financialValue: 32000,
        riskLevel: "High",
        description:
          "The same service was submitted and paid twice.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10011",
        evidenceType: "Claim Record",
        title: "Duplicate Claim Comparison",
        description:
          "Side-by-side comparison of duplicate claim attributes and submission timestamps.",
        uploadedBy: "Claims Payment Integrity Team",
        uploadedDate: "2026-07-10",
        status: "Verified",
        sourceReference: "DUP-RPT-2026-041",
      },
      {
        evidenceId: "EVD-10012",
        evidenceType: "Payment Record",
        title: "Duplicate Payment Confirmation",
        description:
          "Payment records confirm settlement of seven duplicate claims.",
        uploadedBy: "Finance Reconciliation Team",
        uploadedDate: "2026-07-12",
        status: "Verified",
        sourceReference: "PAY-REC-2026-019",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10011",
        author: "Khalid Al-Otaibi",
        role: "FWA Investigator",
        date: "2026-07-14",
        note:
          "The provider acknowledged a batch configuration issue but has not explained why duplicate invoices carried separate internal references.",
        visibility: "Internal",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10011",
        action: "Recover duplicate payments",
        owner: "Finance Recovery Unit",
        dueDate: "2026-08-04",
        priority: "High",
        status: "In Progress",
        estimatedRecovery: 118000,
        rationale:
          "Payment records confirm duplicate settlement for identical services.",
      },
      {
        actionId: "ACT-10012",
        action: "Enable provider-specific duplicate hold rule",
        owner: "Claims Configuration Team",
        dueDate: "2026-07-30",
        priority: "High",
        status: "Completed",
        estimatedRecovery: 24500,
        rationale:
          "A temporary hold rule prevents additional duplicate payment exposure.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10011",
        recoveryType: "Payment Offset",
        amount: 72000,
        initiatedDate: "2026-07-22",
        status: "Recovered",
        reference: "OFFSET-2026-0174",
        owner: "Finance Recovery Unit",
        notes:
          "First recovery tranche offset against the provider payment cycle.",
      },
      {
        recoveryId: "REC-10012",
        recoveryType: "Provider Recovery",
        amount: 46000,
        initiatedDate: "2026-07-25",
        status: "In Progress",
        reference: "REC-2026-0086",
        owner: "Finance Recovery Unit",
        notes:
          "Remaining recovery pending provider reconciliation.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10011",
        date: "2026-07-08",
        event: "Duplicate Alert Generated",
        description:
          "Claims rules engine detected identical paid claims across multiple channels.",
        actor: "Claims Rules Engine",
        status: "Completed",
      },
      {
        eventId: "TML-10012",
        date: "2026-07-09",
        event: "Case Assigned",
        description:
          "Case assigned to the Claims Payment Integrity team.",
        actor: "FWA Workflow Engine",
        status: "Completed",
      },
      {
        eventId: "TML-10013",
        date: "2026-07-22",
        event: "Recovery Offset Applied",
        description:
          "SAR 72,000 recovered through provider payment offset.",
        actor: "Finance Recovery Unit",
        status: "Completed",
      },
      {
        eventId: "TML-10014",
        date: "2026-07-25",
        event: "Remaining Recovery Initiated",
        description:
          "Provider recovery initiated for the outstanding duplicate payment balance.",
        actor: "Khalid Al-Otaibi",
        status: "Pending",
      },
    ],
  },
  {
    caseId: "FWA-2026-003",
    caseTitle:
      "Laboratory Overutilization and Referral Concentration",
    category: "Laboratory Abuse",
    alertSource: "Provider Audit",
    status: "Escalated",
    priority: "Critical",
    riskLevel: "Critical",
    aiConfidenceScore: 93,
    fraudRiskScore: 91,
    createdDate: "2026-07-12",
    lastUpdatedDate: "2026-07-30",
    assignedInvestigator: "Maha Al-Shammari",
    investigatorRole: "Lead Network Investigator",
    investigationUnit: "Network Fraud Analytics",
    region: "Eastern Province",
    claimId: "CLM-10204",
    estimatedExposure: 1260000,
    confirmedExposure: 340000,
    identifiedSavings: 520000,
    recoveryPotential: 340000,
    recoveredAmount: 0,
    description:
      "A clinic and affiliated diagnostic laboratory demonstrate unusually concentrated referrals, excessive repeat testing and shared ownership indicators.",
    executiveSummary:
      "Network analytics identified a dense referral relationship between a primary care clinic and diagnostic laboratory. Testing frequency is substantially above regional clinical benchmarks, and several tests were repeated within medically unnecessary intervals.",
    allegation:
      "The provider network may be generating unnecessary laboratory services through coordinated referral behavior and financial affiliation.",
    investigationObjective:
      "Validate clinical necessity, determine ownership relationships, quantify unnecessary services and assess potential provider collusion.",
    member: {
      memberId: "MEM-10110",
      memberName: "Faisal Al-Dossary",
      policyId: "POL-2026-0141",
      dateOfBirth: "1964-11-03",
      gender: "Male",
      nationality: "Saudi",
      city: "Dammam",
      membershipStatus: "Active",
      riskLevel: "Medium",
      riskScore: 55,
      totalClaims: 38,
      suspiciousClaims: 8,
      totalClaimValue: 226000,
      lastClaimDate: "2026-07-02",
    },
    provider: {
      providerId: "PRV-10033",
      providerName: "Eastern Family Care Clinic",
      providerType: "Clinic",
      specialty: "Family Medicine",
      city: "Dammam",
      networkTier: "Tier 3",
      contractStatus: "Under Review",
      riskLevel: "Critical",
      riskScore: 95,
      totalClaims: 4210,
      suspiciousClaims: 388,
      totalPaidAmount: 19240000,
      peerVariancePercentage: 287,
    },
    relatedClaims: [
      {
        claimId: "CLM-10204",
        serviceDate: "2026-06-28",
        diagnosisCode: "R53.83",
        procedureCode: "80053",
        procedureDescription:
          "Comprehensive metabolic panel",
        billedAmount: 9600,
        approvedAmount: 8200,
        paidAmount: 8200,
        claimStatus: "Paid",
        anomalyType: "Repeat testing",
        anomalyScore: 94,
      },
      {
        claimId: "CLM-10211",
        serviceDate: "2026-06-30",
        diagnosisCode: "R53.83",
        procedureCode: "80053",
        procedureDescription:
          "Comprehensive metabolic panel",
        billedAmount: 9600,
        approvedAmount: 8200,
        paidAmount: 8200,
        claimStatus: "Paid",
        anomalyType: "Medically unnecessary interval",
        anomalyScore: 96,
      },
      {
        claimId: "CLM-10227",
        serviceDate: "2026-07-02",
        diagnosisCode: "Z00.00",
        procedureCode: "84443",
        procedureDescription:
          "Thyroid stimulating hormone",
        billedAmount: 7800,
        approvedAmount: 6500,
        paidAmount: 6500,
        claimStatus: "Under Review",
        anomalyType: "Referral concentration",
        anomalyScore: 91,
      },
    ],
    alerts: [
      {
        alertId: "ALT-90021",
        source: "Provider Audit",
        title: "Laboratory Utilization Outlier",
        description:
          "Laboratory test volume per member is 3.8 times the regional peer average.",
        detectedDate: "2026-07-11",
        riskLevel: "Critical",
        confidenceScore: 93,
        modelName: "Provider Utilization Analytics",
        modelVersion: "2.8.4",
        status: "Escalated",
      },
      {
        alertId: "ALT-90022",
        source: "AI Detection Engine",
        title: "Referral Network Concentration",
        description:
          "Eighty-one percent of laboratory referrals are directed to a single diagnostic provider.",
        detectedDate: "2026-07-12",
        riskLevel: "Critical",
        confidenceScore: 95,
        modelName: "Fraud Graph Intelligence",
        modelVersion: "1.9.2",
        status: "Escalated",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10021",
        category: "Laboratory Utilization",
        title: "Excessive Repeat Testing",
        description:
          "Laboratory tests are repeated within intervals unsupported by clinical guidelines.",
        observedValue: "31% repeated within 7 days",
        expectedValue: "Below 5%",
        variance: "+520%",
        riskLevel: "Critical",
        confidenceScore: 96,
      },
      {
        findingId: "PAT-10022",
        category: "Referral Network",
        title: "Single-Laboratory Concentration",
        description:
          "Referral activity is heavily concentrated toward one laboratory with potential shared ownership.",
        observedValue: "81% referral concentration",
        expectedValue: "Below 25%",
        variance: "+224%",
        riskLevel: "Critical",
        confidenceScore: 95,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10021",
        sourceEntity: "Eastern Family Care Clinic",
        sourceType: "Provider",
        targetEntity: "Eastern Precision Laboratory",
        targetType: "Provider",
        relationshipType: "Concentrated referral network",
        interactionCount: 2184,
        financialValue: 7850000,
        riskLevel: "Critical",
        description:
          "Referral concentration and payment flow indicate a potentially coordinated network.",
      },
      {
        relationshipId: "REL-10022",
        sourceEntity: "Dr. Saad Al-Rashid",
        sourceType: "Provider",
        targetEntity: "Eastern Precision Laboratory",
        targetType: "Provider",
        relationshipType: "Potential ownership affiliation",
        interactionCount: 1,
        financialValue: 0,
        riskLevel: "High",
        description:
          "Corporate registry review indicates overlapping beneficial ownership.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10021",
        evidenceType: "Network Analysis",
        title: "Provider Relationship Graph",
        description:
          "Graph analysis of referral and financial relationships between the clinic and laboratory.",
        uploadedBy: "MediVantage Fraud Graph AI",
        uploadedDate: "2026-07-12",
        status: "Verified",
        sourceReference: "GRAPH-2026-0038",
      },
      {
        evidenceId: "EVD-10022",
        evidenceType: "Audit Report",
        title: "Laboratory Utilization Audit",
        description:
          "Retrospective review of laboratory frequency, clinical indication and repeat testing intervals.",
        uploadedBy: "Provider Audit Team",
        uploadedDate: "2026-07-19",
        status: "Verified",
        sourceReference: "AUD-LAB-2026-012",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10021",
        author: "Maha Al-Shammari",
        role: "Lead Network Investigator",
        date: "2026-07-20",
        note:
          "The relationship pattern is consistent with coordinated referral behavior. Beneficial ownership verification remains in progress.",
        visibility: "Internal",
      },
      {
        noteId: "NOTE-10022",
        author: "Dr. Yara Al-Hassan",
        role: "Clinical Pathology Reviewer",
        date: "2026-07-24",
        note:
          "A significant proportion of repeat testing lacks documented clinical justification.",
        visibility: "Audit",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10021",
        action: "Suspend automatic payment for high-risk laboratory claims",
        owner: "Claims Payment Integrity",
        dueDate: "2026-07-31",
        priority: "Critical",
        status: "Approved",
        estimatedRecovery: 520000,
        rationale:
          "Prepayment review is required to prevent additional exposure during the investigation.",
      },
      {
        actionId: "ACT-10022",
        action: "Conduct onsite provider and laboratory audit",
        owner: "Provider Audit Team",
        dueDate: "2026-08-12",
        priority: "Critical",
        status: "In Progress",
        estimatedRecovery: 340000,
        rationale:
          "Onsite validation is required to review ordering practices, ownership and service delivery.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10021",
        recoveryType: "Provider Recovery",
        amount: 340000,
        initiatedDate: "2026-07-29",
        status: "Identified",
        reference: "REC-LAB-2026-0029",
        owner: "Provider Integrity Unit",
        notes:
          "Recovery amount subject to completion of provider audit and rebuttal review.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10021",
        date: "2026-07-11",
        event: "Provider Audit Alert",
        description:
          "Utilization analysis identified excessive laboratory service frequency.",
        actor: "Provider Audit Analytics",
        status: "Completed",
      },
      {
        eventId: "TML-10022",
        date: "2026-07-12",
        event: "Network Relationship Detected",
        description:
          "Graph AI identified concentrated referrals and potential ownership affiliation.",
        actor: "Fraud Graph Intelligence",
        status: "Completed",
      },
      {
        eventId: "TML-10023",
        date: "2026-07-19",
        event: "Clinical Audit Completed",
        description:
          "Audit confirmed medically unsupported repeat laboratory testing.",
        actor: "Provider Audit Team",
        status: "Completed",
      },
      {
        eventId: "TML-10024",
        date: "2026-07-29",
        event: "Case Escalated",
        description:
          "Case escalated to legal, contracting and executive fraud governance.",
        actor: "Maha Al-Shammari",
        status: "Escalated",
      },
    ],
  },
  {
    caseId: "FWA-2026-004",
    caseTitle:
      "Member Identity Misuse and Provider Collusion",
    category: "Identity Fraud",
    alertSource: "Member Complaint",
    status: "Under Review",
    priority: "High",
    riskLevel: "High",
    aiConfidenceScore: 89,
    fraudRiskScore: 86,
    createdDate: "2026-07-15",
    lastUpdatedDate: "2026-07-28",
    assignedInvestigator: "Rania Al-Mansour",
    investigatorRole: "Member Fraud Investigator",
    investigationUnit: "Member Protection Unit",
    region: "Riyadh",
    claimId: "CLM-10288",
    estimatedExposure: 198000,
    confirmedExposure: 76000,
    identifiedSavings: 122000,
    recoveryPotential: 76000,
    recoveredAmount: 0,
    description:
      "A member disputed several services allegedly delivered while the member was outside the country.",
    executiveSummary:
      "Travel records and member testimony indicate that multiple claims were submitted during a period when the member was abroad. The claims originated from the same clinic and were supported by inconsistent identity verification records.",
    allegation:
      "The member's insurance identity may have been used by another person with possible provider participation or inadequate identity controls.",
    investigationObjective:
      "Confirm the member's location, validate identity verification records, determine provider involvement and reverse unsupported claims.",
    member: {
      memberId: "MEM-10142",
      memberName: "Sara Al-Ghamdi",
      policyId: "POL-2026-0176",
      dateOfBirth: "1991-01-27",
      gender: "Female",
      nationality: "Saudi",
      city: "Riyadh",
      membershipStatus: "Active",
      riskLevel: "High",
      riskScore: 79,
      totalClaims: 22,
      suspiciousClaims: 5,
      totalClaimValue: 164000,
      lastClaimDate: "2026-07-06",
    },
    provider: {
      providerId: "PRV-10049",
      providerName: "Al Waha Family Clinic",
      providerType: "Clinic",
      specialty: "General Practice",
      city: "Riyadh",
      networkTier: "Tier 3",
      contractStatus: "Active",
      riskLevel: "High",
      riskScore: 84,
      totalClaims: 2380,
      suspiciousClaims: 114,
      totalPaidAmount: 11700000,
      peerVariancePercentage: 96,
    },
    relatedClaims: [
      {
        claimId: "CLM-10288",
        serviceDate: "2026-06-29",
        diagnosisCode: "J06.9",
        procedureCode: "99214",
        procedureDescription:
          "Established patient outpatient visit",
        billedAmount: 22000,
        approvedAmount: 19000,
        paidAmount: 19000,
        claimStatus: "Paid",
        anomalyType: "Member absent from country",
        anomalyScore: 95,
      },
      {
        claimId: "CLM-10293",
        serviceDate: "2026-07-02",
        diagnosisCode: "R10.9",
        procedureCode: "76700",
        procedureDescription:
          "Abdominal ultrasound",
        billedAmount: 48000,
        approvedAmount: 42000,
        paidAmount: 42000,
        claimStatus: "Paid",
        anomalyType: "Identity verification mismatch",
        anomalyScore: 92,
      },
      {
        claimId: "CLM-10301",
        serviceDate: "2026-07-06",
        diagnosisCode: "M79.1",
        procedureCode: "96372",
        procedureDescription:
          "Therapeutic injection",
        billedAmount: 18000,
        approvedAmount: 15000,
        paidAmount: 15000,
        claimStatus: "Paid",
        anomalyType: "Member denial",
        anomalyScore: 88,
      },
    ],
    alerts: [
      {
        alertId: "ALT-90031",
        source: "Member Complaint",
        title: "Member Denied Receiving Services",
        description:
          "Member reported that listed services were not received and occurred while abroad.",
        detectedDate: "2026-07-14",
        riskLevel: "High",
        confidenceScore: 89,
        modelName: "Member Complaint Triage",
        modelVersion: "1.5.0",
        status: "Escalated",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10031",
        category: "Identity Verification",
        title: "Biometric Verification Inconsistency",
        description:
          "Identity verification records do not match the member's registered biometric profile.",
        observedValue: "3 failed or overridden checks",
        expectedValue: "0",
        variance: "Critical deviation",
        riskLevel: "High",
        confidenceScore: 91,
      },
      {
        findingId: "PAT-10032",
        category: "Geographic Anomaly",
        title: "Member Outside Service Location",
        description:
          "Travel records indicate the member was outside Saudi Arabia on all three service dates.",
        observedValue: "3 claims during travel",
        expectedValue: "0",
        variance: "Full conflict",
        riskLevel: "Critical",
        confidenceScore: 98,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10031",
        sourceEntity: "Sara Al-Ghamdi",
        sourceType: "Member",
        targetEntity: "Al Waha Family Clinic",
        targetType: "Provider",
        relationshipType: "Disputed service relationship",
        interactionCount: 3,
        financialValue: 76000,
        riskLevel: "High",
        description:
          "Member denies all services billed by this provider during the travel period.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10031",
        evidenceType: "Member Statement",
        title: "Signed Member Dispute Statement",
        description:
          "Formal statement confirming that the member did not receive the disputed services.",
        uploadedBy: "Member Services",
        uploadedDate: "2026-07-15",
        status: "Verified",
        sourceReference: "CMP-2026-0319",
      },
      {
        evidenceId: "EVD-10032",
        evidenceType: "Audit Report",
        title: "Identity Verification Audit",
        description:
          "Audit of provider identity verification and override records.",
        uploadedBy: "Member Protection Unit",
        uploadedDate: "2026-07-23",
        status: "Pending Review",
        sourceReference: "ID-AUD-2026-0044",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10031",
        author: "Rania Al-Mansour",
        role: "Member Fraud Investigator",
        date: "2026-07-22",
        note:
          "Travel documentation confirms member absence. Provider has been asked to produce signed consent, identification and encounter documentation.",
        visibility: "Internal",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10031",
        action: "Suspend provider claims pending identity audit",
        owner: "Claims Operations",
        dueDate: "2026-07-31",
        priority: "High",
        status: "Approved",
        estimatedRecovery: 76000,
        rationale:
          "Claims are unsupported by member presence and identity verification records.",
      },
      {
        actionId: "ACT-10032",
        action: "Reset member digital identity credentials",
        owner: "Member Services",
        dueDate: "2026-07-29",
        priority: "High",
        status: "Completed",
        estimatedRecovery: 0,
        rationale:
          "Credential reset reduces the risk of continued identity misuse.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10031",
        recoveryType: "Claim Reversal",
        amount: 76000,
        initiatedDate: "2026-07-27",
        status: "Initiated",
        reference: "REV-2026-0088",
        owner: "Claims Recovery Team",
        notes:
          "Claim reversal pending final provider response.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10031",
        date: "2026-07-14",
        event: "Member Complaint Received",
        description:
          "Member disputed services appearing in the digital claim history.",
        actor: "Member Services",
        status: "Completed",
      },
      {
        eventId: "TML-10032",
        date: "2026-07-15",
        event: "Fraud Case Created",
        description:
          "Case created and assigned to the Member Protection Unit.",
        actor: "FWA Case Orchestration Engine",
        status: "Completed",
      },
      {
        eventId: "TML-10033",
        date: "2026-07-22",
        event: "Travel Evidence Confirmed",
        description:
          "Travel records confirmed the member was abroad during the disputed service period.",
        actor: "Rania Al-Mansour",
        status: "Completed",
      },
      {
        eventId: "TML-10034",
        date: "2026-07-27",
        event: "Claim Reversal Initiated",
        description:
          "Recovery workflow initiated for the disputed paid claims.",
        actor: "Claims Recovery Team",
        status: "Pending",
      },
    ],
  },
  {
    caseId: "FWA-2026-005",
    caseTitle:
      "Suspected Prescription Shopping Across Pharmacies",
    category: "Prescription Abuse",
    alertSource: "AI Detection Engine",
    status: "Under Review",
    priority: "Medium",
    riskLevel: "Medium",
    aiConfidenceScore: 84,
    fraudRiskScore: 73,
    createdDate: "2026-07-18",
    lastUpdatedDate: "2026-07-29",
    assignedInvestigator: "Ahmed Al-Faraj",
    investigatorRole: "Pharmacy Integrity Analyst",
    investigationUnit: "Pharmacy Benefit Integrity",
    region: "Riyadh",
    claimId: "CLM-10326",
    estimatedExposure: 86000,
    confirmedExposure: 18000,
    identifiedSavings: 42000,
    recoveryPotential: 18000,
    recoveredAmount: 0,
    description:
      "A member received overlapping prescriptions for controlled pain medication from multiple prescribers and pharmacies.",
    executiveSummary:
      "Pharmacy analytics detected overlapping medication fills across four pharmacies and three prescribers. The pattern may reflect member shopping, fragmented care or prescription misuse.",
    allegation:
      "The member may be obtaining overlapping prescriptions from multiple providers without disclosure.",
    investigationObjective:
      "Validate clinical indications, confirm prescriber awareness, assess medication safety and prevent inappropriate future dispensing.",
    member: {
      memberId: "MEM-10188",
      memberName: "Mohammed Al-Shehri",
      policyId: "POL-2026-0222",
      dateOfBirth: "1983-06-11",
      gender: "Male",
      nationality: "Saudi",
      city: "Riyadh",
      membershipStatus: "Active",
      riskLevel: "High",
      riskScore: 81,
      totalClaims: 46,
      suspiciousClaims: 11,
      totalClaimValue: 198000,
      lastClaimDate: "2026-07-14",
    },
    provider: {
      providerId: "PRV-10074",
      providerName: "Central Care Polyclinic",
      providerType: "Polyclinic",
      specialty: "Orthopedics",
      city: "Riyadh",
      networkTier: "Tier 2",
      contractStatus: "Active",
      riskLevel: "Medium",
      riskScore: 62,
      totalClaims: 2860,
      suspiciousClaims: 42,
      totalPaidAmount: 15400000,
      peerVariancePercentage: 48,
    },
    relatedClaims: [
      {
        claimId: "CLM-10326",
        serviceDate: "2026-07-03",
        diagnosisCode: "M54.5",
        procedureCode: "RX-TRM-001",
        procedureDescription:
          "Controlled analgesic prescription",
        billedAmount: 6800,
        approvedAmount: 5800,
        paidAmount: 5800,
        claimStatus: "Paid",
        anomalyType: "Overlapping prescription",
        anomalyScore: 88,
      },
      {
        claimId: "CLM-10339",
        serviceDate: "2026-07-08",
        diagnosisCode: "M25.5",
        procedureCode: "RX-TRM-001",
        procedureDescription:
          "Controlled analgesic prescription",
        billedAmount: 7200,
        approvedAmount: 6200,
        paidAmount: 6200,
        claimStatus: "Paid",
        anomalyType: "Multiple prescriber overlap",
        anomalyScore: 84,
      },
      {
        claimId: "CLM-10352",
        serviceDate: "2026-07-14",
        diagnosisCode: "G89.29",
        procedureCode: "RX-TRM-001",
        procedureDescription:
          "Controlled analgesic prescription",
        billedAmount: 7000,
        approvedAmount: 6000,
        paidAmount: 6000,
        claimStatus: "Under Review",
        anomalyType: "Pharmacy shopping",
        anomalyScore: 82,
      },
    ],
    alerts: [
      {
        alertId: "ALT-90041",
        source: "AI Detection Engine",
        title: "Overlapping Controlled Medication",
        description:
          "Multiple active prescriptions for the same controlled medication were filled within overlapping periods.",
        detectedDate: "2026-07-17",
        riskLevel: "Medium",
        confidenceScore: 84,
        modelName: "Pharmacy Pattern Intelligence",
        modelVersion: "2.3.5",
        status: "Reviewed",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10041",
        category: "Prescription Utilization",
        title: "Multiple Prescriber Activity",
        description:
          "The member obtained similar prescriptions from three prescribers within eleven days.",
        observedValue: "3 prescribers",
        expectedValue: "1 coordinated prescriber",
        variance: "+200%",
        riskLevel: "Medium",
        confidenceScore: 84,
      },
      {
        findingId: "PAT-10042",
        category: "Pharmacy Network",
        title: "Multiple Pharmacy Dispensing",
        description:
          "Prescriptions were filled at four pharmacies with limited evidence of care coordination.",
        observedValue: "4 pharmacies",
        expectedValue: "1–2 pharmacies",
        variance: "+100%",
        riskLevel: "Medium",
        confidenceScore: 82,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10041",
        sourceEntity: "Mohammed Al-Shehri",
        sourceType: "Member",
        targetEntity: "Four participating pharmacies",
        targetType: "Pharmacy",
        relationshipType: "Overlapping dispensing network",
        interactionCount: 7,
        financialValue: 42000,
        riskLevel: "Medium",
        description:
          "The member obtained overlapping medication supplies across multiple pharmacies.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10041",
        evidenceType: "Claim Record",
        title: "Pharmacy Dispensing History",
        description:
          "Consolidated prescription dispensing history across participating pharmacies.",
        uploadedBy: "Pharmacy Benefit Integrity",
        uploadedDate: "2026-07-18",
        status: "Verified",
        sourceReference: "PBM-RPT-2026-017",
      },
      {
        evidenceId: "EVD-10042",
        evidenceType: "Clinical Document",
        title: "Prescriber Clinical Notes",
        description:
          "Clinical indications and medication plans from the involved prescribers.",
        uploadedBy: "Clinical Review Team",
        uploadedDate: "2026-07-26",
        status: "Pending Review",
        sourceReference: "CLN-RX-2026-055",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10041",
        author: "Ahmed Al-Faraj",
        role: "Pharmacy Integrity Analyst",
        date: "2026-07-25",
        note:
          "One prescriber confirmed being unaware of the other active prescriptions. Clinical safety review is recommended before final fraud classification.",
        visibility: "Internal",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10041",
        action: "Place controlled medication claims on review",
        owner: "Pharmacy Benefit Management",
        dueDate: "2026-07-30",
        priority: "High",
        status: "Completed",
        estimatedRecovery: 42000,
        rationale:
          "Prospective review will prevent unsafe or duplicative medication dispensing.",
      },
      {
        actionId: "ACT-10042",
        action: "Initiate coordinated prescriber review",
        owner: "Clinical Pharmacy Team",
        dueDate: "2026-08-05",
        priority: "Medium",
        status: "In Progress",
        estimatedRecovery: 18000,
        rationale:
          "Clinical coordination is required before determining intentional misuse.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10041",
        recoveryType: "Claim Reversal",
        amount: 18000,
        initiatedDate: "2026-07-28",
        status: "Identified",
        reference: "RX-REV-2026-0017",
        owner: "Pharmacy Benefit Integrity",
        notes:
          "Recovery depends on confirmation of unsupported duplicate dispensing.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10041",
        date: "2026-07-17",
        event: "Pharmacy Alert Generated",
        description:
          "AI identified overlapping controlled medication prescriptions.",
        actor: "Pharmacy Pattern Intelligence",
        status: "Completed",
      },
      {
        eventId: "TML-10042",
        date: "2026-07-18",
        event: "Case Assigned",
        description:
          "Case assigned to Pharmacy Benefit Integrity.",
        actor: "FWA Workflow Engine",
        status: "Completed",
      },
      {
        eventId: "TML-10043",
        date: "2026-07-25",
        event: "Prescriber Contacted",
        description:
          "Prescriber confirmed lack of awareness of overlapping prescriptions.",
        actor: "Ahmed Al-Faraj",
        status: "Warning",
      },
      {
        eventId: "TML-10044",
        date: "2026-07-28",
        event: "Clinical Review Requested",
        description:
          "Clinical pharmacy review initiated before final classification.",
        actor: "Pharmacy Benefit Integrity",
        status: "Pending",
      },
    ],
  },
  {
    caseId: "FWA-2026-006",
    caseTitle:
      "Potential Phantom Billing for Undelivered Services",
    category: "Phantom Billing",
    alertSource: "Internal Audit",
    status: "Closed",
    priority: "High",
    riskLevel: "High",
    aiConfidenceScore: 91,
    fraudRiskScore: 87,
    createdDate: "2026-06-18",
    lastUpdatedDate: "2026-07-21",
    assignedInvestigator: "Yousef Al-Hazmi",
    investigatorRole: "Senior Claims Auditor",
    investigationUnit: "Special Investigations Unit",
    region: "Madinah",
    claimId: "CLM-09982",
    paymentId: "PAY-09941",
    estimatedExposure: 264000,
    confirmedExposure: 198000,
    identifiedSavings: 66000,
    recoveryPotential: 198000,
    recoveredAmount: 198000,
    description:
      "Claims were submitted for home healthcare visits that members reported did not occur.",
    executiveSummary:
      "Member outreach, visit scheduling records and staff rosters confirmed that multiple billed home visits were not delivered. The provider accepted the audit findings and the full overpayment was recovered.",
    allegation:
      "The provider billed for home healthcare visits that were not delivered to the listed members.",
    investigationObjective:
      "Confirm service delivery, recover unsupported payments and determine whether the provider contract should be restricted.",
    member: {
      memberId: "MEM-09972",
      memberName: "Huda Al-Harbi",
      policyId: "POL-2026-0017",
      dateOfBirth: "1958-02-19",
      gender: "Female",
      nationality: "Saudi",
      city: "Madinah",
      membershipStatus: "Active",
      riskLevel: "Low",
      riskScore: 18,
      totalClaims: 32,
      suspiciousClaims: 6,
      totalClaimValue: 128000,
      lastClaimDate: "2026-06-12",
    },
    provider: {
      providerId: "PRV-09918",
      providerName: "Madinah Home Health Services",
      providerType: "Home Healthcare",
      specialty: "Home Nursing",
      city: "Madinah",
      networkTier: "Tier 3",
      contractStatus: "Restricted",
      riskLevel: "High",
      riskScore: 89,
      totalClaims: 1460,
      suspiciousClaims: 128,
      totalPaidAmount: 8400000,
      peerVariancePercentage: 134,
    },
    relatedClaims: [
      {
        claimId: "CLM-09982",
        serviceDate: "2026-05-22",
        diagnosisCode: "Z74.2",
        procedureCode: "99509",
        procedureDescription:
          "Home visit support service",
        billedAmount: 36000,
        approvedAmount: 33000,
        paidAmount: 33000,
        claimStatus: "Reversed",
        anomalyType: "Service not delivered",
        anomalyScore: 95,
      },
      {
        claimId: "CLM-09986",
        serviceDate: "2026-05-25",
        diagnosisCode: "Z74.2",
        procedureCode: "99509",
        procedureDescription:
          "Home visit support service",
        billedAmount: 36000,
        approvedAmount: 33000,
        paidAmount: 33000,
        claimStatus: "Reversed",
        anomalyType: "No staff assignment",
        anomalyScore: 93,
      },
      {
        claimId: "CLM-09994",
        serviceDate: "2026-05-29",
        diagnosisCode: "Z74.2",
        procedureCode: "99509",
        procedureDescription:
          "Home visit support service",
        billedAmount: 36000,
        approvedAmount: 33000,
        paidAmount: 33000,
        claimStatus: "Reversed",
        anomalyType: "Member denial",
        anomalyScore: 92,
      },
    ],
    alerts: [
      {
        alertId: "ALT-90051",
        source: "Internal Audit",
        title: "Undelivered Home Care Services",
        description:
          "Audit sampling identified billed visits without supporting visit logs or member confirmation.",
        detectedDate: "2026-06-17",
        riskLevel: "High",
        confidenceScore: 91,
        modelName: "Home Care Integrity Audit",
        modelVersion: "1.2.0",
        status: "Reviewed",
      },
    ],
    patternFindings: [
      {
        findingId: "PAT-10051",
        category: "Service Delivery",
        title: "Missing Visit Confirmation",
        description:
          "Billed visits lacked member confirmation, GPS check-in and staff roster evidence.",
        observedValue: "6 of 8 sampled visits",
        expectedValue: "Complete evidence for all visits",
        variance: "75% unsupported",
        riskLevel: "High",
        confidenceScore: 94,
      },
    ],
    networkRelationships: [
      {
        relationshipId: "REL-10051",
        sourceEntity: "Madinah Home Health Services",
        sourceType: "Provider",
        targetEntity: "Huda Al-Harbi",
        targetType: "Member",
        relationshipType: "Unsupported billed visits",
        interactionCount: 6,
        financialValue: 198000,
        riskLevel: "High",
        description:
          "Member denied receiving the billed home healthcare visits.",
      },
    ],
    evidence: [
      {
        evidenceId: "EVD-10051",
        evidenceType: "Member Statement",
        title: "Member Service Confirmation Interviews",
        description:
          "Recorded member statements denying receipt of the billed visits.",
        uploadedBy: "Internal Audit",
        uploadedDate: "2026-06-20",
        status: "Verified",
        sourceReference: "INT-AUD-2026-071",
      },
      {
        evidenceId: "EVD-10052",
        evidenceType: "Audit Report",
        title: "Home Visit Delivery Audit",
        description:
          "Comparison of claims, schedules, staff rosters and visit records.",
        uploadedBy: "Special Investigations Unit",
        uploadedDate: "2026-06-28",
        status: "Verified",
        sourceReference: "SIU-RPT-2026-026",
      },
    ],
    investigatorNotes: [
      {
        noteId: "NOTE-10051",
        author: "Yousef Al-Hazmi",
        role: "Senior Claims Auditor",
        date: "2026-07-02",
        note:
          "Provider management accepted the findings and attributed the issue to unauthorized billing activity by a former operations supervisor.",
        visibility: "Internal",
      },
      {
        noteId: "NOTE-10052",
        author: "Legal Affairs",
        role: "Legal Counsel",
        date: "2026-07-08",
        note:
          "Full recovery and contractual restriction are proportionate based on the evidence and provider cooperation.",
        visibility: "Legal",
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-10051",
        action: "Recover confirmed unsupported payments",
        owner: "Finance Recovery Unit",
        dueDate: "2026-07-15",
        priority: "High",
        status: "Completed",
        estimatedRecovery: 198000,
        rationale:
          "Services were not delivered and payments were unsupported.",
      },
      {
        actionId: "ACT-10052",
        action: "Restrict provider contract and require corrective action plan",
        owner: "Provider Contracting",
        dueDate: "2026-07-20",
        priority: "High",
        status: "Completed",
        estimatedRecovery: 66000,
        rationale:
          "Enhanced controls are required before normal claims processing resumes.",
      },
    ],
    recoveries: [
      {
        recoveryId: "REC-10051",
        recoveryType: "Provider Recovery",
        amount: 198000,
        initiatedDate: "2026-07-05",
        status: "Recovered",
        reference: "REC-HHC-2026-0042",
        owner: "Finance Recovery Unit",
        notes:
          "Provider remitted the full confirmed overpayment.",
      },
    ],
    timeline: [
      {
        eventId: "TML-10051",
        date: "2026-06-17",
        event: "Audit Exception Identified",
        description:
          "Internal audit identified home visit claims without supporting delivery evidence.",
        actor: "Internal Audit",
        status: "Completed",
      },
      {
        eventId: "TML-10052",
        date: "2026-06-20",
        event: "Member Interviews Completed",
        description:
          "Members denied receiving the billed home healthcare visits.",
        actor: "Special Investigations Unit",
        status: "Completed",
      },
      {
        eventId: "TML-10053",
        date: "2026-07-05",
        event: "Recovery Initiated",
        description:
          "Formal recovery request issued to the provider.",
        actor: "Finance Recovery Unit",
        status: "Completed",
      },
      {
        eventId: "TML-10054",
        date: "2026-07-18",
        event: "Recovery Completed",
        description:
          "Full confirmed exposure recovered from the provider.",
        actor: "Finance Recovery Unit",
        status: "Completed",
      },
      {
        eventId: "TML-10055",
        date: "2026-07-21",
        event: "Case Closed",
        description:
          "Case closed following full recovery and contract restriction.",
        actor: "Yousef Al-Hazmi",
        status: "Completed",
      },
    ],
  },
];

export function getFraudCaseById(
  caseId: string,
): FraudCase | undefined {
  return fraudDemoData.find(
    (fraudCase) => fraudCase.caseId === caseId,
  );
}

export function getFraudDashboardMetrics(): FraudDashboardMetrics {
  const totalCases = fraudDemoData.length;

  const activeInvestigations = fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.status !== "Closed" &&
      fraudCase.status !== "False Positive",
  ).length;

  const criticalCases = fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.riskLevel === "Critical",
  ).length;

  const highRiskClaims = fraudDemoData.reduce(
    (total, fraudCase) =>
      total +
      fraudCase.relatedClaims.filter(
        (claim) => claim.anomalyScore >= 85,
      ).length,
    0,
  );

  const suspectedFraudRings = fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.category === "Provider Collusion" ||
      fraudCase.networkRelationships.some(
        (relationship) =>
          relationship.riskLevel === "Critical",
      ),
  ).length;

  const aiAlerts = fraudDemoData.reduce(
    (total, fraudCase) =>
      total + fraudCase.alerts.length,
    0,
  );

  const estimatedExposure = fraudDemoData.reduce(
    (total, fraudCase) =>
      total + fraudCase.estimatedExposure,
    0,
  );

  const identifiedSavings = fraudDemoData.reduce(
    (total, fraudCase) =>
      total + fraudCase.identifiedSavings,
    0,
  );

  const recoveryPotential = fraudDemoData.reduce(
    (total, fraudCase) =>
      total + fraudCase.recoveryPotential,
    0,
  );

  const recoveredAmount = fraudDemoData.reduce(
    (total, fraudCase) =>
      total + fraudCase.recoveredAmount,
    0,
  );

  const investigationBacklog = fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.status === "New" ||
      fraudCase.status === "Under Review",
  ).length;

  const closedCases = fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.status === "Closed",
  ).length;

  const averageConfidenceScore =
    totalCases === 0
      ? 0
      : Math.round(
          fraudDemoData.reduce(
            (total, fraudCase) =>
              total +
              fraudCase.aiConfidenceScore,
            0,
          ) / totalCases,
        );

  return {
    totalCases,
    activeInvestigations,
    criticalCases,
    highRiskClaims,
    suspectedFraudRings,
    aiAlerts,
    estimatedExposure,
    identifiedSavings,
    recoveryPotential,
    recoveredAmount,
    investigationBacklog,
    closedCases,
    averageConfidenceScore,
  };
}

export function getFraudCasesByStatus(
  status: FraudCaseStatus,
): FraudCase[] {
  return fraudDemoData.filter(
    (fraudCase) => fraudCase.status === status,
  );
}

export function getFraudCasesByRisk(
  riskLevel: FraudRiskLevel,
): FraudCase[] {
  return fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.riskLevel === riskLevel,
  );
}

export function getFraudCasesByCategory(
  category: FraudCategory,
): FraudCase[] {
  return fraudDemoData.filter(
    (fraudCase) =>
      fraudCase.category === category,
  );
}