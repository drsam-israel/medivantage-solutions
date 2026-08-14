export type MemberStatus = "Active" | "Pending" | "Suspended";

export type RiskLevel = "Low" | "Medium" | "High";

export interface InsuranceMember {
  id: string;
  fullName: string;
  initials: string;
  gender: "Female" | "Male";
  dateOfBirth: string;
  age: number;
  nationality: string;
  occupation: string;
  policyId: string;
  product: string;
  status: MemberStatus;
  riskLevel: RiskLevel;
  provider: string;
}

export interface InsurancePolicy {
  id: string;
  memberId: string;
  product: string;
  planType: string;
  coverageLimit: number;
  annualDeductible: number;
  effectiveDate: string;
  renewalDate: string;
  status: "Active" | "Pending Renewal";
}

export interface InsuranceProvider {
  id: string;
  name: string;
  type: "Hospital" | "Clinic" | "Pharmacy" | "Laboratory";
  city: string;
  networkTier: string;
  status: "Active" | "Under Review";
}

export interface InsuranceProfessional {
  id: string;
  fullName: string;
  role: string;
  department: string;
}

export const members: InsuranceMember[] = [
  {
    id: "MBR-10021",
    fullName: "Amina Al-Harbi",
    initials: "AA",
    gender: "Female",
    dateOfBirth: "1988-04-16",
    age: 38,
    nationality: "Saudi Arabian",
    occupation: "Finance Manager",
    policyId: "POL-2026-10021",
    product: "Comprehensive Family Health Plan",
    status: "Active",
    riskLevel: "Low",
    provider: "Al Noor Specialist Hospital",
  },
  {
    id: "MBR-10022",
    fullName: "Khalid Al-Qahtani",
    initials: "KQ",
    gender: "Male",
    dateOfBirth: "1979-09-08",
    age: 46,
    nationality: "Saudi Arabian",
    occupation: "Operations Director",
    policyId: "POL-2026-10022",
    product: "Executive Medical Plan",
    status: "Active",
    riskLevel: "Medium",
    provider: "Al Noor Specialist Hospital",
  },
  {
    id: "MBR-10023",
    fullName: "Sara Mohammed",
    initials: "SM",
    gender: "Female",
    dateOfBirth: "1993-12-02",
    age: 32,
    nationality: "Saudi Arabian",
    occupation: "University Lecturer",
    policyId: "POL-2026-10023",
    product: "Individual Premium Plan",
    status: "Active",
    riskLevel: "Low",
    provider: "Riyadh Medical Center",
  },
  {
    id: "MBR-10024",
    fullName: "Omar Al-Dossari",
    initials: "OD",
    gender: "Male",
    dateOfBirth: "1968-06-11",
    age: 58,
    nationality: "Saudi Arabian",
    occupation: "Business Owner",
    policyId: "POL-2026-10024",
    product: "Comprehensive Medical Plan",
    status: "Active",
    riskLevel: "High",
    provider: "Al Noor Specialist Hospital",
  },
];

export const policies: InsurancePolicy[] = [
  {
    id: "POL-2026-10021",
    memberId: "MBR-10021",
    product: "Comprehensive Family Health Plan",
    planType: "Family",
    coverageLimit: 500000,
    annualDeductible: 1000,
    effectiveDate: "2026-01-01",
    renewalDate: "2027-01-01",
    status: "Active",
  },
  {
    id: "POL-2026-10022",
    memberId: "MBR-10022",
    product: "Executive Medical Plan",
    planType: "Executive",
    coverageLimit: 750000,
    annualDeductible: 1500,
    effectiveDate: "2026-02-01",
    renewalDate: "2027-02-01",
    status: "Active",
  },
  {
    id: "POL-2026-10023",
    memberId: "MBR-10023",
    product: "Individual Premium Plan",
    planType: "Individual",
    coverageLimit: 350000,
    annualDeductible: 750,
    effectiveDate: "2026-03-01",
    renewalDate: "2027-03-01",
    status: "Active",
  },
  {
    id: "POL-2026-10024",
    memberId: "MBR-10024",
    product: "Comprehensive Medical Plan",
    planType: "Individual",
    coverageLimit: 600000,
    annualDeductible: 2000,
    effectiveDate: "2026-01-15",
    renewalDate: "2027-01-15",
    status: "Active",
  },
];

export const providers: InsuranceProvider[] = [
  {
    id: "PRV-001",
    name: "Al Noor Specialist Hospital",
    type: "Hospital",
    city: "Riyadh",
    networkTier: "Tier 1",
    status: "Active",
  },
  {
    id: "PRV-002",
    name: "Riyadh Medical Center",
    type: "Hospital",
    city: "Riyadh",
    networkTier: "Tier 1",
    status: "Active",
  },
  {
    id: "PRV-003",
    name: "Al Hayat Family Clinic",
    type: "Clinic",
    city: "Riyadh",
    networkTier: "Tier 2",
    status: "Active",
  },
];

export const insuranceProfessionals: InsuranceProfessional[] = [
  {
    id: "USR-001",
    fullName: "Dr. Nora Al-Salem",
    role: "Clinical Reviewer",
    department: "Claims Management",
  },
  {
    id: "USR-002",
    fullName: "Dr. Samuel Israel",
    role: "Medical Director",
    department: "Medical and Life Insurance",
  },
  {
    id: "USR-003",
    fullName: "Dr. Faisal Al-Harbi",
    role: "Treating Physician",
    department: "Provider Network",
  },
];

export const getMemberById = (memberId: string) =>
  members.find((member) => member.id === memberId);

export const getPolicyByMemberId = (memberId: string) =>
  policies.find((policy) => policy.memberId === memberId);

export const getProviderById = (providerId: string) =>
  providers.find((provider) => provider.id === providerId);