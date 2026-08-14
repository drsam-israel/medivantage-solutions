import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { ReactNode } from "react";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import {
  getReimbursement,
} from "../services/reimbursementsApi";

import {
  enrichReimbursement,
} from "../services/reimbursementEnrichment";

import {
  mapReimbursementToPayment,
} from "../adapters/reimbursementAdapter";

import type {
  ApprovalStatus,
  Payment,
  PaymentRiskLevel,
  PaymentStatus,
  ReconciliationStatus,
} from "../data/paymentDemoData";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
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

function getTimelineColour(
  status:
    | "Completed"
    | "Pending"
    | "Warning"
    | "Escalated",
):
  | "success"
  | "warning"
  | "error"
  | "default" {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
    case "Warning":
      return "warning";
    case "Escalated":
      return "error";
    default:
      return "default";
  }
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: SummaryCardProps) {
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 0.75,
              fontWeight: 900,
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              "rgba(21, 101, 192, 0.10)",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          mt: 0.45,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {typeof value === "string" ||
        typeof value === "number" ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            "rgba(21, 101, 192, 0.10)",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900 }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function PaymentDetails() {
  const navigate = useNavigate();

  const { paymentId } = useParams<{
    paymentId: string;
  }>();

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPayment = async () => {
      if (!paymentId) {
        if (isMounted) {
          setPayment(null);
          setLoadError(
            "Payment identifier is missing.",
          );
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const reimbursement =
          await getReimbursement(
            decodeURIComponent(paymentId),
          );

        const enriched =
          await enrichReimbursement(
            reimbursement,
          );

        const mappedPayment =
          mapReimbursementToPayment(
            enriched,
          );

        if (isMounted) {
          setPayment(mappedPayment);
        }
      } catch (error) {
        console.error(
          "Unable to load Payment 360:",
          error,
        );

        if (isMounted) {
          setPayment(null);
          setLoadError(
            "The requested reimbursement could not be loaded from the live payment registry.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentId]);

  if (isLoading) {
    return (
      <Box
        sx={{
          py: 8,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 900,
          }}
        >
          Loading Payment 360
        </Typography>

        <LinearProgress />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Resolving reimbursement, claim,
          member and provider information...
        </Typography>
      </Box>
    );
  }

  if (!payment) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert
          severity="error"
          sx={{
            maxWidth: 760,
            mx: "auto",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 900 }}
          >
            Payment could not be loaded
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
          >
            {loadError ??
              "The requested payment record could not be located in the live MediVantage payment registry."}
          </Typography>

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() =>
              navigate("/payments")
            }
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Return to Payments
          </Button>
        </Alert>
      </Box>
    );
  }

  const paymentProgress =
    payment.status === "Paid"
      ? 100
      : payment.status === "Processing"
        ? 75
        : payment.status === "Scheduled"
          ? 50
          : payment.status === "On Hold"
            ? 35
            : 20;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Button
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate("/payments")}
        sx={{
          mb: 2,
          fontWeight: 700,
        }}
      >
        Back to Payments
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0b3d66 0%, #145b8f 55%, #1781a6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "rgba(255, 255, 255, 0.07)",
            right: -70,
            top: -100,
          }}
        />

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box
            sx={{
              flex: "1 1 620px",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PaymentsOutlinedIcon />

              <Typography
                variant="overline"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                PAYMENT 360 · LIVE FINANCIAL RECORD
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                mt: 1.5,
                fontWeight: 900,
                lineHeight: 1.05,
              }}
            >
              {payment.invoiceNumber}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontWeight: 700,
              }}
            >
              {payment.provider.providerName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2.25,
              }}
            >
              <Chip
                label={payment.status}
                color={getPaymentStatusColour(
                  payment.status,
                )}
                sx={{ fontWeight: 900 }}
              />

              <Chip
                label={payment.approvalStatus}
                variant="outlined"
                sx={{
                  color: "common.white",
                  borderColor:
                    "rgba(255,255,255,0.55)",
                  fontWeight: 900,
                }}
              />

              <Chip
                label={
                  payment.reconciliationStatus
                }
                variant="outlined"
                sx={{
                  color: "common.white",
                  borderColor:
                    "rgba(255,255,255,0.55)",
                  fontWeight: 900,
                }}
              />

              <Chip
                label={`AI Risk: ${payment.aiRiskLevel}`}
                variant="outlined"
                sx={{
                  color: "common.white",
                  borderColor:
                    "rgba(255,255,255,0.55)",
                  fontWeight: 900,
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: "0 1 420px",
              minWidth: 300,
              p: 2.5,
              borderRadius: 3,
              backgroundColor:
                "rgba(255,255,255,0.10)",
              border:
                "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ opacity: 0.9 }}
            >
              Payment Progress
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.75,
                fontWeight: 900,
              }}
            >
              {paymentProgress}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={paymentProgress}
              sx={{
                mt: 1.5,
                height: 10,
                borderRadius: 10,
                backgroundColor:
                  "rgba(255,255,255,0.22)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 10,
                  backgroundColor:
                    "common.white",
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                opacity: 0.9,
              }}
            >
              {payment.paymentReference}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
        }}
      >
        <SummaryCard
          title="Gross Amount"
          value={formatCurrency(
            payment.grossAmount,
          )}
          subtitle="Original reimbursement amount"
          icon={<ReceiptLongOutlinedIcon />}
        />

        <SummaryCard
          title="Net Amount"
          value={formatCurrency(
            payment.netAmount,
          )}
          subtitle="Final payable amount"
          icon={<PriceCheckOutlinedIcon />}
        />

        <SummaryCard
          title="Approval"
          value={payment.approvalStatus}
          subtitle="Financial approval state"
          icon={
            <AssignmentTurnedInOutlinedIcon />
          }
        />

        <SummaryCard
          title="AI Risk"
          value={payment.aiRiskLevel}
          subtitle="Financial risk classification"
          icon={<InsightsOutlinedIcon />}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<PaymentsOutlinedIcon />}
          title="Payment Overview"
          subtitle="Core reimbursement and settlement information."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          <DetailItem
            label="Reimbursement Number"
            value={payment.invoiceNumber}
          />
          <DetailItem
            label="Payment Reference"
            value={payment.paymentReference}
          />
          <DetailItem
            label="Category"
            value={payment.category}
          />
          <DetailItem
            label="Payment Method"
            value={payment.method}
          />
          <DetailItem
            label="Invoice Date"
            value={formatDate(
              payment.invoiceDate,
            )}
          />
          <DetailItem
            label="Scheduled Date"
            value={formatDate(
              payment.scheduledDate,
            )}
          />
          <DetailItem
            label="Processing Date"
            value={formatDate(
              payment.processingDate,
            )}
          />
          <DetailItem
            label="Paid Date"
            value={formatDate(
              payment.paidDate,
            )}
          />
          <DetailItem
            label="Currency"
            value={payment.currency}
          />
          <DetailItem
            label="Batch ID"
            value={payment.batchId}
          />
          <DetailItem
            label="Remittance Advice"
            value={
              payment.remittanceAdviceNumber
            }
          />
          <DetailItem
            label="Payment Period"
            value={payment.paymentPeriod}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2.5,
            lineHeight: 1.7,
          }}
        >
          {payment.paymentDescription}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<AccountBalanceOutlinedIcon />}
          title="Provider Profile"
          subtitle="Resolved provider identity and network information."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          <DetailItem
            label="Provider"
            value={payment.provider.providerName}
          />
          <DetailItem
            label="Provider ID"
            value={payment.provider.providerId}
          />
          <DetailItem
            label="Provider Type"
            value={payment.provider.providerType}
          />
          <DetailItem
            label="Network Tier"
            value={payment.provider.networkTier}
          />
          <DetailItem
            label="City"
            value={payment.provider.city}
          />
          <DetailItem
            label="Tax Identification Number"
            value={
              payment.provider
                .taxIdentificationNumber
            }
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<AccountBalanceOutlinedIcon />}
          title="Banking Information"
          subtitle="Beneficiary and settlement details available to the current payment record."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          <DetailItem
            label="Bank Name"
            value={payment.bankDetails.bankName}
          />
          <DetailItem
            label="Account Name"
            value={
              payment.bankDetails.accountName
            }
          />
          <DetailItem
            label="Account Number"
            value={
              payment.bankDetails
                .maskedAccountNumber
            }
          />
          <DetailItem
            label="IBAN"
            value={payment.bankDetails.iban}
          />
          <DetailItem
            label="SWIFT Code"
            value={
              payment.bankDetails.swiftCode
            }
          />
          <DetailItem
            label="Beneficiary Reference"
            value={
              payment.bankDetails
                .beneficiaryReference
            }
          />
          <DetailItem
            label="Verification Status"
            value={
              <Chip
                label={
                  payment.bankDetails
                    .verificationStatus
                }
                size="small"
                color={
                  payment.bankDetails
                    .verificationStatus ===
                  "Verified"
                    ? "success"
                    : payment.bankDetails
                          .verificationStatus ===
                        "Failed"
                      ? "error"
                      : "warning"
                }
              />
            }
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<DescriptionOutlinedIcon />}
          title="Linked Claims"
          subtitle="Claims included in this reimbursement or recovery."
        />

        {payment.claims.length === 0 ? (
          <Alert severity="info">
            No linked claim data is available.
          </Alert>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Claim
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Member
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Service Date
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800 }}
                  >
                    Claim Amount
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800 }}
                  >
                    Approved
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800 }}
                  >
                    Deductible
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800 }}
                  >
                    Coinsurance
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800 }}
                  >
                    Provider Payable
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {payment.claims.map((claim) => (
                  <TableRow
                    key={claim.claimId}
                    hover
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 900 }}
                      >
                        {claim.claimId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 800 }}
                      >
                        {claim.memberName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {claim.memberId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        claim.serviceDate,
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        claim.claimAmount,
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        claim.approvedAmount,
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        claim.deductibleAmount,
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        claim.coinsuranceAmount,
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 900 }}
                      >
                        {formatCurrency(
                          claim.providerPayableAmount,
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={claim.claimStatus}
                        size="small"
                        color={
                          claim.claimStatus ===
                          "Approved"
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={
            <AssignmentTurnedInOutlinedIcon />
          }
          title="Approval Workflow"
          subtitle="Financial and compliance approval history."
        />

        {payment.approvals.length === 0 ? (
          <Alert severity="info">
            No approval history is available.
          </Alert>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Level
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Approver
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Comments
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {payment.approvals.map(
                  (approval) => (
                    <TableRow
                      key={approval.approvalId}
                      hover
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                        >
                          {approval.level}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {approval.approvalId}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {approval.approver}
                      </TableCell>
                      <TableCell>
                        {approval.role}
                      </TableCell>
                      <TableCell>
                        {formatDate(
                          approval.date,
                        )}
                      </TableCell>
                      <TableCell>
                        {approval.comments}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.status}
                          size="small"
                          color={getApprovalColour(
                            approval.status,
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 3,
          mt: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: "1 1 500px",
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SectionHeader
            icon={<ReplayOutlinedIcon />}
            title="Adjustments & Recoveries"
          />

          {payment.adjustments.length === 0 ? (
            <Alert severity="info">
              No financial adjustments are linked
              to this payment.
            </Alert>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {payment.adjustments.map(
                (adjustment) => (
                  <Box
                    key={
                      adjustment.adjustmentId
                    }
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor:
                        "rgba(15, 76, 117, 0.04)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 900 }}
                        >
                          {adjustment.type}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            adjustment.adjustmentId
                          }{" "}
                          ·{" "}
                          {formatDate(
                            adjustment.date,
                          )}
                        </Typography>
                      </Box>

                      <Chip
                        label={adjustment.status}
                        size="small"
                        color={
                          adjustment.status ===
                          "Applied"
                            ? "success"
                            : adjustment.status ===
                                "Rejected"
                              ? "error"
                              : "warning"
                        }
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1.25,
                        lineHeight: 1.6,
                      }}
                    >
                      {adjustment.reason}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1.25,
                        fontWeight: 900,
                        color:
                          adjustment.amount < 0
                            ? "error.main"
                            : "success.main",
                      }}
                    >
                      {formatCurrency(
                        adjustment.amount,
                      )}
                    </Typography>
                  </Box>
                ),
              )}
            </Box>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: "1 1 500px",
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SectionHeader
            icon={<ReplayOutlinedIcon />}
            title="Reconciliation Summary"
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.25,
            }}
          >
            <DetailItem
              label="Reconciliation Status"
              value={
                <Chip
                  label={
                    payment.reconciliationStatus
                  }
                  size="small"
                  color={getReconciliationColour(
                    payment.reconciliationStatus,
                  )}
                />
              }
            />

            <DetailItem
              label="Payment Status"
              value={
                <Chip
                  label={payment.status}
                  size="small"
                  color={getPaymentStatusColour(
                    payment.status,
                  )}
                />
              }
            />

            <DetailItem
              label="Gross Amount"
              value={formatCurrency(
                payment.grossAmount,
              )}
            />

            <DetailItem
              label="Adjustments"
              value={formatCurrency(
                payment.adjustmentsTotal,
              )}
            />

            <DetailItem
              label="Withholding Tax"
              value={formatCurrency(
                payment.withholdingTax,
              )}
            />

            <DetailItem
              label="Bank Charges"
              value={formatCurrency(
                payment.bankCharges,
              )}
            />

            <DetailItem
              label="Final Net Amount"
              value={formatCurrency(
                payment.netAmount,
              )}
            />
          </Box>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={
            <AccountBalanceWalletOutlinedIcon />
          }
          title="Payment Ledger"
          subtitle="Financial postings and running balance."
        />

        <TableContainer>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  Transaction
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  Reference
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  Description
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800 }}
                >
                  Debit
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800 }}
                >
                  Credit
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800 }}
                >
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payment.ledgerEntries.map(
                (entry) => (
                  <TableRow
                    key={entry.ledgerId}
                    hover
                  >
                    <TableCell>
                      {formatDate(entry.date)}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 800 }}
                      >
                        {entry.transactionType}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {entry.reference}
                    </TableCell>

                    <TableCell>
                      {entry.description}
                    </TableCell>

                    <TableCell align="right">
                      {entry.debit
                        ? formatCurrency(
                            entry.debit,
                          )
                        : "—"}
                    </TableCell>

                    <TableCell align="right">
                      {entry.credit
                        ? formatCurrency(
                            entry.credit,
                          )
                        : "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 900,
                          color:
                            entry.runningBalance < 0
                              ? "error.main"
                              : "text.primary",
                        }}
                      >
                        {formatCurrency(
                          entry.runningBalance,
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<InsightsOutlinedIcon />}
          title="AI Payment Intelligence"
          subtitle="Payment anomalies, fraud indicators and financial recommendations."
        />

        {payment.aiInsights.length === 0 ? (
          <Alert severity="info">
            No AI payment insights are available.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {payment.aiInsights.map((insight) => (
              <Box
                key={insight.insightId}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor:
                    insight.riskLevel === "High" ||
                    insight.riskLevel === "Critical"
                      ? "error.light"
                      : insight.riskLevel ===
                          "Medium"
                        ? "warning.light"
                        : "divider",
                  backgroundColor:
                    insight.riskLevel === "High" ||
                    insight.riskLevel === "Critical"
                      ? "rgba(211, 47, 47, 0.04)"
                      : insight.riskLevel ===
                          "Medium"
                        ? "rgba(237, 108, 2, 0.04)"
                        : "rgba(46, 125, 50, 0.04)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900 }}
                    >
                      {insight.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {insight.category} ·{" "}
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>

                  <Chip
                    label={insight.riskLevel}
                    size="small"
                    color={getRiskColour(
                      insight.riskLevel,
                    )}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1.5,
                    lineHeight: 1.7,
                  }}
                >
                  {insight.description}
                </Typography>

                <Divider sx={{ my: 1.75 }} />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  RECOMMENDATION
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    lineHeight: 1.65,
                  }}
                >
                  {insight.recommendation}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionHeader
          icon={<TimelineOutlinedIcon />}
          title="Payment Timeline"
          subtitle="Approval, settlement, reconciliation and exception activity."
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {payment.timeline.map(
            (event, index) => (
              <Box
                key={event.eventId}
                sx={{
                  display: "flex",
                  gap: 2,
                  position: "relative",
                  pb:
                    index ===
                    payment.timeline.length - 1
                      ? 0
                      : 3,
                }}
              >
                {index !==
                  payment.timeline.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 19,
                      top: 40,
                      bottom: 0,
                      width: 2,
                      backgroundColor: "divider",
                    }}
                  />
                )}

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      event.status === "Completed"
                        ? "rgba(46, 125, 50, 0.12)"
                        : event.status ===
                            "Escalated"
                          ? "rgba(211, 47, 47, 0.12)"
                          : "rgba(237, 108, 2, 0.12)",
                    color:
                      event.status === "Completed"
                        ? "success.main"
                        : event.status ===
                            "Escalated"
                          ? "error.main"
                          : "warning.main",
                    zIndex: 1,
                  }}
                >
                  {event.status === "Completed" ? (
                    <CheckCircleOutlinedIcon fontSize="small" />
                  ) : event.status ===
                    "Escalated" ? (
                    <ErrorOutlineOutlinedIcon fontSize="small" />
                  ) : event.status ===
                    "Warning" ? (
                    <WarningAmberOutlinedIcon fontSize="small" />
                  ) : (
                    <PendingActionsOutlinedIcon fontSize="small" />
                  )}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor:
                      "rgba(15, 76, 117, 0.035)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 900 }}
                      >
                        {event.event}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(event.date)} ·{" "}
                        {event.actor}
                      </Typography>
                    </Box>

                    <Chip
                      label={event.status}
                      size="small"
                      color={getTimelineColour(
                        event.status,
                      )}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      lineHeight: 1.65,
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              </Box>
            ),
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatNumber(payment.claims.length)} linked
          claim
          {payment.claims.length === 1 ? "" : "s"} ·{" "}
          {formatNumber(
            payment.ledgerEntries.length,
          )}{" "}
          ledger entries
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "right" }}
        >
          MediVantage Payment 360 · Designed &
          Developed by Dr. Samuel Israel
        </Typography>
      </Box>
    </Box>
  );
}