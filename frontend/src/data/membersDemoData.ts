
export type MemberStatus = "Active" | "Pending" | "Suspended";
export type RiskLevel = "Low" | "Moderate" | "High";

export interface MemberClaim {
  id: string;
  serviceDate: string;
  provider: string;
  category: string;
  amount: number;
  status: "Paid" | "Pending" | "Denied";
}

export interface MemberAuthorization {
  id: string;
  service: string;
  requestedDate: string;
  status: "Approved" | "Pending" | "Denied";
}

export interface MemberTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
}

export interface Member {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  phone: string;
  email: string;
  employer: string;
  policyNumber: string;
  planName: string;
  status: MemberStatus;
  enrolmentDate: string;
  renewalDate: string;
  riskLevel: RiskLevel;
  riskScore: number;
  engagementScore: number;
  predictedAnnualCost: number;
  claimsCount: number;
  claimsPaid: number;
  openAuthorizations: number;
  chronicConditions: string[];
  allergies: string[];
  medications: string[];
  careGaps: string[];
  dependants: number;
  claims: MemberClaim[];
  authorizations: MemberAuthorization[];
  timeline: MemberTimelineEvent[];
}

export const members: Member[] = [
  {
    id: "MBR-10001",
    fullName: "Amina Al-Faraj",
    dateOfBirth: "1982-04-17",
    gender: "Female",
    nationalId: "10******42",
    phone: "+966 55 000 1401",
    email: "amina.alfaraj@example.com",
    employer: "Riyadh Advanced Industries",
    policyNumber: "POL-100001",
    planName: "Corporate Platinum",
    status: "Active",
    enrolmentDate: "2025-01-01",
    renewalDate: "2027-01-01",
    riskLevel: "High",
    riskScore: 82,
    engagementScore: 74,
    predictedAnnualCost: 46200,
    claimsCount: 14,
    claimsPaid: 38500,
    openAuthorizations: 2,
    chronicConditions: ["Type 2 diabetes", "Hypertension"],
    allergies: ["Penicillin"],
    medications: ["Metformin", "Amlodipine"],
    careGaps: ["HbA1c review overdue", "Annual retinal screening due"],
    dependants: 3,
    claims: [
      { id: "CLM-74021", serviceDate: "2026-07-10", provider: "Riyadh Care Hospital", category: "Outpatient", amount: 1850, status: "Paid" },
      { id: "CLM-73912", serviceDate: "2026-06-21", provider: "Al Noor Diagnostics", category: "Laboratory", amount: 760, status: "Paid" },
      { id: "CLM-73680", serviceDate: "2026-05-03", provider: "Riyadh Care Hospital", category: "Pharmacy", amount: 420, status: "Pending" },
    ],
    authorizations: [
      { id: "PA-23018", service: "MRI lumbar spine", requestedDate: "2026-07-22", status: "Pending" },
      { id: "PA-22841", service: "Diabetes education programme", requestedDate: "2026-06-11", status: "Approved" },
    ],
    timeline: [
      { id: "EV-1", date: "2026-07-22T09:20:00", title: "Prior authorization submitted", description: "MRI lumbar spine request received.", actor: "Provider Portal" },
      { id: "EV-2", date: "2026-07-10T13:05:00", title: "Claim adjudicated", description: "Outpatient claim approved and queued for payment.", actor: "Claims Engine" },
      { id: "EV-3", date: "2026-01-01T08:00:00", title: "Policy renewed", description: "Corporate Platinum coverage renewed.", actor: "Policy Administration" },
    ],
  },
  {
    id: "MBR-10002",
    fullName: "Khalid Al-Otaibi",
    dateOfBirth: "1990-11-02",
    gender: "Male",
    nationalId: "10******17",
    phone: "+966 50 000 2302",
    email: "khalid.alotaibi@example.com",
    employer: "Najd Logistics Group",
    policyNumber: "POL-100002",
    planName: "Corporate Gold",
    status: "Active",
    enrolmentDate: "2025-03-15",
    renewalDate: "2026-09-15",
    riskLevel: "Low",
    riskScore: 24,
    engagementScore: 88,
    predictedAnnualCost: 9200,
    claimsCount: 4,
    claimsPaid: 5400,
    openAuthorizations: 0,
    chronicConditions: [],
    allergies: [],
    medications: [],
    careGaps: ["Annual wellness assessment due"],
    dependants: 1,
    claims: [{ id: "CLM-73871", serviceDate: "2026-06-12", provider: "Najd Medical Centre", category: "Dental", amount: 1200, status: "Paid" }],
    authorizations: [],
    timeline: [
      { id: "EV-1", date: "2026-06-12T11:30:00", title: "Dental claim received", description: "Routine dental service claim submitted.", actor: "Provider Portal" },
      { id: "EV-2", date: "2025-03-15T08:00:00", title: "Member enrolled", description: "Member added to Corporate Gold plan.", actor: "Enrollment Operations" },
    ],
  },
  {
    id: "MBR-10003",
    fullName: "Fatimah Al-Salem",
    dateOfBirth: "1975-08-29",
    gender: "Female",
    nationalId: "10******65",
    phone: "+966 54 000 3403",
    email: "fatimah.alsalem@example.com",
    employer: "MediCore Clinics",
    policyNumber: "POL-100003",
    planName: "Executive Plus",
    status: "Active",
    enrolmentDate: "2024-10-01",
    renewalDate: "2026-10-01",
    riskLevel: "Moderate",
    riskScore: 63,
    engagementScore: 61,
    predictedAnnualCost: 29800,
    claimsCount: 9,
    claimsPaid: 22100,
    openAuthorizations: 1,
    chronicConditions: ["Asthma"],
    allergies: ["Sulfonamides"],
    medications: ["Budesonide/formoterol"],
    careGaps: ["Pulmonary function test due"],
    dependants: 2,
    claims: [
      { id: "CLM-74105", serviceDate: "2026-07-18", provider: "MediCore Clinics", category: "Outpatient", amount: 940, status: "Paid" },
      { id: "CLM-73510", serviceDate: "2026-04-09", provider: "Kingdom Specialist Centre", category: "Emergency", amount: 4300, status: "Paid" },
    ],
    authorizations: [{ id: "PA-22984", service: "Biologic therapy review", requestedDate: "2026-07-05", status: "Pending" }],
    timeline: [
      { id: "EV-1", date: "2026-07-18T15:00:00", title: "Outpatient consultation", description: "Respiratory follow-up completed.", actor: "MediCore Clinics" },
      { id: "EV-2", date: "2026-07-05T10:10:00", title: "Authorization submitted", description: "Biologic therapy clinical review initiated.", actor: "Provider Portal" },
    ],
  },
  {
    id: "MBR-10004",
    fullName: "Omar Hassan",
    dateOfBirth: "1988-01-12",
    gender: "Male",
    nationalId: "10******31",
    phone: "+966 56 000 4404",
    email: "omar.hassan@example.com",
    employer: "Gulf Digital Services",
    policyNumber: "POL-100004",
    planName: "Corporate Silver",
    status: "Pending",
    enrolmentDate: "2026-07-01",
    renewalDate: "2027-07-01",
    riskLevel: "Moderate",
    riskScore: 48,
    engagementScore: 43,
    predictedAnnualCost: 15400,
    claimsCount: 0,
    claimsPaid: 0,
    openAuthorizations: 0,
    chronicConditions: ["Dyslipidaemia"],
    allergies: [],
    medications: ["Atorvastatin"],
    careGaps: ["Baseline lipid panel pending"],
    dependants: 0,
    claims: [],
    authorizations: [],
    timeline: [{ id: "EV-1", date: "2026-07-01T09:00:00", title: "Enrollment initiated", description: "Member enrollment awaits identity verification.", actor: "Enrollment Operations" }],
  },
  {
    id: "MBR-10005",
    fullName: "Noura Al-Qahtani",
    dateOfBirth: "1995-06-23",
    gender: "Female",
    nationalId: "10******84",
    phone: "+966 53 000 5505",
    email: "noura.alqahtani@example.com",
    employer: "Riyadh Education Network",
    policyNumber: "POL-100005",
    planName: "Family Gold",
    status: "Active",
    enrolmentDate: "2025-09-01",
    renewalDate: "2026-09-01",
    riskLevel: "Low",
    riskScore: 18,
    engagementScore: 92,
    predictedAnnualCost: 6800,
    claimsCount: 3,
    claimsPaid: 3200,
    openAuthorizations: 0,
    chronicConditions: [],
    allergies: ["Latex"],
    medications: [],
    careGaps: [],
    dependants: 2,
    claims: [{ id: "CLM-73990", serviceDate: "2026-06-30", provider: "Family Health Centre", category: "Preventive", amount: 650, status: "Paid" }],
    authorizations: [],
    timeline: [{ id: "EV-1", date: "2026-06-30T09:10:00", title: "Preventive visit completed", description: "Annual preventive assessment completed.", actor: "Family Health Centre" }],
  },
  {
    id: "MBR-10006",
    fullName: "Yousef Al-Harbi",
    dateOfBirth: "1968-03-08",
    gender: "Male",
    nationalId: "10******06",
    phone: "+966 59 000 6606",
    email: "yousef.alharbi@example.com",
    employer: "Independent",
    policyNumber: "POL-100006",
    planName: "Individual Premium",
    status: "Suspended",
    enrolmentDate: "2024-02-01",
    renewalDate: "2026-08-01",
    riskLevel: "High",
    riskScore: 88,
    engagementScore: 37,
    predictedAnnualCost: 62300,
    claimsCount: 18,
    claimsPaid: 55700,
    openAuthorizations: 1,
    chronicConditions: ["Coronary artery disease", "Hypertension"],
    allergies: [],
    medications: ["Aspirin", "Bisoprolol", "Rosuvastatin"],
    careGaps: ["Cardiology follow-up overdue", "Medication reconciliation due"],
    dependants: 1,
    claims: [
      { id: "CLM-74114", serviceDate: "2026-07-19", provider: "Heart Institute Riyadh", category: "Cardiology", amount: 7200, status: "Pending" },
      { id: "CLM-73321", serviceDate: "2026-03-22", provider: "Heart Institute Riyadh", category: "Inpatient", amount: 18400, status: "Paid" },
    ],
    authorizations: [{ id: "PA-23001", service: "Coronary CT angiography", requestedDate: "2026-07-20", status: "Pending" }],
    timeline: [
      { id: "EV-1", date: "2026-07-20T12:40:00", title: "Authorization submitted", description: "Coronary CT angiography request received.", actor: "Heart Institute Riyadh" },
      { id: "EV-2", date: "2026-07-01T08:30:00", title: "Policy suspended", description: "Coverage suspended pending premium reconciliation.", actor: "Policy Administration" },
    ],
  },
];

export const getMemberById = (id: string) => members.find((member) => member.id === id);

export const memberKpis = {
  totalMembers: members.length,
  activeMembers: members.filter((member) => member.status === "Active").length,
  highRiskMembers: members.filter((member) => member.riskLevel === "High").length,
  openAuthorizations: members.reduce((sum, member) => sum + member.openAuthorizations, 0),
  claimsPaid: members.reduce((sum, member) => sum + member.claimsPaid, 0),
  averageRiskScore: Math.round(members.reduce((sum, member) => sum + member.riskScore, 0) / members.length),
};
