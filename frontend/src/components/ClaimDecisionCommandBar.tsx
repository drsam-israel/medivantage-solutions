import {
  CheckCircleOutlined,
  DownloadOutlined,
  GavelOutlined,
  PauseCircleOutlined,
  PriorityHighOutlined,
  UploadFileOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

type DecisionType = "Approve" | "Reject" | "Pend";

function openDecisionWorkflow(decision: DecisionType) {
  window.dispatchEvent(
    new CustomEvent<DecisionType>("medivantage-claim-decision", {
      detail: decision,
    }),
  );

  window.setTimeout(() => {
    document
      .getElementById("claim-decision-workflow")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

export default function ClaimDecisionCommandBar() {
  const [statusMessage, setStatusMessage] = useState(
    "Awaiting final human authorization",
  );

  const handleDecision = (decision: DecisionType) => {
    setStatusMessage(`${decision} decision selected for final review`);
    openDecisionWorkflow(decision);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        position: "sticky",
        top: 72,
        zIndex: 10,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: {
            xs: "flex-start",
            lg: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            lg: "row",
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
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
            }}
          >
            <GavelOutlined />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              Claim Decision Command Bar
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {statusMessage}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            label="AI Recommendation: Approve"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />

          <Chip
            label="Payment: SAR 16,300"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />

          <Chip
            label="Human Review Required"
            color="warning"
            sx={{ fontWeight: 800 }}
          />
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            xl: "center",
          },
          flexDirection: {
            xs: "column",
            xl: "row",
          },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlined />}
            onClick={() => handleDecision("Approve")}
            sx={{ fontWeight: 900 }}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<WarningAmberOutlined />}
            onClick={() => handleDecision("Reject")}
            sx={{ fontWeight: 900 }}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={<PauseCircleOutlined />}
            onClick={() => handleDecision("Pend")}
            sx={{ fontWeight: 900 }}
          >
            Pend
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<UploadFileOutlined />}
            onClick={() =>
              setStatusMessage(
                "Supporting-document request prepared for provider",
              )
            }
            sx={{ fontWeight: 800 }}
          >
            Request Documents
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<PriorityHighOutlined />}
            onClick={() =>
              setStatusMessage(
                "Claim escalated to medical director for urgent review",
              )
            }
            sx={{ fontWeight: 800 }}
          >
            Escalate
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadOutlined />}
            onClick={() =>
              setStatusMessage("Claim decision summary prepared for export")
            }
            sx={{ fontWeight: 800 }}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}