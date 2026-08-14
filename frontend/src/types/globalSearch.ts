export type GlobalSearchModule =
  | "Dashboard"
  | "Claims"
  | "Members"
  | "Medical Underwriting"
  | "Policy Administration"
  | "Prior Authorization"
  | "Provider Network"
  | "Payments"
  | "Fraud Investigation"
  | "AI Insights";

export interface GlobalSearchItem {
  id: string;
  module: GlobalSearchModule;
  title: string;
  subtitle: string;
  description?: string;
  status?: string;
  path: string;
  keywords: string[];
}

export interface GlobalSearchGroup {
  module: GlobalSearchModule;
  items: GlobalSearchItem[];
}