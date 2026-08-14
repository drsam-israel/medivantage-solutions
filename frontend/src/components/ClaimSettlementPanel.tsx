import {
  AccountBalanceOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  LockOutlined,
  PaymentsOutlined,
  ReceiptLongOutlined,
  ScheduleOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type SettlementStatus =
  | "Ready for Authorization"
  | "Authorized"
  | "Processing"
  | "Settled";

const paymentMethods = [
  "Electronic Fund Transfer",
  "Provider Account Credit",
  "Bank Transfer",
];

export default function ClaimSettlementPanel() {
  const [paymentMethod, setPaymentMethod] = useState(
    "Electronic Fund Transfer",
  );
  const [authorizationConfirmed, setAuthorizationConfirmed] =
    useState(false);
  const [status, setStatus] = useState<SettlementStatus>(
    "Ready for Authorization",
  );
  const [progress, setProgress] = useState(25);

  const authorizePayment = () => {
    if (!authorizationConfirmed) return;

    setStatus("Authorized");
    setProgress(50);
  };

  const processPayment = () => {
    setStatus("Processing");
    setProgress(75);
  };

  const completeSettlement = () => {
    setStatus("Settled");
    setProgress(100);
  };

  const statusColor =
    status === "Settled"
      ? "success"
      : status === "Processing"
        ? "primary"
        : status === "Authorized"
          ? "info"
          : "warning";

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <PaymentsOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Claim Settlement and Payment
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Final payment authorization and provider settlement
            </Typography>
          </Box>
        </Box>

        <Chip
          label={status}
          color={statusColor}
          sx={{ fontWeight: 800 }}
        />
      </Box>

      <Divider />

      <Box sx={{ p: 2.5 }}>
        {status === "Settled" && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              Claim settlement completed
            </Typography>

            <Typography variant="body2">
              The approved provider payment has been recorded successfully.
            </Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              Settlement Breakdown
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
                mb: 3,
              }}
            >
              {[
                {
                  label: "Submitted Claim Amount",
                  value: "SAR 18,500",
                },
                {
                  label: "Covered Amount",
                  value: "SAR 17,250",
                },
                {
                  label: "Member Responsibility",
                  value: "SAR 950",
                },
                {
                  label: "Approved Provider Payment",
                  value: "SAR 16,300",
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      mt: 0.5,
                      color:
                        item.label === "Approved Provider Payment"
                          ? "success.main"
                          : "text.primary",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <TextField
              select
              fullWidth
              label="Payment Method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              disabled={status === "Settled"}
              sx={{ mb: 2 }}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>
                Payment Destination
              </Typography>

              <Box sx={{ display: "grid", gap: 1.25 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Provider
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    Al Noor Specialist Hospital
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Provider Account
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    PRV-ACC-009821
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Remittance Reference
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    REM-2026-10471
                  </Typography>
                </Box>
              </Box>
            </Box>

            <FormControlLabel
              sx={{ alignItems: "flex-start" }}
              control={
                <Checkbox
                  checked={authorizationConfirmed}
                  disabled={status !== "Ready for Authorization"}
                  onChange={(event) =>
                    setAuthorizationConfirmed(event.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2" sx={{ pt: 0.6 }}>
                  I confirm that the claim decision, payment amount, provider
                  account and remittance details have been independently
                  verified.
                </Typography>
              }
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
              }}
            >
              {status === "Ready for Authorization" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<LockOutlined />}
                  disabled={!authorizationConfirmed}
                  onClick={authorizePayment}
                  sx={{ fontWeight: 900 }}
                >
                  Authorize Payment
                </Button>
              )}

              {status === "Authorized" && (
                <Button
                  variant="contained"
                  startIcon={<SendOutlined />}
                  onClick={processPayment}
                  sx={{ fontWeight: 900 }}
                >
                  Send for Processing
                </Button>
              )}

              {status === "Processing" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleOutlined />}
                  onClick={completeSettlement}
                  sx={{ fontWeight: 900 }}
                >
                  Complete Settlement
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<DownloadOutlined />}
                sx={{ fontWeight: 800 }}
              >
                Download Remittance
              </Button>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2.25,
                bgcolor: "background.default",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <AccountBalanceOutlined color="primary" />

                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Settlement Status
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Payment Progress
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900, color: "primary.main" }}
                >
                  {progress}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 10,
                  mb: 2.5,
                }}
              />

              <Box sx={{ display: "grid", gap: 1.75 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Settlement Status
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    {status}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Payment Method
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    {paymentMethod}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Settlement SLA
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    Within 2 business days
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Payment Currency
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    Saudi Riyal
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Authorization Owner
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    Dr. Samuel Israel
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <ScheduleOutlined color="primary" />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                    Expected Settlement
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.4 }}
                  >
                    23 Jul 2026
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "success.light",
                borderRadius: 2,
                p: 2.25,
                mt: 2,
                bgcolor: "success.50",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <ReceiptLongOutlined color="success" />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                    Remittance Integrity
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mt: 0.5,
                      lineHeight: 1.7,
                    }}
                  >
                    Payment values match the approved claim decision and
                    financial adjudication record. The settlement remains fully
                    traceable through the claim audit trail.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}