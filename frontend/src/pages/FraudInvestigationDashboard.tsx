import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  AssessmentOutlined,
  CheckCircleOutlineOutlined,
  FilterAltOutlined,
  GavelOutlined,
  GroupsOutlined,
  InsightsOutlined,
  ManageSearchOutlined,
  OpenInNewOutlined,
  PaymentsOutlined,
  PersonSearchOutlined,
  RefreshOutlined,
  SearchOutlined,
  SecurityOutlined,
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
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
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

import type { SelectChangeEvent } from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import { getFraudCases } from "../services/fraudCasesApi";
import { getFraudAlerts } from "../services/fraudAlertsApi";
import { getFraudRecoveries } from "../services/fraudRecoveriesApi";

import type {
  FraudCase as ApiFraudCase,
  FraudAlert,
  FraudRecovery,
} from "../types/fraud";

type FraudCaseStatus =
  | "New"
  | "Under Review"
  | "Investigation"
  | "Escalated"
  | "Recovery Initiated"
  | "Closed"
  | "False Positive";

type FraudRiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

type FraudPriority = FraudRiskLevel;
type FraudCategory = string;

interface DashboardFraudCase {
  id: string;
  caseId: string;
  caseTitle: string;
  claimId: string;
  category: FraudCategory;
  status: FraudCaseStatus;
  riskLevel: FraudRiskLevel;
  priority: FraudPriority;
  fraudRiskScore: number;
  aiConfidenceScore: number;
  estimatedExposure: number;
  recoveryPotential: number;
  assignedInvestigator: string;
  investigationUnit: string;
  alertSource: string;
  createdDate: string;
  provider: {
    providerId: string;
    providerName: string;
  };
  member: {
    memberId: string;
    memberName: string;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  emphasis?:
    | "default"
    | "warning"
    | "critical"
    | "success";
}

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  severity:
    | "info"
    | "warning"
    | "critical"
    | "success";
}

type SortOption =
  | "Newest"
  | "Highest Risk"
  | "Highest Exposure"
  | "Highest Confidence";

const statusOptions: Array<
  "All" | FraudCaseStatus
> = [
  "All",
  "New",
  "Under Review",
  "Investigation",
  "Escalated",
  "Recovery Initiated",
  "Closed",
  "False Positive",
];

const riskOptions: Array<
  "All" | FraudRiskLevel
> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

const priorityOptions: Array<
  "All" | FraudPriority
> = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

const categoryOptions: Array<
  "All" | FraudCategory
> = [
  "All",
  "Claim Anomaly",
  "Duplicate Claims",
  "Upcoding",
  "Unbundling",
  "Phantom Billing",
  "Identity Fraud",
  "Provider Collusion",
  "Prescription Abuse",
  "Medical Necessity Abuse",
  "Laboratory Abuse",
  "Billing Pattern Anomaly",
  "Provider Overutilization",
  "Member Shopping",
];

const sortOptions: SortOption[] = [
  "Newest",
  "Highest Risk",
  "Highest Exposure",
  "Highest Confidence",
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(
  value: number,
): string {
  if (value >= 1_000_000) {
    return `SAR ${(value / 1_000_000).toFixed(
      2,
    )}M`;
  }

  if (value >= 1_000) {
    return `SAR ${(value / 1_000).toFixed(
      0,
    )}K`;
  }

  return `SAR ${value.toFixed(0)}`;
}

function formatDate(value: string): string {
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

function getStatusColour(
  status: FraudCaseStatus,
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
    case "Investigation":
      return "warning";

    case "Escalated":
      return "error";

    case "Recovery Initiated":
      return "info";

    case "Closed":
      return "success";

    case "False Positive":
      return "default";

    default:
      return "default";
  }
}

function getRiskColour(
  riskLevel: FraudRiskLevel,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (riskLevel) {
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

function getPriorityColour(
  priority: FraudPriority,
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  switch (priority) {
    case "Low":
      return "success";

    case "Medium":
      return "info";

    case "High":
      return "warning";

    case "Critical":
      return "error";

    default:
      return "default";
  }
}

function getRiskWeight(
  riskLevel: FraudRiskLevel,
): number {
  switch (riskLevel) {
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

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  emphasis = "default",
}: MetricCardProps) {
  const palette = {
    default: {
      background:
        "rgba(21,101,192,0.08)",
      foreground: "primary.main",
    },
    warning: {
      background:
        "rgba(237,108,2,0.10)",
      foreground: "warning.main",
    },
    critical: {
      background:
        "rgba(211,47,47,0.10)",
      foreground: "error.main",
    },
    success: {
      background:
        "rgba(46,125,50,0.10)",
      foreground: "success.main",
    },
  }[emphasis];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 220px",
        minWidth: 220,
        p: 2.3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 10px 28px rgba(15,23,42,0.07)",
        },
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
              mt: 0.7,
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
              mt: 0.45,
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
            color: palette.foreground,
            backgroundColor:
              palette.background,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function InsightCard({
  title,
  value,
  description,
  icon,
  severity,
}: InsightCardProps) {
  const palette = {
    info: {
      background:
        "rgba(21,101,192,0.05)",
      border:
        "rgba(21,101,192,0.20)",
      foreground: "primary.main",
    },
    warning: {
      background:
        "rgba(237,108,2,0.05)",
      border:
        "rgba(237,108,2,0.24)",
      foreground: "warning.main",
    },
    critical: {
      background:
        "rgba(211,47,47,0.05)",
      border:
        "rgba(211,47,47,0.24)",
      foreground: "error.main",
    },
    success: {
      background:
        "rgba(46,125,50,0.05)",
      border:
        "rgba(46,125,50,0.22)",
      foreground: "success.main",
    },
  }[severity];

  return (
    <Box
      sx={{
        p: 2.2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: palette.border,
        backgroundColor:
          palette.background,
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
            borderRadius: 2.1,
            color: palette.foreground,
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

export default function FraudInvestigationDashboard() {
  const navigate = useNavigate();

  const [fraudCases, setFraudCases] =
    useState<ApiFraudCase[]>([]);

  const [fraudAlerts, setFraudAlerts] =
    useState<FraudAlert[]>([]);

  const [fraudRecoveries, setFraudRecoveries] =
    useState<FraudRecovery[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | FraudCaseStatus>(
      "All",
    );

  const [riskFilter, setRiskFilter] =
    useState<"All" | FraudRiskLevel>(
      "All",
    );

  const [priorityFilter, setPriorityFilter] =
    useState<"All" | FraudPriority>(
      "All",
    );

  const [categoryFilter, setCategoryFilter] =
    useState<"All" | FraudCategory>(
      "All",
    );

  const [sortOption, setSortOption] =
    useState<SortOption>("Highest Risk");

  useEffect(() => {
    let active = true;

    async function loadFraudOperations() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [cases, alerts, recoveries] =
          await Promise.all([
            getFraudCases({
              skip: 0,
              limit: 500,
            }),
            getFraudAlerts(),
            getFraudRecoveries(),
          ]);

        if (!active) {
          return;
        }

        setFraudCases(cases);
        setFraudAlerts(alerts);
        setFraudRecoveries(recoveries);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load fraud operations.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadFraudOperations();

    return () => {
      active = false;
    };
  }, []);

  const dashboardCases = useMemo<
    DashboardFraudCase[]
  >(() => {
    const titleCaseToken = (value: string) =>
      value
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map(
          (part) =>
            part.charAt(0).toUpperCase() +
            part.slice(1),
        )
        .join(" ");

    const mapRisk = (
      value: string,
    ): FraudRiskLevel => {
      switch (value.toUpperCase()) {
        case "CRITICAL":
          return "Critical";
        case "HIGH":
          return "High";
        case "MEDIUM":
          return "Medium";
        case "LOW":
        default:
          return "Low";
      }
    };

    const mapStatus = (
      fraudCase: ApiFraudCase,
    ): FraudCaseStatus => {
      const status =
        fraudCase.status.toUpperCase();
      const stage =
        fraudCase.investigation_stage.toUpperCase();

      if (status === "CLOSED") {
        return "Closed";
      }

      if (status === "FALSE_POSITIVE") {
        return "False Positive";
      }

      if (status === "ESCALATED") {
        return "Escalated";
      }

      if (status === "RECOVERY") {
        return "Recovery Initiated";
      }

      if (stage === "INVESTIGATION") {
        return "Investigation";
      }

      if (status === "UNDER_REVIEW") {
        return "Under Review";
      }

      return "New";
    };

    const riskScore = (
      value: FraudRiskLevel,
    ): number => {
      switch (value) {
        case "Critical":
          return 95;
        case "High":
          return 80;
        case "Medium":
          return 55;
        case "Low":
        default:
          return 25;
      }
    };

    return fraudCases.map((fraudCase) => {
      const riskLevel = mapRisk(
        fraudCase.risk_level,
      );

      const priority = mapRisk(
        fraudCase.priority,
      );

      return {
        id: fraudCase.id,
        caseId: fraudCase.case_number,
        caseTitle: fraudCase.title,
        claimId:
          fraudCase.primary_claim_id ??
          "Not linked",
        category: titleCaseToken(
          fraudCase.case_type,
        ),
        status: mapStatus(fraudCase),
        riskLevel,
        priority,
        fraudRiskScore: riskScore(riskLevel),
        aiConfidenceScore: Number(
          fraudCase.ai_confidence ?? 0,
        ),
        estimatedExposure: Number(
          fraudCase.suspected_exposure ?? 0,
        ),
        recoveryPotential: Number(
          fraudCase.recovery_potential ?? 0,
        ),
        assignedInvestigator:
          fraudCase.assigned_investigator ??
          "Unassigned",
        investigationUnit:
          fraudCase.investigation_unit ??
          "Special Investigations Unit",
        alertSource: titleCaseToken(
          fraudCase.source,
        ),
        createdDate: fraudCase.created_at,
        provider: {
          providerId:
            fraudCase.provider_id ??
            "Not linked",
          providerName:
            fraudCase.provider_id
              ? "Linked Provider"
              : "Not linked",
        },
        member: {
          memberId:
            fraudCase.member_id ??
            "Not linked",
          memberName:
            fraudCase.member_id
              ? "Linked Member"
              : "Not linked",
        },
      };
    });
  }, [fraudCases]);

  const metrics = useMemo(() => {
    const activeInvestigations =
      fraudCases.filter(
        (fraudCase) =>
          fraudCase.status !== "CLOSED" &&
          fraudCase.status !==
            "FALSE_POSITIVE",
      ).length;

    const criticalCases = fraudCases.filter(
      (fraudCase) =>
        fraudCase.risk_level === "CRITICAL" &&
        fraudCase.status !== "CLOSED" &&
        fraudCase.status !== "FALSE_POSITIVE",
    ).length;

    const highRiskClaims = fraudCases.filter(
      (fraudCase) =>
        fraudCase.risk_level === "HIGH" ||
        fraudCase.risk_level === "CRITICAL",
    ).length;

    const estimatedExposure = fraudCases.reduce(
      (total, fraudCase) =>
        total +
        Number(
          fraudCase.suspected_exposure ?? 0,
        ),
      0,
    );

    const identifiedSavings = fraudCases.reduce(
      (total, fraudCase) =>
        total +
        Number(fraudCase.prevented_loss ?? 0),
      0,
    );

    const recoveryPotential = fraudCases.reduce(
      (total, fraudCase) =>
        total +
        Number(
          fraudCase.recovery_potential ?? 0,
        ),
      0,
    );

    const recoveredFromCases = fraudCases.reduce(
      (total, fraudCase) =>
        total +
        Number(
          fraudCase.recovered_amount ?? 0,
        ),
      0,
    );

    const recoveredFromLedger =
      fraudRecoveries.reduce(
        (total, recovery) =>
          total +
          Number(
            recovery.recovered_amount ?? 0,
          ),
        0,
      );

    const investigationBacklog =
      fraudCases.filter(
        (fraudCase) =>
          fraudCase.status === "OPEN" ||
          fraudCase.status === "UNDER_REVIEW",
      ).length;

    return {
      activeInvestigations,
      criticalCases,
      highRiskClaims,
      estimatedExposure,
      identifiedSavings,
      recoveryPotential,
      recoveredAmount:
        recoveredFromLedger > 0
          ? recoveredFromLedger
          : recoveredFromCases,
      aiAlerts: fraudAlerts.length,
      investigationBacklog,
    };
  }, [
    fraudAlerts,
    fraudCases,
    fraudRecoveries,
  ]);

  const filteredCases = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = dashboardCases.filter(
      (fraudCase) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          fraudCase.caseId
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.caseTitle
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.claimId
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.member.memberName
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.member.memberId
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.provider.providerName
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.provider.providerId
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.assignedInvestigator
            .toLowerCase()
            .includes(normalizedSearch) ||
          fraudCase.category
            .toLowerCase()
            .includes(normalizedSearch);

        return (
          matchesSearch &&
          (statusFilter === "All" ||
            fraudCase.status ===
              statusFilter) &&
          (riskFilter === "All" ||
            fraudCase.riskLevel ===
              riskFilter) &&
          (priorityFilter === "All" ||
            fraudCase.priority ===
              priorityFilter) &&
          (categoryFilter === "All" ||
            fraudCase.category ===
              categoryFilter)
        );
      },
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "Newest":
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          );

        case "Highest Exposure":
          return (
            b.estimatedExposure -
            a.estimatedExposure
          );

        case "Highest Confidence":
          return (
            b.aiConfidenceScore -
            a.aiConfidenceScore
          );

        case "Highest Risk":
        default:
          return (
            getRiskWeight(b.riskLevel) -
              getRiskWeight(a.riskLevel) ||
            b.fraudRiskScore -
              a.fraudRiskScore
          );
      }
    });
  }, [
    categoryFilter,
    dashboardCases,
    priorityFilter,
    riskFilter,
    searchTerm,
    sortOption,
    statusFilter,
  ]);

  const visibleExposure = useMemo(
    () =>
      filteredCases.reduce(
        (total, fraudCase) =>
          total +
          fraudCase.estimatedExposure,
        0,
      ),
    [filteredCases],
  );

  const visibleRecovery = useMemo(
    () =>
      filteredCases.reduce(
        (total, fraudCase) =>
          total +
          fraudCase.recoveryPotential,
        0,
      ),
    [filteredCases],
  );

  const criticalOpenCases = useMemo(
    () =>
      dashboardCases.filter(
        (fraudCase) =>
          fraudCase.riskLevel ===
            "Critical" &&
          fraudCase.status !== "Closed" &&
          fraudCase.status !==
            "False Positive",
      ),
    [dashboardCases],
  );

  const topProvider = useMemo(
    () =>
      [...dashboardCases].sort(
        (a, b) =>
          b.estimatedExposure -
          a.estimatedExposure,
      )[0],
    [dashboardCases],
  );

  const leadingCategory = useMemo(() => {
    const categoryTotals =
      dashboardCases.reduce<
        Record<string, number>
      >((accumulator, fraudCase) => {
        accumulator[fraudCase.category] =
          (accumulator[
            fraudCase.category
          ] ?? 0) + 1;

        return accumulator;
      }, {});

    return Object.entries(
      categoryTotals,
    ).sort((a, b) => b[1] - a[1])[0];
  }, [dashboardCases]);

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("All");
    setRiskFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setSortOption("Highest Risk");
  }

  function handleSelectChange(
    setter: (value: string) => void,
  ) {
    return (
      event: SelectChangeEvent<string>,
    ) => {
      setter(event.target.value);
    };
  }

  function openCase(
    fraudCase: DashboardFraudCase,
  ) {
    navigate(
      `/fraud-investigations/${encodeURIComponent(
        fraudCase.caseId,
      )}`,
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="SPECIAL INVESTIGATIONS UNIT"
        title="Fraud Investigation Center"
        description="Detect, prioritize, investigate and recover financial exposure across claims, providers, members, payments and clinical utilization."
        icon={<ShieldOutlined />}
        context="MediVantage Fraud Operations"
        updatedText="Updated moments ago"
        statusLabel="Live Fraud Surveillance"
        statusTone="success"
        stats={[
          {
            label: "Active Investigations",
            value:
              metrics.activeInvestigations,
            icon: (
              <ManageSearchOutlined />
            ),
            tone: "primary",
          },
          {
            label: "Critical Cases",
            value: metrics.criticalCases,
            icon: (
              <WarningAmberOutlined />
            ),
            tone: "error",
          },
          {
            label: "Estimated Exposure",
            value: formatCompactCurrency(
              metrics.estimatedExposure,
            ),
            icon: (
              <AccountBalanceWalletOutlined />
            ),
            tone: "warning",
          },
          {
            label: "AI Alerts",
            value: metrics.aiAlerts,
            icon: <InsightsOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "Create Investigation",
            icon: <AddOutlined />,
            onClick: () => {
              console.log(
                "Create fraud investigation",
              );
            },
            prominent: true,
          },
          {
            label: "Investigation Queue",
            icon: (
              <ManageSearchOutlined />
            ),
            onClick: () => {
              console.log(
                "Open investigation queue",
              );
            },
            variant: "outlined",
          },
          {
            label: "Fraud Analytics",
            icon: <AssessmentOutlined />,
            onClick: () => {
              console.log(
                "Open fraud analytics",
              );
            },
            variant: "outlined",
          },
        ]}
      />

      {isLoading && (
        <Alert
          severity="info"
          icon={<CircularProgress size={18} />}
          sx={{ mt: 3, borderRadius: 3 }}
        >
          Loading live fraud investigation data…
        </Alert>
      )}

      {loadError && (
        <Alert
          severity="error"
          sx={{ mt: 3, borderRadius: 3 }}
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
          title="Active Investigations"
          value={metrics.activeInvestigations}
          subtitle="Open fraud and payment-integrity cases"
          icon={
            <ManageSearchOutlined />
          }
        />

        <MetricCard
          title="Critical Cases"
          value={metrics.criticalCases}
          subtitle="Immediate executive attention required"
          icon={
            <WarningAmberOutlined />
          }
          emphasis="critical"
        />

        <MetricCard
          title="High-Risk Claims"
          value={metrics.highRiskClaims}
          subtitle="Claims with elevated anomaly scores"
          icon={<SecurityOutlined />}
          emphasis="warning"
        />

        <MetricCard
          title="Estimated Exposure"
          value={formatCompactCurrency(
            metrics.estimatedExposure,
          )}
          subtitle="Potential financial exposure"
          icon={
            <AccountBalanceWalletOutlined />
          }
          emphasis="critical"
        />

        <MetricCard
          title="Savings Identified"
          value={formatCompactCurrency(
            metrics.identifiedSavings,
          )}
          subtitle="Prevented or avoidable expenditure"
          icon={<TrendingUpOutlined />}
          emphasis="success"
        />

        <MetricCard
          title="Recovered Amount"
          value={formatCompactCurrency(
            metrics.recoveredAmount,
          )}
          subtitle="Confirmed funds recovered"
          icon={<PaymentsOutlined />}
          emphasis="success"
        />

        <MetricCard
          title="AI Alerts"
          value={metrics.aiAlerts}
          subtitle="Machine-generated anomaly alerts"
          icon={<InsightsOutlined />}
        />

        <MetricCard
          title="Investigation Backlog"
          value={metrics.investigationBacklog}
          subtitle="Cases awaiting investigator action"
          icon={<GavelOutlined />}
          emphasis="warning"
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
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent:
              "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
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
              AI Fraud Intelligence
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
              }}
            >
              Cross-case risk signals,
              provider patterns and recovery
              opportunities.
            </Typography>
          </Box>

          <Chip
            icon={<InsightsOutlined />}
            label="Real-time Intelligence"
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
          <InsightCard
            title="Critical Open Cases"
            value={String(
              criticalOpenCases.length,
            )}
            description="Critical cases that remain unresolved."
            icon={
              <WarningAmberOutlined />
            }
            severity="critical"
          />

          <InsightCard
            title="Highest-Exposure Provider"
            value={
              topProvider?.provider
                .providerName ??
              "Not available"
            }
            description={
              topProvider
                ? `${topProvider.riskLevel} risk · ${formatCompactCurrency(topProvider.estimatedExposure)} exposure.`
                : "No provider exposure information is available."
            }
            icon={<GroupsOutlined />}
            severity="warning"
          />

          <InsightCard
            title="Leading Fraud Category"
            value={
              leadingCategory?.[0] ??
              "Not available"
            }
            description={
              leadingCategory
                ? `${leadingCategory[1]} investigation case${
                    leadingCategory[1] === 1
                      ? ""
                      : "s"
                  } currently classified in this category.`
                : "No active category information is available."
            }
            icon={
              <PersonSearchOutlined />
            }
            severity="info"
          />

          <InsightCard
            title="Recovery Potential"
            value={formatCompactCurrency(
              metrics.recoveryPotential,
            )}
            description="Potential recoverable amount identified across investigations."
            icon={
              <CheckCircleOutlineOutlined />
            }
            severity="success"
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
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent:
              "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
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
              Investigation Registry
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
              }}
            >
              Search, filter and review active
              and historical fraud cases.
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
              label={`${filteredCases.length} Cases`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />

            <Chip
              label={formatCompactCurrency(
                visibleExposure,
              )}
              color="error"
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />

            <Chip
              label={`${formatCompactCurrency(
                visibleRecovery,
              )} Recovery`}
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
              md: "minmax(260px, 2fr) repeat(2, minmax(150px, 1fr))",
              xl: "minmax(280px, 2fr) repeat(4, minmax(145px, 1fr)) auto",
            },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <TextField
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Search case, claim, member, provider or investigator"
            size="small"
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

          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={handleSelectChange(
                (value) =>
                  setStatusFilter(
                    value as
                      | "All"
                      | FraudCaseStatus,
                  ),
              )}
              displayEmpty
            >
              {statusOptions.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status === "All"
                    ? "All Statuses"
                    : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={riskFilter}
              onChange={handleSelectChange(
                (value) =>
                  setRiskFilter(
                    value as
                      | "All"
                      | FraudRiskLevel,
                  ),
              )}
              displayEmpty
            >
              {riskOptions.map((risk) => (
                <MenuItem
                  key={risk}
                  value={risk}
                >
                  {risk === "All"
                    ? "All Risk Levels"
                    : risk}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={priorityFilter}
              onChange={handleSelectChange(
                (value) =>
                  setPriorityFilter(
                    value as
                      | "All"
                      | FraudPriority,
                  ),
              )}
              displayEmpty
            >
              {priorityOptions.map(
                (priority) => (
                  <MenuItem
                    key={priority}
                    value={priority}
                  >
                    {priority === "All"
                      ? "All Priorities"
                      : priority}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={categoryFilter}
              onChange={handleSelectChange(
                (value) =>
                  setCategoryFilter(
                    value as
                      | "All"
                      | FraudCategory,
                  ),
              )}
              displayEmpty
            >
              {categoryOptions.map(
                (category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={sortOption}
              onChange={handleSelectChange(
                (value) =>
                  setSortOption(
                    value as SortOption,
                  ),
              )}
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  Sort: {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlined />
            }
            onClick={resetFilters}
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Reset
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          <FilterAltOutlined
            fontSize="small"
            sx={{
              color: "text.secondary",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
            }}
          >
            Showing {filteredCases.length} of{" "}
            {dashboardCases.length} cases
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1650 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "rgba(15,76,117,0.045)",
                }}
              >
                <TableCell sx={{ fontWeight: 900 }}>
                  Case
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Provider
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Member
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Claim
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Risk
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Priority
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  AI Confidence
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 900 }}
                >
                  Exposure
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 900 }}
                >
                  Recovery
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Investigator
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 900 }}>
                  Created
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
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14}>
                    <Box
                      sx={{
                        py: 7,
                        textAlign: "center",
                      }}
                    >
                      <ManageSearchOutlined
                        sx={{
                          fontSize: 52,
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
                        No investigations found
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        Adjust the search or filter
                        criteria and try again.
                      </Typography>

                      <Button
                        variant="outlined"
                        startIcon={
                          <RefreshOutlined />
                        }
                        onClick={resetFilters}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          fontWeight: 800,
                          textTransform: "none",
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map(
                  (fraudCase) => (
                    <TableRow
                      key={fraudCase.caseId}
                      hover
                      onDoubleClick={() =>
                        openCase(fraudCase)
                      }
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                        >
                          {fraudCase.caseId}
                        </Typography>

                        <Tooltip
                          title={
                            fraudCase.caseTitle
                          }
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.35,
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace: "nowrap",
                              color:
                                "text.secondary",
                            }}
                          >
                            {
                              fraudCase.caseTitle
                            }
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            fraudCase.category
                          }
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 190,
                            fontWeight: 800,
                          }}
                        >
                          {
                            fraudCase.provider
                              .providerName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            fraudCase.provider
                              .providerId
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800 }}
                        >
                          {
                            fraudCase.member
                              .memberName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            fraudCase.member
                              .memberId
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800 }}
                        >
                          {fraudCase.claimId}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            fraudCase.alertSource
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${fraudCase.riskLevel} · ${fraudCase.fraudRiskScore}`}
                          size="small"
                          color={getRiskColour(
                            fraudCase.riskLevel,
                          )}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            fraudCase.priority
                          }
                          size="small"
                          color={getPriorityColour(
                            fraudCase.priority,
                          )}
                          variant="outlined"
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                        >
                          {
                            fraudCase.aiConfidenceScore
                          }
                          %
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            color: "error.main",
                            fontWeight: 900,
                          }}
                        >
                          {formatCurrency(
                            fraudCase.estimatedExposure,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "success.main",
                            fontWeight: 900,
                          }}
                        >
                          {formatCurrency(
                            fraudCase.recoveryPotential,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800 }}
                        >
                          {
                            fraudCase.assignedInvestigator
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            fraudCase.investigationUnit
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={fraudCase.status}
                          size="small"
                          color={getStatusColour(
                            fraudCase.status,
                          )}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          fraudCase.createdDate,
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={
                            <OpenInNewOutlined />
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            openCase(fraudCase);
                          }}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            textTransform: "none",
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

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Enterprise Fraud, Waste &
        Abuse Investigation Center · Designed &
        Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}