import {
  AccessTimeOutlined,
  AccountBalanceWalletOutlined,
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  FactCheckOutlined,
  LocalHospitalOutlined,
  LockOutlined,
  PendingOutlined,
  PersonOutlineOutlined,
  ReceiptLongOutlined,
  RuleOutlined,
  ShieldOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

type TimelineStatus = "completed" | "current" | "pending";

interface TimelineStep {
  title: string;
  description: string;
  time: string;
  status: TimelineStatus;
  icon: React.ReactNode;
}

interface AuditEvent {
  time: string;
  actor: string;
  action: string;
  outcome: string;
  actorType: "system" | "ai" | "human";
}

const timelineSteps: TimelineStep[] = [
  {
    title: "Claim Submitted",
    description: "Claim received from Al Noor Specialist Hospital",
    time: "21 Jul 2026 · 09:01",
    status: "completed",
    icon: <ReceiptLongOutlined fontSize="small" />,
  },
  {
    title: "Eligibility Verification",
    description: "Member eligibility and policy status confirmed",
    time: "21 Jul 2026 · 09:03",
    status: "completed",
    icon: <FactCheckOutlined fontSize="small" />,
  },
  {
    title: "MediVantage AI™ Review",
    description: "Fraud, duplication, coverage and clinical review completed",
    time: "21 Jul 2026 · 09:05",
    status: "completed",
    icon: <AutoAwesomeOutlined fontSize="small" />,
  },
  {
    title: "Clinical Review",
    description: "Medical necessity and supporting documents reviewed",
    time: "21 Jul 2026 · 09:08",
    status: "completed",
    icon: <LocalHospitalOutlined fontSize="small" />,
  },
  {
    title: "Financial Adjudication",
    description: "Member liability and recommended payment calculated",
    time: "21 Jul 2026 · 09:10",
    status: "completed",
    icon: <AccountBalanceWalletOutlined fontSize="small" />,
  },
  {
    title: "Medical Director Approval",
    description: "Awaiting final human authorization",
    time: "In progress",
    status: "current",
    icon: <PersonOutlineOutlined fontSize="small" />,
  },
  {
    title: "Payment Processing",
    description: "Payment will be released after approval",
    time: "Pending",
    status: "pending",
    icon: <PendingOutlined fontSize="small" />,
  },
];

const auditEvents: AuditEvent[] = [
  {
    time: "09:01",
    actor: "Claims Intake System",
    action: "Claim created and assigned claim ID",
    outcome: "Completed",
    actorType: "system",
  },
  {
    time: "09:03",
    actor: "Eligibility Rules Engine",
    action: "Validated member, policy and coverage status",
    outcome: "Passed",
    actorType: "system",
  },
  {
    time: "09:05",
    actor: "MediVantage AI™",
    action: "Completed fraud and duplicate-claim screening",
    outcome: "Low Risk",
    actorType: "ai",
  },
  {
    time: "09:06",
    actor: "MediVantage AI™",
    action: "Assessed medical necessity and policy compliance",
    outcome: "Supported",
    actorType: "ai",
  },
  {
    time: "09:08",
    actor: "Dr. Nora Al-Salem",
    action: "Reviewed clinical documentation",
    outcome: "Completed",
    actorType: "human",
  },
  {
    time: "09:10",
    actor: "Financial Adjudication Engine",
    action: "Calculated covered amount and member liability",
    outcome: "SAR 16,300",
    actorType: "system",
  },
  {
    time: "09:12",
    actor: "Claims Workflow Engine",
    action: "Escalated claim for medical director approval",
    outcome: "Pending",
    actorType: "system",
  },
];

function getStatusColor(status: TimelineStatus) {
  if (status === "completed") return "success.main";
  if (status === "current") return "primary.main";
  return "grey.400";
}

function TimelineItem({
  step,
  isLast,
}: {
  step: TimelineStep;
  isLast: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "40px minmax(0, 1fr)",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "white",
            bgcolor: getStatusColor(step.status),
            flexShrink: 0,
          }}
        >
          {step.status === "completed" ? (
            <CheckCircleOutlined fontSize="small" />
          ) : (
            step.icon
          )}
        </Box>

        {!isLast && (
          <Box
            sx={{
              width: 2,
              minHeight: 54,
              flex: 1,
              bgcolor:
                step.status === "completed" ? "success.light" : "divider",
            }}
          />
        )}
      </Box>

      <Box sx={{ pb: isLast ? 0 : 2.25 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {step.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                mt: 0.4,
                lineHeight: 1.6,
              }}
            >
              {step.description}
            </Typography>
          </Box>

          <Chip
            label={
              step.status === "completed"
                ? "Complete"
                : step.status === "current"
                  ? "In Progress"
                  : "Pending"
            }
            size="small"
            color={
              step.status === "completed"
                ? "success"
                : step.status === "current"
                  ? "primary"
                  : "default"
            }
            variant={step.status === "pending" ? "outlined" : "filled"}
            sx={{ fontWeight: 700, flexShrink: 0 }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            mt: 0.9,
          }}
        >
          <AccessTimeOutlined sx={{ fontSize: 15 }} />
          {step.time}
        </Typography>
      </Box>
    </Box>
  );
}

function ActorChip({ actorType }: { actorType: AuditEvent["actorType"] }) {
  const config = {
    system: {
      label: "System",
      color: "default" as const,
      icon: <RuleOutlined />,
    },
    ai: {
      label: "AI",
      color: "primary" as const,
      icon: <AutoAwesomeOutlined />,
    },
    human: {
      label: "Human",
      color: "success" as const,
      icon: <PersonOutlineOutlined />,
    },
  };

  const actor = config[actorType];

  return (
    <Chip
      label={actor.label}
      color={actor.color}
      icon={actor.icon}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 700 }}
    />
  );
}

export default function ClaimTimelineAudit() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          xl: "minmax(0, 0.9fr) minmax(0, 1.3fr)",
        },
        gap: 3,
        mt: 3,
        alignItems: "start",
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
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <TaskAltOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Claim Timeline
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              End-to-end claim lifecycle and processing milestones
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "primary.light",
              bgcolor: "primary.50",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Overall Claim Progress
                </Typography>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Five of seven workflow stages completed
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: "primary.main" }}
              >
                72%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={72}
              sx={{ height: 10, borderRadius: 10 }}
            />

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1.2,
                color: "primary.main",
                fontWeight: 800,
              }}
            >
              Estimated completion time: 12 minutes
            </Typography>
          </Box>

          {timelineSteps.map((step, index) => (
            <TimelineItem
              key={step.title}
              step={step}
              isLast={index === timelineSteps.length - 1}
            />
          ))}
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
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            <ShieldOutlined color="primary" />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Audit Trail
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Time-stamped human, AI and system actions
              </Typography>
            </Box>
          </Box>

          <Chip
            label="Integrity Verified"
            color="success"
            icon={<LockOutlined />}
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "80px 150px minmax(0, 1fr) 120px",
              },
              gap: 1.5,
              px: 1.5,
              pb: 1.25,
            }}
          >
            {["Time", "Actor Type", "Action", "Outcome"].map((heading) => (
              <Typography
                key={heading}
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {heading}
              </Typography>
            ))}
          </Box>

          {auditEvents.map((event, index) => (
            <Box
              key={`${event.time}-${event.actor}`}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "80px 150px minmax(0, 1fr) 120px",
                },
                gap: 1.5,
                alignItems: "center",
                p: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: index % 2 === 0 ? "background.paper" : "action.hover",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {event.time}
              </Typography>

              <ActorChip actorType={event.actorType} />

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {event.action}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.secondary", mt: 0.3 }}
                >
                  {event.actor}
                </Typography>
              </Box>

              <Chip
                label={event.outcome}
                size="small"
                color={
                  event.outcome === "Pending"
                    ? "warning"
                    : event.outcome === "Low Risk" ||
                        event.outcome === "Passed" ||
                        event.outcome === "Supported" ||
                        event.outcome === "Completed"
                      ? "success"
                      : "primary"
                }
                variant="outlined"
                sx={{ fontWeight: 700, justifySelf: { md: "start" } }}
              />
            </Box>
          ))}

          <Box
            sx={{
              mt: 3,
              border: "1px solid",
              borderColor: "success.light",
              bgcolor: "success.50",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <CheckCircleOutlined color="success" />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  Governance and Audit Status
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    lineHeight: 1.7,
                  }}
                >
                  Human review remains mandatory before final approval. AI
                  review, fraud screening, clinical validation and financial
                  adjudication are complete. All recorded actions are
                  time-stamped and traceable.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}