export type ProviderStatus =
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Pending";

export type CredentialStatus =
  | "Verified"
  | "Pending Review"
  | "Expiring Soon"
  | "Suspended";

export type ProviderType =
  | "Hospital"
  | "Clinic"
  | "Laboratory"
  | "Pharmacy"
  | "Diagnostic Centre"
  | "Specialist Centre";

export type NetworkTier =
  | "Tier 1"
  | "Tier 2"
  | "Tier 3";

export type AiRiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type ContractStatus =
  | "Active"
  | "Pending Renewal"
  | "Expired"
  | "Suspended";

export interface ProviderCredential {
  id: string;
  credentialType: string;
  credentialNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate: string;
  status: CredentialStatus;
  verifiedBy: string;
  verificationDate: string;
}

export interface ProviderContract {
  contractId: string;
  contractName: string;
  contractType: string;
  status: ContractStatus;
  effectiveDate: string;
  renewalDate: string;
  reimbursementModel: string;
  paymentTerms: string;
  networkTier: NetworkTier;
  annualContractValue: number;
}

export interface ProviderPerformanceMetric {
  metric: string;
  value: string;
  target: string;
  performanceStatus: "Excellent" | "Good" | "Watch" | "Poor";
}

export interface ProviderQualityMetric {
  metric: string;
  score: number;
  benchmark: number;
  status: "Above Benchmark" | "At Benchmark" | "Below Benchmark";
}

export interface ProviderAiInsight {
  id: string;
  title: string;
  category:
    | "Fraud Risk"
    | "Cost"
    | "Quality"
    | "Utilisation"
    | "Network";
  description: string;
  riskLevel: AiRiskLevel;
  confidence: number;
  recommendation: string;
}

export interface ProviderTimelineEvent {
  id: string;
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

export interface ProviderClaimSummary {
  totalSubmitted: number;
  totalApproved: number;
  totalDenied: number;
  totalPaid: number;
  averageClaimValue: number;
  denialRate: number;
  averageProcessingDays: number;
}

export interface ProviderAuthorizationSummary {
  totalRequests: number;
  approved: number;
  denied: number;
  pending: number;
  approvalRate: number;
  averageTurnaroundHours: number;
}

export interface ProviderContact {
  primaryContactName: string;
  primaryContactRole: string;
  phone: string;
  email: string;
  website: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ProviderFacility {
  facilityId: string;
  facilityName: string;
  facilityType: ProviderType;
  city: string;
  region: string;
  bedCapacity?: number;
  emergencyServices: boolean;
  operatingHours: string;
  status: ProviderStatus;
}

export interface Provider {
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  status: ProviderStatus;
  credentialStatus: CredentialStatus;
  networkTier: NetworkTier;
  aiRiskLevel: AiRiskLevel;

  registrationNumber: string;
  licenseNumber: string;
  taxIdentificationNumber: string;

  legalEntityName: string;
  ownershipType: string;
  accreditationBody: string;
  accreditationStatus: string;

  primarySpecialty: string;
  specialties: string[];
  clinicalServices: string[];

  qualityScore: number;
  memberSatisfaction: number;
  networkAdequacyScore: number;
  fraudRiskScore: number;

  activeMembersServed: number;
  claimsVolume: number;
  annualClaimsValue: number;

  latitude: number;
  longitude: number;

  contact: ProviderContact;
  facilities: ProviderFacility[];
  credentials: ProviderCredential[];
  contracts: ProviderContract[];
  performanceMetrics: ProviderPerformanceMetric[];
  qualityMetrics: ProviderQualityMetric[];
  aiInsights: ProviderAiInsight[];
  timeline: ProviderTimelineEvent[];
  claimSummary: ProviderClaimSummary;
  authorizationSummary: ProviderAuthorizationSummary;
}

export const providerDemoData: Provider[] = [
  {
    providerId: "PRV-10001",
    providerName: "Riyadh Care Hospital",
    providerType: "Hospital",
    status: "Active",
    credentialStatus: "Verified",
    networkTier: "Tier 1",
    aiRiskLevel: "Low",

    registrationNumber: "CR-10198234",
    licenseNumber: "MOH-HSP-2026-10001",
    taxIdentificationNumber: "TIN-3100019823",

    legalEntityName: "Riyadh Care Medical Services Company",
    ownershipType: "Private",
    accreditationBody: "CBAHI",
    accreditationStatus: "Accredited",

    primarySpecialty: "Multi-Specialty Hospital",
    specialties: [
      "Cardiology",
      "Internal Medicine",
      "Emergency Medicine",
      "Neurology",
      "Orthopaedics",
      "General Surgery",
      "Paediatrics",
    ],
    clinicalServices: [
      "Emergency Care",
      "Inpatient Care",
      "Outpatient Clinics",
      "Intensive Care",
      "Diagnostic Imaging",
      "Laboratory Services",
      "Pharmacy",
      "Day Surgery",
    ],

    qualityScore: 96,
    memberSatisfaction: 4.8,
    networkAdequacyScore: 98,
    fraudRiskScore: 12,

    activeMembersServed: 18450,
    claimsVolume: 18420,
    annualClaimsValue: 39418800,

    latitude: 24.7136,
    longitude: 46.6753,

    contact: {
      primaryContactName: "Dr. Fahad Al-Mutairi",
      primaryContactRole: "Medical Director",
      phone: "+966 11 555 1001",
      email: "provider.relations@riyadhcare.demo",
      website: "www.riyadhcare.demo",
      addressLine1: "King Fahd Road",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12271",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10001",
        facilityName: "Riyadh Care Main Hospital",
        facilityType: "Hospital",
        city: "Riyadh",
        region: "Riyadh Province",
        bedCapacity: 320,
        emergencyServices: true,
        operatingHours: "24/7",
        status: "Active",
      },
      {
        facilityId: "FAC-10002",
        facilityName: "Riyadh Care Outpatient Centre",
        facilityType: "Clinic",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "Sunday–Thursday, 08:00–22:00",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10001",
        credentialType: "Hospital Operating Licence",
        credentialNumber: "MOH-HSP-2026-10001",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2026-01-15",
        expiryDate: "2028-01-14",
        status: "Verified",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2026-02-02",
      },
      {
        id: "CRD-10002",
        credentialType: "CBAHI Accreditation",
        credentialNumber: "CBAHI-RYD-88421",
        issuingAuthority: "CBAHI",
        issuedDate: "2025-09-01",
        expiryDate: "2028-08-31",
        status: "Verified",
        verifiedBy: "Quality and Compliance Unit",
        verificationDate: "2026-02-04",
      },
    ],

    contracts: [
      {
        contractId: "CON-10001",
        contractName: "Corporate Platinum Provider Agreement",
        contractType: "Comprehensive Network Agreement",
        status: "Active",
        effectiveDate: "2026-01-01",
        renewalDate: "2027-01-01",
        reimbursementModel: "Fee-for-Service with Quality Incentives",
        paymentTerms: "Net 30",
        networkTier: "Tier 1",
        annualContractValue: 14500000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "3.2 days",
        target: "≤ 5 days",
        performanceStatus: "Excellent",
      },
      {
        metric: "Claim Denial Rate",
        value: "2.3%",
        target: "≤ 5%",
        performanceStatus: "Excellent",
      },
      {
        metric: "Prior Authorization Turnaround",
        value: "6.4 hours",
        target: "≤ 12 hours",
        performanceStatus: "Excellent",
      },
      {
        metric: "Member Complaint Rate",
        value: "0.8%",
        target: "≤ 2%",
        performanceStatus: "Good",
      },
    ],

    qualityMetrics: [
      {
        metric: "Clinical Quality",
        score: 97,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Patient Safety",
        score: 95,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Readmission Performance",
        score: 92,
        benchmark: 88,
        status: "Above Benchmark",
      },
      {
        metric: "Member Experience",
        score: 96,
        benchmark: 90,
        status: "Above Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10001",
        title: "Stable Billing Pattern",
        category: "Fraud Risk",
        description:
          "Billing behaviour remains consistent with peer hospitals of comparable size and specialty mix.",
        riskLevel: "Low",
        confidence: 94,
        recommendation:
          "Continue routine monitoring with no immediate intervention.",
      },
      {
        id: "AI-10002",
        title: "High-Value Cardiology Growth",
        category: "Cost",
        description:
          "Cardiology utilisation increased by 11.8% over the last quarter.",
        riskLevel: "Medium",
        confidence: 88,
        recommendation:
          "Review cardiology case mix and high-cost procedure trends.",
      },
      {
        id: "AI-10003",
        title: "Preferred Network Candidate",
        category: "Network",
        description:
          "High quality, strong member satisfaction and broad service coverage support preferred-provider status.",
        riskLevel: "Low",
        confidence: 96,
        recommendation:
          "Maintain Tier 1 status and consider value-based contract expansion.",
      },
    ],

    timeline: [
      {
        id: "EVT-10001",
        date: "2026-07-20",
        event: "AI Provider Review Completed",
        description:
          "Automated provider risk and performance review completed successfully.",
        actor: "MediVantage AI Provider Intelligence",
        status: "Completed",
      },
      {
        id: "EVT-10002",
        date: "2026-06-10",
        event: "Quarterly Quality Review",
        description:
          "Provider exceeded clinical quality and member experience benchmarks.",
        actor: "Provider Quality Team",
        status: "Completed",
      },
      {
        id: "EVT-10003",
        date: "2026-01-01",
        event: "Contract Activated",
        description:
          "Corporate Platinum Provider Agreement became effective.",
        actor: "Network Contracting Team",
        status: "Completed",
      },
    ],

    claimSummary: {
      totalSubmitted: 18420,
      totalApproved: 17410,
      totalDenied: 424,
      totalPaid: 37528000,
      averageClaimValue: 2140,
      denialRate: 2.3,
      averageProcessingDays: 3.2,
    },

    authorizationSummary: {
      totalRequests: 4210,
      approved: 3864,
      denied: 168,
      pending: 178,
      approvalRate: 91.8,
      averageTurnaroundHours: 6.4,
    },
  },

  {
    providerId: "PRV-10002",
    providerName: "Kingdom Specialist Centre",
    providerType: "Specialist Centre",
    status: "Active",
    credentialStatus: "Verified",
    networkTier: "Tier 1",
    aiRiskLevel: "Low",

    registrationNumber: "CR-10923845",
    licenseNumber: "MOH-SPC-2026-10002",
    taxIdentificationNumber: "TIN-3100021092",

    legalEntityName: "Kingdom Specialist Medical Centre Company",
    ownershipType: "Private",
    accreditationBody: "CBAHI",
    accreditationStatus: "Accredited",

    primarySpecialty: "Cardiology",
    specialties: [
      "Cardiology",
      "Cardiac Surgery",
      "Electrophysiology",
      "Vascular Medicine",
    ],
    clinicalServices: [
      "Cardiology Consultation",
      "Cardiac Imaging",
      "Cardiac Catheterisation",
      "Electrophysiology",
      "Day Procedures",
    ],

    qualityScore: 94,
    memberSatisfaction: 4.7,
    networkAdequacyScore: 92,
    fraudRiskScore: 18,

    activeMembersServed: 7920,
    claimsVolume: 8640,
    annualClaimsValue: 28630000,

    latitude: 24.7743,
    longitude: 46.7386,

    contact: {
      primaryContactName: "Dr. Noura Al-Qahtani",
      primaryContactRole: "Chief Executive Officer",
      phone: "+966 11 555 1002",
      email: "network@kingdomspecialist.demo",
      website: "www.kingdomspecialist.demo",
      addressLine1: "Olaya District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12244",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10003",
        facilityName: "Kingdom Specialist Cardiac Centre",
        facilityType: "Specialist Centre",
        city: "Riyadh",
        region: "Riyadh Province",
        bedCapacity: 90,
        emergencyServices: true,
        operatingHours: "24/7",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10003",
        credentialType: "Specialist Centre Licence",
        credentialNumber: "MOH-SPC-2026-10002",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2026-02-01",
        expiryDate: "2028-01-31",
        status: "Verified",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2026-02-10",
      },
    ],

    contracts: [
      {
        contractId: "CON-10002",
        contractName: "Specialist Cardiac Services Agreement",
        contractType: "Specialist Network Agreement",
        status: "Active",
        effectiveDate: "2026-02-01",
        renewalDate: "2027-02-01",
        reimbursementModel: "Bundled Payments",
        paymentTerms: "Net 30",
        networkTier: "Tier 1",
        annualContractValue: 11200000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "4.1 days",
        target: "≤ 5 days",
        performanceStatus: "Good",
      },
      {
        metric: "Claim Denial Rate",
        value: "3.1%",
        target: "≤ 5%",
        performanceStatus: "Good",
      },
      {
        metric: "Prior Authorization Turnaround",
        value: "7.8 hours",
        target: "≤ 12 hours",
        performanceStatus: "Good",
      },
    ],

    qualityMetrics: [
      {
        metric: "Cardiac Outcomes",
        score: 96,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Patient Safety",
        score: 94,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Member Experience",
        score: 93,
        benchmark: 90,
        status: "Above Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10004",
        title: "High-Cost Procedure Concentration",
        category: "Cost",
        description:
          "A high proportion of total paid claims is concentrated in advanced cardiac procedures.",
        riskLevel: "Medium",
        confidence: 91,
        recommendation:
          "Review bundled payment rates and procedure-level outcomes.",
      },
      {
        id: "AI-10005",
        title: "Strong Clinical Outcome Profile",
        category: "Quality",
        description:
          "Clinical outcomes exceed peer benchmarks for specialist cardiac centres.",
        riskLevel: "Low",
        confidence: 95,
        recommendation:
          "Consider expanding preferred referral pathways.",
      },
    ],

    timeline: [
      {
        id: "EVT-10004",
        date: "2026-07-12",
        event: "Cardiac Quality Review",
        description:
          "Clinical outcomes and readmission performance reviewed.",
        actor: "Clinical Quality Committee",
        status: "Completed",
      },
      {
        id: "EVT-10005",
        date: "2026-02-01",
        event: "Contract Activated",
        description:
          "Specialist Cardiac Services Agreement became effective.",
        actor: "Network Contracting Team",
        status: "Completed",
      },
    ],

    claimSummary: {
      totalSubmitted: 8640,
      totalApproved: 8120,
      totalDenied: 268,
      totalPaid: 27260000,
      averageClaimValue: 3314,
      denialRate: 3.1,
      averageProcessingDays: 4.1,
    },

    authorizationSummary: {
      totalRequests: 2950,
      approved: 2684,
      denied: 132,
      pending: 134,
      approvalRate: 91,
      averageTurnaroundHours: 7.8,
    },
  },

  {
    providerId: "PRV-10003",
    providerName: "Al Noor Diagnostics",
    providerType: "Diagnostic Centre",
    status: "Active",
    credentialStatus: "Verified",
    networkTier: "Tier 2",
    aiRiskLevel: "Medium",

    registrationNumber: "CR-11827364",
    licenseNumber: "MOH-DIA-2026-10003",
    taxIdentificationNumber: "TIN-3100031182",

    legalEntityName: "Al Noor Diagnostic Services Company",
    ownershipType: "Private",
    accreditationBody: "CBAHI",
    accreditationStatus: "Accredited",

    primarySpecialty: "Diagnostic Imaging",
    specialties: [
      "Radiology",
      "MRI",
      "CT Imaging",
      "Ultrasound",
      "Mammography",
    ],
    clinicalServices: [
      "MRI",
      "CT Scan",
      "Ultrasound",
      "Digital X-Ray",
      "Mammography",
    ],

    qualityScore: 89,
    memberSatisfaction: 4.4,
    networkAdequacyScore: 91,
    fraudRiskScore: 42,

    activeMembersServed: 6140,
    claimsVolume: 12680,
    annualClaimsValue: 13842000,

    latitude: 24.6877,
    longitude: 46.7219,

    contact: {
      primaryContactName: "Mr. Omar Al-Harbi",
      primaryContactRole: "Operations Director",
      phone: "+966 11 555 1003",
      email: "contracts@alnoordiagnostics.demo",
      website: "www.alnoordiagnostics.demo",
      addressLine1: "Al Malaz District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12836",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10004",
        facilityName: "Al Noor Advanced Imaging Centre",
        facilityType: "Diagnostic Centre",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "Daily, 07:00–23:00",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10004",
        credentialType: "Diagnostic Centre Licence",
        credentialNumber: "MOH-DIA-2026-10003",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2025-12-01",
        expiryDate: "2027-11-30",
        status: "Verified",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2026-01-08",
      },
    ],

    contracts: [
      {
        contractId: "CON-10003",
        contractName: "Diagnostic Imaging Network Agreement",
        contractType: "Ancillary Services Agreement",
        status: "Pending Renewal",
        effectiveDate: "2025-09-01",
        renewalDate: "2026-09-01",
        reimbursementModel: "Fee Schedule",
        paymentTerms: "Net 45",
        networkTier: "Tier 2",
        annualContractValue: 6100000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "5.8 days",
        target: "≤ 5 days",
        performanceStatus: "Watch",
      },
      {
        metric: "Claim Denial Rate",
        value: "6.2%",
        target: "≤ 5%",
        performanceStatus: "Watch",
      },
      {
        metric: "Repeat Imaging Rate",
        value: "4.9%",
        target: "≤ 3%",
        performanceStatus: "Poor",
      },
    ],

    qualityMetrics: [
      {
        metric: "Diagnostic Accuracy",
        score: 91,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Report Turnaround",
        score: 87,
        benchmark: 90,
        status: "Below Benchmark",
      },
      {
        metric: "Member Experience",
        score: 89,
        benchmark: 90,
        status: "Below Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10006",
        title: "Repeat Imaging Pattern",
        category: "Utilisation",
        description:
          "Repeat imaging frequency is above the expected peer benchmark.",
        riskLevel: "Medium",
        confidence: 89,
        recommendation:
          "Review repeat imaging cases and referral documentation.",
      },
      {
        id: "AI-10007",
        title: "Billing Code Concentration",
        category: "Fraud Risk",
        description:
          "A small group of high-value imaging codes represents a disproportionate share of claims.",
        riskLevel: "Medium",
        confidence: 84,
        recommendation:
          "Initiate targeted coding and medical necessity review.",
      },
    ],

    timeline: [
      {
        id: "EVT-10006",
        date: "2026-07-18",
        event: "AI Utilisation Alert",
        description:
          "Repeat imaging rate exceeded the configured network threshold.",
        actor: "MediVantage AI Provider Intelligence",
        status: "Warning",
      },
      {
        id: "EVT-10007",
        date: "2026-06-22",
        event: "Contract Renewal Review Opened",
        description:
          "Contract renewal assessment initiated.",
        actor: "Network Contracting Team",
        status: "Pending",
      },
    ],

    claimSummary: {
      totalSubmitted: 12680,
      totalApproved: 11244,
      totalDenied: 786,
      totalPaid: 12948000,
      averageClaimValue: 1092,
      denialRate: 6.2,
      averageProcessingDays: 5.8,
    },

    authorizationSummary: {
      totalRequests: 3480,
      approved: 3021,
      denied: 241,
      pending: 218,
      approvalRate: 86.8,
      averageTurnaroundHours: 10.5,
    },
  },

  {
    providerId: "PRV-10004",
    providerName: "Family Health Centre",
    providerType: "Clinic",
    status: "Active",
    credentialStatus: "Expiring Soon",
    networkTier: "Tier 2",
    aiRiskLevel: "Medium",

    registrationNumber: "CR-12837192",
    licenseNumber: "MOH-CLN-2026-10004",
    taxIdentificationNumber: "TIN-3100041283",

    legalEntityName: "Family Health Primary Care Company",
    ownershipType: "Private",
    accreditationBody: "CBAHI",
    accreditationStatus: "Accredited",

    primarySpecialty: "Family Medicine",
    specialties: [
      "Family Medicine",
      "General Practice",
      "Paediatrics",
      "Women's Health",
    ],
    clinicalServices: [
      "Primary Care",
      "Chronic Disease Management",
      "Vaccination",
      "Health Screening",
      "Minor Procedures",
    ],

    qualityScore: 87,
    memberSatisfaction: 4.5,
    networkAdequacyScore: 94,
    fraudRiskScore: 35,

    activeMembersServed: 9280,
    claimsVolume: 15100,
    annualClaimsValue: 9654000,

    latitude: 24.6332,
    longitude: 46.7162,

    contact: {
      primaryContactName: "Dr. Amal Al-Dosari",
      primaryContactRole: "Clinic Director",
      phone: "+966 11 555 1004",
      email: "admin@familyhealthcentre.demo",
      website: "www.familyhealthcentre.demo",
      addressLine1: "Al Rawabi District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "14215",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10005",
        facilityName: "Family Health Centre",
        facilityType: "Clinic",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "Sunday–Thursday, 08:00–22:00",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10005",
        credentialType: "Clinic Operating Licence",
        credentialNumber: "MOH-CLN-2026-10004",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2024-10-01",
        expiryDate: "2026-09-30",
        status: "Expiring Soon",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2025-10-03",
      },
    ],

    contracts: [
      {
        contractId: "CON-10004",
        contractName: "Primary Care Network Agreement",
        contractType: "Primary Care Agreement",
        status: "Active",
        effectiveDate: "2026-01-01",
        renewalDate: "2027-01-01",
        reimbursementModel: "Capitation with Quality Incentives",
        paymentTerms: "Monthly Capitation",
        networkTier: "Tier 2",
        annualContractValue: 4250000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "4.6 days",
        target: "≤ 5 days",
        performanceStatus: "Good",
      },
      {
        metric: "Claim Denial Rate",
        value: "4.8%",
        target: "≤ 5%",
        performanceStatus: "Good",
      },
      {
        metric: "Preventive Screening Completion",
        value: "78%",
        target: "≥ 85%",
        performanceStatus: "Watch",
      },
    ],

    qualityMetrics: [
      {
        metric: "Chronic Disease Management",
        score: 88,
        benchmark: 90,
        status: "Below Benchmark",
      },
      {
        metric: "Preventive Care",
        score: 84,
        benchmark: 88,
        status: "Below Benchmark",
      },
      {
        metric: "Member Experience",
        score: 91,
        benchmark: 90,
        status: "Above Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10008",
        title: "Credential Expiry Risk",
        category: "Network",
        description:
          "The primary operating licence is approaching expiry.",
        riskLevel: "Medium",
        confidence: 100,
        recommendation:
          "Request updated licence documentation before 31 August 2026.",
      },
      {
        id: "AI-10009",
        title: "Preventive Care Gap",
        category: "Quality",
        description:
          "Preventive screening completion remains below the network target.",
        riskLevel: "Medium",
        confidence: 90,
        recommendation:
          "Implement targeted member outreach and screening reminders.",
      },
    ],

    timeline: [
      {
        id: "EVT-10008",
        date: "2026-07-25",
        event: "Licence Expiry Notification",
        description:
          "Automated reminder sent to provider administration.",
        actor: "Credentialing Automation",
        status: "Warning",
      },
      {
        id: "EVT-10009",
        date: "2026-05-15",
        event: "Quality Improvement Plan",
        description:
          "Preventive screening improvement plan initiated.",
        actor: "Provider Quality Team",
        status: "Pending",
      },
    ],

    claimSummary: {
      totalSubmitted: 15100,
      totalApproved: 13710,
      totalDenied: 725,
      totalPaid: 9120000,
      averageClaimValue: 639,
      denialRate: 4.8,
      averageProcessingDays: 4.6,
    },

    authorizationSummary: {
      totalRequests: 960,
      approved: 814,
      denied: 76,
      pending: 70,
      approvalRate: 84.8,
      averageTurnaroundHours: 9.2,
    },
  },

  {
    providerId: "PRV-10005",
    providerName: "Gulf Medical Laboratory",
    providerType: "Laboratory",
    status: "Active",
    credentialStatus: "Verified",
    networkTier: "Tier 2",
    aiRiskLevel: "High",

    registrationNumber: "CR-13847291",
    licenseNumber: "MOH-LAB-2026-10005",
    taxIdentificationNumber: "TIN-3100051384",

    legalEntityName: "Gulf Medical Laboratory Services Company",
    ownershipType: "Private",
    accreditationBody: "ISO 15189",
    accreditationStatus: "Accredited",

    primarySpecialty: "Clinical Laboratory",
    specialties: [
      "Clinical Chemistry",
      "Haematology",
      "Microbiology",
      "Molecular Diagnostics",
    ],
    clinicalServices: [
      "Routine Laboratory Testing",
      "Molecular Testing",
      "Pathology",
      "Home Sample Collection",
    ],

    qualityScore: 82,
    memberSatisfaction: 4.1,
    networkAdequacyScore: 88,
    fraudRiskScore: 71,

    activeMembersServed: 11380,
    claimsVolume: 24600,
    annualClaimsValue: 10278000,

    latitude: 24.6904,
    longitude: 46.6858,

    contact: {
      primaryContactName: "Mr. Khalid Al-Anazi",
      primaryContactRole: "General Manager",
      phone: "+966 11 555 1005",
      email: "payerrelations@gulfmedical.demo",
      website: "www.gulfmedical.demo",
      addressLine1: "Al Sulaymaniyah District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12243",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10006",
        facilityName: "Gulf Medical Central Laboratory",
        facilityType: "Laboratory",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "24/7",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10006",
        credentialType: "Laboratory Operating Licence",
        credentialNumber: "MOH-LAB-2026-10005",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2026-01-01",
        expiryDate: "2027-12-31",
        status: "Verified",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2026-01-12",
      },
    ],

    contracts: [
      {
        contractId: "CON-10005",
        contractName: "Laboratory Services Network Agreement",
        contractType: "Ancillary Services Agreement",
        status: "Active",
        effectiveDate: "2026-01-01",
        renewalDate: "2027-01-01",
        reimbursementModel: "Fee Schedule",
        paymentTerms: "Net 45",
        networkTier: "Tier 2",
        annualContractValue: 4820000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "6.4 days",
        target: "≤ 5 days",
        performanceStatus: "Poor",
      },
      {
        metric: "Claim Denial Rate",
        value: "8.6%",
        target: "≤ 5%",
        performanceStatus: "Poor",
      },
      {
        metric: "Duplicate Test Rate",
        value: "7.2%",
        target: "≤ 3%",
        performanceStatus: "Poor",
      },
    ],

    qualityMetrics: [
      {
        metric: "Laboratory Accuracy",
        score: 91,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Duplicate Testing Control",
        score: 72,
        benchmark: 88,
        status: "Below Benchmark",
      },
      {
        metric: "Member Experience",
        score: 82,
        benchmark: 90,
        status: "Below Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10010",
        title: "Possible Duplicate Testing",
        category: "Fraud Risk",
        description:
          "The model identified a high frequency of repeated laboratory tests within short clinical intervals.",
        riskLevel: "High",
        confidence: 93,
        recommendation:
          "Initiate fraud, waste and abuse review for duplicate testing patterns.",
      },
      {
        id: "AI-10011",
        title: "High Denial Concentration",
        category: "Cost",
        description:
          "Claim denials are concentrated in medical necessity and duplicate-service categories.",
        riskLevel: "High",
        confidence: 90,
        recommendation:
          "Perform coding education and pre-submission validation review.",
      },
    ],

    timeline: [
      {
        id: "EVT-10010",
        date: "2026-07-27",
        event: "Fraud Risk Escalation",
        description:
          "Duplicate testing alert escalated for investigation.",
        actor: "MediVantage AI Provider Intelligence",
        status: "Escalated",
      },
      {
        id: "EVT-10011",
        date: "2026-07-05",
        event: "Claims Audit Initiated",
        description:
          "Targeted laboratory claims audit opened.",
        actor: "Fraud, Waste and Abuse Team",
        status: "Pending",
      },
    ],

    claimSummary: {
      totalSubmitted: 24600,
      totalApproved: 20860,
      totalDenied: 2116,
      totalPaid: 9385000,
      averageClaimValue: 418,
      denialRate: 8.6,
      averageProcessingDays: 6.4,
    },

    authorizationSummary: {
      totalRequests: 640,
      approved: 501,
      denied: 88,
      pending: 51,
      approvalRate: 78.3,
      averageTurnaroundHours: 13.4,
    },
  },

  {
    providerId: "PRV-10006",
    providerName: "Al Shifa Pharmacy",
    providerType: "Pharmacy",
    status: "Active",
    credentialStatus: "Verified",
    networkTier: "Tier 3",
    aiRiskLevel: "Medium",

    registrationNumber: "CR-14857291",
    licenseNumber: "MOH-PHM-2026-10006",
    taxIdentificationNumber: "TIN-3100061485",

    legalEntityName: "Al Shifa Pharmacy Group",
    ownershipType: "Private",
    accreditationBody: "Saudi Food and Drug Authority",
    accreditationStatus: "Licensed",

    primarySpecialty: "Retail Pharmacy",
    specialties: [
      "Retail Pharmacy",
      "Chronic Medication",
      "Specialty Medication",
    ],
    clinicalServices: [
      "Prescription Dispensing",
      "Medication Counselling",
      "Home Delivery",
      "Chronic Medication Refill",
    ],

    qualityScore: 86,
    memberSatisfaction: 4.3,
    networkAdequacyScore: 96,
    fraudRiskScore: 48,

    activeMembersServed: 14600,
    claimsVolume: 31800,
    annualClaimsValue: 18412000,

    latitude: 24.7208,
    longitude: 46.6901,

    contact: {
      primaryContactName: "Mr. Saleh Al-Ghamdi",
      primaryContactRole: "Pharmacy Network Director",
      phone: "+966 11 555 1006",
      email: "insurance@alshifapharmacy.demo",
      website: "www.alshifapharmacy.demo",
      addressLine1: "King Abdullah Road",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12451",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10007",
        facilityName: "Al Shifa Central Pharmacy",
        facilityType: "Pharmacy",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "24/7",
        status: "Active",
      },
    ],

    credentials: [
      {
        id: "CRD-10007",
        credentialType: "Pharmacy Operating Licence",
        credentialNumber: "MOH-PHM-2026-10006",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2025-06-15",
        expiryDate: "2027-06-14",
        status: "Verified",
        verifiedBy: "MediVantage Credentialing Team",
        verificationDate: "2026-01-15",
      },
    ],

    contracts: [
      {
        contractId: "CON-10006",
        contractName: "Retail Pharmacy Benefit Agreement",
        contractType: "Pharmacy Network Agreement",
        status: "Active",
        effectiveDate: "2026-01-01",
        renewalDate: "2027-01-01",
        reimbursementModel: "Drug Tariff plus Dispensing Fee",
        paymentTerms: "Net 30",
        networkTier: "Tier 3",
        annualContractValue: 8200000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "1.8 days",
        target: "≤ 3 days",
        performanceStatus: "Excellent",
      },
      {
        metric: "Claim Denial Rate",
        value: "5.4%",
        target: "≤ 5%",
        performanceStatus: "Watch",
      },
      {
        metric: "Generic Substitution Rate",
        value: "71%",
        target: "≥ 75%",
        performanceStatus: "Watch",
      },
    ],

    qualityMetrics: [
      {
        metric: "Dispensing Accuracy",
        score: 94,
        benchmark: 90,
        status: "Above Benchmark",
      },
      {
        metric: "Generic Utilisation",
        score: 84,
        benchmark: 88,
        status: "Below Benchmark",
      },
      {
        metric: "Member Experience",
        score: 87,
        benchmark: 90,
        status: "Below Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10012",
        title: "Brand Medication Concentration",
        category: "Cost",
        description:
          "Brand medication utilisation remains above network expectations.",
        riskLevel: "Medium",
        confidence: 87,
        recommendation:
          "Introduce generic substitution incentives and prescribing feedback.",
      },
      {
        id: "AI-10013",
        title: "Early Refill Pattern",
        category: "Fraud Risk",
        description:
          "Selected members show repeated early refill activity across chronic medications.",
        riskLevel: "Medium",
        confidence: 82,
        recommendation:
          "Review early refill overrides and member-level prescribing patterns.",
      },
    ],

    timeline: [
      {
        id: "EVT-10012",
        date: "2026-07-10",
        event: "Pharmacy Utilisation Review",
        description:
          "Brand and generic medication utilisation reviewed.",
        actor: "Pharmacy Benefit Team",
        status: "Completed",
      },
    ],

    claimSummary: {
      totalSubmitted: 31800,
      totalApproved: 28850,
      totalDenied: 1717,
      totalPaid: 17346000,
      averageClaimValue: 579,
      denialRate: 5.4,
      averageProcessingDays: 1.8,
    },

    authorizationSummary: {
      totalRequests: 4220,
      approved: 3704,
      denied: 318,
      pending: 198,
      approvalRate: 87.8,
      averageTurnaroundHours: 5.1,
    },
  },

  {
    providerId: "PRV-10007",
    providerName: "Advanced Imaging Centre",
    providerType: "Diagnostic Centre",
    status: "Pending",
    credentialStatus: "Pending Review",
    networkTier: "Tier 3",
    aiRiskLevel: "Medium",

    registrationNumber: "CR-15867291",
    licenseNumber: "MOH-DIA-2026-10007",
    taxIdentificationNumber: "TIN-3100071586",

    legalEntityName: "Advanced Imaging Medical Company",
    ownershipType: "Private",
    accreditationBody: "Pending Assessment",
    accreditationStatus: "Under Review",

    primarySpecialty: "Advanced Radiology",
    specialties: [
      "MRI",
      "CT Imaging",
      "Nuclear Medicine",
      "Interventional Radiology",
    ],
    clinicalServices: [
      "MRI",
      "CT Scan",
      "Nuclear Imaging",
      "Image-Guided Procedures",
    ],

    qualityScore: 78,
    memberSatisfaction: 4,
    networkAdequacyScore: 82,
    fraudRiskScore: 46,

    activeMembersServed: 0,
    claimsVolume: 0,
    annualClaimsValue: 0,

    latitude: 24.7421,
    longitude: 46.7012,

    contact: {
      primaryContactName: "Dr. Majed Al-Rashid",
      primaryContactRole: "Medical Director",
      phone: "+966 11 555 1007",
      email: "credentialing@advancedimaging.demo",
      website: "www.advancedimaging.demo",
      addressLine1: "Al Nakheel District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "12381",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10008",
        facilityName: "Advanced Imaging Centre",
        facilityType: "Diagnostic Centre",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "Sunday–Thursday, 08:00–20:00",
        status: "Pending",
      },
    ],

    credentials: [
      {
        id: "CRD-10008",
        credentialType: "Diagnostic Centre Licence",
        credentialNumber: "MOH-DIA-2026-10007",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2026-04-01",
        expiryDate: "2028-03-31",
        status: "Pending Review",
        verifiedBy: "Not Yet Assigned",
        verificationDate: "",
      },
    ],

    contracts: [
      {
        contractId: "CON-10007",
        contractName: "Proposed Diagnostic Services Agreement",
        contractType: "Ancillary Services Agreement",
        status: "Pending Renewal",
        effectiveDate: "2026-09-01",
        renewalDate: "2027-09-01",
        reimbursementModel: "Proposed Fee Schedule",
        paymentTerms: "Net 45",
        networkTier: "Tier 3",
        annualContractValue: 3600000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Credentialing Completion",
        value: "68%",
        target: "100%",
        performanceStatus: "Watch",
      },
      {
        metric: "Document Verification",
        value: "7 of 10",
        target: "10 of 10",
        performanceStatus: "Watch",
      },
    ],

    qualityMetrics: [
      {
        metric: "Pre-Network Quality Assessment",
        score: 78,
        benchmark: 85,
        status: "Below Benchmark",
      },
      {
        metric: "Facility Readiness",
        score: 82,
        benchmark: 85,
        status: "Below Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10014",
        title: "Incomplete Credentialing",
        category: "Network",
        description:
          "Three mandatory credentialing documents remain unverified.",
        riskLevel: "Medium",
        confidence: 100,
        recommendation:
          "Do not activate the provider until all mandatory documents are verified.",
      },
    ],

    timeline: [
      {
        id: "EVT-10013",
        date: "2026-07-22",
        event: "Credentialing Review Started",
        description:
          "Initial credentialing and facility assessment initiated.",
        actor: "Provider Credentialing Team",
        status: "Pending",
      },
      {
        id: "EVT-10014",
        date: "2026-07-25",
        event: "Missing Documentation Notice",
        description:
          "Request sent for accreditation and professional indemnity documentation.",
        actor: "Credentialing Automation",
        status: "Warning",
      },
    ],

    claimSummary: {
      totalSubmitted: 0,
      totalApproved: 0,
      totalDenied: 0,
      totalPaid: 0,
      averageClaimValue: 0,
      denialRate: 0,
      averageProcessingDays: 0,
    },

    authorizationSummary: {
      totalRequests: 0,
      approved: 0,
      denied: 0,
      pending: 0,
      approvalRate: 0,
      averageTurnaroundHours: 0,
    },
  },

  {
    providerId: "PRV-10008",
    providerName: "Northern Community Clinic",
    providerType: "Clinic",
    status: "Suspended",
    credentialStatus: "Suspended",
    networkTier: "Tier 3",
    aiRiskLevel: "Critical",

    registrationNumber: "CR-16877291",
    licenseNumber: "MOH-CLN-2026-10008",
    taxIdentificationNumber: "TIN-3100081687",

    legalEntityName: "Northern Community Healthcare Company",
    ownershipType: "Private",
    accreditationBody: "CBAHI",
    accreditationStatus: "Suspended",

    primarySpecialty: "General Practice",
    specialties: [
      "General Practice",
      "Family Medicine",
      "Minor Procedures",
    ],
    clinicalServices: [
      "Primary Care",
      "General Consultation",
      "Minor Procedures",
      "Health Screening",
    ],

    qualityScore: 61,
    memberSatisfaction: 3.2,
    networkAdequacyScore: 74,
    fraudRiskScore: 91,

    activeMembersServed: 2120,
    claimsVolume: 7420,
    annualClaimsValue: 5812000,

    latitude: 24.8123,
    longitude: 46.6381,

    contact: {
      primaryContactName: "Mr. Hassan Al-Salem",
      primaryContactRole: "Administrative Director",
      phone: "+966 11 555 1008",
      email: "admin@northerncommunity.demo",
      website: "www.northerncommunity.demo",
      addressLine1: "Northern Riyadh District",
      city: "Riyadh",
      region: "Riyadh Province",
      postalCode: "13321",
      country: "Saudi Arabia",
    },

    facilities: [
      {
        facilityId: "FAC-10009",
        facilityName: "Northern Community Clinic",
        facilityType: "Clinic",
        city: "Riyadh",
        region: "Riyadh Province",
        emergencyServices: false,
        operatingHours: "Suspended",
        status: "Suspended",
      },
    ],

    credentials: [
      {
        id: "CRD-10009",
        credentialType: "Clinic Operating Licence",
        credentialNumber: "MOH-CLN-2026-10008",
        issuingAuthority: "Ministry of Health",
        issuedDate: "2025-03-01",
        expiryDate: "2027-02-28",
        status: "Suspended",
        verifiedBy: "Provider Compliance Unit",
        verificationDate: "2026-07-19",
      },
    ],

    contracts: [
      {
        contractId: "CON-10008",
        contractName: "Community Clinic Network Agreement",
        contractType: "Primary Care Agreement",
        status: "Suspended",
        effectiveDate: "2025-01-01",
        renewalDate: "2026-01-01",
        reimbursementModel: "Fee-for-Service",
        paymentTerms: "Payments on Hold",
        networkTier: "Tier 3",
        annualContractValue: 2200000,
      },
    ],

    performanceMetrics: [
      {
        metric: "Average Claim Processing Time",
        value: "9.4 days",
        target: "≤ 5 days",
        performanceStatus: "Poor",
      },
      {
        metric: "Claim Denial Rate",
        value: "17.8%",
        target: "≤ 5%",
        performanceStatus: "Poor",
      },
      {
        metric: "Potential Upcoding Rate",
        value: "14.2%",
        target: "≤ 2%",
        performanceStatus: "Poor",
      },
    ],

    qualityMetrics: [
      {
        metric: "Clinical Documentation",
        score: 58,
        benchmark: 90,
        status: "Below Benchmark",
      },
      {
        metric: "Billing Compliance",
        score: 49,
        benchmark: 90,
        status: "Below Benchmark",
      },
      {
        metric: "Member Experience",
        score: 64,
        benchmark: 90,
        status: "Below Benchmark",
      },
    ],

    aiInsights: [
      {
        id: "AI-10015",
        title: "Suspected Upcoding",
        category: "Fraud Risk",
        description:
          "The provider shows a statistically significant concentration of high-complexity consultation codes.",
        riskLevel: "Critical",
        confidence: 97,
        recommendation:
          "Maintain suspension and conduct a comprehensive claims investigation.",
      },
      {
        id: "AI-10016",
        title: "Unusual Referral Network",
        category: "Fraud Risk",
        description:
          "Referral activity is concentrated among a small group of linked service providers.",
        riskLevel: "High",
        confidence: 92,
        recommendation:
          "Investigate connected-provider relationships and referral patterns.",
      },
    ],

    timeline: [
      {
        id: "EVT-10015",
        date: "2026-07-19",
        event: "Provider Suspended",
        description:
          "Provider network participation suspended pending investigation.",
        actor: "Provider Compliance Committee",
        status: "Escalated",
      },
      {
        id: "EVT-10016",
        date: "2026-07-16",
        event: "Critical AI Fraud Alert",
        description:
          "Potential upcoding and abnormal referral patterns detected.",
        actor: "MediVantage AI Provider Intelligence",
        status: "Escalated",
      },
      {
        id: "EVT-10017",
        date: "2026-07-17",
        event: "Payment Hold Applied",
        description:
          "Outstanding provider payments placed on administrative hold.",
        actor: "Finance and Compliance Team",
        status: "Completed",
      },
    ],

    claimSummary: {
      totalSubmitted: 7420,
      totalApproved: 5180,
      totalDenied: 1321,
      totalPaid: 4214000,
      averageClaimValue: 783,
      denialRate: 17.8,
      averageProcessingDays: 9.4,
    },

    authorizationSummary: {
      totalRequests: 840,
      approved: 522,
      denied: 214,
      pending: 104,
      approvalRate: 62.1,
      averageTurnaroundHours: 22.6,
    },
  },
];

export const getProviderById = (
  providerId: string,
): Provider | undefined => {
  const normalizedProviderId = providerId
    .trim()
    .toLowerCase();

  return providerDemoData.find(
    (provider) =>
      provider.providerId.toLowerCase() ===
      normalizedProviderId,
  );
};

export const getProviderDashboardMetrics = () => {
  const totalProviders = providerDemoData.length;

  const activeProviders = providerDemoData.filter(
    (provider) => provider.status === "Active",
  ).length;

  const hospitals = providerDemoData.filter(
    (provider) => provider.providerType === "Hospital",
  ).length;

  const clinics = providerDemoData.filter(
    (provider) => provider.providerType === "Clinic",
  ).length;

  const laboratories = providerDemoData.filter(
    (provider) => provider.providerType === "Laboratory",
  ).length;

  const pharmacies = providerDemoData.filter(
    (provider) => provider.providerType === "Pharmacy",
  ).length;

  const pendingCredentialing = providerDemoData.filter(
    (provider) =>
      provider.credentialStatus === "Pending Review",
  ).length;

  const expiringCredentials = providerDemoData.filter(
    (provider) =>
      provider.credentialStatus === "Expiring Soon",
  ).length;

  const aiRiskAlerts = providerDemoData.filter(
    (provider) =>
      provider.aiRiskLevel === "High" ||
      provider.aiRiskLevel === "Critical",
  ).length;

  const averageQualityScore =
    providerDemoData.reduce(
      (total, provider) =>
        total + provider.qualityScore,
      0,
    ) / totalProviders;

  const averageNetworkAdequacy =
    providerDemoData.reduce(
      (total, provider) =>
        total + provider.networkAdequacyScore,
      0,
    ) / totalProviders;

  const totalClaimsVolume = providerDemoData.reduce(
    (total, provider) =>
      total + provider.claimsVolume,
    0,
  );

  const totalAnnualClaimsValue =
    providerDemoData.reduce(
      (total, provider) =>
        total + provider.annualClaimsValue,
      0,
    );

  return {
    totalProviders,
    activeProviders,
    hospitals,
    clinics,
    laboratories,
    pharmacies,
    pendingCredentialing,
    expiringCredentials,
    aiRiskAlerts,
    averageQualityScore:
      Math.round(averageQualityScore * 10) / 10,
    averageNetworkAdequacy:
      Math.round(averageNetworkAdequacy * 10) / 10,
    totalClaimsVolume,
    totalAnnualClaimsValue,
  };
};