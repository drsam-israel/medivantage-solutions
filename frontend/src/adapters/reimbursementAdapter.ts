import type {
  ApprovalStatus,
  Payment,
  PaymentAiInsight,
  PaymentCategory,
  PaymentMethod,
  PaymentRiskLevel,
  PaymentStatus,
  ReconciliationStatus,
} from "../data/paymentDemoData";

import type {
  EnrichedReimbursement,
} from "../services/reimbursementEnrichment";

type PaymentProviderType =
  | "Laboratory"
  | "Pharmacy"
  | "Hospital"
  | "Clinic"
  | "Diagnostic Centre"
  | "Specialist Centre";

type PaymentNetworkTier =
  | "Tier 1"
  | "Tier 2"
  | "Tier 3";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapStatus(status: string): PaymentStatus {
  switch (status.toUpperCase()) {
    case "PAID":
    case "RECONCILED":
      return "Paid";
    case "APPROVED":
      return "Scheduled";
    case "RECONCILIATION_EXCEPTION":
      return "Failed";
    case "PENDING_APPROVAL":
    default:
      return "Scheduled";
  }
}

function mapApprovalStatus(status: string): ApprovalStatus {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "Approved";
    case "ESCALATED":
      return "Escalated";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

function mapReconciliationStatus(status: string): ReconciliationStatus {
  switch (status.toUpperCase()) {
    case "RECONCILED":
      return "Reconciled";
    case "EXCEPTION":
    case "RECONCILIATION_EXCEPTION":
      return "Exception";
    case "UNMATCHED":
      return "Unmatched";
    default:
      return "Pending";
  }
}

function mapRiskLevel(level: string | null): PaymentRiskLevel {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return "Critical";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    default:
      return "Low";
  }
}

function mapPaymentMethod(method: string | null): PaymentMethod {
  switch (method?.trim().toUpperCase()) {
    case "EFT":
      return "EFT";
    case "CHEQUE":
    case "CHECK":
      return "Cheque";
    case "BANK_TRANSFER":
    case "BANK TRANSFER":
    case "WIRE_TRANSFER":
    case "WIRE TRANSFER":
    default:
      return "Bank Transfer";
  }
}

function mapProviderType(
  providerType: string | null | undefined,
): PaymentProviderType {
  const normalized = providerType
    ?.trim()
    .toUpperCase()
    .replaceAll("-", " ")
    .replaceAll("_", " ");

  if (!normalized) return "Hospital";
  if (normalized.includes("LAB")) return "Laboratory";
  if (normalized.includes("PHARM")) return "Pharmacy";
  if (normalized.includes("DIAGNOSTIC") || normalized.includes("IMAGING")) {
    return "Diagnostic Centre";
  }
  if (
    normalized.includes("SPECIALIST") ||
    normalized.includes("SPECIALTY") ||
    normalized.includes("SPECIALITY")
  ) {
    return "Specialist Centre";
  }
  if (normalized.includes("CLINIC")) return "Clinic";
  return "Hospital";
}

function mapNetworkTier(
  networkStatus: string | null | undefined,
): PaymentNetworkTier {
  const normalized = networkStatus
    ?.trim()
    .toUpperCase()
    .replaceAll("-", " ")
    .replaceAll("_", " ");

  if (normalized?.includes("TIER 3")) return "Tier 3";
  if (normalized?.includes("TIER 2")) return "Tier 2";
  return "Tier 1";
}

function mapCategory(reimbursementType: string): PaymentCategory {
  return reimbursementType.toUpperCase() === "RECOVERY"
    ? "Recovery"
    : "Provider Reimbursement";
}

function formatMemberName(
  member: EnrichedReimbursement["member"],
): string {
  if (!member) return "Member details unavailable";
  return [member.first_name, member.middle_name, member.last_name]
    .filter(Boolean)
    .join(" ");
}

function buildAiInsights(
  enriched: EnrichedReimbursement,
): PaymentAiInsight[] {
  const { reimbursement } = enriched;

  if (
    reimbursement.ai_risk_score === null &&
    !reimbursement.ai_risk_reason
  ) {
    return [];
  }

  const riskLevel = mapRiskLevel(reimbursement.ai_risk_level);

  return [
    {
      insightId: `AI-${reimbursement.id}`,
      title:
        riskLevel === "High" || riskLevel === "Critical"
          ? "Payment Risk Alert"
          : "Payment Risk Assessment",
      category: "Compliance",
      description:
        reimbursement.ai_risk_reason ??
        "No material financial anomaly was identified.",
      riskLevel,
      confidence: reimbursement.ai_risk_score ?? 0,
      recommendation:
        riskLevel === "Critical"
          ? "Hold payment and escalate for financial review."
          : riskLevel === "High"
            ? "Review before payment release."
            : riskLevel === "Medium"
              ? "Proceed with enhanced monitoring."
              : "Proceed with standard payment controls.",
    },
  ];
}

export function mapReimbursementToPayment(
  enriched: EnrichedReimbursement,
): Payment {
  const { reimbursement, claim, member, provider } = enriched;

  const grossAmount = toNumber(reimbursement.billed_amount);
  const withholding = toNumber(reimbursement.withholding_amount);
  const recovery = toNumber(reimbursement.recovery_amount);
  const netAmount = toNumber(reimbursement.net_payable_amount);
  const approvedAmount = toNumber(reimbursement.approved_amount);

  const claimBilled = toNumber(claim?.billed_amount);
  const claimAllowed = toNumber(claim?.allowed_amount);
  const deductible = toNumber(claim?.deductible_amount);
  const coinsurance = toNumber(claim?.coinsurance_amount);
  const payerResponsibility = toNumber(claim?.payer_responsibility);

  const category = mapCategory(reimbursement.reimbursement_type);

  return {
    paymentId: reimbursement.id,
    paymentReference:
      reimbursement.payment_reference ?? reimbursement.reimbursement_number,
    batchId: "Not available",
    remittanceAdviceNumber: "Not available",

    category,
    status: mapStatus(reimbursement.status),
    method: mapPaymentMethod(reimbursement.payment_method),
    reconciliationStatus: mapReconciliationStatus(
      reimbursement.reconciliation_status,
    ),
    approvalStatus: mapApprovalStatus(reimbursement.approval_status),
    aiRiskLevel: mapRiskLevel(reimbursement.ai_risk_level),

    provider: {
      providerId: provider?.provider_code ?? reimbursement.provider_id,
      providerName:
        provider?.provider_name ?? "Provider details unavailable",
      providerType: mapProviderType(provider?.provider_type),
      networkTier: mapNetworkTier(provider?.network_status),
      city: provider?.city ?? provider?.region ?? "Not available",
      taxIdentificationNumber: "Not available",
    },

    bankDetails: {
      bankName: "Not available",
      accountName: provider?.provider_name ?? "Not available",
      maskedAccountNumber: "Not available",
      iban: "Not available",
      swiftCode: "Not available",
      beneficiaryReference: "Not available",
      verificationStatus: "Pending",
    },

    invoiceNumber: reimbursement.reimbursement_number,
    invoiceDate: reimbursement.created_at,
    scheduledDate: reimbursement.scheduled_payment_date ?? "",
    processingDate: reimbursement.approved_at ?? "",
    paidDate: reimbursement.paid_at ?? "",

    grossAmount,
    adjustmentsTotal: recovery > 0 ? -recovery : 0,
    withholdingTax: withholding,
    bankCharges: 0,
    netAmount,

    currency: "SAR",
    paymentPeriod: "Live reimbursement transaction",
    paymentDescription: `Reimbursement linked to claim ${
      claim?.claim_number ?? reimbursement.claim_id
    }.`,

    claims: claim
      ? [
          {
            claimId: claim.claim_number,
            memberId: member?.member_number ?? claim.member_id,
            memberName: formatMemberName(member),
            serviceDate: claim.service_date,
            claimAmount: claimBilled,
            approvedAmount: claimAllowed,
            deductibleAmount: deductible,
            coinsuranceAmount: coinsurance,
            providerPayableAmount:
              payerResponsibility > 0
                ? payerResponsibility
                : approvedAmount,
            claimStatus: claim.claim_status
              .replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          },
        ]
      : [],

    approvals:
      reimbursement.approved_at && reimbursement.approved_by
        ? [
            {
              approvalId: `APR-${reimbursement.id}`,
              level: "Finance Approval",
              approver: reimbursement.approved_by,
              role: "Finance Operations",
              status: "Approved",
              date: reimbursement.approved_at,
              comments:
                reimbursement.approval_notes ??
                "Reimbursement approved for payment.",
            },
          ]
        : [],

    adjustments:
      recovery > 0
        ? [
            {
              adjustmentId: `REC-${reimbursement.id}`,
              type: "Recovery",
              reason: "Recovery amount applied to reimbursement.",
              amount: -recovery,
              date: reimbursement.updated_at,
              status:
                reimbursement.status === "RECONCILED"
                  ? "Applied"
                  : "Pending",
            },
          ]
        : [],

    ledgerEntries: [
      {
        ledgerId: `LED-GROSS-${reimbursement.id}`,
        date: reimbursement.created_at,
        transactionType: category === "Recovery" ? "Recovery" : "Payment",
        reference: reimbursement.reimbursement_number,
        debit: category === "Recovery" ? 0 : grossAmount,
        credit: category === "Recovery" ? Math.abs(netAmount) : 0,
        runningBalance: netAmount,
        description:
          category === "Recovery"
            ? "Recovery transaction recorded."
            : "Provider reimbursement recorded.",
      },
    ],

    aiInsights: buildAiInsights(enriched),

    timeline: [
      {
        eventId: `EVT-CREATED-${reimbursement.id}`,
        date: reimbursement.created_at,
        event: "Reimbursement Created",
        description:
          "Reimbursement transaction created from the adjudicated claim.",
        actor: "MediVantage Payment Operations",
        status: "Completed",
      },

      ...(reimbursement.approved_at
        ? [
            {
              eventId: `EVT-APPROVED-${reimbursement.id}`,
              date: reimbursement.approved_at,
              event: "Payment Approved",
              description:
                reimbursement.approval_notes ??
                "Finance approval completed.",
              actor:
                reimbursement.approved_by ?? "Finance Operations",
              status: "Completed" as const,
            },
          ]
        : []),

      ...(reimbursement.paid_at
        ? [
            {
              eventId: `EVT-PAID-${reimbursement.id}`,
              date: reimbursement.paid_at,
              event: "Payment Executed",
              description: `Payment reference ${
                reimbursement.payment_reference ?? "not available"
              } was executed.`,
              actor: "Treasury Operations",
              status: "Completed" as const,
            },
          ]
        : []),

      ...(reimbursement.reconciled_at
        ? [
            {
              eventId: `EVT-RECONCILED-${reimbursement.id}`,
              date: reimbursement.reconciled_at,
              event:
                reimbursement.reconciliation_status === "RECONCILED"
                  ? "Payment Reconciled"
                  : "Reconciliation Exception",
              description: reimbursement.reconciliation_reference
                ? `Reconciliation reference ${reimbursement.reconciliation_reference}.`
                : "Reconciliation activity recorded.",
              actor:
                reimbursement.reconciled_by ?? "Finance Reconciliation",
              status:
                reimbursement.reconciliation_status === "RECONCILED"
                  ? ("Completed" as const)
                  : ("Warning" as const),
            },
          ]
        : []),
    ],
  };
}