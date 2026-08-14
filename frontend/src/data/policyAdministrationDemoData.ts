// ==========================================================
// MediVantage Solutions™
// Enterprise Policy Administration Demo Data
// ==========================================================

export type PolicyStatus =
  | "Active"
  | "Pending"
  | "Renewal Due"
  | "Expired"
  | "Cancelled"
  | "Suspended";

export type PlanType =
  | "Individual"
  | "Family"
  | "Corporate"
  | "Senior"
  | "Student";

export interface Dependent {
  id: string;
  fullName: string;
  relationship: string;
  gender: string;
  dateOfBirth: string;
}

export interface PolicyHolder {
  memberId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
}

export interface Coverage {
  network: string;
  deductible: number;
  copay: number;
  coinsurance: number;
  annualLimit: number;
  outOfPocketMaximum: number;
  benefits: string[];
  exclusions: string[];
}

export interface PremiumInformation {
  premium: number;
  currency: string;
  billingFrequency: "Monthly" | "Quarterly" | "Annual";
  billingStatus:
    | "Paid"
    | "Pending"
    | "Overdue";
  nextPaymentDate: string;
}

export interface PolicyTimelineEvent {
  id: string;
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface PolicyEndorsement {
  id: string;
  title: string;
  effectiveDate: string;
  status: string;
}

export interface PolicyRecord {
  policyId: string;
  policyNumber: string;

  status: PolicyStatus;
  planType: PlanType;
  planName: string;

  effectiveDate: string;
  expiryDate: string;

  policyHolder: PolicyHolder;

  dependents: Dependent[];

  coverage: Coverage;

  premium: PremiumInformation;

  endorsements: PolicyEndorsement[];

  timeline: PolicyTimelineEvent[];

  aiRiskScore: number;

  renewalEligible: boolean;
}

export interface PolicyDashboardKPIs {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  renewalsDue: number;
  monthlyPremiumCollected: number;
  outstandingPremiums: number;
}

export const policyDashboardKPIs: PolicyDashboardKPIs = {
  totalPolicies: 8435,
  activePolicies: 7124,
  pendingPolicies: 386,
  renewalsDue: 241,
  monthlyPremiumCollected: 12450000,
  outstandingPremiums: 385000
};
// ==========================================================
// Enterprise Policy Records
// ==========================================================

export const policyRecords: PolicyRecord[] = [
  {
    policyId: "POL-100001",
    policyNumber: "MV-GOLD-2026-0001",
    status: "Active",
    planType: "Family",
    planName: "Gold Family Health Plan",
    effectiveDate: "2026-01-01",
    expiryDate: "2026-12-31",

    policyHolder: {
      memberId: "MEM-100001",
      fullName: "Ahmed Al-Harbi",
      gender: "Male",
      dateOfBirth: "1985-06-15",
      phone: "+966501112233",
      email: "ahmed.alharbi@email.com"
    },

    dependents: [
      {
        id: "DEP-1001",
        fullName: "Sarah Al-Harbi",
        relationship: "Spouse",
        gender: "Female",
        dateOfBirth: "1987-02-21"
      },
      {
        id: "DEP-1002",
        fullName: "Yousef Al-Harbi",
        relationship: "Son",
        gender: "Male",
        dateOfBirth: "2015-09-04"
      }
    ],

    coverage: {
      network: "Premier Network",
      deductible: 500,
      copay: 25,
      coinsurance: 10,
      annualLimit: 1000000,
      outOfPocketMaximum: 5000,
      benefits: [
        "Inpatient",
        "Outpatient",
        "Emergency",
        "Maternity",
        "Pharmacy"
      ],
      exclusions: [
        "Cosmetic Procedures",
        "Experimental Treatments"
      ]
    },

    premium: {
      premium: 1850,
      currency: "SAR",
      billingFrequency: "Monthly",
      billingStatus: "Paid",
      nextPaymentDate: "2026-08-01"
    },

    endorsements: [
      {
        id: "END-001",
        title: "Dental Rider",
        effectiveDate: "2026-02-01",
        status: "Active"
      }
    ],

    timeline: [
      {
        id: "EVT-001",
        title: "Policy Issued",
        description: "Policy successfully issued.",
        performedBy: "AI Underwriting Engine",
        timestamp: "2026-01-01T09:00:00Z"
      },
      {
        id: "EVT-002",
        title: "Coverage Activated",
        description: "Benefits became active.",
        performedBy: "Policy Administration",
        timestamp: "2026-01-01T10:15:00Z"
      }
    ],

    aiRiskScore: 18,
    renewalEligible: true
  },

  {
    policyId: "POL-100002",
    policyNumber: "MV-PLAT-2026-0002",
    status: "Active",
    planType: "Individual",
    planName: "Platinum Executive Plan",

    effectiveDate: "2026-03-01",
    expiryDate: "2027-02-28",

    policyHolder: {
      memberId: "MEM-100002",
      fullName: "Fatimah Al-Qahtani",
      gender: "Female",
      dateOfBirth: "1982-11-05",
      phone: "+966500998877",
      email: "fatimah@email.com"
    },

    dependents: [],

    coverage: {
      network: "Executive Network",
      deductible: 0,
      copay: 0,
      coinsurance: 0,
      annualLimit: 2500000,
      outOfPocketMaximum: 0,
      benefits: [
        "Worldwide Coverage",
        "VIP Room",
        "Cancer Care",
        "Transplant",
        "Telemedicine"
      ],
      exclusions: [
        "Elective Cosmetic Surgery"
      ]
    },

    premium: {
      premium: 5400,
      currency: "SAR",
      billingFrequency: "Monthly",
      billingStatus: "Paid",
      nextPaymentDate: "2026-08-01"
    },

    endorsements: [],

    timeline: [],

    aiRiskScore: 9,
    renewalEligible: true
  },

  {
    policyId: "POL-100003",
    policyNumber: "MV-CORP-2026-0100",
    status: "Renewal Due",
    planType: "Corporate",
    planName: "Corporate Group Medical",

    effectiveDate: "2025-09-01",
    expiryDate: "2026-08-31",

    policyHolder: {
      memberId: "ORG-001",
      fullName: "ABC Manufacturing Ltd.",
      gender: "-",
      dateOfBirth: "-",
      phone: "+966114455667",
      email: "hr@abc.com"
    },

    dependents: [],

    coverage: {
      network: "National Corporate Network",
      deductible: 250,
      copay: 20,
      coinsurance: 10,
      annualLimit: 750000,
      outOfPocketMaximum: 4000,
      benefits: [
        "Hospital",
        "Outpatient",
        "Emergency",
        "Occupational Health"
      ],
      exclusions: [
        "Cosmetic Surgery"
      ]
    },

    premium: {
      premium: 126500,
      currency: "SAR",
      billingFrequency: "Annual",
      billingStatus: "Pending",
      nextPaymentDate: "2026-08-31"
    },

    endorsements: [],

    timeline: [],

    aiRiskScore: 31,
    renewalEligible: true
  },

  {
    policyId: "POL-100004",
    policyNumber: "MV-SENIOR-2026-0004",
    status: "Pending",
    planType: "Senior",
    planName: "Senior Care Plan",

    effectiveDate: "2026-08-01",
    expiryDate: "2027-07-31",

    policyHolder: {
      memberId: "MEM-100004",
      fullName: "Mohammed Hassan",
      gender: "Male",
      dateOfBirth: "1954-03-18",
      phone: "+966577889900",
      email: "mhassan@email.com"
    },

    dependents: [],

    coverage: {
      network: "Senior Care Network",
      deductible: 100,
      copay: 10,
      coinsurance: 5,
      annualLimit: 1500000,
      outOfPocketMaximum: 2500,
      benefits: [
        "Chronic Disease",
        "Cardiology",
        "Dialysis",
        "Rehabilitation"
      ],
      exclusions: [
        "Experimental Medicine"
      ]
    },

    premium: {
      premium: 3200,
      currency: "SAR",
      billingFrequency: "Monthly",
      billingStatus: "Pending",
      nextPaymentDate: "2026-08-01"
    },

    endorsements: [],

    timeline: [],

    aiRiskScore: 64,
    renewalEligible: false
  }
];

// ==========================================================
// Helper Functions
// ==========================================================

export const getPolicyById = (
  policyId: string
): PolicyRecord | undefined =>
  policyRecords.find(
    policy => policy.policyId === policyId
  );

export const getPolicyByNumber = (
  policyNumber: string
): PolicyRecord | undefined =>
  policyRecords.find(
    policy => policy.policyNumber === policyNumber
  );

export const getPoliciesByStatus = (
  status: PolicyStatus
): PolicyRecord[] =>
  policyRecords.filter(
    policy => policy.status === status
  );

export const getRenewalPolicies = (): PolicyRecord[] =>
  policyRecords.filter(
    policy =>
      policy.status === "Renewal Due" ||
      policy.renewalEligible
  );

export const searchPolicies = (
  searchText: string
): PolicyRecord[] => {

  const search = searchText.toLowerCase();

  return policyRecords.filter(policy =>
    policy.policyNumber.toLowerCase().includes(search) ||
    policy.policyHolder.fullName.toLowerCase().includes(search) ||
    policy.planName.toLowerCase().includes(search) ||
    policy.policyHolder.memberId.toLowerCase().includes(search)
  );
};