export type AIInsightDomain =
  | "Claims"
  | "Medical Underwriting"
  | "Fraud Detection"
  | "Prior Authorization"
  | "Payment Integrity"
  | "Provider Network"
  | "Population Health"
  | "Member Engagement"
  | "Operational Intelligence";

export type AIInsightSeverity =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type AIInsightStatus =
  | "New"
  | "Under Review"
  | "Action Required"
  | "In Progress"
  | "Resolved"
  | "Dismissed";

export type AIReviewStatus =
  | "Pending"
  | "Approved"
  | "Escalated"
  | "Rejected";

export type GovernanceStatus =
  | "Compliant"
  | "Attention Required"
  | "Restricted"
  | "Under Review";

export type DriftStatus =
  | "Normal"
  | "Watch"
  | "Degraded"
  | "Critical";

export type BiasStatus =
  | "Passed"
  | "Watch"
  | "Failed"
  | "Not Assessed";

export type AuditStatus =
  | "Complete"
  | "Pending"
  | "Exception"
  | "Not Required";

export type TrendDirection =
  | "Increasing"
  | "Decreasing"
  | "Stable";

export type ImpactType =
  | "Savings Opportunity"
  | "Financial Exposure"
  | "Operational Risk"
  | "Clinical Risk"
  | "Revenue Protection"
  | "Member Experience";

export type EntityType =
  | "Claim"
  | "Member"
  | "Provider"
  | "Policy"
  | "Authorization"
  | "Payment"
  | "Employer Group"
  | "Portfolio";

export interface AIModel {
  modelId: string;
  modelName: string;
  modelVersion: string;
  modelType:
    | "Predictive"
    | "Classification"
    | "Anomaly Detection"
    | "Clinical NLP"
    | "Forecasting"
    | "Recommendation";
  businessDomain: AIInsightDomain;
  owner: string;
  deploymentStatus:
    | "Production"
    | "Pilot"
    | "Monitoring"
    | "Restricted";
  lastValidatedDate: string;
  nextReviewDate: string;
  trainingDataPeriod: string;
  performanceMetric: string;
  performanceValue: number;
  driftStatus: DriftStatus;
  biasStatus: BiasStatus;
  governanceStatus: GovernanceStatus;
}

export interface FeatureDriver {
  featureId: string;
  featureName: string;
  featureValue: string;
  importanceScore: number;
  direction:
    | "Increases Risk"
    | "Reduces Risk"
    | "Neutral";
  explanation: string;
}

export interface SupportingEvidence {
  evidenceId: string;
  evidenceType:
    | "Claim Record"
    | "Member History"
    | "Provider Profile"
    | "Clinical Record"
    | "Payment Record"
    | "Authorization Record"
    | "Policy Record"
    | "Portfolio Trend";
  referenceId: string;
  title: string;
  description: string;
  date: string;
  relevanceScore: number;
}

export interface RecommendedAction {
  actionId: string;
  action: string;
  rationale: string;
  owner: string;
  dueDate: string;
  priority: AIInsightSeverity;
  status:
    | "Recommended"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Rejected";
  estimatedImpact: number;
}

export interface HumanReview {
  reviewer: string;
  reviewerRole: string;
  reviewStatus: AIReviewStatus;
  reviewDate: string;
  comments: string;
  overrideApplied: boolean;
  overrideReason: string;
}

export interface GovernanceAssessment {
  governanceStatus: GovernanceStatus;
  biasStatus: BiasStatus;
  fairnessScore: number;
  driftStatus: DriftStatus;
  auditStatus: AuditStatus;
  explainabilityScore: number;
  dataQualityScore: number;
  privacyStatus:
    | "Passed"
    | "Attention Required"
    | "Restricted";
  humanOversightRequired: boolean;
  lastGovernanceReview: string;
  nextGovernanceReview: string;
}

export interface InsightTimelineEvent {
  eventId: string;
  date: string;
  event: string;
  description: string;
  actor: string;
  status:
    | "Completed"
    | "Pending"
    | "Warning"
    | "Escalated";
}

export interface AffectedEntity {
  entityId: string;
  entityType: EntityType;
  entityName: string;
  relationship: string;
  riskScore: number;
  financialValue: number;
}

export interface AIInsight {
  insightId: string;
  title: string;
  summary: string;
  domain: AIInsightDomain;
  severity: AIInsightSeverity;
  status: AIInsightStatus;
  impactType: ImpactType;

  generatedDate: string;
  lastUpdatedDate: string;
  predictionPeriod: string;

  confidenceScore: number;
  riskScore: number;
  probabilityScore: number;
  trendDirection: TrendDirection;

  financialImpact: number;
  estimatedSavings: number;
  estimatedExposure: number;

  primaryEntityId: string;
  primaryEntityType: EntityType;
  primaryEntityName: string;

  assignedOwner: string;
  ownerRole: string;
  businessUnit: string;

  model: AIModel;

  explanation: string;
  businessImpact: string;
  recommendedDecision: string;
  uncertaintyStatement: string;

  featureDrivers: FeatureDriver[];
  supportingEvidence: SupportingEvidence[];
  affectedEntities: AffectedEntity[];
  recommendedActions: RecommendedAction[];

  humanReview: HumanReview;
  governance: GovernanceAssessment;
  timeline: InsightTimelineEvent[];
}

export interface AIExecutiveMetrics {
  totalInsights: number;
  criticalInsights: number;
  highPriorityInsights: number;
  actionRequired: number;
  resolvedInsights: number;
  averageConfidence: number;
  enterpriseAIRiskScore: number;
  predictedClaimsCost: number;
  predictedFraudLoss: number;
  paymentLeakageExposure: number;
  underwritingRiskExposure: number;
  authorizationDelayExposure: number;
  memberChurnExposure: number;
  providerRiskExposure: number;
  identifiedSavings: number;
  recoveryOpportunity: number;
  governanceExceptions: number;
  driftAlerts: number;
  biasAlerts: number;
}

export const aiModels: AIModel[] = [
  {
    modelId: "MDL-CLAIMS-001",
    modelName: "Claims Cost Prediction",
    modelVersion: "3.2.0",
    modelType: "Forecasting",
    businessDomain: "Claims",
    owner: "Enterprise Analytics",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-10",
    nextReviewDate: "2026-10-10",
    trainingDataPeriod: "January 2023 to June 2026",
    performanceMetric: "MAPE",
    performanceValue: 8.4,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-FRAUD-001",
    modelName: "Fraud Detection AI",
    modelVersion: "4.6.0",
    modelType: "Anomaly Detection",
    businessDomain: "Fraud Detection",
    owner: "Payment Integrity",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-05",
    nextReviewDate: "2026-10-05",
    trainingDataPeriod: "January 2022 to June 2026",
    performanceMetric: "Precision",
    performanceValue: 91.8,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-UW-001",
    modelName: "Underwriting Risk AI",
    modelVersion: "3.0.0",
    modelType: "Predictive",
    businessDomain: "Medical Underwriting",
    owner: "Underwriting Intelligence",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-08",
    nextReviewDate: "2026-10-08",
    trainingDataPeriod: "January 2021 to June 2026",
    performanceMetric: "AUC",
    performanceValue: 89.6,
    driftStatus: "Watch",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-PA-001",
    modelName: "Authorization Delay Predictor",
    modelVersion: "2.1.0",
    modelType: "Predictive",
    businessDomain: "Prior Authorization",
    owner: "Utilization Management",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-12",
    nextReviewDate: "2026-10-12",
    trainingDataPeriod: "January 2024 to June 2026",
    performanceMetric: "F1 Score",
    performanceValue: 87.2,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-PAY-001",
    modelName: "Payment Integrity AI",
    modelVersion: "2.2.0",
    modelType: "Anomaly Detection",
    businessDomain: "Payment Integrity",
    owner: "Finance Operations",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-11",
    nextReviewDate: "2026-10-11",
    trainingDataPeriod: "January 2023 to June 2026",
    performanceMetric: "Recall",
    performanceValue: 93.1,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-PROV-001",
    modelName: "Provider Risk Engine",
    modelVersion: "2.4.0",
    modelType: "Classification",
    businessDomain: "Provider Network",
    owner: "Provider Integrity",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-09",
    nextReviewDate: "2026-10-09",
    trainingDataPeriod: "January 2022 to June 2026",
    performanceMetric: "AUC",
    performanceValue: 92.4,
    driftStatus: "Watch",
    biasStatus: "Passed",
    governanceStatus: "Attention Required",
  },
  {
    modelId: "MDL-MEM-001",
    modelName: "Member Churn Predictor",
    modelVersion: "1.9.0",
    modelType: "Predictive",
    businessDomain: "Member Engagement",
    owner: "Member Experience",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-03",
    nextReviewDate: "2026-10-03",
    trainingDataPeriod: "January 2024 to June 2026",
    performanceMetric: "AUC",
    performanceValue: 84.7,
    driftStatus: "Normal",
    biasStatus: "Watch",
    governanceStatus: "Attention Required",
  },
  {
    modelId: "MDL-POP-001",
    modelName: "High-Cost Member Predictor",
    modelVersion: "2.5.0",
    modelType: "Predictive",
    businessDomain: "Population Health",
    owner: "Population Health Analytics",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-07",
    nextReviewDate: "2026-10-07",
    trainingDataPeriod: "January 2022 to June 2026",
    performanceMetric: "AUC",
    performanceValue: 90.3,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-NLP-001",
    modelName: "Clinical NLP Engine",
    modelVersion: "5.1.0",
    modelType: "Clinical NLP",
    businessDomain: "Medical Underwriting",
    owner: "Clinical AI",
    deploymentStatus: "Production",
    lastValidatedDate: "2026-07-06",
    nextReviewDate: "2026-10-06",
    trainingDataPeriod: "Clinical corpus through June 2026",
    performanceMetric: "Entity F1 Score",
    performanceValue: 94.2,
    driftStatus: "Normal",
    biasStatus: "Passed",
    governanceStatus: "Compliant",
  },
  {
    modelId: "MDL-OPS-001",
    modelName: "Operations Bottleneck Predictor",
    modelVersion: "1.6.0",
    modelType: "Forecasting",
    businessDomain: "Operational Intelligence",
    owner: "Enterprise Operations",
    deploymentStatus: "Monitoring",
    lastValidatedDate: "2026-07-14",
    nextReviewDate: "2026-09-14",
    trainingDataPeriod: "January 2024 to July 2026",
    performanceMetric: "MAPE",
    performanceValue: 11.3,
    driftStatus: "Watch",
    biasStatus: "Not Assessed",
    governanceStatus: "Under Review",
  },
];

export const aiInsightsDemoData: AIInsight[] = [
  {
    insightId: "AI-INS-2026-001",
    title: "Claims expenditure expected to exceed monthly forecast",
    summary:
      "Inpatient cardiology and oncology claims are projected to push total claims expenditure 11.8% above the approved August forecast.",
    domain: "Claims",
    severity: "Critical",
    status: "Action Required",
    impactType: "Financial Exposure",
    generatedDate: "2026-08-01",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "August 2026",
    confidenceScore: 94,
    riskScore: 92,
    probabilityScore: 88,
    trendDirection: "Increasing",
    financialImpact: 6800000,
    estimatedSavings: 1400000,
    estimatedExposure: 6800000,
    primaryEntityId: "PORTFOLIO-CLAIMS-2026-08",
    primaryEntityType: "Portfolio",
    primaryEntityName: "Enterprise Claims Portfolio",
    assignedOwner: "Omar Al-Rashid",
    ownerRole: "Claims Finance Director",
    businessUnit: "Claims and Finance",
    model: aiModels[0],
    explanation:
      "The forecast increase is driven by higher inpatient admission frequency, longer average length of stay, increased oncology infusion costs and a concentration of high-value cardiology procedures.",
    businessImpact:
      "Without intervention, the claims budget may exceed plan by SAR 6.8 million, negatively affecting the medical loss ratio and monthly cash-flow position.",
    recommendedDecision:
      "Initiate targeted utilization review for high-cost cardiology and oncology cases, verify network pricing and review discharge-planning opportunities.",
    uncertaintyStatement:
      "The forecast may vary if current inpatient discharges occur earlier than expected or if pending high-value claims are denied.",
    featureDrivers: [
      {
        featureId: "FD-001-01",
        featureName: "Inpatient admission frequency",
        featureValue: "+18.4%",
        importanceScore: 29,
        direction: "Increases Risk",
        explanation:
          "Admission frequency is materially above the three-month moving average.",
      },
      {
        featureId: "FD-001-02",
        featureName: "Average length of stay",
        featureValue: "6.8 days",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Average stay increased from 5.1 to 6.8 days.",
      },
      {
        featureId: "FD-001-03",
        featureName: "Oncology infusion cost",
        featureValue: "+22.1%",
        importanceScore: 21,
        direction: "Increases Risk",
        explanation:
          "Specialty drug expenditure is above forecast.",
      },
      {
        featureId: "FD-001-04",
        featureName: "Network discount performance",
        featureValue: "92% of target",
        importanceScore: 14,
        direction: "Increases Risk",
        explanation:
          "Negotiated discounts are underperforming against contract targets.",
      },
      {
        featureId: "FD-001-05",
        featureName: "Preventive care engagement",
        featureValue: "+8.2%",
        importanceScore: 12,
        direction: "Reduces Risk",
        explanation:
          "Improved preventive engagement partially offsets future exposure.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-001-01",
        evidenceType: "Portfolio Trend",
        referenceId: "RPT-CLAIMS-AUG-2026",
        title: "August Claims Forecast",
        description:
          "Claims cost forecast by service line and provider.",
        date: "2026-08-01",
        relevanceScore: 98,
      },
      {
        evidenceId: "EV-001-02",
        evidenceType: "Claim Record",
        referenceId: "CLM-HIGH-COST-BATCH-08",
        title: "High-Value Claim Cohort",
        description:
          "Twenty-eight claims with approved values above SAR 100,000.",
        date: "2026-08-01",
        relevanceScore: 95,
      },
    ],
    affectedEntities: [
      {
        entityId: "PRV-10001",
        entityType: "Provider",
        entityName: "Al Noor Specialist Hospital",
        relationship: "Highest inpatient cost contributor",
        riskScore: 86,
        financialValue: 2100000,
      },
      {
        entityId: "PRV-10002",
        entityType: "Provider",
        entityName: "Kingdom Specialist Centre",
        relationship: "High-cost cardiology contributor",
        riskScore: 78,
        financialValue: 1800000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-001-01",
        action: "Launch high-cost case review",
        rationale:
          "Targeted clinical review can reduce avoidable length of stay and inappropriate utilization.",
        owner: "Utilization Management",
        dueDate: "2026-08-05",
        priority: "Critical",
        status: "Approved",
        estimatedImpact: 900000,
      },
      {
        actionId: "ACT-AI-001-02",
        action: "Review provider pricing variance",
        rationale:
          "Network pricing underperformance is contributing to the forecast variance.",
        owner: "Provider Contracting",
        dueDate: "2026-08-09",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 500000,
      },
    ],
    humanReview: {
      reviewer: "Dr. Lina Al-Salem",
      reviewerRole: "Chief Medical Reviewer",
      reviewStatus: "Approved",
      reviewDate: "2026-08-02",
      comments:
        "Forecast is clinically plausible. Recommend immediate utilization review.",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 97,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 94,
      dataQualityScore: 96,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-10",
      nextGovernanceReview: "2026-10-10",
    },
    timeline: [
      {
        eventId: "TL-AI-001-01",
        date: "2026-08-01",
        event: "Insight Generated",
        description:
          "Claims forecast model detected projected budget variance.",
        actor: "Claims Cost Prediction v3.2",
        status: "Completed",
      },
      {
        eventId: "TL-AI-001-02",
        date: "2026-08-02",
        event: "Clinical Review Completed",
        description:
          "Chief Medical Reviewer confirmed clinical plausibility.",
        actor: "Dr. Lina Al-Salem",
        status: "Completed",
      },
      {
        eventId: "TL-AI-001-03",
        date: "2026-08-02",
        event: "Action Required",
        description:
          "Insight escalated to Claims and Finance leadership.",
        actor: "AI Insights Workflow",
        status: "Escalated",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-002",
    title: "Critical provider fraud risk concentration detected",
    summary:
      "One provider accounts for a disproportionate share of high-risk coding, laboratory referral and payment-integrity alerts.",
    domain: "Fraud Detection",
    severity: "Critical",
    status: "Under Review",
    impactType: "Revenue Protection",
    generatedDate: "2026-08-01",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Current quarter",
    confidenceScore: 97,
    riskScore: 95,
    probabilityScore: 92,
    trendDirection: "Increasing",
    financialImpact: 3200000,
    estimatedSavings: 1800000,
    estimatedExposure: 3200000,
    primaryEntityId: "PRV-10033",
    primaryEntityType: "Provider",
    primaryEntityName: "Eastern Family Care Clinic",
    assignedOwner: "Maha Al-Shammari",
    ownerRole: "Lead Network Investigator",
    businessUnit: "Fraud, Waste and Abuse",
    model: aiModels[1],
    explanation:
      "The provider demonstrates unusual coding severity, repeated laboratory utilization, concentrated referral relationships and elevated payment exceptions.",
    businessImpact:
      "Continued payment without enhanced controls could expose the insurer to an additional SAR 3.2 million in preventable losses.",
    recommendedDecision:
      "Place high-risk claims on prepayment review, expand the retrospective audit and assess provider-network restrictions.",
    uncertaintyStatement:
      "Some anomalies may reflect legitimate specialty case mix and require clinical validation.",
    featureDrivers: [
      {
        featureId: "FD-002-01",
        featureName: "Suspicious claims ratio",
        featureValue: "9.2%",
        importanceScore: 31,
        direction: "Increases Risk",
        explanation:
          "The suspicious claim ratio is materially above the network benchmark.",
      },
      {
        featureId: "FD-002-02",
        featureName: "Peer billing variance",
        featureValue: "+287%",
        importanceScore: 27,
        direction: "Increases Risk",
        explanation:
          "Billing frequency and service intensity exceed peer norms.",
      },
      {
        featureId: "FD-002-03",
        featureName: "Referral concentration",
        featureValue: "81%",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Most referrals are concentrated toward one affiliated laboratory.",
      },
      {
        featureId: "FD-002-04",
        featureName: "Provider response history",
        featureValue: "Delayed",
        importanceScore: 18,
        direction: "Increases Risk",
        explanation:
          "The provider has not fully responded to prior information requests.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-002-01",
        evidenceType: "Provider Profile",
        referenceId: "PRV-10033",
        title: "Provider Risk Profile",
        description:
          "Provider utilization, billing and peer-comparison profile.",
        date: "2026-08-01",
        relevanceScore: 99,
      },
      {
        evidenceId: "EV-002-02",
        evidenceType: "Claim Record",
        referenceId: "FWA-2026-003",
        title: "Open Fraud Investigation",
        description:
          "Laboratory overutilization and referral-concentration investigation.",
        date: "2026-07-30",
        relevanceScore: 97,
      },
    ],
    affectedEntities: [
      {
        entityId: "PRV-10033",
        entityType: "Provider",
        entityName: "Eastern Family Care Clinic",
        relationship: "Primary high-risk provider",
        riskScore: 95,
        financialValue: 2400000,
      },
      {
        entityId: "PRV-10034",
        entityType: "Provider",
        entityName: "Eastern Precision Laboratory",
        relationship: "Concentrated referral partner",
        riskScore: 91,
        financialValue: 800000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-002-01",
        action: "Apply prepayment review",
        rationale:
          "Enhanced review will prevent additional payment exposure.",
        owner: "Claims Payment Integrity",
        dueDate: "2026-08-03",
        priority: "Critical",
        status: "In Progress",
        estimatedImpact: 1000000,
      },
      {
        actionId: "ACT-AI-002-02",
        action: "Expand provider audit",
        rationale:
          "Current evidence indicates a provider-level pattern rather than isolated claims.",
        owner: "Provider Integrity",
        dueDate: "2026-08-12",
        priority: "High",
        status: "Approved",
        estimatedImpact: 800000,
      },
    ],
    humanReview: {
      reviewer: "Maha Al-Shammari",
      reviewerRole: "Lead Network Investigator",
      reviewStatus: "Escalated",
      reviewDate: "2026-08-02",
      comments:
        "The provider requires immediate executive fraud-governance review.",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 96,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 95,
      dataQualityScore: 94,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-05",
      nextGovernanceReview: "2026-10-05",
    },
    timeline: [
      {
        eventId: "TL-AI-002-01",
        date: "2026-08-01",
        event: "Provider Risk Alert Generated",
        description:
          "Fraud model detected critical provider concentration.",
        actor: "Fraud Detection AI v4.6",
        status: "Completed",
      },
      {
        eventId: "TL-AI-002-02",
        date: "2026-08-02",
        event: "Investigator Review",
        description:
          "Network investigator confirmed escalation criteria.",
        actor: "Maha Al-Shammari",
        status: "Completed",
      },
      {
        eventId: "TL-AI-002-03",
        date: "2026-08-02",
        event: "Executive Escalation",
        description:
          "Insight escalated to the fraud-governance committee.",
        actor: "FWA Workflow",
        status: "Escalated",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-003",
    title: "High-risk members likely to become high-cost next quarter",
    summary:
      "Forty-two members are predicted to enter the top 5% of claims expenditure during the next quarter.",
    domain: "Population Health",
    severity: "High",
    status: "New",
    impactType: "Clinical Risk",
    generatedDate: "2026-08-02",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Q4 2026",
    confidenceScore: 91,
    riskScore: 84,
    probabilityScore: 79,
    trendDirection: "Increasing",
    financialImpact: 4100000,
    estimatedSavings: 1200000,
    estimatedExposure: 4100000,
    primaryEntityId: "COHORT-HIGH-COST-Q4",
    primaryEntityType: "Portfolio",
    primaryEntityName: "High-Cost Member Cohort",
    assignedOwner: "Dr. Rania Al-Mansour",
    ownerRole: "Population Health Director",
    businessUnit: "Care Management",
    model: aiModels[7],
    explanation:
      "The cohort demonstrates worsening chronic disease indicators, increasing emergency utilization, medication complexity and incomplete follow-up care.",
    businessImpact:
      "Early care-management intervention may prevent avoidable emergency visits, admissions and disease complications.",
    recommendedDecision:
      "Enroll the highest-risk members in intensive care management and schedule proactive clinical outreach.",
    uncertaintyStatement:
      "Risk may decrease if pending follow-up visits and medication changes improve disease control.",
    featureDrivers: [
      {
        featureId: "FD-003-01",
        featureName: "Emergency visits",
        featureValue: "3.4 per member",
        importanceScore: 28,
        direction: "Increases Risk",
        explanation:
          "Emergency utilization increased over the previous six months.",
      },
      {
        featureId: "FD-003-02",
        featureName: "Chronic condition count",
        featureValue: "4.1 average",
        importanceScore: 25,
        direction: "Increases Risk",
        explanation:
          "Multiple uncontrolled chronic conditions increase future cost risk.",
      },
      {
        featureId: "FD-003-03",
        featureName: "Medication complexity",
        featureValue: "8.6 active medicines",
        importanceScore: 20,
        direction: "Increases Risk",
        explanation:
          "Polypharmacy increases clinical and adherence risk.",
      },
      {
        featureId: "FD-003-04",
        featureName: "Care gap closure",
        featureValue: "61%",
        importanceScore: 15,
        direction: "Increases Risk",
        explanation:
          "Preventive and chronic care gaps remain unresolved.",
      },
      {
        featureId: "FD-003-05",
        featureName: "Primary care engagement",
        featureValue: "Improving",
        importanceScore: 12,
        direction: "Reduces Risk",
        explanation:
          "Recent engagement may lower future utilization.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-003-01",
        evidenceType: "Member History",
        referenceId: "COHORT-HIGH-COST-Q4",
        title: "High-Cost Member Cohort",
        description:
          "Member-level clinical and utilization risk summary.",
        date: "2026-08-02",
        relevanceScore: 98,
      },
    ],
    affectedEntities: [
      {
        entityId: "MEM-10021",
        entityType: "Member",
        entityName: "Abdulrahman Al-Qahtani",
        relationship: "Highest predicted expenditure",
        riskScore: 91,
        financialValue: 260000,
      },
      {
        entityId: "MEM-10110",
        entityType: "Member",
        entityName: "Faisal Al-Dossary",
        relationship: "Frequent emergency utilization",
        riskScore: 88,
        financialValue: 220000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-003-01",
        action: "Enroll members in intensive care management",
        rationale:
          "Proactive intervention can reduce avoidable admissions and complications.",
        owner: "Care Management",
        dueDate: "2026-08-10",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 900000,
      },
      {
        actionId: "ACT-AI-003-02",
        action: "Complete medication review",
        rationale:
          "Medication complexity is a major risk contributor.",
        owner: "Clinical Pharmacy",
        dueDate: "2026-08-15",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 300000,
      },
    ],
    humanReview: {
      reviewer: "Pending Assignment",
      reviewerRole: "Population Health Clinician",
      reviewStatus: "Pending",
      reviewDate: "",
      comments: "",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 95,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 92,
      dataQualityScore: 93,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-07",
      nextGovernanceReview: "2026-10-07",
    },
    timeline: [
      {
        eventId: "TL-AI-003-01",
        date: "2026-08-02",
        event: "Cohort Prediction Generated",
        description:
          "High-cost member prediction completed for Q4.",
        actor: "High-Cost Member Predictor v2.5",
        status: "Completed",
      },
      {
        eventId: "TL-AI-003-02",
        date: "2026-08-02",
        event: "Human Review Pending",
        description:
          "Clinical validation has not yet been completed.",
        actor: "Population Health Workflow",
        status: "Pending",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-004",
    title: "Prior authorization backlog likely to breach SLA",
    summary:
      "Cardiology and advanced imaging requests are forecast to exceed turnaround-time targets within the next 48 hours.",
    domain: "Prior Authorization",
    severity: "High",
    status: "Action Required",
    impactType: "Operational Risk",
    generatedDate: "2026-08-02",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Next 48 hours",
    confidenceScore: 92,
    riskScore: 87,
    probabilityScore: 85,
    trendDirection: "Increasing",
    financialImpact: 950000,
    estimatedSavings: 280000,
    estimatedExposure: 950000,
    primaryEntityId: "PA-BACKLOG-2026-08-02",
    primaryEntityType: "Authorization",
    primaryEntityName: "Prior Authorization Backlog",
    assignedOwner: "Noura Al-Salem",
    ownerRole: "Utilization Management Director",
    businessUnit: "Prior Authorization",
    model: aiModels[3],
    explanation:
      "The backlog is driven by increased request volume, clinical reviewer shortages, incomplete provider documentation and a high concentration of complex cardiology requests.",
    businessImpact:
      "SLA breaches may delay member care, increase provider complaints and create regulatory exposure.",
    recommendedDecision:
      "Reallocate clinical reviewers, prioritize high-risk requests and trigger automated provider-documentation reminders.",
    uncertaintyStatement:
      "The risk may decline if providers submit missing documents earlier than forecast.",
    featureDrivers: [
      {
        featureId: "FD-004-01",
        featureName: "Open request volume",
        featureValue: "186 requests",
        importanceScore: 32,
        direction: "Increases Risk",
        explanation:
          "The open volume is 44% above daily capacity.",
      },
      {
        featureId: "FD-004-02",
        featureName: "Reviewer availability",
        featureValue: "72% capacity",
        importanceScore: 26,
        direction: "Increases Risk",
        explanation:
          "Available clinical review capacity is below requirement.",
      },
      {
        featureId: "FD-004-03",
        featureName: "Missing documentation",
        featureValue: "38%",
        importanceScore: 23,
        direction: "Increases Risk",
        explanation:
          "Incomplete submissions require additional manual follow-up.",
      },
      {
        featureId: "FD-004-04",
        featureName: "Auto-approval eligibility",
        featureValue: "21%",
        importanceScore: 19,
        direction: "Reduces Risk",
        explanation:
          "A subset of low-risk requests may be safely automated.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-004-01",
        evidenceType: "Authorization Record",
        referenceId: "PA-BACKLOG-2026-08-02",
        title: "Authorization Queue Analysis",
        description:
          "Open requests, age, specialty and reviewer-capacity analysis.",
        date: "2026-08-02",
        relevanceScore: 99,
      },
    ],
    affectedEntities: [
      {
        entityId: "PA-CARDIOLOGY",
        entityType: "Authorization",
        entityName: "Cardiology Authorization Queue",
        relationship: "Highest SLA breach risk",
        riskScore: 91,
        financialValue: 540000,
      },
      {
        entityId: "PA-IMAGING",
        entityType: "Authorization",
        entityName: "Advanced Imaging Queue",
        relationship: "Second-highest backlog concentration",
        riskScore: 84,
        financialValue: 410000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-004-01",
        action: "Reallocate clinical reviewers",
        rationale:
          "Temporary staffing changes will reduce queue age.",
        owner: "Utilization Management",
        dueDate: "2026-08-03",
        priority: "Critical",
        status: "Approved",
        estimatedImpact: 180000,
      },
      {
        actionId: "ACT-AI-004-02",
        action: "Enable low-risk auto-approval",
        rationale:
          "Rules-based automation can reduce manual workload.",
        owner: "Clinical Operations",
        dueDate: "2026-08-05",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 100000,
      },
    ],
    humanReview: {
      reviewer: "Noura Al-Salem",
      reviewerRole: "Utilization Management Director",
      reviewStatus: "Approved",
      reviewDate: "2026-08-02",
      comments:
        "Immediate workload redistribution approved.",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 98,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 93,
      dataQualityScore: 97,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-12",
      nextGovernanceReview: "2026-10-12",
    },
    timeline: [
      {
        eventId: "TL-AI-004-01",
        date: "2026-08-02",
        event: "SLA Risk Predicted",
        description:
          "Model detected likely turnaround-time breach.",
        actor: "Authorization Delay Predictor v2.1",
        status: "Completed",
      },
      {
        eventId: "TL-AI-004-02",
        date: "2026-08-02",
        event: "Operational Action Approved",
        description:
          "Reviewer reallocation was approved.",
        actor: "Noura Al-Salem",
        status: "Completed",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-005",
    title: "Payment leakage detected in duplicate reimbursement pattern",
    summary:
      "Cross-channel duplicate submissions may have created SAR 1.18 million in overpayment exposure.",
    domain: "Payment Integrity",
    severity: "Critical",
    status: "In Progress",
    impactType: "Revenue Protection",
    generatedDate: "2026-08-01",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Current quarter",
    confidenceScore: 99,
    riskScore: 93,
    probabilityScore: 96,
    trendDirection: "Increasing",
    financialImpact: 1180000,
    estimatedSavings: 760000,
    estimatedExposure: 1180000,
    primaryEntityId: "PAY-10003",
    primaryEntityType: "Payment",
    primaryEntityName: "Duplicate Payment Cohort",
    assignedOwner: "Khalid Al-Otaibi",
    ownerRole: "Payment Integrity Investigator",
    businessUnit: "Finance and Payment Integrity",
    model: aiModels[4],
    explanation:
      "The same member, provider, service date and procedure combinations were submitted through multiple channels and paid under separate references.",
    businessImpact:
      "Unresolved duplicates may lead to significant financial leakage and distorted provider-payment reporting.",
    recommendedDecision:
      "Block pending duplicates, recover paid duplicates and enable provider-specific duplicate controls.",
    uncertaintyStatement:
      "A small number of submissions may represent legitimate corrected claims rather than duplicates.",
    featureDrivers: [
      {
        featureId: "FD-005-01",
        featureName: "Exact field match",
        featureValue: "100%",
        importanceScore: 36,
        direction: "Increases Risk",
        explanation:
          "Member, provider, date and procedure fields are identical.",
      },
      {
        featureId: "FD-005-02",
        featureName: "Cross-channel submission",
        featureValue: "Portal and batch",
        importanceScore: 28,
        direction: "Increases Risk",
        explanation:
          "Claims were submitted through different processing channels.",
      },
      {
        featureId: "FD-005-03",
        featureName: "Submission interval",
        featureValue: "Under 48 hours",
        importanceScore: 21,
        direction: "Increases Risk",
        explanation:
          "Repeated submissions occurred within a short interval.",
      },
      {
        featureId: "FD-005-04",
        featureName: "Correction indicator",
        featureValue: "Missing",
        importanceScore: 15,
        direction: "Increases Risk",
        explanation:
          "The submissions were not marked as corrected claims.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-005-01",
        evidenceType: "Payment Record",
        referenceId: "PAY-10003",
        title: "Duplicate Payment Record",
        description:
          "Payment reconciliation and duplicate claim comparison.",
        date: "2026-08-01",
        relevanceScore: 100,
      },
      {
        evidenceId: "EV-005-02",
        evidenceType: "Claim Record",
        referenceId: "FWA-2026-002",
        title: "Duplicate Claims Investigation",
        description:
          "Open fraud investigation for cross-channel duplicate submissions.",
        date: "2026-07-27",
        relevanceScore: 98,
      },
    ],
    affectedEntities: [
      {
        entityId: "PRV-10018",
        entityType: "Provider",
        entityName: "Jeddah Horizon Medical Center",
        relationship: "Submitting provider",
        riskScore: 88,
        financialValue: 1180000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-005-01",
        action: "Recover duplicate payments",
        rationale:
          "Payment records confirm duplicate settlement.",
        owner: "Finance Recovery Unit",
        dueDate: "2026-08-06",
        priority: "Critical",
        status: "In Progress",
        estimatedImpact: 720000,
      },
      {
        actionId: "ACT-AI-005-02",
        action: "Apply duplicate hold rule",
        rationale:
          "Provider-specific controls will prevent further leakage.",
        owner: "Claims Configuration",
        dueDate: "2026-08-04",
        priority: "High",
        status: "Approved",
        estimatedImpact: 40000,
      },
    ],
    humanReview: {
      reviewer: "Khalid Al-Otaibi",
      reviewerRole: "Payment Integrity Investigator",
      reviewStatus: "Approved",
      reviewDate: "2026-08-02",
      comments:
        "Duplicate pattern confirmed. Recovery remains in progress.",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 99,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 98,
      dataQualityScore: 99,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-11",
      nextGovernanceReview: "2026-10-11",
    },
    timeline: [
      {
        eventId: "TL-AI-005-01",
        date: "2026-08-01",
        event: "Leakage Pattern Detected",
        description:
          "Payment Integrity AI detected duplicate reimbursement pattern.",
        actor: "Payment Integrity AI v2.2",
        status: "Completed",
      },
      {
        eventId: "TL-AI-005-02",
        date: "2026-08-02",
        event: "Recovery Confirmed",
        description:
          "Finance Recovery Unit confirmed recoverable duplicate payments.",
        actor: "Khalid Al-Otaibi",
        status: "Completed",
      },
      {
        eventId: "TL-AI-005-03",
        date: "2026-08-02",
        event: "Recovery In Progress",
        description:
          "Payment recovery workflow remains active.",
        actor: "Finance Recovery Unit",
        status: "Pending",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-006",
    title: "Underwriting portfolio risk is shifting upward",
    summary:
      "The proportion of applications classified as moderate or high risk increased by 14.2% over the previous month.",
    domain: "Medical Underwriting",
    severity: "High",
    status: "Under Review",
    impactType: "Financial Exposure",
    generatedDate: "2026-08-01",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "August to October 2026",
    confidenceScore: 89,
    riskScore: 82,
    probabilityScore: 78,
    trendDirection: "Increasing",
    financialImpact: 2800000,
    estimatedSavings: 900000,
    estimatedExposure: 2800000,
    primaryEntityId: "UW-PORTFOLIO-2026-08",
    primaryEntityType: "Portfolio",
    primaryEntityName: "New Business Underwriting Portfolio",
    assignedOwner: "Dr. Ahmed Al-Faraj",
    ownerRole: "Chief Medical Underwriter",
    businessUnit: "Medical Underwriting",
    model: aiModels[2],
    explanation:
      "The shift is associated with increasing diabetes prevalence, cardiovascular comorbidity, obesity-related conditions and higher expected claims cost.",
    businessImpact:
      "If pricing and eligibility rules remain unchanged, new business may generate an adverse medical loss ratio.",
    recommendedDecision:
      "Review risk thresholds, expected-cost assumptions and clinical evidence requirements for high-risk applications.",
    uncertaintyStatement:
      "The final risk distribution may change after outstanding medical evidence is received.",
    featureDrivers: [
      {
        featureId: "FD-006-01",
        featureName: "Diabetes prevalence",
        featureValue: "+12.8%",
        importanceScore: 27,
        direction: "Increases Risk",
        explanation:
          "More applicants have documented diabetes or prediabetes.",
      },
      {
        featureId: "FD-006-02",
        featureName: "Cardiovascular comorbidity",
        featureValue: "+9.6%",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Cardiovascular conditions are more common in recent applications.",
      },
      {
        featureId: "FD-006-03",
        featureName: "Expected claims cost",
        featureValue: "+16.2%",
        importanceScore: 23,
        direction: "Increases Risk",
        explanation:
          "Predicted annual claims cost increased across the portfolio.",
      },
      {
        featureId: "FD-006-04",
        featureName: "Missing clinical evidence",
        featureValue: "18%",
        importanceScore: 15,
        direction: "Increases Risk",
        explanation:
          "Incomplete medical evidence increases decision uncertainty.",
      },
      {
        featureId: "FD-006-05",
        featureName: "Preventive care indicators",
        featureValue: "Improving",
        importanceScore: 11,
        direction: "Reduces Risk",
        explanation:
          "Preventive engagement partially mitigates expected risk.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-006-01",
        evidenceType: "Policy Record",
        referenceId: "UW-PORTFOLIO-2026-08",
        title: "Underwriting Portfolio Analysis",
        description:
          "Risk distribution, expected cost and decision trend analysis.",
        date: "2026-08-01",
        relevanceScore: 97,
      },
      {
        evidenceId: "EV-006-02",
        evidenceType: "Clinical Record",
        referenceId: "UW-CLINICAL-COHORT-08",
        title: "Clinical Risk Cohort",
        description:
          "Applicant comorbidity and medical-evidence profile.",
        date: "2026-08-01",
        relevanceScore: 94,
      },
    ],
    affectedEntities: [
      {
        entityId: "EMP-10021",
        entityType: "Employer Group",
        entityName: "Riyadh Industrial Holdings",
        relationship: "Highest group-level underwriting risk shift",
        riskScore: 85,
        financialValue: 1200000,
      },
      {
        entityId: "EMP-10033",
        entityType: "Employer Group",
        entityName: "Eastern Logistics Group",
        relationship: "Second-highest expected-cost increase",
        riskScore: 79,
        financialValue: 900000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-006-01",
        action: "Review pricing assumptions",
        rationale:
          "Expected claims cost has increased materially.",
        owner: "Actuarial and Underwriting",
        dueDate: "2026-08-12",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 600000,
      },
      {
        actionId: "ACT-AI-006-02",
        action: "Strengthen evidence requirements",
        rationale:
          "Incomplete clinical evidence is increasing decision uncertainty.",
        owner: "Medical Underwriting",
        dueDate: "2026-08-08",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 300000,
      },
    ],
    humanReview: {
      reviewer: "Dr. Ahmed Al-Faraj",
      reviewerRole: "Chief Medical Underwriter",
      reviewStatus: "Pending",
      reviewDate: "",
      comments: "",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 95,
      driftStatus: "Watch",
      auditStatus: "Complete",
      explainabilityScore: 91,
      dataQualityScore: 92,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-08",
      nextGovernanceReview: "2026-10-08",
    },
    timeline: [
      {
        eventId: "TL-AI-006-01",
        date: "2026-08-01",
        event: "Portfolio Risk Shift Detected",
        description:
          "Underwriting model detected increasing moderate and high-risk applications.",
        actor: "Underwriting Risk AI v3.0",
        status: "Completed",
      },
      {
        eventId: "TL-AI-006-02",
        date: "2026-08-02",
        event: "Medical Review Pending",
        description:
          "Portfolio-level review has been assigned.",
        actor: "Underwriting Workflow",
        status: "Pending",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-007",
    title: "Member churn risk is rising in two employer groups",
    summary:
      "Member dissatisfaction, unresolved claims and repeated service delays indicate elevated renewal and attrition risk.",
    domain: "Member Engagement",
    severity: "Medium",
    status: "New",
    impactType: "Member Experience",
    generatedDate: "2026-08-02",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Next 90 days",
    confidenceScore: 85,
    riskScore: 72,
    probabilityScore: 69,
    trendDirection: "Increasing",
    financialImpact: 1900000,
    estimatedSavings: 650000,
    estimatedExposure: 1900000,
    primaryEntityId: "EMP-CHURN-COHORT-08",
    primaryEntityType: "Employer Group",
    primaryEntityName: "High-Churn Employer Cohort",
    assignedOwner: "Layla Al-Dosari",
    ownerRole: "Member Experience Director",
    businessUnit: "Member Services",
    model: aiModels[6],
    explanation:
      "The affected groups demonstrate lower satisfaction scores, more unresolved claims, longer prior-authorization delays and repeated contact-centre escalations.",
    businessImpact:
      "Employer dissatisfaction may reduce renewal rates and increase member attrition.",
    recommendedDecision:
      "Launch targeted employer recovery plans, resolve high-priority service issues and conduct executive account reviews.",
    uncertaintyStatement:
      "Churn risk may decline if current service-recovery actions are completed quickly.",
    featureDrivers: [
      {
        featureId: "FD-007-01",
        featureName: "Member satisfaction",
        featureValue: "2.8/5",
        importanceScore: 29,
        direction: "Increases Risk",
        explanation:
          "Satisfaction is materially below the portfolio average.",
      },
      {
        featureId: "FD-007-02",
        featureName: "Open complaints",
        featureValue: "48",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Complaint volume increased over the previous month.",
      },
      {
        featureId: "FD-007-03",
        featureName: "Unresolved claims",
        featureValue: "17%",
        importanceScore: 22,
        direction: "Increases Risk",
        explanation:
          "A significant share of claims remains unresolved.",
      },
      {
        featureId: "FD-007-04",
        featureName: "Authorization delay",
        featureValue: "+21 hours",
        importanceScore: 15,
        direction: "Increases Risk",
        explanation:
          "Authorization turnaround time exceeds group expectations.",
      },
      {
        featureId: "FD-007-05",
        featureName: "Recent service recovery",
        featureValue: "Started",
        importanceScore: 10,
        direction: "Reduces Risk",
        explanation:
          "Early service-recovery efforts may improve retention.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-007-01",
        evidenceType: "Member History",
        referenceId: "EMP-CHURN-COHORT-08",
        title: "Employer Group Experience Analysis",
        description:
          "Member satisfaction, complaint and service-resolution indicators.",
        date: "2026-08-02",
        relevanceScore: 96,
      },
    ],
    affectedEntities: [
      {
        entityId: "EMP-10041",
        entityType: "Employer Group",
        entityName: "Riyadh Manufacturing Group",
        relationship: "Highest predicted churn risk",
        riskScore: 78,
        financialValue: 1100000,
      },
      {
        entityId: "EMP-10052",
        entityType: "Employer Group",
        entityName: "Gulf Retail Holdings",
        relationship: "Second-highest churn exposure",
        riskScore: 71,
        financialValue: 800000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-007-01",
        action: "Launch employer service-recovery plan",
        rationale:
          "Direct employer engagement may reduce churn risk.",
        owner: "Account Management",
        dueDate: "2026-08-07",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 450000,
      },
      {
        actionId: "ACT-AI-007-02",
        action: "Resolve high-priority member complaints",
        rationale:
          "Open complaints are a major churn driver.",
        owner: "Member Services",
        dueDate: "2026-08-05",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 200000,
      },
    ],
    humanReview: {
      reviewer: "Pending Assignment",
      reviewerRole: "Member Experience Manager",
      reviewStatus: "Pending",
      reviewDate: "",
      comments: "",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Attention Required",
      biasStatus: "Watch",
      fairnessScore: 89,
      driftStatus: "Normal",
      auditStatus: "Pending",
      explainabilityScore: 88,
      dataQualityScore: 91,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-03",
      nextGovernanceReview: "2026-10-03",
    },
    timeline: [
      {
        eventId: "TL-AI-007-01",
        date: "2026-08-02",
        event: "Churn Risk Predicted",
        description:
          "Member Churn Predictor identified two high-risk employer groups.",
        actor: "Member Churn Predictor v1.9",
        status: "Completed",
      },
      {
        eventId: "TL-AI-007-02",
        date: "2026-08-02",
        event: "Governance Review Required",
        description:
          "Fairness score requires additional review.",
        actor: "AI Governance Monitor",
        status: "Warning",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-008",
    title: "Provider quality decline detected in Tier 2 network",
    summary:
      "Three Tier 2 providers show declining quality, higher readmission rates and worsening member-satisfaction scores.",
    domain: "Provider Network",
    severity: "High",
    status: "Under Review",
    impactType: "Clinical Risk",
    generatedDate: "2026-08-01",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Current quarter",
    confidenceScore: 90,
    riskScore: 83,
    probabilityScore: 81,
    trendDirection: "Increasing",
    financialImpact: 2300000,
    estimatedSavings: 720000,
    estimatedExposure: 2300000,
    primaryEntityId: "PROV-QUALITY-COHORT-T2",
    primaryEntityType: "Provider",
    primaryEntityName: "Tier 2 Quality-Risk Cohort",
    assignedOwner: "Saud Al-Ghamdi",
    ownerRole: "Provider Performance Director",
    businessUnit: "Provider Network",
    model: aiModels[5],
    explanation:
      "The affected providers demonstrate increasing readmissions, lower adherence to care pathways and declining member-experience metrics.",
    businessImpact:
      "Quality deterioration may increase claims cost, member dissatisfaction and avoidable utilization.",
    recommendedDecision:
      "Initiate performance-improvement plans and review network-tier status.",
    uncertaintyStatement:
      "Recent case-mix changes may partially explain the decline and require clinical validation.",
    featureDrivers: [
      {
        featureId: "FD-008-01",
        featureName: "Readmission rate",
        featureValue: "+4.8%",
        importanceScore: 31,
        direction: "Increases Risk",
        explanation:
          "Readmissions increased above specialty benchmarks.",
      },
      {
        featureId: "FD-008-02",
        featureName: "Member satisfaction",
        featureValue: "3.1/5",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Member-experience scores have declined.",
      },
      {
        featureId: "FD-008-03",
        featureName: "Care pathway adherence",
        featureValue: "76%",
        importanceScore: 22,
        direction: "Increases Risk",
        explanation:
          "Clinical pathway adherence is below contract target.",
      },
      {
        featureId: "FD-008-04",
        featureName: "Credential compliance",
        featureValue: "98%",
        importanceScore: 13,
        direction: "Reduces Risk",
        explanation:
          "Credential compliance remains strong.",
      },
      {
        featureId: "FD-008-05",
        featureName: "Case-mix severity",
        featureValue: "+7%",
        importanceScore: 10,
        direction: "Neutral",
        explanation:
          "Higher case severity may partially explain the observed trend.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-008-01",
        evidenceType: "Provider Profile",
        referenceId: "PROV-QUALITY-COHORT-T2",
        title: "Tier 2 Provider Quality Analysis",
        description:
          "Quality, readmission, pathway and satisfaction trends.",
        date: "2026-08-01",
        relevanceScore: 97,
      },
    ],
    affectedEntities: [
      {
        entityId: "PRV-10062",
        entityType: "Provider",
        entityName: "Central Medical Centre",
        relationship: "Largest quality decline",
        riskScore: 86,
        financialValue: 1100000,
      },
      {
        entityId: "PRV-10067",
        entityType: "Provider",
        entityName: "Riyadh Community Hospital",
        relationship: "Elevated readmission risk",
        riskScore: 82,
        financialValue: 700000,
      },
      {
        entityId: "PRV-10072",
        entityType: "Provider",
        entityName: "Gulf Specialist Clinic",
        relationship: "Member experience decline",
        riskScore: 76,
        financialValue: 500000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-008-01",
        action: "Initiate provider performance plan",
        rationale:
          "Quality indicators are below network targets.",
        owner: "Provider Performance",
        dueDate: "2026-08-12",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 500000,
      },
      {
        actionId: "ACT-AI-008-02",
        action: "Review network-tier eligibility",
        rationale:
          "Persistent underperformance may require tier reassessment.",
        owner: "Provider Contracting",
        dueDate: "2026-08-20",
        priority: "Medium",
        status: "Recommended",
        estimatedImpact: 220000,
      },
    ],
    humanReview: {
      reviewer: "Saud Al-Ghamdi",
      reviewerRole: "Provider Performance Director",
      reviewStatus: "Pending",
      reviewDate: "",
      comments: "",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Attention Required",
      biasStatus: "Passed",
      fairnessScore: 94,
      driftStatus: "Watch",
      auditStatus: "Complete",
      explainabilityScore: 90,
      dataQualityScore: 92,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-09",
      nextGovernanceReview: "2026-10-09",
    },
    timeline: [
      {
        eventId: "TL-AI-008-01",
        date: "2026-08-01",
        event: "Quality Decline Detected",
        description:
          "Provider Risk Engine identified a worsening quality pattern.",
        actor: "Provider Risk Engine v2.4",
        status: "Completed",
      },
      {
        eventId: "TL-AI-008-02",
        date: "2026-08-02",
        event: "Performance Review Assigned",
        description:
          "Review assigned to Provider Performance leadership.",
        actor: "Provider Intelligence Workflow",
        status: "Pending",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-009",
    title: "Claims denial rate is increasing in outpatient imaging",
    summary:
      "Outpatient imaging denials increased by 8.7%, primarily due to missing documentation and authorization mismatches.",
    domain: "Claims",
    severity: "Medium",
    status: "New",
    impactType: "Operational Risk",
    generatedDate: "2026-08-02",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Current month",
    confidenceScore: 88,
    riskScore: 68,
    probabilityScore: 75,
    trendDirection: "Increasing",
    financialImpact: 780000,
    estimatedSavings: 240000,
    estimatedExposure: 780000,
    primaryEntityId: "CLAIMS-IMAGING-DENIALS",
    primaryEntityType: "Claim",
    primaryEntityName: "Outpatient Imaging Claims",
    assignedOwner: "Maha Al-Qahtani",
    ownerRole: "Claims Operations Manager",
    businessUnit: "Claims Operations",
    model: aiModels[0],
    explanation:
      "Denials are concentrated among MRI and CT claims with incomplete clinical documentation or mismatched authorization references.",
    businessImpact:
      "Higher denial rates increase provider rework, member complaints and claims-processing cost.",
    recommendedDecision:
      "Improve provider submission guidance and validate authorization references before adjudication.",
    uncertaintyStatement:
      "Some recent denials may be reversed after additional documentation is received.",
    featureDrivers: [
      {
        featureId: "FD-009-01",
        featureName: "Missing documentation",
        featureValue: "43%",
        importanceScore: 34,
        direction: "Increases Risk",
        explanation:
          "Documentation gaps are the largest denial driver.",
      },
      {
        featureId: "FD-009-02",
        featureName: "Authorization mismatch",
        featureValue: "31%",
        importanceScore: 29,
        direction: "Increases Risk",
        explanation:
          "Authorization references do not match the submitted claims.",
      },
      {
        featureId: "FD-009-03",
        featureName: "Coding error",
        featureValue: "18%",
        importanceScore: 22,
        direction: "Increases Risk",
        explanation:
          "Procedure-code inconsistencies contribute to denials.",
      },
      {
        featureId: "FD-009-04",
        featureName: "Provider training completion",
        featureValue: "82%",
        importanceScore: 15,
        direction: "Reduces Risk",
        explanation:
          "Training completion partially reduces future denial risk.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-009-01",
        evidenceType: "Claim Record",
        referenceId: "CLAIMS-IMAGING-DENIALS",
        title: "Imaging Denial Analysis",
        description:
          "Denial reason, provider and authorization-linkage analysis.",
        date: "2026-08-02",
        relevanceScore: 98,
      },
    ],
    affectedEntities: [
      {
        entityId: "PRV-10003",
        entityType: "Provider",
        entityName: "Al Noor Diagnostics",
        relationship: "Highest documentation-related denial volume",
        riskScore: 72,
        financialValue: 320000,
      },
      {
        entityId: "PRV-10029",
        entityType: "Provider",
        entityName: "Riyadh Imaging Centre",
        relationship: "High authorization mismatch rate",
        riskScore: 69,
        financialValue: 260000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-009-01",
        action: "Launch provider submission education",
        rationale:
          "Documentation gaps are the main denial driver.",
        owner: "Provider Relations",
        dueDate: "2026-08-15",
        priority: "Medium",
        status: "Recommended",
        estimatedImpact: 140000,
      },
      {
        actionId: "ACT-AI-009-02",
        action: "Add authorization validation",
        rationale:
          "Pre-adjudication validation can prevent avoidable denials.",
        owner: "Claims Technology",
        dueDate: "2026-08-22",
        priority: "Medium",
        status: "Recommended",
        estimatedImpact: 100000,
      },
    ],
    humanReview: {
      reviewer: "Pending Assignment",
      reviewerRole: "Claims Operations Analyst",
      reviewStatus: "Pending",
      reviewDate: "",
      comments: "",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Compliant",
      biasStatus: "Passed",
      fairnessScore: 97,
      driftStatus: "Normal",
      auditStatus: "Complete",
      explainabilityScore: 92,
      dataQualityScore: 95,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-10",
      nextGovernanceReview: "2026-10-10",
    },
    timeline: [
      {
        eventId: "TL-AI-009-01",
        date: "2026-08-02",
        event: "Denial Pattern Detected",
        description:
          "Claims analytics detected rising imaging denial rates.",
        actor: "Claims Cost Prediction v3.2",
        status: "Completed",
      },
      {
        eventId: "TL-AI-009-02",
        date: "2026-08-02",
        event: "Operational Review Pending",
        description:
          "Claims Operations review has been requested.",
        actor: "Claims Intelligence Workflow",
        status: "Pending",
      },
    ],
  },

  {
    insightId: "AI-INS-2026-010",
    title: "Operational bottleneck predicted in claims review team",
    summary:
      "Manual claims-review capacity is forecast to fall 24% below required workload over the next seven days.",
    domain: "Operational Intelligence",
    severity: "High",
    status: "Action Required",
    impactType: "Operational Risk",
    generatedDate: "2026-08-02",
    lastUpdatedDate: "2026-08-02",
    predictionPeriod: "Next 7 days",
    confidenceScore: 87,
    riskScore: 80,
    probabilityScore: 82,
    trendDirection: "Increasing",
    financialImpact: 1250000,
    estimatedSavings: 380000,
    estimatedExposure: 1250000,
    primaryEntityId: "OPS-CLAIMS-REVIEW-TEAM",
    primaryEntityType: "Portfolio",
    primaryEntityName: "Claims Review Operations",
    assignedOwner: "Sara Al-Harbi",
    ownerRole: "Claims Operations Director",
    businessUnit: "Enterprise Operations",
    model: aiModels[9],
    explanation:
      "The predicted capacity gap is associated with increased high-complexity claims, reviewer leave, lower automation rates and rising documentation exceptions.",
    businessImpact:
      "The bottleneck may delay claims decisions, increase provider complaints and reduce SLA performance.",
    recommendedDecision:
      "Reallocate reviewers, increase straight-through processing and prioritize high-value claims.",
    uncertaintyStatement:
      "The forecast may improve if expected staff return earlier or automation volume increases.",
    featureDrivers: [
      {
        featureId: "FD-010-01",
        featureName: "Incoming review volume",
        featureValue: "+19%",
        importanceScore: 30,
        direction: "Increases Risk",
        explanation:
          "Manual review demand is increasing.",
      },
      {
        featureId: "FD-010-02",
        featureName: "Available reviewers",
        featureValue: "-14%",
        importanceScore: 26,
        direction: "Increases Risk",
        explanation:
          "Reviewer availability is below expected staffing.",
      },
      {
        featureId: "FD-010-03",
        featureName: "Automation rate",
        featureValue: "41%",
        importanceScore: 24,
        direction: "Increases Risk",
        explanation:
          "Straight-through processing remains below target.",
      },
      {
        featureId: "FD-010-04",
        featureName: "Case complexity",
        featureValue: "+11%",
        importanceScore: 20,
        direction: "Increases Risk",
        explanation:
          "The average review complexity has increased.",
      },
    ],
    supportingEvidence: [
      {
        evidenceId: "EV-010-01",
        evidenceType: "Portfolio Trend",
        referenceId: "OPS-CLAIMS-REVIEW-TEAM",
        title: "Claims Review Capacity Forecast",
        description:
          "Workload, staffing, automation and SLA forecast.",
        date: "2026-08-02",
        relevanceScore: 97,
      },
    ],
    affectedEntities: [
      {
        entityId: "TEAM-CLAIMS-MANUAL",
        entityType: "Portfolio",
        entityName: "Manual Claims Review Team",
        relationship: "Primary capacity constraint",
        riskScore: 84,
        financialValue: 1250000,
      },
    ],
    recommendedActions: [
      {
        actionId: "ACT-AI-010-01",
        action: "Temporarily reallocate reviewers",
        rationale:
          "Additional capacity is required to avoid SLA breaches.",
        owner: "Claims Operations",
        dueDate: "2026-08-04",
        priority: "High",
        status: "Approved",
        estimatedImpact: 220000,
      },
      {
        actionId: "ACT-AI-010-02",
        action: "Expand straight-through processing",
        rationale:
          "Low-risk claims can bypass manual review.",
        owner: "Claims Technology",
        dueDate: "2026-08-12",
        priority: "High",
        status: "Recommended",
        estimatedImpact: 160000,
      },
    ],
    humanReview: {
      reviewer: "Sara Al-Harbi",
      reviewerRole: "Claims Operations Director",
      reviewStatus: "Approved",
      reviewDate: "2026-08-02",
      comments:
        "Temporary staff reallocation approved.",
      overrideApplied: false,
      overrideReason: "",
    },
    governance: {
      governanceStatus: "Under Review",
      biasStatus: "Not Assessed",
      fairnessScore: 0,
      driftStatus: "Watch",
      auditStatus: "Pending",
      explainabilityScore: 86,
      dataQualityScore: 90,
      privacyStatus: "Passed",
      humanOversightRequired: true,
      lastGovernanceReview: "2026-07-14",
      nextGovernanceReview: "2026-09-14",
    },
    timeline: [
      {
        eventId: "TL-AI-010-01",
        date: "2026-08-02",
        event: "Capacity Gap Predicted",
        description:
          "Operations model detected a likely claims-review bottleneck.",
        actor: "Operations Bottleneck Predictor v1.6",
        status: "Completed",
      },
      {
        eventId: "TL-AI-010-02",
        date: "2026-08-02",
        event: "Staff Reallocation Approved",
        description:
          "Claims leadership approved temporary capacity changes.",
        actor: "Sara Al-Harbi",
        status: "Completed",
      },
      {
        eventId: "TL-AI-010-03",
        date: "2026-08-02",
        event: "Governance Review Pending",
        description:
          "Model remains under enhanced governance monitoring.",
        actor: "AI Governance Monitor",
        status: "Warning",
      },
    ],
  },
];

export function getAIInsightById(
  insightId: string,
): AIInsight | undefined {
  const normalizedId = insightId
    .trim()
    .toLowerCase();

  return aiInsightsDemoData.find(
    (insight) =>
      insight.insightId.toLowerCase() ===
      normalizedId,
  );
}

export function getAIInsightsByDomain(
  domain: AIInsightDomain,
): AIInsight[] {
  return aiInsightsDemoData.filter(
    (insight) => insight.domain === domain,
  );
}

export function getAIInsightsBySeverity(
  severity: AIInsightSeverity,
): AIInsight[] {
  return aiInsightsDemoData.filter(
    (insight) =>
      insight.severity === severity,
  );
}

export function getAIInsightsByStatus(
  status: AIInsightStatus,
): AIInsight[] {
  return aiInsightsDemoData.filter(
    (insight) => insight.status === status,
  );
}

export function getAIExecutiveMetrics(): AIExecutiveMetrics {
  const totalInsights = aiInsightsDemoData.length;

  const criticalInsights =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.severity === "Critical",
    ).length;

  const highPriorityInsights =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.severity === "High",
    ).length;

  const actionRequired =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.status === "Action Required" ||
        insight.status === "In Progress",
    ).length;

  const resolvedInsights =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.status === "Resolved",
    ).length;

  const averageConfidence =
    totalInsights === 0
      ? 0
      : Math.round(
          aiInsightsDemoData.reduce(
            (total, insight) =>
              total + insight.confidenceScore,
            0,
          ) / totalInsights,
        );

  const enterpriseAIRiskScore =
    totalInsights === 0
      ? 0
      : Math.round(
          aiInsightsDemoData.reduce(
            (total, insight) =>
              total + insight.riskScore,
            0,
          ) / totalInsights,
        );

  const predictedClaimsCost =
    aiInsightsDemoData
      .filter(
        (insight) => insight.domain === "Claims",
      )
      .reduce(
        (total, insight) =>
          total + insight.financialImpact,
        0,
      );

  const predictedFraudLoss =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain === "Fraud Detection",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const paymentLeakageExposure =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain === "Payment Integrity",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const underwritingRiskExposure =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain ===
          "Medical Underwriting",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const authorizationDelayExposure =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain ===
          "Prior Authorization",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const memberChurnExposure =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain ===
          "Member Engagement",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const providerRiskExposure =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.domain === "Provider Network",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedExposure,
        0,
      );

  const identifiedSavings =
    aiInsightsDemoData.reduce(
      (total, insight) =>
        total + insight.estimatedSavings,
      0,
    );

  const recoveryOpportunity =
    aiInsightsDemoData
      .filter(
        (insight) =>
          insight.impactType ===
            "Revenue Protection" ||
          insight.domain === "Payment Integrity" ||
          insight.domain === "Fraud Detection",
      )
      .reduce(
        (total, insight) =>
          total + insight.estimatedSavings,
        0,
      );

  const governanceExceptions =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.governance.governanceStatus !==
        "Compliant",
    ).length;

  const driftAlerts =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.governance.driftStatus ===
          "Watch" ||
        insight.governance.driftStatus ===
          "Degraded" ||
        insight.governance.driftStatus ===
          "Critical",
    ).length;

  const biasAlerts =
    aiInsightsDemoData.filter(
      (insight) =>
        insight.governance.biasStatus ===
          "Watch" ||
        insight.governance.biasStatus ===
          "Failed",
    ).length;

  return {
    totalInsights,
    criticalInsights,
    highPriorityInsights,
    actionRequired,
    resolvedInsights,
    averageConfidence,
    enterpriseAIRiskScore,
    predictedClaimsCost,
    predictedFraudLoss,
    paymentLeakageExposure,
    underwritingRiskExposure,
    authorizationDelayExposure,
    memberChurnExposure,
    providerRiskExposure,
    identifiedSavings,
    recoveryOpportunity,
    governanceExceptions,
    driftAlerts,
    biasAlerts,
  };
}