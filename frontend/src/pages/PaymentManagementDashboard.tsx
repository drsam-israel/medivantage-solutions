import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  AccountBalanceWalletOutlined,
  AddCardOutlined,
  AnalyticsOutlined,
  AssignmentTurnedInOutlined,
  AutorenewOutlined,
  ErrorOutlineOutlined,
  FilterAltOffOutlined,
  HourglassTopOutlined,
  PaidOutlined,
  PaymentsOutlined,
  PendingActionsOutlined,
  PriceCheckOutlined,
  ReceiptLongOutlined,
  ReplayOutlined,
  SearchOutlined,
  VisibilityOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import type {
  SelectChangeEvent,
} from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import {
  getReimbursements,
} from "../services/reimbursementsApi";

import {
  enrichReimbursements,
} from "../services/reimbursementEnrichment";

import {
  mapReimbursementToPayment,
} from "../adapters/reimbursementAdapter";

import type {
  ApprovalStatus,
  Payment,
  PaymentCategory,
  PaymentMethod,
  PaymentRiskLevel,
  PaymentStatus,
  ReconciliationStatus,
} from "../data/paymentDemoData";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  tone:
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral";
}

const toneStyles = {
  primary: {
    background: "rgba(21,101,192,0.08)",
    iconBackground: "rgba(21,101,192,0.13)",
    iconColour: "#1565C0",
  },
  success: {
    background: "rgba(46,125,50,0.08)",
    iconBackground: "rgba(46,125,50,0.13)",
    iconColour: "#2E7D32",
  },
  warning: {
    background: "rgba(237,108,2,0.08)",
    iconBackground: "rgba(237,108,2,0.13)",
    iconColour: "#ED6C02",
  },
  error: {
    background: "rgba(211,47,47,0.08)",
    iconBackground: "rgba(211,47,47,0.13)",
    iconColour: "#D32F2F",
  },
  info: {
    background: "rgba(2,136,209,0.08)",
    iconBackground: "rgba(2,136,209,0.13)",
    iconColour: "#0288D1",
  },
  neutral: {
    background: "rgba(69,90,100,0.08)",
    iconBackground: "rgba(69,90,100,0.13)",
    iconColour: "#455A64",
  },
} as const;

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: MetricCardProps) {
  const style = toneStyles[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 220px",
        minWidth: 220,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: style.background,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 0.75,
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.75,
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.5,
            background: style.iconBackground,
            color: style.iconColour,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPaymentStatusColour(
  status: PaymentStatus,
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" {
  switch (status) {
    case "Paid":
      return "success";
    case "Scheduled":
      return "info";
    case "Processing":
      return "warning";
    case "Failed":
    case "On Hold":
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
}

function getApprovalColour(
  status: ApprovalStatus,
):
  | "success"
  | "warning"
  | "error"
  | "default" {
  switch (status) {
    case "Approved":
      return "success";
    case "Pending":
    case "Escalated":
      return "warning";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
}

function getReconciliationColour(
  status: ReconciliationStatus,
):
  | "success"
  | "warning"
  | "error"
  | "default" {
  switch (status) {
    case "Reconciled":
      return "success";
    case "Pending":
      return "warning";
    case "Exception":
    case "Unmatched":
      return "error";
    default:
      return "default";
  }
}

function getRiskColour(
  risk: PaymentRiskLevel,
):
  | "success"
  | "warning"
  | "error"
  | "default" {
  switch (risk) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
    case "Critical":
      return "error";
    default:
      return "default";
  }
}

const paymentStatuses: Array<
  PaymentStatus | "All"
> = [
  "All",
  "Scheduled",
  "Processing",
  "Paid",
  "Failed",
  "On Hold",
  "Cancelled",
];

const paymentMethods: Array<
  PaymentMethod | "All"
> = [
  "All",
  "EFT",
  "Bank Transfer",
  "Cheque",
  "Virtual Card",
];

const paymentCategories: Array<
  PaymentCategory | "All"
> = [
  "All",
  "Provider Reimbursement",
  "Member Reimbursement",
  "Refund",
  "Adjustment",
  "Recovery",
];

const reconciliationStatuses: Array<
  ReconciliationStatus | "All"
> = [
  "All",
  "Reconciled",
  "Pending",
  "Exception",
  "Unmatched",
];

const approvalStatuses: Array<
  ApprovalStatus | "All"
> = [
  "All",
  "Approved",
  "Pending",
  "Rejected",
  "Escalated",
];

const riskLevels: Array<
  PaymentRiskLevel | "All"
> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

export default function PaymentManagementDashboard() {
  const navigate = useNavigate();

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [status, setStatus] =
    useState<PaymentStatus | "All">("All");

  const [method, setMethod] =
    useState<PaymentMethod | "All">("All");

  const [category, setCategory] =
    useState<PaymentCategory | "All">("All");

  const [
    reconciliationStatus,
    setReconciliationStatus,
  ] = useState<
    ReconciliationStatus | "All"
  >("All");

  const [approvalStatus, setApprovalStatus] =
    useState<ApprovalStatus | "All">("All");

  const [riskLevel, setRiskLevel] =
    useState<PaymentRiskLevel | "All">("All");

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const reimbursements =
        await getReimbursements();

      const enriched =
        await enrichReimbursements(
          reimbursements,
        );

      const mappedPayments =
        enriched.map(
          mapReimbursementToPayment,
        );

      setPayments(mappedPayments);
    } catch (error) {
      console.error(
        "Unable to load reimbursement payments:",
        error,
      );

      setPayments([]);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load live reimbursement and payment data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const metrics = useMemo(() => {
    const paidPayments =
      payments.filter(
        (payment) =>
          payment.status === "Paid",
      ).length;

    const scheduledPayments =
      payments.filter(
        (payment) =>
          payment.status === "Scheduled",
      ).length;

    const processingPayments =
      payments.filter(
        (payment) =>
          payment.status === "Processing",
      ).length;

    const failedPayments =
      payments.filter(
        (payment) =>
          payment.status === "Failed",
      ).length;

    const onHoldPayments =
      payments.filter(
        (payment) =>
          payment.status === "On Hold",
      ).length;

    const pendingApprovals =
      payments.filter(
        (payment) =>
          payment.approvalStatus === "Pending" ||
          payment.approvalStatus === "Escalated",
      ).length;

    const reconciliationExceptions =
      payments.filter(
        (payment) =>
          payment.reconciliationStatus ===
            "Exception" ||
          payment.reconciliationStatus ===
            "Unmatched",
      ).length;

    const aiRiskAlerts =
      payments.filter(
        (payment) =>
          payment.aiRiskLevel === "High" ||
          payment.aiRiskLevel === "Critical",
      ).length;

    const totalGrossAmount =
      payments.reduce(
        (total, payment) =>
          total + payment.grossAmount,
        0,
      );

    const totalNetAmount =
      payments.reduce(
        (total, payment) =>
          total + payment.netAmount,
        0,
      );

    const totalPaidAmount =
      payments
        .filter(
          (payment) =>
            payment.status === "Paid",
        )
        .reduce(
          (total, payment) =>
            total + payment.netAmount,
          0,
        );

    const outstandingLiability =
      payments
        .filter(
          (payment) =>
            payment.status !== "Paid" &&
            payment.status !== "Cancelled",
        )
        .reduce(
          (total, payment) =>
            total +
            Math.max(
              payment.netAmount,
              0,
            ),
          0,
        );

    const recoveryAmount =
      payments
        .filter(
          (payment) =>
            payment.category === "Recovery",
        )
        .reduce(
          (total, payment) =>
            total +
            Math.abs(
              payment.netAmount,
            ),
          0,
        );

    return {
      totalPayments:
        payments.length,
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
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return payments.filter(
      (payment) => {
        const searchableContent = [
          payment.paymentId,
          payment.paymentReference,
          payment.batchId,
          payment.invoiceNumber,
          payment.provider.providerName,
          payment.provider.providerId,
          payment.provider.providerType,
          payment.category,
          payment.status,
          payment.approvalStatus,
          payment.reconciliationStatus,
          payment.aiRiskLevel,
          ...payment.claims.flatMap(
            (claim) => [
              claim.claimId,
              claim.memberId,
              claim.memberName,
            ],
          ),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableContent.includes(
            normalizedSearch,
          );

        const matchesStatus =
          status === "All" ||
          payment.status === status;

        const matchesMethod =
          method === "All" ||
          payment.method === method;

        const matchesCategory =
          category === "All" ||
          payment.category === category;

        const matchesReconciliation =
          reconciliationStatus === "All" ||
          payment.reconciliationStatus ===
            reconciliationStatus;

        const matchesApproval =
          approvalStatus === "All" ||
          payment.approvalStatus ===
            approvalStatus;

        const matchesRisk =
          riskLevel === "All" ||
          payment.aiRiskLevel ===
            riskLevel;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesMethod &&
          matchesCategory &&
          matchesReconciliation &&
          matchesApproval &&
          matchesRisk
        );
      },
    );
  }, [
    payments,
    approvalStatus,
    category,
    method,
    reconciliationStatus,
    riskLevel,
    searchTerm,
    status,
  ]);

  const highRiskPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.aiRiskLevel === "High" ||
          payment.aiRiskLevel === "Critical",
      ),
    [payments],
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatus("All");
    setMethod("All");
    setCategory("All");
    setReconciliationStatus("All");
    setApprovalStatus("All");
    setRiskLevel("All");
  };

  const handleViewPayment = (
    paymentId: string,
  ) => {
    navigate(
      `/payments/${encodeURIComponent(
        paymentId,
      )}`,
    );
  };

  const handleStatusChange = (
    event: SelectChangeEvent,
  ) => {
    setStatus(
      event.target.value as
        | PaymentStatus
        | "All",
    );
  };

  const handleMethodChange = (
    event: SelectChangeEvent,
  ) => {
    setMethod(
      event.target.value as
        | PaymentMethod
        | "All",
    );
  };

  const handleCategoryChange = (
    event: SelectChangeEvent,
  ) => {
    setCategory(
      event.target.value as
        | PaymentCategory
        | "All",
    );
  };

  const handleReconciliationChange = (
    event: SelectChangeEvent,
  ) => {
    setReconciliationStatus(
      event.target.value as
        | ReconciliationStatus
        | "All",
    );
  };

  const handleApprovalChange = (
    event: SelectChangeEvent,
  ) => {
    setApprovalStatus(
      event.target.value as
        | ApprovalStatus
        | "All",
    );
  };

  const handleRiskChange = (
    event: SelectChangeEvent,
  ) => {
    setRiskLevel(
      event.target.value as
        | PaymentRiskLevel
        | "All",
    );
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="FINANCIAL OPERATIONS"
        title="Reimbursements & Payment Management"
        description="Manage provider reimbursements, member payments, approval workflows, banking execution, reconciliation, recoveries and AI-enabled financial risk intelligence."
        icon={<PaymentsOutlined />}
        context="MediVantage Financial Operations"
        updatedText="Updated moments ago"
        statusLabel="Live Financial Operations"
        statusTone="success"
        stats={[
          {
            label: "Paid Payments",
            value: metrics.paidPayments,
            icon: <PaidOutlined />,
            tone: "success",
          },
          {
            label: "Pending Approvals",
            value: metrics.pendingApprovals,
            icon: (
              <AssignmentTurnedInOutlined />
            ),
            tone: "warning",
          },
          {
            label:
              "Reconciliation Exceptions",
            value:
              metrics.reconciliationExceptions,
            icon: <ReplayOutlined />,
            tone: "error",
          },
          {
            label: "AI Risk Alerts",
            value: metrics.aiRiskAlerts,
            icon: <AnalyticsOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "Create Payment",
            icon: <AddCardOutlined />,
            onClick: () =>
              console.log(
                "Create payment workflow",
              ),
            prominent: true,
          },
          {
            label: "Refresh Payments",
            icon: <AutorenewOutlined />,
            onClick: () =>
              void loadPayments(),
            variant: "outlined",
          },
        ]}
      />

      {isLoading && (
        <LinearProgress sx={{ mt: 2 }} />
      )}

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: 3,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                void loadPayments()
              }
            >
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
        }}
      >
        <MetricCard
          title="Total Payments"
          value={metrics.totalPayments}
          subtitle="All live reimbursement transactions"
          icon={<PaymentsOutlined />}
          tone="primary"
        />

        <MetricCard
          title="Paid Payments"
          value={metrics.paidPayments}
          subtitle="Successfully settled"
          icon={<PaidOutlined />}
          tone="success"
        />

        <MetricCard
          title="Scheduled"
          value={metrics.scheduledPayments}
          subtitle="Approved and awaiting execution"
          icon={<PendingActionsOutlined />}
          tone="info"
        />

        <MetricCard
          title="Processing"
          value={metrics.processingPayments}
          subtitle="Currently in payment workflow"
          icon={<HourglassTopOutlined />}
          tone="warning"
        />

        <MetricCard
          title="Failed Payments"
          value={metrics.failedPayments}
          subtitle="Requires exception review"
          icon={<ErrorOutlineOutlined />}
          tone="error"
        />

        <MetricCard
          title="On Hold"
          value={metrics.onHoldPayments}
          subtitle="Blocked by risk or compliance"
          icon={<WarningAmberOutlined />}
          tone="error"
        />

        <MetricCard
          title="Pending Approvals"
          value={metrics.pendingApprovals}
          subtitle="Awaiting governance decision"
          icon={
            <AssignmentTurnedInOutlined />
          }
          tone="warning"
        />

        <MetricCard
          title="Reconciliation Exceptions"
          value={
            metrics.reconciliationExceptions
          }
          subtitle="Unmatched or exception items"
          icon={<ReplayOutlined />}
          tone="error"
        />

        <MetricCard
          title="Total Paid Amount"
          value={formatCurrency(
            metrics.totalPaidAmount,
          )}
          subtitle="Successfully settled value"
          icon={<PriceCheckOutlined />}
          tone="success"
        />

        <MetricCard
          title="Outstanding Liability"
          value={formatCurrency(
            metrics.outstandingLiability,
          )}
          subtitle="Approved but unpaid exposure"
          icon={
            <AccountBalanceWalletOutlined />
          }
          tone="warning"
        />

        <MetricCard
          title="Recovery Amount"
          value={formatCurrency(
            metrics.recoveryAmount,
          )}
          subtitle="Post-payment recoveries"
          icon={<ReceiptLongOutlined />}
          tone="info"
        />

        <MetricCard
          title="AI Risk Alerts"
          value={metrics.aiRiskAlerts}
          subtitle="High and critical payments"
          icon={<AnalyticsOutlined />}
          tone="error"
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2}
          sx={{
            mb: 2.5,
            justifyContent:
              "space-between",
            alignItems: {
              xs: "stretch",
              lg: "center",
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              Payment Registry
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              Search and review live reimbursements,
              approvals, settlement status,
              reconciliation and payment risk.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              <FilterAltOffOutlined />
            }
            onClick={clearFilters}
            sx={{
              minHeight: 40,
              whiteSpace: "nowrap",
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Clear Filters
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            placeholder="Search payment, reimbursement, provider, claim or member"
            sx={{
              flex: "2 1 320px",
              minWidth: 280,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              flex: "1 1 160px",
              minWidth: 150,
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={
                handleStatusChange
              }
            >
              {paymentStatuses.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: "1 1 170px",
              minWidth: 160,
            }}
          >
            <InputLabel>Method</InputLabel>
            <Select
              value={method}
              label="Method"
              onChange={
                handleMethodChange
              }
            >
              {paymentMethods.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: "1 1 210px",
              minWidth: 200,
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={
                handleCategoryChange
              }
            >
              {paymentCategories.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: "1 1 200px",
              minWidth: 190,
            }}
          >
            <InputLabel>
              Reconciliation
            </InputLabel>
            <Select
              value={
                reconciliationStatus
              }
              label="Reconciliation"
              onChange={
                handleReconciliationChange
              }
            >
              {reconciliationStatuses.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: "1 1 170px",
              minWidth: 160,
            }}
          >
            <InputLabel>
              Approval
            </InputLabel>
            <Select
              value={approvalStatus}
              label="Approval"
              onChange={
                handleApprovalChange
              }
            >
              {approvalStatuses.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: "1 1 150px",
              minWidth: 140,
            }}
          >
            <InputLabel>
              AI Risk
            </InputLabel>
            <Select
              value={riskLevel}
              label="AI Risk"
              onChange={
                handleRiskChange
              }
            >
              {riskLevels.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {highRiskPayments.length > 0 && (
        <Alert
          severity="warning"
          sx={{
            mt: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 900 }}
          >
            Payment risk surveillance:
          </Typography>{" "}
          {highRiskPayments.length} payment
          {highRiskPayments.length === 1
            ? " has"
            : "s have"}{" "}
          high or critical AI risk classification
          requiring finance or compliance review.
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 900 }}
          >
            Payment Results
          </Typography>

          <Chip
            label={`${filteredPayments.length} payment${
              filteredPayments.length === 1
                ? ""
                : "s"
            }`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <TableContainer>
          <Table
            sx={{ minWidth: 1600 }}
            aria-label="Payment registry"
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "#F8FAFC",
                  "& th": {
                    color:
                      "text.secondary",
                    fontSize: 12,
                    fontWeight: 900,
                    textTransform:
                      "uppercase",
                    letterSpacing: 0.4,
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell>
                  Payment
                </TableCell>
                <TableCell>
                  Provider
                </TableCell>
                <TableCell>
                  Linked Claim
                </TableCell>
                <TableCell>
                  Category
                </TableCell>
                <TableCell>
                  Method
                </TableCell>
                <TableCell>
                  Scheduled
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Approval
                </TableCell>
                <TableCell>
                  Reconciliation
                </TableCell>
                <TableCell align="right">
                  Gross
                </TableCell>
                <TableCell align="right">
                  Net
                </TableCell>
                <TableCell>
                  AI Risk
                </TableCell>
                <TableCell align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPayments.map(
                (payment) => {
                  const linkedClaim =
                    payment.claims[0];

                  return (
                    <TableRow
                      key={
                        payment.paymentId
                      }
                      hover
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "primary.main",
                            fontWeight: 900,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {
                            payment
                              .invoiceNumber
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color:
                              "text.secondary",
                          }}
                        >
                          {
                            payment
                              .paymentReference
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {
                            payment
                              .provider
                              .providerName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color:
                              "text.secondary",
                          }}
                        >
                          {
                            payment
                              .provider
                              .providerId
                          }{" "}
                          ·{" "}
                          {
                            payment
                              .provider
                              .providerType
                          }
                        </Typography>

                        <Chip
                          label={
                            payment
                              .provider
                              .networkTier
                          }
                          size="small"
                          variant="outlined"
                          sx={{
                            mt: 0.75,
                            height: 22,
                            fontSize: 11,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {linkedClaim
                            ?.claimId ??
                            "Not available"}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color:
                              "text.secondary",
                          }}
                        >
                          {linkedClaim
                            ?.memberName ??
                            "Member unavailable"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {payment.category}
                      </TableCell>

                      <TableCell>
                        {payment.method}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          payment.scheduledDate,
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            payment.status
                          }
                          size="small"
                          color={getPaymentStatusColour(
                            payment.status,
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            payment
                              .approvalStatus
                          }
                          size="small"
                          color={getApprovalColour(
                            payment.approvalStatus,
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            payment
                              .reconciliationStatus
                          }
                          size="small"
                          color={getReconciliationColour(
                            payment.reconciliationStatus,
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatCurrency(
                            payment.grossAmount,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 900,
                            whiteSpace:
                              "nowrap",
                            color:
                              payment.netAmount <
                              0
                                ? "error.main"
                                : "text.primary",
                          }}
                        >
                          {formatCurrency(
                            payment.netAmount,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            payment
                              .aiRiskLevel
                          }
                          size="small"
                          color={getRiskColour(
                            payment.aiRiskLevel,
                          )}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={
                            <VisibilityOutlined />
                          }
                          onClick={() =>
                            handleViewPayment(
                              payment.paymentId,
                            )
                          }
                          sx={{
                            boxShadow:
                              "none",
                            whiteSpace:
                              "nowrap",
                            textTransform:
                              "none",
                            fontWeight: 800,
                          }}
                        >
                          View 360
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}

              {!isLoading &&
                filteredPayments.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      sx={{
                        py: 7,
                        textAlign:
                          "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        No payments found
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.75,
                          color:
                            "text.secondary",
                        }}
                      >
                        {payments.length ===
                        0
                          ? "No live reimbursement records are currently available."
                          : "Adjust your search criteria or clear the active filters."}
                      </Typography>

                      {payments.length >
                        0 && (
                        <Button
                          variant="outlined"
                          startIcon={
                            <FilterAltOffOutlined />
                          }
                          onClick={
                            clearFilters
                          }
                          sx={{
                            mt: 2,
                            textTransform:
                              "none",
                            fontWeight: 800,
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Solutions™ Reimbursements & Payment
        Management · Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}