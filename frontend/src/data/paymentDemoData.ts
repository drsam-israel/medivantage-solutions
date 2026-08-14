export type PaymentStatus =
  | "Scheduled"
  | "Processing"
  | "Paid"
  | "Failed"
  | "On Hold"
  | "Cancelled";

export type PaymentMethod =
  | "EFT"
  | "Bank Transfer"
  | "Cheque"
  | "Virtual Card";

export type ReconciliationStatus =
  | "Reconciled"
  | "Pending"
  | "Exception"
  | "Unmatched";

export type ApprovalStatus =
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Escalated";

export type PaymentRiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type PaymentCategory =
  | "Provider Reimbursement"
  | "Member Reimbursement"
  | "Refund"
  | "Adjustment"
  | "Recovery";

export interface PaymentProvider {
  providerId: string;
  providerName: string;
  providerType:
    | "Hospital"
    | "Clinic"
    | "Laboratory"
    | "Pharmacy"
    | "Diagnostic Centre"
    | "Specialist Centre";
  networkTier: "Tier 1" | "Tier 2" | "Tier 3";
  city: string;
  taxIdentificationNumber: string;
}

export interface PaymentBankDetails {
  bankName: string;
  accountName: string;
  maskedAccountNumber: string;
  iban: string;
  swiftCode: string;
  beneficiaryReference: string;
  verificationStatus:
    | "Verified"
    | "Pending"
    | "Failed";
}

export interface PaymentClaimLink {
  claimId: string;
  memberId: string;
  memberName: string;
  serviceDate: string;
  claimAmount: number;
  approvedAmount: number;
  deductibleAmount: number;
  coinsuranceAmount: number;
  providerPayableAmount: number;
  claimStatus: string;
}

export interface PaymentApproval {
  approvalId: string;
  level: string;
  approver: string;
  role: string;
  status: ApprovalStatus;
  date: string;
  comments: string;
}

export interface PaymentAdjustment {
  adjustmentId: string;
  type:
    | "Debit"
    | "Credit"
    | "Recovery"
    | "Withholding";
  reason: string;
  amount: number;
  date: string;
  status:
    | "Applied"
    | "Pending"
    | "Rejected";
}

export interface PaymentLedgerEntry {
  ledgerId: string;
  date: string;
  transactionType:
    | "Payment"
    | "Adjustment"
    | "Recovery"
    | "Reversal"
    | "Fee";
  reference: string;
  debit: number;
  credit: number;
  runningBalance: number;
  description: string;
}

export interface PaymentAiInsight {
  insightId: string;
  title: string;
  category:
    | "Fraud Risk"
    | "Banking"
    | "Reconciliation"
    | "Duplicate Payment"
    | "Cash Flow"
    | "Compliance";
  description: string;
  riskLevel: PaymentRiskLevel;
  confidence: number;
  recommendation: string;
}

export interface PaymentTimelineEvent {
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

export interface Payment {
  paymentId: string;
  paymentReference: string;
  batchId: string;
  remittanceAdviceNumber: string;

  category: PaymentCategory;
  status: PaymentStatus;
  method: PaymentMethod;
  reconciliationStatus: ReconciliationStatus;
  approvalStatus: ApprovalStatus;
  aiRiskLevel: PaymentRiskLevel;

  provider: PaymentProvider;
  bankDetails: PaymentBankDetails;

  invoiceNumber: string;
  invoiceDate: string;
  scheduledDate: string;
  processingDate: string;
  paidDate: string;

  grossAmount: number;
  adjustmentsTotal: number;
  withholdingTax: number;
  bankCharges: number;
  netAmount: number;

  currency: "SAR";
  paymentPeriod: string;
  paymentDescription: string;

  claims: PaymentClaimLink[];
  approvals: PaymentApproval[];
  adjustments: PaymentAdjustment[];
  ledgerEntries: PaymentLedgerEntry[];
  aiInsights: PaymentAiInsight[];
  timeline: PaymentTimelineEvent[];
}

export const paymentDemoData: Payment[] = [
  {
    paymentId: "PAY-10001",
    paymentReference: "MVS-EFT-2026-000101",
    batchId: "BAT-2026-0715-01",
    remittanceAdviceNumber: "RA-2026-10001",

    category: "Provider Reimbursement",
    status: "Paid",
    method: "EFT",
    reconciliationStatus: "Reconciled",
    approvalStatus: "Approved",
    aiRiskLevel: "Low",

    provider: {
      providerId: "PRV-10001",
      providerName: "Riyadh Care Hospital",
      providerType: "Hospital",
      networkTier: "Tier 1",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100019823",
    },

    bankDetails: {
      bankName: "Saudi National Bank",
      accountName:
        "Riyadh Care Medical Services Company",
      maskedAccountNumber: "**** **** 8842",
      iban: "SA03 8000 0000 6080 1016 8842",
      swiftCode: "NCBKSAJE",
      beneficiaryReference: "BEN-RCH-10001",
      verificationStatus: "Verified",
    },

    invoiceNumber: "INV-RCH-2026-0712",
    invoiceDate: "2026-07-12",
    scheduledDate: "2026-07-15",
    processingDate: "2026-07-15",
    paidDate: "2026-07-16",

    grossAmount: 1248500,
    adjustmentsTotal: -18450,
    withholdingTax: 0,
    bankCharges: 25,
    netAmount: 1230025,

    currency: "SAR",
    paymentPeriod: "June 2026",
    paymentDescription:
      "Monthly provider reimbursement for approved inpatient, outpatient and emergency claims.",

    claims: [
      {
        claimId: "CLM-10001",
        memberId: "MBR-10001",
        memberName: "Ahmed Al-Harbi",
        serviceDate: "2026-06-02",
        claimAmount: 78500,
        approvedAmount: 74400,
        deductibleAmount: 1000,
        coinsuranceAmount: 2400,
        providerPayableAmount: 71000,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10002",
        memberId: "MBR-10008",
        memberName: "Noura Al-Salem",
        serviceDate: "2026-06-08",
        claimAmount: 126000,
        approvedAmount: 119500,
        deductibleAmount: 1500,
        coinsuranceAmount: 3500,
        providerPayableAmount: 114500,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10003",
        memberId: "MBR-10012",
        memberName: "Fahad Al-Mutairi",
        serviceDate: "2026-06-18",
        claimAmount: 242000,
        approvedAmount: 231400,
        deductibleAmount: 2000,
        coinsuranceAmount: 6400,
        providerPayableAmount: 223000,
        claimStatus: "Approved",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10001",
        level: "Level 1",
        approver: "Maha Al-Qahtani",
        role: "Payment Operations Analyst",
        status: "Approved",
        date: "2026-07-13",
        comments:
          "Invoice and claims totals validated.",
      },
      {
        approvalId: "APR-10002",
        level: "Level 2",
        approver: "Omar Al-Rashid",
        role: "Finance Manager",
        status: "Approved",
        date: "2026-07-14",
        comments:
          "Payment approved for inclusion in EFT batch.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10001",
        type: "Recovery",
        reason:
          "Recovery of prior overpayment identified during post-payment audit.",
        amount: -18450,
        date: "2026-07-12",
        status: "Applied",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10001",
        date: "2026-07-12",
        transactionType: "Payment",
        reference: "INV-RCH-2026-0712",
        debit: 1248500,
        credit: 0,
        runningBalance: 1248500,
        description:
          "Gross provider reimbursement recorded.",
      },
      {
        ledgerId: "LED-10002",
        date: "2026-07-12",
        transactionType: "Recovery",
        reference: "ADJ-10001",
        debit: 0,
        credit: 18450,
        runningBalance: 1230050,
        description:
          "Prior overpayment recovery applied.",
      },
      {
        ledgerId: "LED-10003",
        date: "2026-07-16",
        transactionType: "Fee",
        reference: "BANK-FEE-10001",
        debit: 25,
        credit: 0,
        runningBalance: 1230025,
        description:
          "Bank processing charge.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10001",
        title: "Normal Payment Pattern",
        category: "Fraud Risk",
        description:
          "The amount and claim composition are consistent with the provider's historical reimbursement profile.",
        riskLevel: "Low",
        confidence: 96,
        recommendation:
          "No intervention required. Continue routine monitoring.",
      },
      {
        insightId: "PAY-AI-10002",
        title: "Successful Reconciliation",
        category: "Reconciliation",
        description:
          "The payment amount, bank confirmation and ledger entries reconcile without exception.",
        riskLevel: "Low",
        confidence: 100,
        recommendation:
          "Close the payment cycle.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10001",
        date: "2026-07-12",
        event: "Invoice Received",
        description:
          "Monthly provider invoice received and validated.",
        actor: "Payment Operations",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10002",
        date: "2026-07-14",
        event: "Finance Approval Completed",
        description:
          "Payment approved by the Finance Manager.",
        actor: "Finance Department",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10003",
        date: "2026-07-16",
        event: "Payment Settled",
        description:
          "Funds successfully transferred through EFT.",
        actor: "Banking Integration Service",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10004",
        date: "2026-07-17",
        event: "Payment Reconciled",
        description:
          "Bank confirmation matched to the payment ledger.",
        actor: "Reconciliation Engine",
        status: "Completed",
      },
    ],
  },

  {
    paymentId: "PAY-10002",
    paymentReference: "MVS-EFT-2026-000102",
    batchId: "BAT-2026-0720-01",
    remittanceAdviceNumber: "RA-2026-10002",

    category: "Provider Reimbursement",
    status: "Scheduled",
    method: "Bank Transfer",
    reconciliationStatus: "Pending",
    approvalStatus: "Approved",
    aiRiskLevel: "Low",

    provider: {
      providerId: "PRV-10002",
      providerName: "Kingdom Specialist Centre",
      providerType: "Specialist Centre",
      networkTier: "Tier 1",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100021092",
    },

    bankDetails: {
      bankName: "Riyad Bank",
      accountName:
        "Kingdom Specialist Medical Centre Company",
      maskedAccountNumber: "**** **** 1002",
      iban: "SA21 2000 0000 1180 2201 1002",
      swiftCode: "RIBLSARI",
      beneficiaryReference: "BEN-KSC-10002",
      verificationStatus: "Verified",
    },

    invoiceNumber: "INV-KSC-2026-0720",
    invoiceDate: "2026-07-20",
    scheduledDate: "2026-07-30",
    processingDate: "",
    paidDate: "",

    grossAmount: 986400,
    adjustmentsTotal: -12500,
    withholdingTax: 0,
    bankCharges: 20,
    netAmount: 973880,

    currency: "SAR",
    paymentPeriod: "June 2026",
    paymentDescription:
      "Specialist cardiac services reimbursement including bundled procedure payments.",

    claims: [
      {
        claimId: "CLM-10024",
        memberId: "MBR-10017",
        memberName: "Khalid Al-Anazi",
        serviceDate: "2026-06-04",
        claimAmount: 164000,
        approvedAmount: 155000,
        deductibleAmount: 2000,
        coinsuranceAmount: 5000,
        providerPayableAmount: 148000,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10025",
        memberId: "MBR-10022",
        memberName: "Layla Al-Dosari",
        serviceDate: "2026-06-14",
        claimAmount: 212000,
        approvedAmount: 202500,
        deductibleAmount: 2500,
        coinsuranceAmount: 6000,
        providerPayableAmount: 194000,
        claimStatus: "Approved",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10003",
        level: "Level 1",
        approver: "Maha Al-Qahtani",
        role: "Payment Operations Analyst",
        status: "Approved",
        date: "2026-07-23",
        comments:
          "Invoice validated against approved cardiac claims.",
      },
      {
        approvalId: "APR-10004",
        level: "Level 2",
        approver: "Omar Al-Rashid",
        role: "Finance Manager",
        status: "Approved",
        date: "2026-07-24",
        comments:
          "Approved for scheduled bank transfer.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10002",
        type: "Debit",
        reason:
          "Contractual rate correction for two cardiac procedure claims.",
        amount: -12500,
        date: "2026-07-22",
        status: "Applied",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10004",
        date: "2026-07-20",
        transactionType: "Payment",
        reference: "INV-KSC-2026-0720",
        debit: 986400,
        credit: 0,
        runningBalance: 986400,
        description:
          "Gross provider reimbursement recorded.",
      },
      {
        ledgerId: "LED-10005",
        date: "2026-07-22",
        transactionType: "Adjustment",
        reference: "ADJ-10002",
        debit: 0,
        credit: 12500,
        runningBalance: 973900,
        description:
          "Contractual rate correction applied.",
      },
      {
        ledgerId: "LED-10006",
        date: "2026-07-24",
        transactionType: "Fee",
        reference: "BANK-FEE-10002",
        debit: 20,
        credit: 0,
        runningBalance: 973880,
        description:
          "Expected bank transfer charge.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10003",
        title: "Expected Specialist Payment",
        category: "Cash Flow",
        description:
          "The payment is within the expected monthly range for the provider.",
        riskLevel: "Low",
        confidence: 93,
        recommendation:
          "Proceed with scheduled payment.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10005",
        date: "2026-07-20",
        event: "Invoice Received",
        description:
          "Specialist services invoice received.",
        actor: "Payment Operations",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10006",
        date: "2026-07-24",
        event: "Payment Approved",
        description:
          "Payment approved for release on 30 July 2026.",
        actor: "Finance Manager",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10007",
        date: "2026-07-30",
        event: "Payment Scheduled",
        description:
          "Bank transfer is awaiting execution.",
        actor: "Treasury Operations",
        status: "Pending",
      },
    ],
  },

  {
    paymentId: "PAY-10003",
    paymentReference: "MVS-EFT-2026-000103",
    batchId: "BAT-2026-0722-02",
    remittanceAdviceNumber: "RA-2026-10003",

    category: "Provider Reimbursement",
    status: "Failed",
    method: "EFT",
    reconciliationStatus: "Exception",
    approvalStatus: "Approved",
    aiRiskLevel: "High",

    provider: {
      providerId: "PRV-10003",
      providerName: "Al Noor Diagnostics",
      providerType: "Diagnostic Centre",
      networkTier: "Tier 2",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100031182",
    },

    bankDetails: {
      bankName: "Al Rajhi Bank",
      accountName:
        "Al Noor Diagnostic Services Company",
      maskedAccountNumber: "**** **** 2203",
      iban: "SA10 8000 0000 6080 3302 2203",
      swiftCode: "RJHISARI",
      beneficiaryReference: "BEN-AND-10003",
      verificationStatus: "Failed",
    },

    invoiceNumber: "INV-AND-2026-0722",
    invoiceDate: "2026-07-22",
    scheduledDate: "2026-07-25",
    processingDate: "2026-07-25",
    paidDate: "",

    grossAmount: 462800,
    adjustmentsTotal: -8200,
    withholdingTax: 0,
    bankCharges: 0,
    netAmount: 454600,

    currency: "SAR",
    paymentPeriod: "June 2026",
    paymentDescription:
      "Diagnostic imaging reimbursement for approved MRI, CT and ultrasound claims.",

    claims: [
      {
        claimId: "CLM-10038",
        memberId: "MBR-10031",
        memberName: "Sara Al-Harbi",
        serviceDate: "2026-06-11",
        claimAmount: 14200,
        approvedAmount: 12800,
        deductibleAmount: 500,
        coinsuranceAmount: 700,
        providerPayableAmount: 11600,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10039",
        memberId: "MBR-10033",
        memberName: "Abdullah Al-Otaibi",
        serviceDate: "2026-06-16",
        claimAmount: 18400,
        approvedAmount: 16900,
        deductibleAmount: 500,
        coinsuranceAmount: 900,
        providerPayableAmount: 15500,
        claimStatus: "Approved",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10005",
        level: "Level 1",
        approver: "Maha Al-Qahtani",
        role: "Payment Operations Analyst",
        status: "Approved",
        date: "2026-07-23",
        comments:
          "Payment validated for release.",
      },
      {
        approvalId: "APR-10006",
        level: "Level 2",
        approver: "Omar Al-Rashid",
        role: "Finance Manager",
        status: "Approved",
        date: "2026-07-24",
        comments:
          "Approved subject to beneficiary verification.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10003",
        type: "Debit",
        reason:
          "Imaging tariff correction.",
        amount: -8200,
        date: "2026-07-23",
        status: "Applied",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10007",
        date: "2026-07-22",
        transactionType: "Payment",
        reference: "INV-AND-2026-0722",
        debit: 462800,
        credit: 0,
        runningBalance: 462800,
        description:
          "Gross reimbursement recorded.",
      },
      {
        ledgerId: "LED-10008",
        date: "2026-07-23",
        transactionType: "Adjustment",
        reference: "ADJ-10003",
        debit: 0,
        credit: 8200,
        runningBalance: 454600,
        description:
          "Tariff correction applied.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10004",
        title: "Beneficiary Account Mismatch",
        category: "Banking",
        description:
          "The beneficiary account name does not fully match the verified provider legal entity.",
        riskLevel: "High",
        confidence: 98,
        recommendation:
          "Place the payment on hold and obtain verified banking documentation.",
      },
      {
        insightId: "PAY-AI-10005",
        title: "Reconciliation Exception",
        category: "Reconciliation",
        description:
          "No successful bank settlement record was returned for the payment instruction.",
        riskLevel: "High",
        confidence: 100,
        recommendation:
          "Reconcile the failed transfer and prevent duplicate reprocessing.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10008",
        date: "2026-07-25",
        event: "Payment Instruction Submitted",
        description:
          "EFT instruction submitted to the bank.",
        actor: "Banking Integration Service",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10009",
        date: "2026-07-25",
        event: "Payment Failed",
        description:
          "Bank rejected the beneficiary information.",
        actor: "Banking Integration Service",
        status: "Escalated",
      },
      {
        eventId: "PAY-EVT-10010",
        date: "2026-07-26",
        event: "Exception Review Opened",
        description:
          "Payment exception assigned to Finance Operations.",
        actor: "Reconciliation Engine",
        status: "Pending",
      },
    ],
  },

  {
    paymentId: "PAY-10004",
    paymentReference: "MVS-EFT-2026-000104",
    batchId: "BAT-2026-0725-01",
    remittanceAdviceNumber: "RA-2026-10004",

    category: "Provider Reimbursement",
    status: "On Hold",
    method: "Bank Transfer",
    reconciliationStatus: "Pending",
    approvalStatus: "Escalated",
    aiRiskLevel: "Critical",

    provider: {
      providerId: "PRV-10005",
      providerName: "Gulf Medical Laboratory",
      providerType: "Laboratory",
      networkTier: "Tier 2",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100051384",
    },

    bankDetails: {
      bankName: "Saudi Awwal Bank",
      accountName:
        "Gulf Medical Laboratory Services Company",
      maskedAccountNumber: "**** **** 5005",
      iban: "SA44 4500 0000 0000 5105 5005",
      swiftCode: "SABBSARI",
      beneficiaryReference: "BEN-GML-10005",
      verificationStatus: "Verified",
    },

    invoiceNumber: "INV-GML-2026-0725",
    invoiceDate: "2026-07-25",
    scheduledDate: "2026-08-01",
    processingDate: "",
    paidDate: "",

    grossAmount: 684300,
    adjustmentsTotal: -92500,
    withholdingTax: 0,
    bankCharges: 20,
    netAmount: 591780,

    currency: "SAR",
    paymentPeriod: "June 2026",
    paymentDescription:
      "Laboratory reimbursement currently held pending fraud, waste and abuse investigation.",

    claims: [
      {
        claimId: "CLM-10050",
        memberId: "MBR-10042",
        memberName: "Huda Al-Salem",
        serviceDate: "2026-06-05",
        claimAmount: 8400,
        approvedAmount: 7900,
        deductibleAmount: 200,
        coinsuranceAmount: 400,
        providerPayableAmount: 7300,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10051",
        memberId: "MBR-10044",
        memberName: "Saud Al-Ghamdi",
        serviceDate: "2026-06-05",
        claimAmount: 9600,
        approvedAmount: 9000,
        deductibleAmount: 200,
        coinsuranceAmount: 500,
        providerPayableAmount: 8300,
        claimStatus: "Approved",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10007",
        level: "Level 1",
        approver: "Maha Al-Qahtani",
        role: "Payment Operations Analyst",
        status: "Approved",
        date: "2026-07-26",
        comments:
          "Invoice validated; duplicate testing concerns identified.",
      },
      {
        approvalId: "APR-10008",
        level: "Compliance Review",
        approver: "Lina Al-Otaibi",
        role: "FWA Investigation Manager",
        status: "Escalated",
        date: "2026-07-27",
        comments:
          "Payment hold required pending investigation.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10004",
        type: "Recovery",
        reason:
          "Provisional recovery for suspected duplicate laboratory tests.",
        amount: -92500,
        date: "2026-07-27",
        status: "Pending",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10009",
        date: "2026-07-25",
        transactionType: "Payment",
        reference: "INV-GML-2026-0725",
        debit: 684300,
        credit: 0,
        runningBalance: 684300,
        description:
          "Gross reimbursement recorded.",
      },
      {
        ledgerId: "LED-10010",
        date: "2026-07-27",
        transactionType: "Recovery",
        reference: "ADJ-10004",
        debit: 0,
        credit: 92500,
        runningBalance: 591800,
        description:
          "Provisional recovery recorded.",
      },
      {
        ledgerId: "LED-10011",
        date: "2026-07-27",
        transactionType: "Fee",
        reference: "BANK-FEE-10004",
        debit: 20,
        credit: 0,
        runningBalance: 591780,
        description:
          "Expected bank charge.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10006",
        title: "Duplicate Testing Exposure",
        category: "Fraud Risk",
        description:
          "The underlying claims include repeated laboratory tests within clinically unusual time intervals.",
        riskLevel: "Critical",
        confidence: 96,
        recommendation:
          "Maintain payment hold until the FWA investigation is completed.",
      },
      {
        insightId: "PAY-AI-10007",
        title: "Potential Overpayment",
        category: "Duplicate Payment",
        description:
          "A subset of billed tests may overlap with previously paid claims.",
        riskLevel: "High",
        confidence: 91,
        recommendation:
          "Complete claim-level duplicate analysis before release.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10011",
        date: "2026-07-25",
        event: "Invoice Received",
        description:
          "Laboratory reimbursement invoice received.",
        actor: "Payment Operations",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10012",
        date: "2026-07-27",
        event: "Critical AI Alert",
        description:
          "Duplicate testing and potential overpayment detected.",
        actor: "MediVantage Payment Intelligence",
        status: "Escalated",
      },
      {
        eventId: "PAY-EVT-10013",
        date: "2026-07-27",
        event: "Payment Hold Applied",
        description:
          "Payment blocked pending compliance investigation.",
        actor: "Finance and Compliance Committee",
        status: "Escalated",
      },
    ],
  },

  {
    paymentId: "PAY-10005",
    paymentReference: "MVS-EFT-2026-000105",
    batchId: "BAT-2026-0728-01",
    remittanceAdviceNumber: "RA-2026-10005",

    category: "Provider Reimbursement",
    status: "Processing",
    method: "EFT",
    reconciliationStatus: "Pending",
    approvalStatus: "Approved",
    aiRiskLevel: "Medium",

    provider: {
      providerId: "PRV-10006",
      providerName: "Al Shifa Pharmacy",
      providerType: "Pharmacy",
      networkTier: "Tier 3",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100061485",
    },

    bankDetails: {
      bankName: "Arab National Bank",
      accountName: "Al Shifa Pharmacy Group",
      maskedAccountNumber: "**** **** 6006",
      iban: "SA15 3000 0000 1080 4406 6006",
      swiftCode: "ARNBSARI",
      beneficiaryReference: "BEN-ASP-10006",
      verificationStatus: "Verified",
    },

    invoiceNumber: "INV-ASP-2026-0728",
    invoiceDate: "2026-07-28",
    scheduledDate: "2026-07-29",
    processingDate: "2026-07-29",
    paidDate: "",

    grossAmount: 772600,
    adjustmentsTotal: -14600,
    withholdingTax: 0,
    bankCharges: 25,
    netAmount: 757975,

    currency: "SAR",
    paymentPeriod: "June 2026",
    paymentDescription:
      "Retail pharmacy reimbursement for approved medication claims.",

    claims: [
      {
        claimId: "CLM-10062",
        memberId: "MBR-10051",
        memberName: "Reem Al-Harbi",
        serviceDate: "2026-06-10",
        claimAmount: 4200,
        approvedAmount: 3900,
        deductibleAmount: 100,
        coinsuranceAmount: 200,
        providerPayableAmount: 3600,
        claimStatus: "Approved",
      },
      {
        claimId: "CLM-10063",
        memberId: "MBR-10052",
        memberName: "Yousef Al-Qahtani",
        serviceDate: "2026-06-12",
        claimAmount: 6800,
        approvedAmount: 6200,
        deductibleAmount: 150,
        coinsuranceAmount: 350,
        providerPayableAmount: 5700,
        claimStatus: "Approved",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10009",
        level: "Level 1",
        approver: "Maha Al-Qahtani",
        role: "Payment Operations Analyst",
        status: "Approved",
        date: "2026-07-28",
        comments:
          "Pharmacy reimbursement validated.",
      },
      {
        approvalId: "APR-10010",
        level: "Level 2",
        approver: "Omar Al-Rashid",
        role: "Finance Manager",
        status: "Approved",
        date: "2026-07-29",
        comments:
          "Approved for EFT processing.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10005",
        type: "Debit",
        reason:
          "Non-formulary medication pricing adjustment.",
        amount: -14600,
        date: "2026-07-28",
        status: "Applied",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10012",
        date: "2026-07-28",
        transactionType: "Payment",
        reference: "INV-ASP-2026-0728",
        debit: 772600,
        credit: 0,
        runningBalance: 772600,
        description:
          "Gross pharmacy reimbursement recorded.",
      },
      {
        ledgerId: "LED-10013",
        date: "2026-07-28",
        transactionType: "Adjustment",
        reference: "ADJ-10005",
        debit: 0,
        credit: 14600,
        runningBalance: 758000,
        description:
          "Non-formulary pricing adjustment applied.",
      },
      {
        ledgerId: "LED-10014",
        date: "2026-07-29",
        transactionType: "Fee",
        reference: "BANK-FEE-10005",
        debit: 25,
        credit: 0,
        runningBalance: 757975,
        description:
          "Bank processing charge.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10008",
        title: "Early Refill Concentration",
        category: "Fraud Risk",
        description:
          "A moderate number of underlying claims include early medication refill patterns.",
        riskLevel: "Medium",
        confidence: 84,
        recommendation:
          "Allow processing but review repeated early refill overrides.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10014",
        date: "2026-07-28",
        event: "Payment Created",
        description:
          "Pharmacy reimbursement payment created.",
        actor: "Payment Operations",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10015",
        date: "2026-07-29",
        event: "Payment Processing",
        description:
          "EFT instruction is being processed.",
        actor: "Banking Integration Service",
        status: "Pending",
      },
    ],
  },

  {
    paymentId: "PAY-10006",
    paymentReference: "MVS-REC-2026-000106",
    batchId: "BAT-2026-0729-REC",
    remittanceAdviceNumber: "RA-2026-10006",

    category: "Recovery",
    status: "Scheduled",
    method: "Bank Transfer",
    reconciliationStatus: "Pending",
    approvalStatus: "Pending",
    aiRiskLevel: "High",

    provider: {
      providerId: "PRV-10008",
      providerName: "Northern Community Clinic",
      providerType: "Clinic",
      networkTier: "Tier 3",
      city: "Riyadh",
      taxIdentificationNumber: "TIN-3100081687",
    },

    bankDetails: {
      bankName: "Bank Albilad",
      accountName:
        "Northern Community Healthcare Company",
      maskedAccountNumber: "**** **** 8008",
      iban: "SA22 1500 0000 6080 8808 8008",
      swiftCode: "ALBISARI",
      beneficiaryReference: "BEN-NCC-10008",
      verificationStatus: "Verified",
    },

    invoiceNumber: "REC-NCC-2026-0729",
    invoiceDate: "2026-07-29",
    scheduledDate: "2026-08-05",
    processingDate: "",
    paidDate: "",

    grossAmount: 0,
    adjustmentsTotal: -286400,
    withholdingTax: 0,
    bankCharges: 0,
    netAmount: -286400,

    currency: "SAR",
    paymentPeriod: "Post-payment audit recovery",
    paymentDescription:
      "Recovery of suspected overpayments associated with upcoding and unsupported services.",

    claims: [
      {
        claimId: "CLM-10074",
        memberId: "MBR-10060",
        memberName: "Mansour Al-Dosari",
        serviceDate: "2026-05-08",
        claimAmount: 18400,
        approvedAmount: 16600,
        deductibleAmount: 300,
        coinsuranceAmount: 800,
        providerPayableAmount: 15500,
        claimStatus: "Under Investigation",
      },
      {
        claimId: "CLM-10075",
        memberId: "MBR-10062",
        memberName: "Aisha Al-Salem",
        serviceDate: "2026-05-11",
        claimAmount: 22100,
        approvedAmount: 19800,
        deductibleAmount: 300,
        coinsuranceAmount: 1000,
        providerPayableAmount: 18500,
        claimStatus: "Under Investigation",
      },
    ],

    approvals: [
      {
        approvalId: "APR-10011",
        level: "Compliance Review",
        approver: "Lina Al-Otaibi",
        role: "FWA Investigation Manager",
        status: "Approved",
        date: "2026-07-29",
        comments:
          "Recovery supported by preliminary audit findings.",
      },
      {
        approvalId: "APR-10012",
        level: "Executive Approval",
        approver: "Pending Assignment",
        role: "Chief Financial Officer",
        status: "Pending",
        date: "",
        comments:
          "Awaiting executive approval.",
      },
    ],

    adjustments: [
      {
        adjustmentId: "ADJ-10006",
        type: "Recovery",
        reason:
          "Suspected overpayment caused by upcoding and unsupported services.",
        amount: -286400,
        date: "2026-07-29",
        status: "Pending",
      },
    ],

    ledgerEntries: [
      {
        ledgerId: "LED-10015",
        date: "2026-07-29",
        transactionType: "Recovery",
        reference: "REC-NCC-2026-0729",
        debit: 0,
        credit: 286400,
        runningBalance: -286400,
        description:
          "Post-payment recovery receivable recorded.",
      },
    ],

    aiInsights: [
      {
        insightId: "PAY-AI-10009",
        title: "High Recovery Confidence",
        category: "Fraud Risk",
        description:
          "The recovery amount is supported by statistically significant upcoding and unsupported service patterns.",
        riskLevel: "High",
        confidence: 95,
        recommendation:
          "Complete executive approval and initiate formal recovery.",
      },
      {
        insightId: "PAY-AI-10010",
        title: "Provider Solvency Watch",
        category: "Cash Flow",
        description:
          "The recovery value is material relative to the provider's recent monthly reimbursements.",
        riskLevel: "High",
        confidence: 88,
        recommendation:
          "Consider a structured recovery schedule to reduce collection risk.",
      },
    ],

    timeline: [
      {
        eventId: "PAY-EVT-10016",
        date: "2026-07-19",
        event: "Provider Suspended",
        description:
          "Provider network participation suspended.",
        actor: "Provider Compliance Committee",
        status: "Escalated",
      },
      {
        eventId: "PAY-EVT-10017",
        date: "2026-07-29",
        event: "Recovery Calculated",
        description:
          "Preliminary recovery amount calculated from audited claims.",
        actor: "FWA Investigation Team",
        status: "Completed",
      },
      {
        eventId: "PAY-EVT-10018",
        date: "2026-07-29",
        event: "Executive Approval Pending",
        description:
          "Recovery awaits Chief Financial Officer approval.",
        actor: "Finance Governance Workflow",
        status: "Pending",
      },
    ],
  },
];

export const getPaymentById = (
  paymentId: string,
): Payment | undefined => {
  const normalizedPaymentId = paymentId
    .trim()
    .toLowerCase();

  return paymentDemoData.find(
    (payment) =>
      payment.paymentId.toLowerCase() ===
      normalizedPaymentId,
  );
};

export const getPaymentDashboardMetrics = () => {
  const totalPayments = paymentDemoData.length;

  const paidPayments = paymentDemoData.filter(
    (payment) => payment.status === "Paid",
  ).length;

  const scheduledPayments = paymentDemoData.filter(
    (payment) => payment.status === "Scheduled",
  ).length;

  const processingPayments = paymentDemoData.filter(
    (payment) => payment.status === "Processing",
  ).length;

  const failedPayments = paymentDemoData.filter(
    (payment) => payment.status === "Failed",
  ).length;

  const onHoldPayments = paymentDemoData.filter(
    (payment) => payment.status === "On Hold",
  ).length;

  const pendingApprovals = paymentDemoData.filter(
    (payment) =>
      payment.approvalStatus === "Pending" ||
      payment.approvalStatus === "Escalated",
  ).length;

  const reconciliationExceptions =
    paymentDemoData.filter(
      (payment) =>
        payment.reconciliationStatus ===
          "Exception" ||
        payment.reconciliationStatus ===
          "Unmatched",
    ).length;

  const aiRiskAlerts = paymentDemoData.filter(
    (payment) =>
      payment.aiRiskLevel === "High" ||
      payment.aiRiskLevel === "Critical",
  ).length;

  const totalGrossAmount = paymentDemoData.reduce(
    (total, payment) =>
      total + payment.grossAmount,
    0,
  );

  const totalNetAmount = paymentDemoData.reduce(
    (total, payment) =>
      total + payment.netAmount,
    0,
  );

  const totalPaidAmount = paymentDemoData
    .filter((payment) => payment.status === "Paid")
    .reduce(
      (total, payment) =>
        total + payment.netAmount,
      0,
    );

  const outstandingLiability = paymentDemoData
    .filter(
      (payment) =>
        payment.status !== "Paid" &&
        payment.status !== "Cancelled",
    )
    .reduce(
      (total, payment) =>
        total + Math.max(payment.netAmount, 0),
      0,
    );

  const recoveryAmount = paymentDemoData
    .filter(
      (payment) =>
        payment.category === "Recovery",
    )
    .reduce(
      (total, payment) =>
        total + Math.abs(payment.netAmount),
      0,
    );

  return {
    totalPayments,
    paidPayments,
    scheduledPayments,
    processingPayments,
    failedPayments,
    onHoldPayments,
    pendingApprovals,
    reconciliationExceptions,
    aiRiskAlerts,
    totalGrossAmount,
    totalNetAmount,
    totalPaidAmount,
    outstandingLiability,
    recoveryAmount,
  };
};