export type AuthorizationPriority =
  | "Routine"
  | "High"
  | "Urgent"
  | "Emergency";

export type AuthorizationStatus =
  | "Pending Review"
  | "AI Recommended"
  | "Approved"
  | "Denied"
  | "More Information Required"
  | "Escalated";

export type AIRecommendation =
  | "Approve"
  | "Deny"
  | "Request More Information"
  | "Escalate to Medical Director";

export type CoverageStatus =
  | "Active"
  | "Inactive"
  | "Benefit Limit Reached"
  | "Coverage Verification Required";

export type DocumentStatus =
  | "Received"
  | "Pending"
  | "Validated"
  | "Missing";

export interface PriorAuthorizationKpis {
  totalRequests: number;
  pendingRequests: number;
  approvedToday: number;
  urgentReviews: number;
  averageTurnaroundHours: number;
  aiRecommendationRate: number;
}

export interface ClinicalCode {
  code: string;
  description: string;
}

export interface ProviderInformation {
  providerId: string;
  providerName: string;
  physicianName: string;
  specialty: string;
  facilityName: string;
  city: string;
  networkStatus: "In Network" | "Out of Network";
}

export interface MemberInformation {
  memberId: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female";
  policyNumber: string;
  planName: string;
  employerGroup: string;
  phoneNumber: string;
}

export interface CoverageValidation {
  policyStatus: CoverageStatus;
  benefitCovered: boolean;
  preAuthorizationRequired: boolean;
  waitingPeriodSatisfied: boolean;
  annualBenefitLimit: number;
  utilizedBenefitAmount: number;
  remainingBenefitAmount: number;
  estimatedMemberCopay: number;
  coverageNotes: string;
}

export interface ClinicalInformation {
  primaryDiagnosis: ClinicalCode;
  secondaryDiagnoses: ClinicalCode[];
  requestedProcedure: ClinicalCode;
  serviceCategory: string;
  symptoms: string[];
  clinicalNotes: string;
  comorbidities: string[];
  previousTreatments: string[];
  currentMedications: string[];
  requestedServiceDate: string;
  expectedLengthOfStay?: number;
}

export interface SupportingDocument {
  id: string;
  name: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  fileType: string;
}

export interface GuidelineReference {
  source: string;
  guideline: string;
  criterion: string;
  result: "Met" | "Partially Met" | "Not Met";
}

export interface AIClinicalFactor {
  factor: string;
  impact: "High" | "Moderate" | "Low";
  finding: string;
}

export interface AIAssessment {
  recommendation: AIRecommendation;
  confidence: number;
  medicalNecessityScore: number;
  evidenceStrength: "Strong" | "Moderate" | "Limited";
  summary: string;
  clinicalFactors: AIClinicalFactor[];
  guidelineReferences: GuidelineReference[];
  riskFlags: string[];
  modelName: string;
  modelVersion: string;
  reviewedByHuman: boolean;
}

export interface AuthorizationTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  details: string;
  status:
    | "Completed"
    | "Current"
    | "Pending"
    | "Escalated";
}

export interface PriorAuthorizationRequest {
  authorizationId: string;
  requestDate: string;
  priority: AuthorizationPriority;
  status: AuthorizationStatus;
  member: MemberInformation;
  provider: ProviderInformation;
  clinical: ClinicalInformation;
  coverage: CoverageValidation;
  documents: SupportingDocument[];
  aiAssessment: AIAssessment;
  timeline: AuthorizationTimelineEvent[];
  assignedReviewer: string;
  reviewDueDate: string;
}

export const priorAuthorizationKpis: PriorAuthorizationKpis = {
  totalRequests: 248,
  pendingRequests: 42,
  approvedToday: 31,
  urgentReviews: 8,
  averageTurnaroundHours: 6.4,
  aiRecommendationRate: 87,
};

export const priorAuthorizationRequests: PriorAuthorizationRequest[] = [
  {
    authorizationId: "PA-2026-10001",
    requestDate: "2026-07-21T08:30:00",
    priority: "Routine",
    status: "Pending Review",
    assignedReviewer: "Dr. Layla Hassan",
    reviewDueDate: "2026-07-23T17:00:00",
    member: {
      memberId: "MV-M-10421",
      fullName: "Sara Mohammed",
      age: 52,
      gender: "Female",
      policyNumber: "POL-HEALTH-88410",
      planName: "MediVantage Gold",
      employerGroup: "Gulf Technology Services",
      phoneNumber: "+966 55 231 8840",
    },
    provider: {
      providerId: "PRV-2214",
      providerName: "Kingdom Orthopaedic Centre",
      physicianName: "Dr. Faisal Rahman",
      specialty: "Orthopaedic Surgery",
      facilityName: "Kingdom Orthopaedic Centre",
      city: "Riyadh",
      networkStatus: "In Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "M17.11",
        description: "Unilateral primary osteoarthritis, right knee",
      },
      secondaryDiagnoses: [
        {
          code: "M25.561",
          description: "Pain in right knee",
        },
      ],
      requestedProcedure: {
        code: "73721",
        description: "MRI of lower extremity joint without contrast",
      },
      serviceCategory: "Diagnostic Imaging",
      symptoms: [
        "Persistent right knee pain",
        "Reduced range of motion",
        "Intermittent swelling",
      ],
      clinicalNotes:
        "Patient has experienced progressive right knee pain for six months despite conservative management. MRI requested to evaluate meniscal and cartilage pathology before further treatment planning.",
      comorbidities: ["Hypertension", "Hyperlipidaemia"],
      previousTreatments: [
        "Physiotherapy for eight weeks",
        "NSAID therapy",
        "Activity modification",
      ],
      currentMedications: [
        "Amlodipine 5 mg daily",
        "Atorvastatin 20 mg daily",
        "Celecoxib 200 mg as required",
      ],
      requestedServiceDate: "2026-07-28",
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 250000,
      utilizedBenefitAmount: 43600,
      remainingBenefitAmount: 206400,
      estimatedMemberCopay: 180,
      coverageNotes:
        "MRI is covered under advanced diagnostic imaging benefits subject to medical necessity review.",
    },
    documents: [
      {
        id: "DOC-10001-1",
        name: "Orthopaedic Referral Letter.pdf",
        category: "Referral",
        uploadedBy: "Kingdom Orthopaedic Centre",
        uploadedAt: "2026-07-21T08:32:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10001-2",
        name: "Physiotherapy Progress Notes.pdf",
        category: "Clinical Notes",
        uploadedBy: "Kingdom Orthopaedic Centre",
        uploadedAt: "2026-07-21T08:35:00",
        status: "Received",
        fileType: "PDF",
      },
      {
        id: "DOC-10001-3",
        name: "Knee X-Ray Report.pdf",
        category: "Imaging",
        uploadedBy: "Kingdom Orthopaedic Centre",
        uploadedAt: "2026-07-21T08:37:00",
        status: "Validated",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Approve",
      confidence: 92,
      medicalNecessityScore: 89,
      evidenceStrength: "Strong",
      summary:
        "The requested knee MRI is clinically supported because symptoms persist despite documented conservative treatment and plain radiography has not fully explained the functional impairment.",
      clinicalFactors: [
        {
          factor: "Persistent symptoms",
          impact: "High",
          finding: "Knee pain has persisted for six months.",
        },
        {
          factor: "Failed conservative treatment",
          impact: "High",
          finding:
            "Physiotherapy, NSAIDs and activity modification have not produced adequate improvement.",
        },
        {
          factor: "Functional limitation",
          impact: "Moderate",
          finding:
            "Reduced range of motion and recurrent swelling are documented.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Clinical Policy",
          guideline: "Advanced Musculoskeletal Imaging",
          criterion:
            "Persistent symptoms after at least six weeks of conservative treatment",
          result: "Met",
        },
        {
          source: "Evidence-Based Imaging Guideline",
          guideline: "MRI for Chronic Knee Pain",
          criterion:
            "Unresolved symptoms with suspected internal derangement",
          result: "Met",
        },
      ],
      riskFlags: [],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: false,
    },
    timeline: [
      {
        id: "TL-10001-1",
        timestamp: "2026-07-21T08:30:00",
        event: "Authorization request submitted",
        actor: "Kingdom Orthopaedic Centre",
        details:
          "Request submitted through the provider authorization portal.",
        status: "Completed",
      },
      {
        id: "TL-10001-2",
        timestamp: "2026-07-21T08:41:00",
        event: "Coverage validation completed",
        actor: "MediVantage Rules Engine",
        details:
          "Policy active and diagnostic imaging benefit confirmed.",
        status: "Completed",
      },
      {
        id: "TL-10001-3",
        timestamp: "2026-07-21T08:44:00",
        event: "AI medical necessity assessment completed",
        actor: "Clinical Necessity AI",
        details:
          "Approval recommended with 92% confidence.",
        status: "Completed",
      },
      {
        id: "TL-10001-4",
        timestamp: "2026-07-21T09:05:00",
        event: "Clinical review pending",
        actor: "Dr. Layla Hassan",
        details:
          "Case assigned to clinical reviewer for final determination.",
        status: "Current",
      },
    ],
  },
  {
    authorizationId: "PA-2026-10002",
    requestDate: "2026-07-21T07:15:00",
    priority: "Urgent",
    status: "AI Recommended",
    assignedReviewer: "Dr. Omar Al-Sayed",
    reviewDueDate: "2026-07-21T11:15:00",
    member: {
      memberId: "MV-M-10984",
      fullName: "Ahmed Ali",
      age: 61,
      gender: "Male",
      policyNumber: "POL-HEALTH-77102",
      planName: "MediVantage Platinum",
      employerGroup: "National Industrial Holdings",
      phoneNumber: "+966 50 442 1198",
    },
    provider: {
      providerId: "PRV-1187",
      providerName: "Al Noor Cardiac Institute",
      physicianName: "Dr. Nasser Al-Qahtani",
      specialty: "Interventional Cardiology",
      facilityName: "Al Noor Cardiac Institute",
      city: "Riyadh",
      networkStatus: "In Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "I25.118",
        description:
          "Atherosclerotic heart disease with other forms of angina",
      },
      secondaryDiagnoses: [
        {
          code: "I10",
          description: "Essential hypertension",
        },
        {
          code: "E11.9",
          description: "Type 2 diabetes mellitus",
        },
      ],
      requestedProcedure: {
        code: "93458",
        description:
          "Coronary angiography with left heart catheterization",
      },
      serviceCategory: "Cardiology",
      symptoms: [
        "Exertional chest pain",
        "Shortness of breath",
        "Reduced exercise tolerance",
      ],
      clinicalNotes:
        "Patient has worsening exertional angina despite optimal medical therapy. Stress imaging demonstrates inducible myocardial ischaemia in the anterior wall.",
      comorbidities: [
        "Type 2 diabetes mellitus",
        "Hypertension",
        "Dyslipidaemia",
      ],
      previousTreatments: [
        "Beta blocker therapy",
        "Nitrate therapy",
        "Antiplatelet therapy",
        "Statin therapy",
      ],
      currentMedications: [
        "Aspirin 81 mg daily",
        "Bisoprolol 5 mg daily",
        "Isosorbide mononitrate 30 mg daily",
        "Rosuvastatin 20 mg daily",
        "Metformin 1 g twice daily",
      ],
      requestedServiceDate: "2026-07-21",
      expectedLengthOfStay: 1,
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 500000,
      utilizedBenefitAmount: 128400,
      remainingBenefitAmount: 371600,
      estimatedMemberCopay: 500,
      coverageNotes:
        "Cardiac catheterization is covered under inpatient and advanced cardiac procedure benefits.",
    },
    documents: [
      {
        id: "DOC-10002-1",
        name: "Cardiology Consultation.pdf",
        category: "Clinical Notes",
        uploadedBy: "Al Noor Cardiac Institute",
        uploadedAt: "2026-07-21T07:17:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10002-2",
        name: "Stress Echocardiography Report.pdf",
        category: "Diagnostic Test",
        uploadedBy: "Al Noor Cardiac Institute",
        uploadedAt: "2026-07-21T07:18:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10002-3",
        name: "Recent ECG.pdf",
        category: "Diagnostic Test",
        uploadedBy: "Al Noor Cardiac Institute",
        uploadedAt: "2026-07-21T07:19:00",
        status: "Received",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Approve",
      confidence: 97,
      medicalNecessityScore: 96,
      evidenceStrength: "Strong",
      summary:
        "Urgent coronary angiography is supported by progressive angina, failed optimal medical treatment and objective evidence of inducible myocardial ischaemia.",
      clinicalFactors: [
        {
          factor: "Objective ischaemia",
          impact: "High",
          finding:
            "Stress imaging demonstrates inducible anterior wall ischaemia.",
        },
        {
          factor: "Progressive symptoms",
          impact: "High",
          finding:
            "Exertional chest pain is worsening despite treatment.",
        },
        {
          factor: "High cardiovascular risk",
          impact: "High",
          finding:
            "Diabetes, hypertension and dyslipidaemia increase clinical risk.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Cardiology Policy",
          guideline: "Diagnostic Coronary Angiography",
          criterion:
            "Persistent or progressive angina despite optimal medical treatment",
          result: "Met",
        },
        {
          source: "Cardiovascular Evidence Guideline",
          guideline: "Invasive Evaluation of Suspected CAD",
          criterion:
            "Objective evidence of clinically significant myocardial ischaemia",
          result: "Met",
        },
      ],
      riskFlags: ["Urgent clinical deterioration risk"],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: false,
    },
    timeline: [
      {
        id: "TL-10002-1",
        timestamp: "2026-07-21T07:15:00",
        event: "Urgent authorization submitted",
        actor: "Al Noor Cardiac Institute",
        details:
          "Cardiology request submitted with urgent clinical priority.",
        status: "Completed",
      },
      {
        id: "TL-10002-2",
        timestamp: "2026-07-21T07:22:00",
        event: "Urgency triage completed",
        actor: "MediVantage Triage Engine",
        details:
          "Case classified as urgent due to progressive angina and abnormal stress imaging.",
        status: "Completed",
      },
      {
        id: "TL-10002-3",
        timestamp: "2026-07-21T07:25:00",
        event: "AI approval recommendation generated",
        actor: "Clinical Necessity AI",
        details:
          "Approval recommended with 97% confidence.",
        status: "Completed",
      },
      {
        id: "TL-10002-4",
        timestamp: "2026-07-21T07:31:00",
        event: "Urgent medical review initiated",
        actor: "Dr. Omar Al-Sayed",
        details:
          "Final human review is currently in progress.",
        status: "Current",
      },
    ],
  },
  {
    authorizationId: "PA-2026-10003",
    requestDate: "2026-07-20T14:10:00",
    priority: "High",
    status: "More Information Required",
    assignedReviewer: "Dr. Hana Youssef",
    reviewDueDate: "2026-07-22T14:10:00",
    member: {
      memberId: "MV-M-11302",
      fullName: "Fatima Hassan",
      age: 44,
      gender: "Female",
      policyNumber: "POL-HEALTH-66031",
      planName: "MediVantage Gold",
      employerGroup: "Riyadh Education Group",
      phoneNumber: "+966 54 907 3311",
    },
    provider: {
      providerId: "PRV-3342",
      providerName: "Saudi Women's Diagnostic Centre",
      physicianName: "Dr. Reem Khalid",
      specialty: "Breast Imaging",
      facilityName: "Saudi Women's Diagnostic Centre",
      city: "Riyadh",
      networkStatus: "In Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "N63.21",
        description: "Unspecified lump in left breast, upper outer quadrant",
      },
      secondaryDiagnoses: [
        {
          code: "Z80.3",
          description: "Family history of malignant neoplasm of breast",
        },
      ],
      requestedProcedure: {
        code: "77049",
        description:
          "Bilateral breast MRI with and without contrast",
      },
      serviceCategory: "Oncology Diagnostic Imaging",
      symptoms: [
        "Palpable left breast lump",
        "Intermittent local tenderness",
      ],
      clinicalNotes:
        "Patient has a palpable breast lesion and a first-degree family history of breast cancer. Ultrasound report is available; recent mammography report has not yet been submitted.",
      comorbidities: ["Hypothyroidism"],
      previousTreatments: [
        "Clinical breast examination",
        "Breast ultrasound",
      ],
      currentMedications: ["Levothyroxine 75 mcg daily"],
      requestedServiceDate: "2026-07-26",
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 250000,
      utilizedBenefitAmount: 18200,
      remainingBenefitAmount: 231800,
      estimatedMemberCopay: 250,
      coverageNotes:
        "Breast MRI is covered where conventional imaging is inconclusive or high-risk criteria are documented.",
    },
    documents: [
      {
        id: "DOC-10003-1",
        name: "Breast Ultrasound Report.pdf",
        category: "Imaging",
        uploadedBy: "Saudi Women's Diagnostic Centre",
        uploadedAt: "2026-07-20T14:13:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10003-2",
        name: "Breast Clinic Consultation.pdf",
        category: "Clinical Notes",
        uploadedBy: "Saudi Women's Diagnostic Centre",
        uploadedAt: "2026-07-20T14:14:00",
        status: "Received",
        fileType: "PDF",
      },
      {
        id: "DOC-10003-3",
        name: "Recent Mammography Report.pdf",
        category: "Imaging",
        uploadedBy: "Saudi Women's Diagnostic Centre",
        uploadedAt: "Pending",
        status: "Missing",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Request More Information",
      confidence: 88,
      medicalNecessityScore: 72,
      evidenceStrength: "Moderate",
      summary:
        "Breast MRI may be appropriate, but determination requires the recent mammography result and clearer documentation of the ultrasound findings.",
      clinicalFactors: [
        {
          factor: "Palpable breast lesion",
          impact: "High",
          finding:
            "A clinically palpable lesion requires complete diagnostic imaging assessment.",
        },
        {
          factor: "Family history",
          impact: "Moderate",
          finding:
            "A first-degree family history increases malignancy risk.",
        },
        {
          factor: "Incomplete conventional imaging",
          impact: "High",
          finding:
            "The recent mammography report is missing.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Oncology Imaging Policy",
          guideline: "Breast MRI Medical Necessity",
          criterion:
            "Conventional imaging completed and inconclusive",
          result: "Partially Met",
        },
        {
          source: "Evidence-Based Breast Imaging Guideline",
          guideline: "MRI for High-Risk Breast Assessment",
          criterion:
            "Documented elevated lifetime risk or incomplete diagnostic findings",
          result: "Partially Met",
        },
      ],
      riskFlags: ["Missing mammography report"],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: true,
    },
    timeline: [
      {
        id: "TL-10003-1",
        timestamp: "2026-07-20T14:10:00",
        event: "Authorization request submitted",
        actor: "Saudi Women's Diagnostic Centre",
        details:
          "Breast MRI request submitted through provider portal.",
        status: "Completed",
      },
      {
        id: "TL-10003-2",
        timestamp: "2026-07-20T14:18:00",
        event: "Document completeness review completed",
        actor: "MediVantage Document AI",
        details:
          "Recent mammography report identified as missing.",
        status: "Completed",
      },
      {
        id: "TL-10003-3",
        timestamp: "2026-07-20T14:21:00",
        event: "Additional information requested",
        actor: "Dr. Hana Youssef",
        details:
          "Provider asked to submit recent mammography report and complete ultrasound interpretation.",
        status: "Current",
      },
    ],
  },
  {
    authorizationId: "PA-2026-10004",
    requestDate: "2026-07-20T09:40:00",
    priority: "High",
    status: "Escalated",
    assignedReviewer: "Dr. Khalid Mansour",
    reviewDueDate: "2026-07-21T15:00:00",
    member: {
      memberId: "MV-M-11677",
      fullName: "Yousef Abdullah",
      age: 58,
      gender: "Male",
      policyNumber: "POL-HEALTH-55102",
      planName: "MediVantage Platinum",
      employerGroup: "Arabian Logistics Corporation",
      phoneNumber: "+966 56 811 2047",
    },
    provider: {
      providerId: "PRV-4091",
      providerName: "Advanced Orthopaedic Hospital",
      physicianName: "Dr. Tariq Mahmoud",
      specialty: "Joint Replacement Surgery",
      facilityName: "Advanced Orthopaedic Hospital",
      city: "Jeddah",
      networkStatus: "Out of Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "M16.12",
        description: "Unilateral primary osteoarthritis, left hip",
      },
      secondaryDiagnoses: [
        {
          code: "M25.552",
          description: "Pain in left hip",
        },
      ],
      requestedProcedure: {
        code: "27130",
        description: "Total hip arthroplasty",
      },
      serviceCategory: "Inpatient Surgery",
      symptoms: [
        "Severe chronic hip pain",
        "Reduced mobility",
        "Difficulty performing daily activities",
      ],
      clinicalNotes:
        "Severe radiographic osteoarthritis with substantial functional limitation. Patient has failed prolonged conservative management and is requesting surgery at an out-of-network facility.",
      comorbidities: ["Obesity", "Hypertension"],
      previousTreatments: [
        "Physiotherapy",
        "Intra-articular corticosteroid injection",
        "NSAID therapy",
        "Weight reduction programme",
      ],
      currentMedications: [
        "Losartan 50 mg daily",
        "Naproxen 500 mg twice daily as required",
      ],
      requestedServiceDate: "2026-08-06",
      expectedLengthOfStay: 4,
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 500000,
      utilizedBenefitAmount: 97400,
      remainingBenefitAmount: 402600,
      estimatedMemberCopay: 6800,
      coverageNotes:
        "Procedure is covered, but the requested facility is out of network. Network exception review is required.",
    },
    documents: [
      {
        id: "DOC-10004-1",
        name: "Orthopaedic Surgical Assessment.pdf",
        category: "Clinical Notes",
        uploadedBy: "Advanced Orthopaedic Hospital",
        uploadedAt: "2026-07-20T09:44:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10004-2",
        name: "Pelvic X-Ray.pdf",
        category: "Imaging",
        uploadedBy: "Advanced Orthopaedic Hospital",
        uploadedAt: "2026-07-20T09:46:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10004-3",
        name: "Physiotherapy Completion Report.pdf",
        category: "Clinical Notes",
        uploadedBy: "Advanced Orthopaedic Hospital",
        uploadedAt: "2026-07-20T09:47:00",
        status: "Received",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Escalate to Medical Director",
      confidence: 91,
      medicalNecessityScore: 94,
      evidenceStrength: "Strong",
      summary:
        "The total hip replacement is medically necessary; however, the out-of-network facility selection requires a benefit exception and medical director review.",
      clinicalFactors: [
        {
          factor: "Advanced structural disease",
          impact: "High",
          finding:
            "Radiographic evidence demonstrates severe hip osteoarthritis.",
        },
        {
          factor: "Failed conservative management",
          impact: "High",
          finding:
            "Multiple non-operative interventions have failed.",
        },
        {
          factor: "Out-of-network provider",
          impact: "High",
          finding:
            "The selected hospital is outside the contracted provider network.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Orthopaedic Policy",
          guideline: "Total Joint Replacement",
          criterion:
            "Severe radiographic disease with documented functional impairment",
          result: "Met",
        },
        {
          source: "Network Management Policy",
          guideline: "Out-of-Network Exception",
          criterion:
            "Clinical or accessibility justification for network exception",
          result: "Not Met",
        },
      ],
      riskFlags: [
        "Out-of-network provider",
        "High estimated procedure cost",
      ],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: true,
    },
    timeline: [
      {
        id: "TL-10004-1",
        timestamp: "2026-07-20T09:40:00",
        event: "Authorization request submitted",
        actor: "Advanced Orthopaedic Hospital",
        details:
          "Total hip arthroplasty request submitted.",
        status: "Completed",
      },
      {
        id: "TL-10004-2",
        timestamp: "2026-07-20T09:52:00",
        event: "Clinical necessity confirmed",
        actor: "Clinical Necessity AI",
        details:
          "Procedure meets clinical necessity criteria.",
        status: "Completed",
      },
      {
        id: "TL-10004-3",
        timestamp: "2026-07-20T09:54:00",
        event: "Network exception identified",
        actor: "Coverage Rules Engine",
        details:
          "Requested facility is not within the member's contracted network.",
        status: "Completed",
      },
      {
        id: "TL-10004-4",
        timestamp: "2026-07-20T10:05:00",
        event: "Escalated to medical director",
        actor: "Dr. Khalid Mansour",
        details:
          "Case escalated for network exception and high-cost procedure review.",
        status: "Escalated",
      },
    ],
  },
  {
    authorizationId: "PA-2026-10005",
    requestDate: "2026-07-19T13:25:00",
    priority: "Routine",
    status: "Approved",
    assignedReviewer: "Dr. Maryam Saleh",
    reviewDueDate: "2026-07-21T17:00:00",
    member: {
      memberId: "MV-M-11802",
      fullName: "Mariam Ibrahim",
      age: 36,
      gender: "Female",
      policyNumber: "POL-HEALTH-48221",
      planName: "MediVantage Gold",
      employerGroup: "Vision Healthcare Services",
      phoneNumber: "+966 53 554 2991",
    },
    provider: {
      providerId: "PRV-2877",
      providerName: "Rheumatology Care Centre",
      physicianName: "Dr. Noor Al-Harbi",
      specialty: "Rheumatology",
      facilityName: "Rheumatology Care Centre",
      city: "Riyadh",
      networkStatus: "In Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "M06.9",
        description: "Rheumatoid arthritis, unspecified",
      },
      secondaryDiagnoses: [],
      requestedProcedure: {
        code: "J1745",
        description: "Infliximab injection",
      },
      serviceCategory: "Specialty Medication",
      symptoms: [
        "Persistent joint pain",
        "Morning stiffness",
        "Progressive hand swelling",
      ],
      clinicalNotes:
        "Moderate-to-severe rheumatoid arthritis remains active despite methotrexate and hydroxychloroquine. Biologic therapy requested after appropriate screening.",
      comorbidities: [],
      previousTreatments: [
        "Methotrexate for nine months",
        "Hydroxychloroquine for six months",
        "Intermittent corticosteroid therapy",
      ],
      currentMedications: [
        "Methotrexate 20 mg weekly",
        "Folic acid 5 mg weekly",
        "Hydroxychloroquine 200 mg twice daily",
      ],
      requestedServiceDate: "2026-07-30",
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 250000,
      utilizedBenefitAmount: 62400,
      remainingBenefitAmount: 187600,
      estimatedMemberCopay: 450,
      coverageNotes:
        "Biologic therapy is covered after documented failure of conventional disease-modifying treatment.",
    },
    documents: [
      {
        id: "DOC-10005-1",
        name: "Rheumatology Assessment.pdf",
        category: "Clinical Notes",
        uploadedBy: "Rheumatology Care Centre",
        uploadedAt: "2026-07-19T13:27:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10005-2",
        name: "DMARD Treatment History.pdf",
        category: "Medication History",
        uploadedBy: "Rheumatology Care Centre",
        uploadedAt: "2026-07-19T13:29:00",
        status: "Validated",
        fileType: "PDF",
      },
      {
        id: "DOC-10005-3",
        name: "Tuberculosis Screening.pdf",
        category: "Laboratory",
        uploadedBy: "Rheumatology Care Centre",
        uploadedAt: "2026-07-19T13:31:00",
        status: "Validated",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Approve",
      confidence: 95,
      medicalNecessityScore: 93,
      evidenceStrength: "Strong",
      summary:
        "Biologic treatment is supported by persistent active rheumatoid arthritis despite adequate trials of conventional disease-modifying therapy.",
      clinicalFactors: [
        {
          factor: "Failure of conventional therapy",
          impact: "High",
          finding:
            "Methotrexate and hydroxychloroquine have not achieved disease control.",
        },
        {
          factor: "Persistent disease activity",
          impact: "High",
          finding:
            "Ongoing pain, stiffness and swelling are documented.",
        },
        {
          factor: "Safety screening completed",
          impact: "Moderate",
          finding:
            "Required tuberculosis screening has been completed.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Specialty Pharmacy Policy",
          guideline: "Biologic Therapy for Rheumatoid Arthritis",
          criterion:
            "Failure or intolerance of conventional DMARD treatment",
          result: "Met",
        },
      ],
      riskFlags: [],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: true,
    },
    timeline: [
      {
        id: "TL-10005-1",
        timestamp: "2026-07-19T13:25:00",
        event: "Authorization request submitted",
        actor: "Rheumatology Care Centre",
        details:
          "Specialty medication authorization submitted.",
        status: "Completed",
      },
      {
        id: "TL-10005-2",
        timestamp: "2026-07-19T13:36:00",
        event: "AI medical necessity review completed",
        actor: "Clinical Necessity AI",
        details:
          "Approval recommended with 95% confidence.",
        status: "Completed",
      },
      {
        id: "TL-10005-3",
        timestamp: "2026-07-19T15:10:00",
        event: "Authorization approved",
        actor: "Dr. Maryam Saleh",
        details:
          "Infliximab treatment approved for an initial six-month period.",
        status: "Completed",
      },
    ],
  },
  {
    authorizationId: "PA-2026-10006",
    requestDate: "2026-07-19T10:05:00",
    priority: "Routine",
    status: "Denied",
    assignedReviewer: "Dr. Saeed Al-Mutairi",
    reviewDueDate: "2026-07-21T17:00:00",
    member: {
      memberId: "MV-M-12114",
      fullName: "Khalid Saleh",
      age: 33,
      gender: "Male",
      policyNumber: "POL-HEALTH-40018",
      planName: "MediVantage Silver",
      employerGroup: "Desert Retail Group",
      phoneNumber: "+966 59 224 7810",
    },
    provider: {
      providerId: "PRV-3074",
      providerName: "Elite Spine Clinic",
      physicianName: "Dr. Waleed Hamza",
      specialty: "Orthopaedic Spine Surgery",
      facilityName: "Elite Spine Clinic",
      city: "Riyadh",
      networkStatus: "In Network",
    },
    clinical: {
      primaryDiagnosis: {
        code: "M54.50",
        description: "Low back pain, unspecified",
      },
      secondaryDiagnoses: [],
      requestedProcedure: {
        code: "72148",
        description: "MRI lumbar spine without contrast",
      },
      serviceCategory: "Diagnostic Imaging",
      symptoms: [
        "Lower back pain for three weeks",
        "Mild intermittent stiffness",
      ],
      clinicalNotes:
        "Patient reports three weeks of uncomplicated lower back pain. No neurological deficit, trauma, malignancy history, infection risk or other red-flag symptoms are documented.",
      comorbidities: [],
      previousTreatments: [
        "Paracetamol as required",
      ],
      currentMedications: [
        "Paracetamol 1 g as required",
      ],
      requestedServiceDate: "2026-07-24",
    },
    coverage: {
      policyStatus: "Active",
      benefitCovered: true,
      preAuthorizationRequired: true,
      waitingPeriodSatisfied: true,
      annualBenefitLimit: 100000,
      utilizedBenefitAmount: 9100,
      remainingBenefitAmount: 90900,
      estimatedMemberCopay: 120,
      coverageNotes:
        "Lumbar MRI is covered when medical necessity criteria, including red flags or failed conservative therapy, are satisfied.",
    },
    documents: [
      {
        id: "DOC-10006-1",
        name: "Spine Clinic Consultation.pdf",
        category: "Clinical Notes",
        uploadedBy: "Elite Spine Clinic",
        uploadedAt: "2026-07-19T10:07:00",
        status: "Validated",
        fileType: "PDF",
      },
    ],
    aiAssessment: {
      recommendation: "Deny",
      confidence: 94,
      medicalNecessityScore: 31,
      evidenceStrength: "Limited",
      summary:
        "The lumbar MRI does not currently meet medical necessity criteria because symptoms are recent, no red flags are documented and an adequate course of conservative management has not been completed.",
      clinicalFactors: [
        {
          factor: "Short symptom duration",
          impact: "High",
          finding:
            "Symptoms have been present for only three weeks.",
        },
        {
          factor: "No red-flag findings",
          impact: "High",
          finding:
            "No neurological deficit, trauma, infection or malignancy risk is documented.",
        },
        {
          factor: "Insufficient conservative treatment",
          impact: "High",
          finding:
            "No structured physiotherapy or extended medication trial has been completed.",
        },
      ],
      guidelineReferences: [
        {
          source: "Internal Imaging Policy",
          guideline: "Lumbar Spine MRI",
          criterion:
            "Persistent symptoms after conservative treatment or documented red flags",
          result: "Not Met",
        },
      ],
      riskFlags: [],
      modelName: "MediVantage Clinical Necessity AI",
      modelVersion: "2.4.1",
      reviewedByHuman: true,
    },
    timeline: [
      {
        id: "TL-10006-1",
        timestamp: "2026-07-19T10:05:00",
        event: "Authorization request submitted",
        actor: "Elite Spine Clinic",
        details:
          "Lumbar MRI authorization request submitted.",
        status: "Completed",
      },
      {
        id: "TL-10006-2",
        timestamp: "2026-07-19T10:14:00",
        event: "AI denial recommendation generated",
        actor: "Clinical Necessity AI",
        details:
          "Request did not meet medical necessity criteria.",
        status: "Completed",
      },
      {
        id: "TL-10006-3",
        timestamp: "2026-07-19T12:20:00",
        event: "Authorization denied",
        actor: "Dr. Saeed Al-Mutairi",
        details:
          "Request denied. Conservative treatment advised before reconsideration unless red-flag symptoms develop.",
        status: "Completed",
      },
    ],
  },
];

export const getPriorAuthorizationById = (
  authorizationId: string,
): PriorAuthorizationRequest | undefined =>
  priorAuthorizationRequests.find(
    (request) => request.authorizationId === authorizationId,
  );

export const getPendingAuthorizationRequests = (): PriorAuthorizationRequest[] =>
  priorAuthorizationRequests.filter((request) =>
    [
      "Pending Review",
      "AI Recommended",
      "More Information Required",
      "Escalated",
    ].includes(request.status),
  );

export const getUrgentAuthorizationRequests = (): PriorAuthorizationRequest[] =>
  priorAuthorizationRequests.filter(
    (request) =>
      request.priority === "Urgent" ||
      request.priority === "Emergency",
  );
