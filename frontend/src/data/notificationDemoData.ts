export type NotificationSeverity =
  | "info"
  | "success"
  | "warning"
  | "critical";

export type NotificationModule =
  | "Claims"
  | "Members"
  | "Medical Underwriting"
  | "Prior Authorization"
  | "Provider Network"
  | "Payments"
  | "Fraud Investigation"
  | "AI Insights"
  | "Platform";

export interface EnterpriseNotification {
  id: string;
  title: string;
  message: string;
  module: NotificationModule;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  path?: string;
  recordId?: string;
}

export const notificationDemoData: EnterpriseNotification[] = [
  {
    id: "NTF-001",
    title: "Critical Fraud Case Escalated",
    message:
      "Case FRA-2026-1042 exceeded the fraud risk threshold and requires immediate SIU review.",
    module: "Fraud Investigation",
    severity: "critical",
    timestamp: "2026-08-05T18:42:00",
    read: false,
    path: "/fraud-investigations/FRA-2026-1042",
    recordId: "FRA-2026-1042",
  },

  {
    id: "NTF-002",
    title: "Prior Authorization Near SLA Breach",
    message:
      "Authorization PA-2026-1884 has less than two hours remaining before SLA expiration.",
    module: "Prior Authorization",
    severity: "warning",
    timestamp: "2026-08-05T18:18:00",
    read: false,
    path: "/prior-authorization/PA-2026-1884",
    recordId: "PA-2026-1884",
  },

  {
    id: "NTF-003",
    title: "Payment Reconciliation Exception",
    message:
      "Payment PAY-2026-2017 could not be matched to the settlement batch.",
    module: "Payments",
    severity: "warning",
    timestamp: "2026-08-05T17:54:00",
    read: false,
    path: "/payments/PAY-2026-2017",
    recordId: "PAY-2026-2017",
  },

  {
    id: "NTF-004",
    title: "AI Model Drift Detected",
    message:
      "Claims anomaly detection model exceeded monitored drift tolerance.",
    module: "AI Insights",
    severity: "critical",
    timestamp: "2026-08-05T17:12:00",
    read: false,
    path: "/ai-insights",
  },

  {
    id: "NTF-005",
    title: "Underwriting Case Approved",
    message:
      "Application UW-2026-10021 has been approved after senior clinical review.",
    module: "Medical Underwriting",
    severity: "success",
    timestamp: "2026-08-05T16:46:00",
    read: true,
    path: "/medical-underwriting/UW-2026-10021",
    recordId: "UW-2026-10021",
  },

  {
    id: "NTF-006",
    title: "Provider Credential Expiring",
    message:
      "Operating licence for Riyadh Central Hospital expires within 30 days.",
    module: "Provider Network",
    severity: "info",
    timestamp: "2026-08-05T15:30:00",
    read: true,
    path: "/provider-network",
  },
];