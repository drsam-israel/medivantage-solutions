import {
  CheckCircleOutlined,
  GavelOutlined,
  PauseCircleOutlined,
  PersonOutlined,
  SendOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type DecisionType = "Approve" | "Reject" | "Pend";

interface DecisionRecord {
  decision: DecisionType;
  reason: string;
  reviewer: string;
  timestamp: string;
  paymentAuthorized: boolean;
}

const decisionReasons: Record<DecisionType, string[]> = {
  Approve: [
    "Clinical and policy requirements satisfied",
    "Medical necessity confirmed",
    "Coverage and benefit validation passed",
    "Manual review completed",
  ],
  Reject: [
    "Service not covered under policy",
    "Medical necessity not established",
    "Duplicate claim confirmed",
    "Required documentation not provided",
  ],
  Pend: [
    "Additional clinical documents required",
    "Provider clarification required",
    "Medical director review required",
    "Benefit verification incomplete",
  ],
};

export default function ClaimDecisionWorkflow() {
  const [decision, setDecision] = useState<DecisionType>("Approve");
  const [reason, setReason] = useState(decisionReasons.Approve[0]);
  const [comments, setComments] = useState("");
  const [humanOversightConfirmed, setHumanOversightConfirmed] =
    useState(false);
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);
  const [decisionRecord, setDecisionRecord] =
    useState<DecisionRecord | null>(null);

  const selectDecision = (nextDecision: DecisionType) => {
    setDecision(nextDecision);
    setReason(decisionReasons[nextDecision][0]);

    if (nextDecision !== "Approve") {
      setPaymentAuthorized(false);
    }
  };

  const submitDecision = () => {
    if (!humanOversightConfirmed || !comments.trim()) return;

    setDecisionRecord({
      decision,
      reason,
      reviewer: "Dr. Samuel Israel",
      timestamp: new Date().toLocaleString(),
      paymentAuthorized: decision === "Approve" && paymentAuthorized,
    });
  };

  useEffect(() => {
    const handleCommandDecision = (event: Event) => {
      const customEvent = event as CustomEvent<DecisionType>;

      if (
        customEvent.detail === "Approve" ||
        customEvent.detail === "Reject" ||
        customEvent.detail === "Pend"
      ) {
        selectDecision(customEvent.detail);
        setDecisionRecord(null);
      }
    };

    window.addEventListener(
      "medivantage-claim-decision",
      handleCommandDecision,
    );

    return () => {
      window.removeEventListener(
        "medivantage-claim-decision",
        handleCommandDecision,
      );
    };
  }, []);
  const decisionColor =
    decisionRecord?.decision === "Approve"
      ? "success"
      : decisionRecord?.decision === "Reject"
        ? "error"
        : "warning";

  return (
    <Paper id="claim-decision-workflow"
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
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
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
          <GavelOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Final Claim Decision
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Human-authorized approval, rejection or pending decision
            </Typography>
          </Box>
        </Box>

        <Chip
          label={
            decisionRecord
              ? `Decision: ${decisionRecord.decision}`
              : "Decision Pending"
          }
          color={decisionRecord ? decisionColor : "warning"}
          sx={{ fontWeight: 800 }}
        />
      </Box>

      <Divider />

      <Box sx={{ p: 2.5 }}>
        {decisionRecord && (
          <Alert
            severity={
              decisionRecord.decision === "Approve"
                ? "success"
                : decisionRecord.decision === "Reject"
                  ? "error"
                  : "warning"
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              Claim {decisionRecord.decision}d
            </Typography>

            <Typography variant="body2">
              Recorded by {decisionRecord.reviewer} on{" "}
              {decisionRecord.timestamp}.
            </Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(0, 1fr) minmax(320px, 0.7fr)",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
              Select Decision
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.25,
                mb: 2.5,
              }}
            >
              <Button
                variant={decision === "Approve" ? "contained" : "outlined"}
                color="success"
                startIcon={<CheckCircleOutlined />}
                onClick={() => selectDecision("Approve")}
                sx={{ fontWeight: 800, py: 1.2 }}
              >
                Approve
              </Button>

              <Button
                variant={decision === "Reject" ? "contained" : "outlined"}
                color="error"
                startIcon={<WarningAmberOutlined />}
                onClick={() => selectDecision("Reject")}
                sx={{ fontWeight: 800, py: 1.2 }}
              >
                Reject
              </Button>

              <Button
                variant={decision === "Pend" ? "contained" : "outlined"}
                color="warning"
                startIcon={<PauseCircleOutlined />}
                onClick={() => selectDecision("Pend")}
                sx={{ fontWeight: 800, py: 1.2 }}
              >
                Pend
              </Button>
            </Box>

            <TextField
              select
              fullWidth
              label="Decision Reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              sx={{ mb: 2 }}
            >
              {decisionReasons[decision].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Decision Rationale"
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Document the clinical, policy and financial basis for this decision..."
            />

            <FormControlLabel
              sx={{ mt: 1.5, alignItems: "flex-start" }}
              control={
                <Checkbox
                  checked={humanOversightConfirmed}
                  onChange={(event) =>
                    setHumanOversightConfirmed(event.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body2" sx={{ pt: 0.6 }}>
                  I confirm that I have independently reviewed the clinical,
                  policy, financial and AI-assisted findings.
                </Typography>
              }
            />

            {decision === "Approve" && (
              <FormControlLabel
                sx={{ display: "flex", alignItems: "flex-start" }}
                control={
                  <Checkbox
                    checked={paymentAuthorized}
                    onChange={(event) =>
                      setPaymentAuthorized(event.target.checked)
                    }
                  />
                }
                label={
                  <Typography variant="body2" sx={{ pt: 0.6 }}>
                    Authorize payment of SAR 16,300 after final operational
                    validation.
                  </Typography>
                }
              />
            )}

            <Button
              variant="contained"
              color={
                decision === "Approve"
                  ? "success"
                  : decision === "Reject"
                    ? "error"
                    : "warning"
              }
              startIcon={<SendOutlined />}
              onClick={submitDecision}
              disabled={!humanOversightConfirmed || !comments.trim()}
              sx={{ mt: 2, fontWeight: 900, px: 3, py: 1.2 }}
            >
              Confirm {decision} Decision
            </Button>
          </Box>

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
              <PersonOutlined color="primary" />

              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Decision Summary
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gap: 1.75 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Reviewer
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Dr. Samuel Israel
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Current Recommendation
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  MediVantage AI recommends approval
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Recommended Payment
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, color: "success.main" }}
                >
                  SAR 16,300
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Human Oversight
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Mandatory before finalization
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Decision Status
                </Typography>

                <Chip
                  label={decisionRecord ? decisionRecord.decision : "Pending"}
                  color={decisionRecord ? decisionColor : "warning"}
                  size="small"
                  sx={{ mt: 0.5, fontWeight: 800 }}
                />
              </Box>

              {decisionRecord && (
                <>
                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Recorded Reason
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {decisionRecord.reason}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Payment Authorization
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {decisionRecord.paymentAuthorized
                        ? "Authorized"
                        : "Not authorized"}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}