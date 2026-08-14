import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import type { ReactNode } from "react";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import {
  aiInsightsDemoData,
  aiModels,
  getAIExecutiveMetrics,
} from "../data/aiInsightsDemoData";

import type {
  AIInsight,
  AIInsightDomain,
  AIInsightSeverity,
  AIInsightStatus,
  BiasStatus,
  DriftStatus,
  GovernanceStatus,
} from "../data/aiInsightsDemoData";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  tone?:
    | "default"
    | "success"
    | "warning"
    | "critical"
    | "info";
}

interface IntelligenceCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  severity:
    | "default"
    | "success"
    | "warning"
    | "critical";
}

type SortOption =
  | "Highest Risk"
  | "Highest Financial Impact"
  | "Highest Confidence"
  | "Newest";

const domainOptions: Array<"All" | AIInsightDomain> = [
  "All",
  "Claims",
  "Medical Underwriting",
  "Fraud Detection",
  "Prior Authorization",
  "Payment Integrity",
  "Provider Network",
  "Population Health",
  "Member Engagement",
  "Operational Intelligence",
];

const severityOptions: Array<
  "All" | AIInsightSeverity
> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

const statusOptions: Array<
  "All" | AIInsightStatus
> = [
  "All",
  "New",
  "Under Review",
  "Action Required",
  "In Progress",
  "Resolved",
  "Dismissed",
];

const governanceOptions: Array<
  "All" | GovernanceStatus
> = [
  "All",
  "Compliant",
  "Attention Required",
  "Restricted",
  "Under Review",
];

const sortOptions: SortOption[] = [
  "Highest Risk",
  "Highest Financial Impact",
  "Highest Confidence",
  "Newest",
];

const money = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return money.format(value);
}

function formatCompactCurrency(
  value: number,
): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000_000) {
    return `SAR ${(value / 1_000_000_000).toFixed(
      2,
    )}B`;
  }

  if (absoluteValue >= 1_000_000) {
    return `SAR ${(value / 1_000_000).toFixed(
      2,
    )}M`;
  }

  if (absoluteValue >= 1_000) {
    return `SAR ${(value / 1_000).toFixed(0)}K`;
  }

  return `SAR ${value.toFixed(0)}`;
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

function getSeverityColour(
  severity: AIInsightSeverity,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (severity) {
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

function getStatusColour(
  status: AIInsightStatus,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (status) {
    case "New":
      return "info";
    case "Under Review":
      return "warning";
    case "Action Required":
      return "error";
    case "In Progress":
      return "warning";
    case "Resolved":
      return "success";
    case "Dismissed":
      return "default";
    default:
      return "default";
  }
}

function getGovernanceColour(
  status: GovernanceStatus,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (status) {
    case "Compliant":
      return "success";
    case "Attention Required":
    case "Under Review":
      return "warning";
    case "Restricted":
      return "error";
    default:
      return "default";
  }
}

function getDriftColour(
  status: DriftStatus,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (status) {
    case "Normal":
      return "success";
    case "Watch":
      return "warning";
    case "Degraded":
    case "Critical":
      return "error";
    default:
      return "default";
  }
}

function getBiasColour(
  status: BiasStatus,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (status) {
    case "Passed":
      return "success";
    case "Watch":
    case "Not Assessed":
      return "warning";
    case "Failed":
      return "error";
    default:
      return "default";
  }
}

function getRiskWeight(
  severity: AIInsightSeverity,
): number {
  switch (severity) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}

function getDomainIcon(
  domain: AIInsightDomain,
): ReactNode {
  switch (domain) {
    case "Claims":
      return <QueryStatsOutlinedIcon />;
    case "Medical Underwriting":
      return <HealthAndSafetyOutlinedIcon />;
    case "Fraud Detection":
      return <GavelOutlinedIcon />;
    case "Prior Authorization":
      return <LocalHospitalOutlinedIcon />;
    case "Payment Integrity":
      return <PaymentsOutlinedIcon />;
    case "Provider Network":
      return <GroupsOutlinedIcon />;
    case "Population Health":
      return <HealthAndSafetyOutlinedIcon />;
    case "Member Engagement":
      return <GroupsOutlinedIcon />;
    case "Operational Intelligence":
      return <TrendingUpOutlinedIcon />;
    default:
      return <InsightsOutlinedIcon />;
  }
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = "default",
}: MetricCardProps) {
  const palette = {
    default: {
      backgroundColor:
        "rgba(21, 101, 192, 0.08)",
      iconColor: "primary.main",
    },
    success: {
      backgroundColor:
        "rgba(46, 125, 50, 0.10)",
      iconColor: "success.main",
    },
    warning: {
      backgroundColor:
        "rgba(237, 108, 2, 0.10)",
      iconColor: "warning.main",
    },
    critical: {
      backgroundColor:
        "rgba(211, 47, 47, 0.10)",
      iconColor: "error.main",
    },
    info: {
      backgroundColor:
        "rgba(2, 136, 209, 0.10)",
      iconColor: "info.main",
    },
  }[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 220px",
        minWidth: 220,
        p: 2.4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
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
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 0.75,
              fontWeight: 900,
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "text.secondary",
              lineHeight: 1.45,
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
            borderRadius: 2.4,
            backgroundColor:
              palette.backgroundColor,
            color: palette.iconColor,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function IntelligenceCard({
  title,
  value,
  description,
  icon,
  severity,
}: IntelligenceCardProps) {
  const palette = {
    default: {
      backgroundColor:
        "rgba(21, 101, 192, 0.04)",
      borderColor:
        "rgba(21, 101, 192, 0.18)",
      iconColor: "primary.main",
    },
    success: {
      backgroundColor:
        "rgba(46, 125, 50, 0.04)",
      borderColor:
        "rgba(46, 125, 50, 0.20)",
      iconColor: "success.main",
    },
    warning: {
      backgroundColor:
        "rgba(237, 108, 2, 0.04)",
      borderColor:
        "rgba(237, 108, 2, 0.20)",
      iconColor: "warning.main",
    },
    critical: {
      backgroundColor:
        "rgba(211, 47, 47, 0.04)",
      borderColor:
        "rgba(211, 47, 47, 0.20)",
      iconColor: "error.main",
    },
  }[severity];

  return (
    <Box
      sx={{
        p: 2.4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: palette.borderColor,
        backgroundColor:
          palette.backgroundColor,
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
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 0.55,
              fontWeight: 900,
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.2,
            color: palette.iconColor,
            backgroundColor:
              "background.paper",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1,
          color: "text.secondary",
          lineHeight: 1.55,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export default function AIInsightsDashboard() {
  const navigate = useNavigate();

  const metrics = useMemo(
    () => getAIExecutiveMetrics(),
    [],
  );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [domainFilter, setDomainFilter] =
    useState<"All" | AIInsightDomain>("All");

  const [severityFilter, setSeverityFilter] =
    useState<"All" | AIInsightSeverity>(
      "All",
    );

  const [statusFilter, setStatusFilter] =
    useState<"All" | AIInsightStatus>(
      "All",
    );

  const [
    governanceFilter,
    setGovernanceFilter,
  ] = useState<"All" | GovernanceStatus>(
    "All",
  );

  const [sortOption, setSortOption] =
    useState<SortOption>("Highest Risk");

  const filteredInsights = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = aiInsightsDemoData.filter(
      (insight) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          insight.insightId
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.title
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.summary
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.primaryEntityName
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.assignedOwner
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.model.modelName
            .toLowerCase()
            .includes(normalizedSearch) ||
          insight.domain
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesDomain =
          domainFilter === "All" ||
          insight.domain === domainFilter;

        const matchesSeverity =
          severityFilter === "All" ||
          insight.severity ===
            severityFilter;

        const matchesStatus =
          statusFilter === "All" ||
          insight.status === statusFilter;

        const matchesGovernance =
          governanceFilter === "All" ||
          insight.governance
            .governanceStatus ===
            governanceFilter;

        return (
          matchesSearch &&
          matchesDomain &&
          matchesSeverity &&
          matchesStatus &&
          matchesGovernance
        );
      },
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "Highest Financial Impact":
          return (
            b.financialImpact -
            a.financialImpact
          );

        case "Highest Confidence":
          return (
            b.confidenceScore -
            a.confidenceScore
          );

        case "Newest":
          return (
            new Date(
              b.generatedDate,
            ).getTime() -
            new Date(
              a.generatedDate,
            ).getTime()
          );

        case "Highest Risk":
        default:
          return (
            getRiskWeight(b.severity) -
              getRiskWeight(a.severity) ||
            b.riskScore - a.riskScore
          );
      }
    });
  }, [
    domainFilter,
    governanceFilter,
    searchTerm,
    severityFilter,
    sortOption,
    statusFilter,
  ]);

  const visibleFinancialImpact =
    useMemo(
      () =>
        filteredInsights.reduce(
          (total, insight) =>
            total +
            insight.financialImpact,
          0,
        ),
      [filteredInsights],
    );

  const visibleSavings = useMemo(
    () =>
      filteredInsights.reduce(
        (total, insight) =>
          total +
          insight.estimatedSavings,
        0,
      ),
    [filteredInsights],
  );

  const criticalInsight = useMemo(
    () =>
      [...aiInsightsDemoData].sort(
        (a, b) =>
          b.riskScore - a.riskScore,
      )[0],
    [],
  );

  const highestFinancialInsight =
    useMemo(
      () =>
        [...aiInsightsDemoData].sort(
          (a, b) =>
            b.financialImpact -
            a.financialImpact,
        )[0],
      [],
    );

  const strongestModel = useMemo(
    () =>
      [...aiModels].sort(
        (a, b) =>
          b.performanceValue -
          a.performanceValue,
      )[0],
    [],
  );

  const criticalModels = useMemo(
    () =>
      aiModels.filter(
        (model) =>
          model.driftStatus !== "Normal" ||
          model.biasStatus !== "Passed" ||
          model.governanceStatus !==
            "Compliant",
      ),
    [],
  );

  const domainDistribution = useMemo(() => {
    return domainOptions
      .filter(
        (
          domain,
        ): domain is AIInsightDomain =>
          domain !== "All",
      )
      .map((domain) => ({
        domain,
        count: aiInsightsDemoData.filter(
          (insight) =>
            insight.domain === domain,
        ).length,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setDomainFilter("All");
    setSeverityFilter("All");
    setStatusFilter("All");
    setGovernanceFilter("All");
    setSortOption("Highest Risk");
  };

  const openInsight = (
    insightId: string,
  ) => {
    navigate(
      `/ai-insights/${encodeURIComponent(
        insightId,
      )}`,
    );
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="ENTERPRISE AI INTELLIGENCE"
        title="AI Insights Center"
        description="Predictive intelligence, explainable AI, responsible automation and executive decision support across the MediVantage insurance platform."
        icon={<PsychologyOutlinedIcon />}
        context="MediVantage Enterprise AI Operations"
        updatedText="Updated moments ago"
        statusLabel="Live AI Intelligence"
        statusTone="success"
        stats={[
          {
            label: "Active Insights",
            value: metrics.totalInsights,
            icon: <InsightsOutlinedIcon />,
            tone: "primary",
          },
          {
            label: "Critical Insights",
            value: metrics.criticalInsights,
            icon: <WarningAmberOutlinedIcon />,
            tone: "error",
          },
          {
            label: "Average Confidence",
            value: `${metrics.averageConfidence}%`,
            icon: <QueryStatsOutlinedIcon />,
            tone: "success",
          },
          {
            label: "Governance Exceptions",
            value: metrics.governanceExceptions,
            icon: <FactCheckOutlinedIcon />,
            tone: "warning",
          },
        ]}
        actions={[
          {
            label: "Ask AI Copilot",
            icon: <AutoAwesomeOutlinedIcon />,
            onClick: () => {
              console.log("Open AI Copilot");
            },
            prominent: true,
          },
          {
            label: "Governance Report",
            icon: <FactCheckOutlinedIcon />,
            onClick: () => {
              console.log("Open AI governance report");
            },
            variant: "outlined",
          },
          {
            label: "Model Health",
            icon: <PsychologyOutlinedIcon />,
            onClick: () => {
              console.log("Open AI model health monitor");
            },
            variant: "outlined",
          },
        ]}
      />

      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <MetricCard
          title="Enterprise AI Risk"
          value={`${metrics.enterpriseAIRiskScore}/100`}
          subtitle="Average risk across active insights"
          icon={<SecurityOutlinedIcon />}
          tone="critical"
        />

        <MetricCard
          title="Critical Insights"
          value={metrics.criticalInsights}
          subtitle="Immediate executive attention"
          icon={
            <WarningAmberOutlinedIcon />
          }
          tone="critical"
        />

        <MetricCard
          title="Action Required"
          value={metrics.actionRequired}
          subtitle="Insights awaiting intervention"
          icon={<FactCheckOutlinedIcon />}
          tone="warning"
        />

        <MetricCard
          title="Predicted Claims Cost"
          value={formatCompactCurrency(
            metrics.predictedClaimsCost,
          )}
          subtitle="Claims intelligence exposure"
          icon={<QueryStatsOutlinedIcon />}
          tone="warning"
        />

        <MetricCard
          title="Fraud Exposure"
          value={formatCompactCurrency(
            metrics.predictedFraudLoss,
          )}
          subtitle="Predicted fraud-related loss"
          icon={<GavelOutlinedIcon />}
          tone="critical"
        />

        <MetricCard
          title="Payment Leakage"
          value={formatCompactCurrency(
            metrics.paymentLeakageExposure,
          )}
          subtitle="Potential reimbursement leakage"
          icon={<PaymentsOutlinedIcon />}
          tone="critical"
        />

        <MetricCard
          title="Savings Identified"
          value={formatCompactCurrency(
            metrics.identifiedSavings,
          )}
          subtitle="AI-supported savings opportunity"
          icon={<TrendingUpOutlinedIcon />}
          tone="success"
        />

        <MetricCard
          title="Governance Exceptions"
          value={metrics.governanceExceptions}
          subtitle="Models requiring governance attention"
          icon={<FactCheckOutlinedIcon />}
          tone="warning"
        />

        <MetricCard
          title="Drift Alerts"
          value={metrics.driftAlerts}
          subtitle="Models outside normal drift status"
          icon={<InsightsOutlinedIcon />}
          tone="warning"
        />

        <MetricCard
          title="Bias Alerts"
          value={metrics.biasAlerts}
          subtitle="Fairness or bias review required"
          icon={<GroupsOutlinedIcon />}
          tone="warning"
        />
      </Box>

      {metrics.governanceExceptions > 0 && (
        <Alert
          severity="warning"
          sx={{
            mt: 3,
            borderRadius: 3,
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 900 }}
          >
            Responsible AI monitoring:
          </Typography>{" "}
          {metrics.governanceExceptions} insight
          {metrics.governanceExceptions === 1
            ? " has"
            : "s have"}{" "}
          governance conditions requiring
          human review, fairness assessment or
          enhanced model monitoring.
        </Alert>
      )}

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
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              Executive AI Brief
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
              }}
            >
              Highest-priority intelligence
              requiring executive and operational
              attention.
            </Typography>
          </Box>

          <Chip
            icon={<AutoAwesomeOutlinedIcon />}
            label="AI-Generated Brief"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <IntelligenceCard
            title="Highest-Risk Insight"
            value={
              criticalInsight?.title ??
              "Not available"
            }
            description={
              criticalInsight
                ? `${criticalInsight.riskScore}/100 risk score with ${criticalInsight.confidenceScore}% confidence.`
                : "No active risk insight is available."
            }
            icon={
              <WarningAmberOutlinedIcon />
            }
            severity="critical"
          />

          <IntelligenceCard
            title="Largest Financial Impact"
            value={
              highestFinancialInsight
                ? formatCompactCurrency(
                    highestFinancialInsight.financialImpact,
                  )
                : "Not available"
            }
            description={
              highestFinancialInsight?.title ??
              "No financial-impact insight is available."
            }
            icon={
              <AccountBalanceWalletOutlinedIcon />
            }
            severity="warning"
          />

          <IntelligenceCard
            title="Highest-Performing Model"
            value={
              strongestModel?.modelName ??
              "Not available"
            }
            description={
              strongestModel
                ? `${strongestModel.performanceMetric}: ${strongestModel.performanceValue} · ${strongestModel.deploymentStatus}`
                : "No model performance information is available."
            }
            icon={<PsychologyOutlinedIcon />}
            severity="success"
          />

          <IntelligenceCard
            title="Models Requiring Attention"
            value={String(
              criticalModels.length,
            )}
            description="Models with drift, bias or governance conditions outside the normal state."
            icon={<FactCheckOutlinedIcon />}
            severity={
              criticalModels.length > 0
                ? "warning"
                : "success"
            }
          />
        </Box>
      </Paper>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 2fr) minmax(340px, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 900 }}
          >
            Predictive Intelligence Portfolio
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.35,
              color: "text.secondary",
            }}
          >
            Financial exposure and opportunity
            across major insurance domains.
          </Typography>

          <Box
            sx={{
              mt: 2.5,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <IntelligenceCard
              title="Underwriting Risk"
              value={formatCompactCurrency(
                metrics.underwritingRiskExposure,
              )}
              description="Predicted new-business exposure requiring pricing or eligibility review."
              icon={
                <HealthAndSafetyOutlinedIcon />
              }
              severity="warning"
            />

            <IntelligenceCard
              title="Authorization Delay Risk"
              value={formatCompactCurrency(
                metrics.authorizationDelayExposure,
              )}
              description="Operational exposure associated with predicted SLA breaches."
              icon={
                <LocalHospitalOutlinedIcon />
              }
              severity="warning"
            />

            <IntelligenceCard
              title="Member Churn Exposure"
              value={formatCompactCurrency(
                metrics.memberChurnExposure,
              )}
              description="Revenue at risk from dissatisfaction, attrition and non-renewal."
              icon={<GroupsOutlinedIcon />}
              severity="warning"
            />

            <IntelligenceCard
              title="Provider Risk Exposure"
              value={formatCompactCurrency(
                metrics.providerRiskExposure,
              )}
              description="Clinical, financial and network exposure among high-risk providers."
              icon={<GroupsOutlinedIcon />}
              severity="critical"
            />

            <IntelligenceCard
              title="Recovery Opportunity"
              value={formatCompactCurrency(
                metrics.recoveryOpportunity,
              )}
              description="Potential fraud and payment-integrity recoveries."
              icon={<PaymentsOutlinedIcon />}
              severity="success"
            />

            <IntelligenceCard
              title="Average AI Confidence"
              value={`${metrics.averageConfidence}%`}
              description="Average confidence across all active enterprise insights."
              icon={<InsightsOutlinedIcon />}
              severity="success"
            />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 900 }}
          >
            Insight Distribution
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.35,
              color: "text.secondary",
            }}
          >
            Active AI insights by insurance
            business domain.
          </Typography>

          <Box
            sx={{
              mt: 2.5,
              display: "grid",
              gap: 1.7,
            }}
          >
            {domainDistribution.map(
              (item) => {
                const percentage =
                  metrics.totalInsights > 0
                    ? (item.count /
                        metrics.totalInsights) *
                      100
                    : 0;

                return (
                  <Box key={item.domain}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            color: "primary.main",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {getDomainIcon(
                            item.domain,
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {item.domain}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        {item.count}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        mt: 0.8,
                        height: 7,
                        borderRadius: 99,
                      }}
                    />
                  </Box>
                );
              },
            )}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              AI Insight Registry
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
              }}
            >
              Search, prioritize and review
              enterprise AI recommendations,
              predictions and anomalies.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              label={`${filteredInsights.length} Insights`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />

            <Chip
              label={`${formatCompactCurrency(
                visibleFinancialImpact,
              )} Impact`}
              color="error"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />

            <Chip
              label={`${formatCompactCurrency(
                visibleSavings,
              )} Savings`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(280px, 2fr) repeat(2, minmax(160px, 1fr))",
              xl: "minmax(300px, 2fr) repeat(5, minmax(150px, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <TextField
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Search insight, model, domain, entity or owner"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            size="small"
            label="Domain"
            value={domainFilter}
            onChange={(event) =>
              setDomainFilter(
                event.target.value as
                  | "All"
                  | AIInsightDomain,
              )
            }
          >
            {domainOptions.map((domain) => (
              <MenuItem
                key={domain}
                value={domain}
              >
                {domain}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Severity"
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(
                event.target.value as
                  | "All"
                  | AIInsightSeverity,
              )
            }
          >
            {severityOptions.map(
              (severity) => (
                <MenuItem
                  key={severity}
                  value={severity}
                >
                  {severity}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "All"
                  | AIInsightStatus,
              )
            }
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                value={status}
              >
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Governance"
            value={governanceFilter}
            onChange={(event) =>
              setGovernanceFilter(
                event.target.value as
                  | "All"
                  | GovernanceStatus,
              )
            }
          >
            {governanceOptions.map(
              (status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            size="small"
            label="Sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as SortOption,
              )
            }
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={
              <FilterAltOffOutlinedIcon />
            }
            onClick={resetFilters}
            sx={{
              minHeight: 40,
              borderRadius: 2,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

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
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 900 }}
            >
              Enterprise Insight Results
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              Showing {filteredInsights.length} of{" "}
              {aiInsightsDemoData.length} AI
              insights
            </Typography>
          </Box>

          <Chip
            icon={<PsychologyOutlinedIcon />}
            label="Human Oversight Enabled"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "rgba(27,37,89,0.045)",
                }}
              >
                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Insight
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Domain
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Primary Entity
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Severity
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Risk
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Confidence
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 900 }}
                >
                  Financial Impact
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 900 }}
                >
                  Savings
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Model
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Governance
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Drift
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Bias
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Owner
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900 }}
                >
                  Generated
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 900 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredInsights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={16}>
                    <Box
                      sx={{
                        py: 7,
                        textAlign: "center",
                      }}
                    >
                      <PsychologyOutlinedIcon
                        sx={{
                          fontSize: 54,
                          color: "text.disabled",
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          mt: 1,
                          fontWeight: 900,
                        }}
                      >
                        No AI insights found
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        Adjust the search or
                        filters to display
                        additional insights.
                      </Typography>

                      <Button
                        variant="outlined"
                        startIcon={
                          <FilterAltOffOutlinedIcon />
                        }
                        onClick={resetFilters}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          fontWeight: 800,
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInsights.map(
                  (insight: AIInsight) => (
                    <TableRow
                      key={insight.insightId}
                      hover
                      onDoubleClick={() =>
                        openInsight(
                          insight.insightId,
                        )
                      }
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {insight.insightId}
                        </Typography>

                        <Tooltip
                          title={insight.title}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.35,
                              maxWidth: 270,
                              overflow: "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace: "nowrap",
                              color:
                                "text.secondary",
                            }}
                          >
                            {insight.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "grid",
                              placeItems: "center",
                              color:
                                "primary.main",
                            }}
                          >
                            {getDomainIcon(
                              insight.domain,
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            {insight.domain}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            maxWidth: 220,
                          }}
                        >
                          {
                            insight.primaryEntityName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              "text.secondary",
                          }}
                        >
                          {
                            insight.primaryEntityType
                          }{" "}
                          ·{" "}
                          {
                            insight.primaryEntityId
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={insight.severity}
                          size="small"
                          color={getSeverityColour(
                            insight.severity,
                          )}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                        >
                          {insight.riskScore}/100
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                        >
                          {
                            insight.confidenceScore
                          }
                          %
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={
                            insight.confidenceScore
                          }
                          sx={{
                            mt: 0.6,
                            width: 85,
                            height: 5,
                            borderRadius: 99,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 900,
                            color: "error.main",
                          }}
                        >
                          {formatCurrency(
                            insight.financialImpact,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 900,
                            color:
                              "success.main",
                          }}
                        >
                          {formatCurrency(
                            insight.estimatedSavings,
                          )}
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
                            insight.model
                              .modelName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              "text.secondary",
                          }}
                        >
                          v
                          {
                            insight.model
                              .modelVersion
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            insight.governance
                              .governanceStatus
                          }
                          size="small"
                          color={getGovernanceColour(
                            insight.governance
                              .governanceStatus,
                          )}
                          variant="outlined"
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            insight.governance
                              .driftStatus
                          }
                          size="small"
                          color={getDriftColour(
                            insight.governance
                              .driftStatus,
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            insight.governance
                              .biasStatus
                          }
                          size="small"
                          color={getBiasColour(
                            insight.governance
                              .biasStatus,
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {insight.assignedOwner}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              "text.secondary",
                          }}
                        >
                          {insight.businessUnit}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={insight.status}
                          size="small"
                          color={getStatusColour(
                            insight.status,
                          )}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          insight.generatedDate,
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            <VisibilityOutlinedIcon />
                          }
                          onClick={(event) => {
                            event.stopPropagation();

                            openInsight(
                              insight.insightId,
                            );
                          }}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          View 360
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )
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
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              AI Model Governance Monitor
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
              }}
            >
              Production model performance,
              validation, drift, bias and
              governance status.
            </Typography>
          </Box>

          <Chip
            label={`${aiModels.length} Registered Models`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {aiModels.map((model) => (
            <Box
              key={model.modelId}
              sx={{
                p: 2.4,
                borderRadius: 3,
                border: "1px solid",
                borderColor:
                  model.governanceStatus ===
                  "Compliant"
                    ? "divider"
                    : "warning.light",
                backgroundColor:
                  model.governanceStatus ===
                  "Compliant"
                    ? "background.paper"
                    : "rgba(237,108,2,0.035)",
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
                    variant="h6"
                    sx={{ fontWeight: 900 }}
                  >
                    {model.modelName}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {model.modelId} · v
                    {model.modelVersion}
                  </Typography>
                </Box>

                <Chip
                  label={
                    model.deploymentStatus
                  }
                  size="small"
                  color={
                    model.deploymentStatus ===
                    "Production"
                      ? "success"
                      : model.deploymentStatus ===
                          "Restricted"
                        ? "error"
                        : "warning"
                  }
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 1.8 }} />

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Performance
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 900 }}
                  >
                    {model.performanceMetric}:{" "}
                    {model.performanceValue}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Owner
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      textAlign: "right",
                    }}
                  >
                    {model.owner}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={`Drift: ${model.driftStatus}`}
                    size="small"
                    color={getDriftColour(
                      model.driftStatus,
                    )}
                  />

                  <Chip
                    label={`Bias: ${model.biasStatus}`}
                    size="small"
                    color={getBiasColour(
                      model.biasStatus,
                    )}
                  />

                  <Chip
                    label={
                      model.governanceStatus
                    }
                    size="small"
                    color={getGovernanceColour(
                      model.governanceStatus,
                    )}
                  />
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Last validated{" "}
                  {formatDate(
                    model.lastValidatedDate,
                  )}{" "}
                  · Next review{" "}
                  {formatDate(
                    model.nextReviewDate,
                  )}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Paper>

      <Alert
        severity="info"
        icon={<PsychologyOutlinedIcon />}
        sx={{
          mt: 3,
          borderRadius: 3,
        }}
      >
        AI-generated predictions and
        recommendations support authorised
        healthcare insurance professionals.
        Clinical, underwriting, payment, fraud
        and coverage decisions remain subject to
        appropriate human review, policy rules
        and governance controls.
      </Alert>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "text.secondary" }}
        >
          MediVantage Enterprise AI
          Intelligence · {aiModels.length} AI
          Models · {metrics.totalInsights} Active
          Insights
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textAlign: "right",
          }}
        >
          Designed & Developed by Dr. Samuel
          Israel
        </Typography>
      </Box>
    </Box>
  );
}