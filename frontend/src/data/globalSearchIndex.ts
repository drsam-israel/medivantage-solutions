import type {
  GlobalSearchItem,
  GlobalSearchModule,
} from "../types/globalSearch";

export const globalSearchItems: GlobalSearchItem[] = [
  {
    id: "MODULE-DASHBOARD",
    module: "Dashboard",
    title: "Executive Dashboard",
    subtitle: "Enterprise insurance command center",
    description:
      "Operational, clinical, financial and AI intelligence overview.",
    path: "/",
    keywords: [
      "dashboard",
      "executive",
      "overview",
      "performance",
      "insurance health score",
      "command center",
    ],
  },

  {
    id: "MODULE-CLAIMS",
    module: "Claims",
    title: "Claims Workspace",
    subtitle: "Claims intake, review and adjudication",
    description:
      "Search claims, clinical reviews, fraud indicators and payment decisions.",
    path: "/claims",
    keywords: [
      "claims",
      "claim",
      "adjudication",
      "clinical review",
      "claims workspace",
    ],
  },

  {
    id: "CLM-2026-10482",
    module: "Claims",
    title: "CLM-2026-10482",
    subtitle: "Amina Al-Harbi · Cardiac Catheterization",
    description:
      "Riyadh Central Hospital · Clinical Review · SAR 42,850",
    status: "Clinical Review",
    path: "/claims/CLM-2026-10482",
    keywords: [
      "amina al-harbi",
      "cardiac catheterization",
      "riyadh central hospital",
      "critical",
      "clinical review",
    ],
  },

  {
    id: "CLM-2026-10481",
    module: "Claims",
    title: "CLM-2026-10481",
    subtitle: "Khalid Al-Qahtani · MRI – Lumbar Spine",
    description:
      "Al Noor Medical Center · Pending Review · SAR 3,600",
    status: "Pending Review",
    path: "/claims/CLM-2026-10481",
    keywords: [
      "khalid al-qahtani",
      "mri",
      "lumbar spine",
      "al noor medical center",
      "pending review",
    ],
  },

  {
    id: "MODULE-MEMBERS",
    module: "Members",
    title: "Members 360",
    subtitle: "Member intelligence workspace",
    description:
      "Search member demographics, policies, claims and risk profiles.",
    path: "/members",
    keywords: [
      "members",
      "member",
      "member 360",
      "demographics",
      "eligibility",
      "risk",
    ],
  },

  {
    id: "MBR-10021",
    module: "Members",
    title: "MBR-10021",
    subtitle: "Member 360 Profile",
    description:
      "Active healthcare insurance member linked to underwriting application UW-2026-10021.",
    status: "Active",
    path: "/members/MBR-10021",
    keywords: [
      "member 10021",
      "active member",
      "member profile",
      "member 360",
    ],
  },

  {
    id: "MODULE-UNDERWRITING",
    module: "Medical Underwriting",
    title: "Medical Underwriting",
    subtitle: "Clinical risk and eligibility assessment",
    description:
      "Search underwriting applications, medical evidence and risk decisions.",
    path: "/medical-underwriting",
    keywords: [
      "underwriting",
      "medical underwriting",
      "clinical risk",
      "application",
      "eligibility",
      "pricing",
    ],
  },

  {
    id: "UW-2026-10021",
    module: "Medical Underwriting",
    title: "UW-2026-10021",
    subtitle: "Comprehensive Family Health Plan",
    description:
      "Pending Review · Risk score 24 · Assigned to Dr. Nora Al-Salem",
    status: "Pending Review",
    path: "/medical-underwriting/UW-2026-10021",
    keywords: [
      "underwriting application",
      "family health plan",
      "nora al-salem",
      "risk score 24",
    ],
  },

  {
    id: "UW-2026-10024",
    module: "Medical Underwriting",
    title: "UW-2026-10024",
    subtitle: "Comprehensive Medical Plan",
    description:
      "Manual Review · High risk · Assigned to Dr. Samuel Israel",
    status: "Manual Review",
    path: "/medical-underwriting/UW-2026-10024",
    keywords: [
      "high risk underwriting",
      "manual review",
      "samuel israel",
      "risk score 76",
    ],
  },

  {
    id: "MODULE-POLICY",
    module: "Policy Administration",
    title: "Policy Administration",
    subtitle: "Policy lifecycle management",
    description:
      "Search policies, renewals, billing, coverage and endorsements.",
    path: "/policy-administration",
    keywords: [
      "policy",
      "policies",
      "policy administration",
      "renewals",
      "billing",
      "coverage",
      "endorsement",
    ],
  },

  {
    id: "MODULE-PRIOR-AUTH",
    module: "Prior Authorization",
    title: "Prior Authorization",
    subtitle: "Utilization management workspace",
    description:
      "Search service requests, medical necessity reviews and payer decisions.",
    path: "/prior-authorization",
    keywords: [
      "prior authorization",
      "authorization",
      "medical necessity",
      "utilization management",
      "clinical review",
    ],
  },

  {
    id: "MODULE-PROVIDERS",
    module: "Provider Network",
    title: "Provider Network Management",
    subtitle: "Provider onboarding and credentialing",
    description:
      "Search hospitals, clinics, laboratories, pharmacies and network risk.",
    path: "/provider-network",
    keywords: [
      "provider",
      "providers",
      "hospital",
      "clinic",
      "laboratory",
      "pharmacy",
      "credentialing",
      "network",
    ],
  },

  {
    id: "MODULE-PAYMENTS",
    module: "Payments",
    title: "Reimbursements & Payment Management",
    subtitle: "Enterprise financial operations",
    description:
      "Search reimbursements, payment approvals, recoveries and reconciliation.",
    path: "/payments",
    keywords: [
      "payments",
      "payment",
      "reimbursement",
      "reconciliation",
      "recovery",
      "finance",
      "bank transfer",
    ],
  },

  {
    id: "MODULE-FRAUD",
    module: "Fraud Investigation",
    title: "Fraud Investigation Center",
    subtitle: "Fraud, waste and abuse operations",
    description:
      "Search investigations, suspicious claims, provider anomalies and recoveries.",
    path: "/fraud-investigations",
    keywords: [
      "fraud",
      "investigation",
      "waste",
      "abuse",
      "fwa",
      "suspicious claims",
      "recovery",
    ],
  },

  {
    id: "MODULE-AI",
    module: "AI Insights",
    title: "AI Insights Center",
    subtitle: "Enterprise AI intelligence",
    description:
      "Search predictions, recommendations, model risks and governance alerts.",
    path: "/ai-insights",
    keywords: [
      "ai insights",
      "artificial intelligence",
      "prediction",
      "recommendation",
      "model",
      "governance",
      "bias",
      "drift",
    ],
  },
];

export const globalSearchModules: GlobalSearchModule[] = [
  "Dashboard",
  "Claims",
  "Members",
  "Medical Underwriting",
  "Policy Administration",
  "Prior Authorization",
  "Provider Network",
  "Payments",
  "Fraud Investigation",
  "AI Insights",
];