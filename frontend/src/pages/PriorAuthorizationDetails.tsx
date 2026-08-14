import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowBackOutlined,
  AssignmentOutlined,
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  GavelOutlined,
  LocalHospitalOutlined,
  PersonOutlined,
  PsychologyOutlined,
  ScheduleOutlined,
  ShieldOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getPriorAuthorization,
  submitPriorAuthorizationDecision,
} from "../services/priorAuthorizationsApi";

import {
  enrichPriorAuthorization,
  getMemberDisplayName,
  getProviderDisplayName,
} from "../services/priorAuthorizationEnrichment";

import type {
  EnrichedPriorAuthorization,
} from "../services/priorAuthorizationEnrichment";

import type {
  PriorAuthorization,
  PriorAuthorizationDecisionAction,
  PriorAuthorizationDecisionRequest,
} from "../types/priorAuthorization";

type DecisionUiAction =
  | "APPROVE"
  | "REQUEST_MORE_INFORMATION"
  | "ESCALATE"
  | "DENY";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}

interface DecisionDialogState {
  open: boolean;
  action: DecisionUiAction | null;
}

const statusStyles: Record<
  PriorAuthorization["status"],
  { color: string; backgroundColor: string; label: string }
> = {
  PENDING_REVIEW: {
    color: "#6D28D9",
    backgroundColor: "#EDE9FE",
    label: "Pending Review",
  },
  MORE_INFORMATION_REQUIRED: {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    label: "More Information Required",
  },
  ESCALATED: {
    color: "#BE123C",
    backgroundColor: "#FFE4E6",
    label: "Escalated",
  },
  APPROVED: {
    color: "#047857",
    backgroundColor: "#D1FAE5",
    label: "Approved",
  },
  DENIED: {
    color: "#B91C1C",
    backgroundColor: "#FEE2E2",
    label: "Denied",
  },
};

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        backgroundColor: "background.default",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "primary.main",
            backgroundColor: "rgba(21,93,155,0.09)",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      {action}
    </Box>
  );
}

function DetailItem({
  label,
  value,
  emphasis = false,
}: DetailItemProps) {
  return (
    <Box
      sx={{
        p: 2.25,
        minHeight: 112,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 0.75 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: emphasis ? 900 : 800,
          overflowWrap: "anywhere",
        }}
      >
        {value || "Not available"}
      </Typography>
    </Box>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not available";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Not available";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function displayValue(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
}

function normalizeAiRecommendation(
  value: string | null,
): string {
  switch (value?.toUpperCase()) {
    case "APPROVE":
      return "Approve";
    case "DENY":
      return "Deny";
    case "REQUEST_MORE_INFORMATION":
      return "Request More Information";
    case "ESCALATE":
    case "ESCALATE_TO_MEDICAL_DIRECTOR":
      return "Escalate to Medical Director";
    default:
      return value ?? "Not available";
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return "#047857";
  if (score >= 60) return "#B45309";
  return "#B91C1C";
}

function decisionTitle(action: DecisionUiAction | null): string {
  switch (action) {
    case "APPROVE":
      return "Approve Authorization";
    case "REQUEST_MORE_INFORMATION":
      return "Request More Information";
    case "ESCALATE":
      return "Escalate to Medical Director";
    case "DENY":
      return "Deny Authorization";
    default:
      return "Clinical Determination";
  }
}

function defaultRationale(action: DecisionUiAction | null): string {
  switch (action) {
    case "APPROVE":
      return "Clinical criteria and medical necessity requirements are satisfied. Authorization approved following human clinical review.";
    case "REQUEST_MORE_INFORMATION":
      return "Additional clinical documentation is required before a final determination can be made.";
    case "ESCALATE":
      return "The case requires higher-level clinical determination because of complexity or uncertainty in the available clinical evidence.";
    case "DENY":
      return "The submitted clinical documentation does not demonstrate that the requested service meets the applicable medical necessity criteria.";
    default:
      return "";
  }
}

export default function PriorAuthorizationDetails() {
  const navigate = useNavigate();
  const { authorizationId } = useParams<{
    authorizationId: string;
  }>();

  const [authorization, setAuthorization] =
    useState<PriorAuthorization | null>(null);
  const [enrichment, setEnrichment] =
    useState<EnrichedPriorAuthorization | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);

  const [decisionDialog, setDecisionDialog] =
    useState<DecisionDialogState>({
      open: false,
      action: null,
    });

  const [reviewer, setReviewer] = useState("");
  const [rationale, setRationale] = useState("");
  const [informationRequested, setInformationRequested] =
    useState("");
  const [escalationReason, setEscalationReason] = useState("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadAuthorization = useCallback(async () => {
    if (!authorizationId) {
      setLoadError("Authorization ID is missing from the route.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);

      const record = await getPriorAuthorization(authorizationId);
      const enriched = await enrichPriorAuthorization(record);

      setAuthorization(record);
      setEnrichment(enriched);
      setReviewer(
        record.assigned_reviewer ??
          record.decided_by ??
          "Dr. Clinical Reviewer",
      );
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load the authorization.",
      );
    } finally {
      setLoading(false);
    }
  }, [authorizationId]);

  useEffect(() => {
    void loadAuthorization();
  }, [loadAuthorization]);

  const statusStyle = authorization
    ? statusStyles[authorization.status]
    : statusStyles.PENDING_REVIEW;

  const medicalNecessityScore =
    authorization?.medical_necessity_score ?? 0;
  const aiConfidence = authorization?.ai_confidence ?? 0;
  const necessityColour = scoreColor(medicalNecessityScore);

  const aiRecommendation = normalizeAiRecommendation(
    authorization?.ai_recommendation ?? null,
  );

  const isFinalized =
    authorization?.status === "APPROVED" ||
    authorization?.status === "DENIED";

  const currentDecisionLabel = useMemo(() => {
    if (!authorization) return null;

    if (authorization.final_decision) {
      return authorization.final_decision
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    return statusStyle.label;
  }, [authorization, statusStyle.label]);

  const member = enrichment?.member ?? null;
  const provider = enrichment?.provider ?? null;
  const enrollment = enrichment?.enrollment ?? null;

  const memberDisplayName =
    getMemberDisplayName(member);

  const providerDisplayName =
    getProviderDisplayName(provider);

  const providerNetworkStatus =
    provider?.network_status
      ? provider.network_status
          .replaceAll("_", " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
          )
      : "Not available";

  const openDecisionDialog = (action: DecisionUiAction) => {
    if (!authorization || isFinalized) return;

    setDecisionDialog({ open: true, action });
    setReviewer(
      authorization.assigned_reviewer ??
        authorization.decided_by ??
        "Dr. Clinical Reviewer",
    );
    setRationale(defaultRationale(action));
    setInformationRequested(
      action === "REQUEST_MORE_INFORMATION"
        ? "Please provide the additional clinical documentation required to complete medical-necessity review."
        : "",
    );
    setEscalationReason(
      action === "ESCALATE"
        ? "Complex authorization requiring Medical Director review before final determination."
        : "",
    );
  };

  const closeDecisionDialog = () => {
    if (decisionSubmitting) return;

    setDecisionDialog({
      open: false,
      action: null,
    });
  };

  const submitDecision = async () => {
    if (
      !authorization ||
      !decisionDialog.action ||
      !reviewer.trim() ||
      !rationale.trim()
    ) {
      return;
    }

    const action: PriorAuthorizationDecisionAction =
      decisionDialog.action;

    const payload: PriorAuthorizationDecisionRequest = {
      action,
      reviewer: reviewer.trim(),
      rationale: rationale.trim(),
    };

    if (action === "REQUEST_MORE_INFORMATION") {
      payload.information_requested =
        informationRequested.trim() ||
        "Additional supporting clinical documentation requested.";
    }

    if (action === "ESCALATE") {
      payload.escalation_reason =
        escalationReason.trim() ||
        "Medical Director review required.";
      payload.escalated_to = "MEDICAL_DIRECTOR";
    }

    try {
      setDecisionSubmitting(true);

      const updated =
        await submitPriorAuthorizationDecision(
          authorization.id,
          payload,
        );

      setAuthorization(updated);
      setEnrichment(
        await enrichPriorAuthorization(updated),
      );
      setReviewer(
        updated.assigned_reviewer ??
          updated.decided_by ??
          reviewer,
      );

      setDecisionDialog({
        open: false,
        action: null,
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: `${decisionTitle(action)} recorded and persisted successfully.`,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to record the clinical determination.",
      });
    } finally {
      setDecisionSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 420,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress />
          <Typography color="text.secondary">
            Loading authorization clinical review...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (loadError || !authorization) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => navigate("/prior-authorization")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 800 }}
        >
          Back to Prior Authorization
        </Button>

        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void loadAuthorization()}
            >
              Retry
            </Button>
          }
        >
          {loadError ?? "Authorization could not be loaded."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackOutlined />}
        onClick={() => navigate("/prior-authorization")}
        sx={{
          mb: 2.5,
          textTransform: "none",
          fontWeight: 800,
        }}
      >
        Back to Prior Authorization
      </Button>

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 4 },
          color: "common.white",
          overflow: "hidden",
          position: "relative",
          borderRadius: 4,
          background:
            "linear-gradient(110deg, #124B7A 0%, #155D9B 58%, #1683A1 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 270,
            height: 270,
            borderRadius: "50%",
            right: -70,
            top: -110,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1fr) 330px",
            },
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", mb: 2 }}
            >
              <FactCheckOutlined />
              <Typography
                variant="overline"
                sx={{ fontWeight: 900, letterSpacing: 1.2 }}
              >
                PRIOR AUTHORIZATION CLINICAL REVIEW
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                lineHeight: 1.05,
                mb: 1.5,
              }}
            >
              {authorization.authorization_number}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                opacity: 0.92,
                mb: 2,
              }}
            >
              {authorization.procedure_description}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                label={statusStyle.label}
                sx={{
                  fontWeight: 900,
                  color: statusStyle.color,
                  backgroundColor: statusStyle.backgroundColor,
                }}
              />
              <Chip
                label={`${authorization.priority} priority`}
                sx={{
                  fontWeight: 800,
                  color: "#075985",
                  backgroundColor: "#E0F2FE",
                }}
              />
              <Chip
                icon={<PsychologyOutlined />}
                label={`AI: ${aiRecommendation}`}
                sx={{
                  fontWeight: 800,
                  color: "#075985",
                  backgroundColor: "#E0F2FE",
                  "& .MuiChip-icon": { color: "#075985" },
                }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              p: 3,
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Typography sx={{ opacity: 0.8, mb: 1 }}>
              Medical Necessity Score
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, mb: 1.5 }}
            >
              {medicalNecessityScore}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={medicalNecessityScore}
              sx={{
                height: 9,
                borderRadius: 99,
                backgroundColor: "rgba(255,255,255,0.22)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "common.white",
                  borderRadius: 99,
                },
              }}
            />
            <Typography sx={{ mt: 1.5, opacity: 0.85 }}>
              AI confidence: {aiConfidence}%
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.8fr) minmax(360px, 0.9fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "grid", gap: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<PersonOutlined />}
              title="Member and Eligibility Profile"
              subtitle="Resolved member demographics, policy enrollment and coverage status."
              action={
                <Chip
                  label={displayValue(
                    authorization.coverage_status,
                  )}
                  size="small"
                  color={
                    authorization.coverage_status === "ACTIVE"
                      ? "success"
                      : "default"
                  }
                />
              }
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Member"
                value={memberDisplayName}
                emphasis
              />
              <DetailItem
                label="Member Number"
                value={member?.member_number}
              />
              <DetailItem
                label="Policy Number"
                value={enrollment?.policy_number}
              />
              <DetailItem
                label="Date of Birth"
                value={formatDate(member?.date_of_birth)}
              />
              <DetailItem
                label="Gender"
                value={member?.gender}
              />
              <DetailItem
                label="Coverage Status"
                value={
                  enrollment?.enrollment_status ??
                  authorization.coverage_status
                }
              />
              <DetailItem
                label="Employer / Group"
                value={
                  enrollment?.employer_name ??
                  enrollment?.group_number
                }
              />
              <DetailItem
                label="Coverage Period"
                value={
                  enrollment
                    ? `${formatDate(
                        enrollment.coverage_start_date,
                      )} – ${formatDate(
                        enrollment.coverage_end_date,
                      )}`
                    : "Not available"
                }
              />
              <DetailItem
                label="Member Location"
                value={[
                  member?.city,
                  member?.region,
                  member?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<LocalHospitalOutlined />}
              title="Provider and Facility"
              subtitle="Resolved provider identity, specialty, location and network participation."
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Provider"
                value={providerDisplayName}
                emphasis
              />
              <DetailItem
                label="Provider Code"
                value={provider?.provider_code}
              />
              <DetailItem
                label="Provider Type"
                value={provider?.provider_type}
              />
              <DetailItem
                label="Specialty"
                value={provider?.specialty}
              />
              <DetailItem
                label="Network Status"
                value={providerNetworkStatus}
              />
              <DetailItem
                label="Provider Location"
                value={[
                  provider?.city,
                  provider?.region,
                  provider?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
              <DetailItem
                label="Licence Number"
                value={provider?.license_number}
              />
              <DetailItem
                label="Assigned Reviewer"
                value={authorization.assigned_reviewer}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<ShieldOutlined />}
              title="Clinical Request"
              subtitle="Diagnosis, requested service and medical rationale."
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Primary Diagnosis"
                value={`${displayValue(
                  authorization.diagnosis_code,
                )} · ${displayValue(
                  authorization.diagnosis_description,
                )}`}
                emphasis
              />
              <DetailItem
                label="Requested Procedure"
                value={`${displayValue(
                  authorization.procedure_code,
                )} · ${authorization.procedure_description}`}
                emphasis
              />
              <DetailItem
                label="Requested Service Date"
                value={formatDate(
                  authorization.requested_service_date,
                )}
              />
              <DetailItem
                label="Clinical Urgency"
                value={authorization.priority}
              />
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900 }}
              >
                Clinical Summary and Rationale
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  lineHeight: 1.75,
                }}
              >
                {displayValue(authorization.clinical_summary)}
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<ShieldOutlined />}
              title="Coverage Validation"
              subtitle="Benefit eligibility and authorization rules returned by the live API."
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Coverage Status"
                value={authorization.coverage_status}
                emphasis
              />
              <DetailItem
                label="Benefit Category"
                value={authorization.benefit_category}
              />
              <DetailItem
                label="Service Covered"
                value={authorization.service_covered}
              />
              <DetailItem
                label="Authorization Required"
                value={authorization.authorization_required}
              />
              <DetailItem
                label="Enrollment Type"
                value={enrollment?.enrollment_type}
              />
              <DetailItem
                label="Relationship to Subscriber"
                value={enrollment?.relationship_to_subscriber}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<DescriptionOutlined />}
              title="Supporting Clinical Documentation"
              subtitle="Evidence submitted to support medical-necessity review."
            />
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                Supporting-document metadata is not yet returned by the
                live Prior Authorization API. This section is ready for
                document-service integration.
              </Alert>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<AssignmentOutlined />}
              title="Timeline and Audit History"
              subtitle="Traceable persisted workflow activity and human decisions."
            />
            <Divider />
            <Box sx={{ p: 2.5, display: "grid", gap: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900 }}
                >
                  Authorization request created
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary" }}
                >
                  {formatDateTime(authorization.created_at)}
                </Typography>
              </Box>

              {authorization.decided_at && (
                <>
                  <Divider />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 900 }}
                    >
                      {currentDecisionLabel}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                      }}
                    >
                      {formatDateTime(authorization.decided_at)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      {authorization.decision_rationale ??
                        authorization.information_requested ??
                        authorization.escalation_reason ??
                        "Clinical review action recorded."}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.75,
                        color: "primary.main",
                        fontWeight: 800,
                      }}
                    >
                      {authorization.decided_by ??
                        "Clinical Reviewer"}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            position: { xl: "sticky" },
            top: { xl: 88 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<PsychologyOutlined />}
              title="AI Medical-Necessity Assessment"
              subtitle="Explainable decision support for the clinical reviewer."
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Chip
                icon={<AutoAwesomeOutlined />}
                label={aiRecommendation}
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  minHeight: 32,
                  fontWeight: 900,
                  color: "#047857",
                  backgroundColor: "#D1FAE5",
                  "& .MuiChip-icon": { color: "#047857" },
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    py: 0.5,
                  },
                }}
              />

              <Box sx={{ mt: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.75,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    Medical necessity
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: necessityColour,
                    }}
                  >
                    {medicalNecessityScore}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={medicalNecessityScore}
                  sx={{
                    height: 9,
                    borderRadius: 99,
                    backgroundColor: `${necessityColour}20`,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: necessityColour,
                      borderRadius: 99,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mt: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.75,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    AI confidence
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900 }}
                  >
                    {aiConfidence}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={aiConfidence}
                  sx={{ height: 9, borderRadius: 99 }}
                />
              </Box>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900 }}
              >
                AI Rationale
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                {displayValue(authorization.ai_rationale)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                AI recommendations support human clinical review and do
                not independently approve or deny care.
              </Alert>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<ScheduleOutlined />}
              title="Review Assignment"
              subtitle="Reviewer ownership and service-level deadline."
            />
            <Divider />
            <Box sx={{ p: 2.5, display: "grid", gap: 2 }}>
              <DetailItem
                label="Assigned Reviewer"
                value={authorization.assigned_reviewer}
              />
              <DetailItem
                label="Review Due"
                value={formatDateTime(
                  authorization.review_due_at,
                )}
              />
              <DetailItem
                label="Request Submitted"
                value={formatDateTime(
                  authorization.created_at,
                )}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              icon={<GavelOutlined />}
              title="Final Determination"
              subtitle="Human-reviewed authorization decision."
            />
            <Divider />

            <Box sx={{ p: 2.5 }}>
              {(authorization.final_decision ||
                authorization.status !== "PENDING_REVIEW") && (
                <Alert
                  severity={
                    authorization.status === "APPROVED"
                      ? "success"
                      : authorization.status === "DENIED"
                        ? "error"
                        : "warning"
                  }
                  sx={{ mb: 2 }}
                >
                  Current persisted state:{" "}
                  <strong>{currentDecisionLabel}</strong>
                  {authorization.decided_by
                    ? ` · ${authorization.decided_by}`
                    : ""}
                </Alert>
              )}

              <Stack spacing={1.25}>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleOutlined />}
                  disabled={isFinalized}
                  onClick={() => openDecisionDialog("APPROVE")}
                  sx={{
                    py: 1.25,
                    fontWeight: 900,
                    textTransform: "none",
                  }}
                >
                  Approve Authorization
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DescriptionOutlined />}
                  disabled={isFinalized}
                  onClick={() =>
                    openDecisionDialog(
                      "REQUEST_MORE_INFORMATION",
                    )
                  }
                  sx={{
                    py: 1.25,
                    fontWeight: 800,
                    textTransform: "none",
                  }}
                >
                  Request More Information
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<WarningAmberOutlined />}
                  disabled={isFinalized}
                  onClick={() => openDecisionDialog("ESCALATE")}
                  sx={{
                    py: 1.25,
                    fontWeight: 800,
                    textTransform: "none",
                  }}
                >
                  Escalate to Medical Director
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<GavelOutlined />}
                  disabled={isFinalized}
                  onClick={() => openDecisionDialog("DENY")}
                  sx={{
                    py: 1.25,
                    fontWeight: 800,
                    textTransform: "none",
                  }}
                >
                  Deny Authorization
                </Button>
              </Stack>

              {isFinalized && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1.5,
                    color: "text.secondary",
                  }}
                >
                  This authorization has a final determination. Decision
                  controls are locked in the MVP interface.
                </Typography>
              )}
            </Box>

            <Divider />

            <Box
              sx={{
                p: 2.5,
                backgroundColor: "background.default",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "flex-start" }}
              >
                <ShieldOutlined
                  color="primary"
                  fontSize="small"
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  All final decisions require authenticated human review
                  and are persisted in the authorization audit record.
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          mt: 3,
          display: "block",
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Solutions™ Prior Authorization Workspace · Designed
        & Developed by Dr. Samuel Israel
      </Typography>

      <Dialog
        open={decisionDialog.open}
        onClose={closeDecisionDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {decisionTitle(decisionDialog.action)}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">
              This action will be submitted to the live MediVantage API
              and persisted to the authorization record.
            </Alert>

            <TextField
              label="Reviewer"
              value={reviewer}
              onChange={(event) =>
                setReviewer(event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="Decision rationale"
              value={rationale}
              onChange={(event) =>
                setRationale(event.target.value)
              }
              required
              multiline
              minRows={4}
              fullWidth
            />

            {decisionDialog.action ===
              "REQUEST_MORE_INFORMATION" && (
              <TextField
                label="Information requested"
                value={informationRequested}
                onChange={(event) =>
                  setInformationRequested(event.target.value)
                }
                multiline
                minRows={3}
                fullWidth
              />
            )}

            {decisionDialog.action === "ESCALATE" && (
              <TextField
                label="Escalation reason"
                value={escalationReason}
                onChange={(event) =>
                  setEscalationReason(event.target.value)
                }
                multiline
                minRows={3}
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeDecisionDialog}
            disabled={decisionSubmitting}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void submitDecision()}
            disabled={
              decisionSubmitting ||
              !reviewer.trim() ||
              !rationale.trim()
            }
            startIcon={
              decisionSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{ textTransform: "none", fontWeight: 800 }}
          >
            {decisionSubmitting
              ? "Submitting..."
              : "Confirm Decision"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
        message={snackbar.message}
      />
    </Box>
  );
}