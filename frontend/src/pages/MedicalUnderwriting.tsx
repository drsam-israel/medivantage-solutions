import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  AddOutlined,
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  HealthAndSafetyOutlined,
  PersonSearchOutlined,
  PsychologyOutlined,
  ScheduleOutlined,
  ShieldOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";
import { getUnderwritingApplications } from "../services/underwritingApi";
import { getMembers } from "../services/membersApi";

import type { UnderwritingApplication } from "../types/underwriting";
import type { Member } from "../types/member";

function getMemberName(member: Member): string {
  return [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatDate(value: string): string {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getRiskLabel(
  score: number | null,
): "Low" | "Medium" | "High" | "Not Scored" {
  if (score === null) {
    return "Not Scored";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
}

function getRiskColor(
  score: number | null,
): "default" | "success" | "warning" | "error" {
  if (score === null) {
    return "default";
  }

  if (score >= 70) {
    return "error";
  }

  if (score >= 40) {
    return "warning";
  }

  return "success";
}

function getStatusLabel(
  status: UnderwritingApplication["status"],
): string {
  switch (status) {
    case "PENDING_REVIEW":
      return "Pending Review";
    case "AI_REVIEW":
      return "AI Review";
    case "MANUAL_REVIEW":
      return "Manual Review";
    case "APPROVED":
      return "Approved";
    case "DECLINED":
      return "Declined";
    case "REFERRED":
      return "Referred";
    default:
      return status;
  }
}

function getStatusColor(
  status: UnderwritingApplication["status"],
):
  | "default"
  | "primary"
  | "warning"
  | "success"
  | "error"
  | "info" {
  switch (status) {
    case "APPROVED":
      return "success";
    case "AI_REVIEW":
      return "primary";
    case "MANUAL_REVIEW":
    case "REFERRED":
      return "warning";
    case "DECLINED":
      return "error";
    case "PENDING_REVIEW":
      return "default";
    default:
      return "info";
  }
}

interface ApplicationRow extends UnderwritingApplication {
  member: Member | null;
}

export default function MedicalUnderwriting() {
  const navigate = useNavigate();

  const [applications, setApplications] =
    useState<UnderwritingApplication[]>([]);

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadUnderwritingWorkspace() {
      try {
        setLoading(true);
        setError(null);

        const [applicationData, memberData] =
          await Promise.all([
            getUnderwritingApplications(),
            getMembers(),
          ]);

        if (!active) {
          return;
        }

        setApplications(applicationData);
        setMembers(memberData);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load medical underwriting workspace.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUnderwritingWorkspace();

    return () => {
      active = false;
    };
  }, []);

  const memberMap = useMemo(
    () =>
      new Map(
        members.map((member) => [member.id, member]),
      ),
    [members],
  );

  const applicationRows = useMemo<ApplicationRow[]>(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return applications
      .map((application) => ({
        ...application,
        member:
          memberMap.get(application.member_id) ?? null,
      }))
      .filter((application) => {
        if (!normalizedSearch) {
          return true;
        }

        const applicantName = application.member
          ? getMemberName(application.member).toLowerCase()
          : "";

        const memberNumber =
          application.member?.member_number.toLowerCase() ?? "";

        return (
          application.application_number
            .toLowerCase()
            .includes(normalizedSearch) ||
          applicantName.includes(normalizedSearch) ||
          memberNumber.includes(normalizedSearch) ||
          application.product
            .toLowerCase()
            .includes(normalizedSearch) ||
          getStatusLabel(application.status)
            .toLowerCase()
            .includes(normalizedSearch) ||
          (application.assigned_underwriter ?? "")
            .toLowerCase()
            .includes(normalizedSearch)
        );
      });
  }, [applications, memberMap, searchTerm]);

  const highRiskCount = applications.filter(
    (application) =>
      application.risk_score !== null &&
      application.risk_score >= 70,
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "APPROVED",
  ).length;

  const pendingCount = applications.filter(
    (application) =>
      !["APPROVED", "DECLINED"].includes(
        application.status,
      ),
  ).length;

  const aiReviewCount = applications.filter(
    (application) => application.status === "AI_REVIEW",
  ).length;

  const manualReviewCount = applications.filter(
    (application) =>
      application.status === "MANUAL_REVIEW",
  ).length;

  const approvalRate =
    applications.length === 0
      ? 0
      : Math.round(
          (approvedCount / applications.length) * 100,
        );

  const underwritingMetrics = [
    {
      label: "Applications",
      value: applications.length,
      supportingText: "Live underwriting queue",
      icon: <PersonSearchOutlined />,
    },
    {
      label: "Pending Review",
      value: pendingCount,
      supportingText: "Requires underwriting action",
      icon: <ScheduleOutlined />,
    },
    {
      label: "High Risk",
      value: highRiskCount,
      supportingText: "Risk score of 70 or above",
      icon: <WarningAmberOutlined />,
    },
    {
      label: "Approval Rate",
      value: `${approvalRate}%`,
      supportingText: "Live underwriting decisions",
      icon: <CheckCircleOutlined />,
    },
  ];

  const capabilityCards = [
    {
      title: "AI-Assisted Risk Assessment",
      description:
        "Applicant risk scoring, clinical evidence review, expected claims exposure and recommendation support.",
      icon: <AutoAwesomeOutlined color="primary" />,
    },
    {
      title: "Clinical Governance",
      description:
        "Human underwriting review remains mandatory for final eligibility, pricing and coverage decisions.",
      icon: <ShieldOutlined color="primary" />,
    },
    {
      title: "Portfolio Intelligence",
      description:
        "Track approval patterns, high-risk applications, referral rates and underwriting performance.",
      icon: <TrendingUpOutlined color="primary" />,
    },
  ];

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="CLINICAL RISK INTELLIGENCE"
        title="Medical Underwriting"
        description="AI-assisted clinical risk assessment, eligibility determination, pricing recommendations and explainable underwriting decisions from one intelligent enterprise workspace."
        icon={<HealthAndSafetyOutlined />}
        context="MediVantage Underwriting Engine"
        updatedText="Live backend data"
        statusLabel={
          error
            ? "API Issue"
            : loading
              ? "Loading"
              : "Live Underwriting Queue"
        }
        statusTone={
          error
            ? "error"
            : loading
              ? "warning"
              : "success"
        }
        stats={[
          {
            label: "Applications",
            value: applications.length,
            icon: <PersonSearchOutlined />,
            tone: "primary",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            icon: <ScheduleOutlined />,
            tone: "warning",
          },
          {
            label: "High-Risk Cases",
            value: highRiskCount,
            icon: <WarningAmberOutlined />,
            tone: "error",
          },
          {
            label: "AI Reviews",
            value: aiReviewCount,
            icon: <PsychologyOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "New Application",
            icon: <AddOutlined />,
            onClick: () => {
              console.log("Create underwriting application");
            },
            prominent: true,
          },
          {
            label: "AI Risk Engine",
            icon: <AutoAwesomeOutlined />,
            onClick: () => {
              console.log("Open AI risk engine");
            },
            variant: "outlined",
          },
          {
            label: "Decision Rules",
            icon: <ShieldOutlined />,
            onClick: () => {
              console.log("Open underwriting decision rules");
            },
            variant: "outlined",
          },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          mt: 3,
          mb: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {underwritingMetrics.map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: 2.25,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
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
                  {item.label}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ mt: 0.5, fontWeight: 900 }}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.75,
                    color: "text.secondary",
                  }}
                >
                  {item.supportingText}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 2,
                  color: "primary.main",
                  backgroundColor: "rgba(21,93,155,0.10)",
                }}
              >
                {item.icon}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Underwriting Applications Queue
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 0.25, color: "text.secondary" }}
            >
              Review applicant risk, clinical evidence, AI recommendations and policy decisions.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1.25,
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
            }}
          >
            <Chip
              label={`${manualReviewCount} manual reviews`}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />

            <TextField
              size="small"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search applications..."
              sx={{
                minWidth: {
                  sm: 280,
                  md: 320,
                },
              }}
            />
          </Box>
        </Box>

        <Divider />

        {loading ? (
          <Box
            sx={{
              py: 10,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Loading underwriting applications...
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                minWidth: 1050,
                display: "grid",
                gridTemplateColumns:
                  "150px 220px minmax(220px, 1fr) 130px 150px 190px 130px",
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                backgroundColor: "background.default",
              }}
            >
              {[
                "Application",
                "Applicant",
                "Product",
                "Risk",
                "Status",
                "Assigned Underwriter",
                "Action",
              ].map((heading) => (
                <Typography
                  key={heading}
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>

            {applicationRows.map((application) => (
              <Box
                key={application.id}
                sx={{
                  minWidth: 1050,
                  display: "grid",
                  gridTemplateColumns:
                    "150px 220px minmax(220px, 1fr) 130px 150px 190px 130px",
                  gap: 1.5,
                  alignItems: "center",
                  px: 2.5,
                  py: 1.75,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  transition: "background-color 0.2s ease",

                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 900 }}
                  >
                    {application.application_number}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDate(application.submitted_date)}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {application.member
                      ? getMemberName(application.member)
                      : "Member not found"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {application.member?.member_number ??
                      application.member_id}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700 }}
                >
                  {application.product}
                </Typography>

                <Chip
                  label={
                    application.risk_score === null
                      ? "Not Scored"
                      : `${getRiskLabel(
                          application.risk_score,
                        )} · ${application.risk_score}`
                  }
                  color={getRiskColor(application.risk_score)}
                  size="small"
                  sx={{
                    justifySelf: "start",
                    fontWeight: 800,
                  }}
                />

                <Chip
                  label={getStatusLabel(application.status)}
                  color={getStatusColor(application.status)}
                  size="small"
                  variant={
                    application.status === "PENDING_REVIEW"
                      ? "outlined"
                      : "filled"
                  }
                  sx={{
                    justifySelf: "start",
                    fontWeight: 800,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700 }}
                >
                  {application.assigned_underwriter ?? "Unassigned"}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate(
                      `/medical-underwriting/${application.id}`,
                    )
                  }
                  sx={{
                    justifySelf: "start",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Open
                </Button>
              </Box>
            ))}

            {applicationRows.length === 0 && (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  No applications found
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  Try a different applicant, application number, underwriter or status.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {capabilityCards.map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              p: 2.25,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              {item.icon}

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 900 }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Medical Underwriting · Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}