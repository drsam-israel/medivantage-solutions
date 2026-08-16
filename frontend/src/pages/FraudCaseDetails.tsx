import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { getFraudCases } from "../services/fraudCasesApi";
import { getFraudAlerts } from "../services/fraudAlertsApi";
import { getFraudEvidence } from "../services/fraudEvidenceApi";
import { getFraudInvestigatorNotes } from "../services/fraudInvestigatorNotesApi";
import { getFraudActions } from "../services/fraudActionsApi";
import { getFraudRecoveries } from "../services/fraudRecoveriesApi";
import { getFraudTimelineEvents } from "../services/fraudTimelineApi";
import { getClaims } from "../services/claimsApi";
import { getMembers } from "../services/membersApi";
import { getProviders } from "../services/providersApi";

import type {
  FraudAction,
  FraudAlert,
  FraudCase,
  FraudEvidence,
  FraudInvestigatorNote,
  FraudRecovery,
  FraudTimelineEvent,
} from "../types/fraud";
import type { Claim } from "../types/claim";
import type { Member } from "../types/member";
import type { Provider } from "../types/provider";

type ChipColour =
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  tone?: "default" | "success" | "warning" | "critical";
}

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

const money = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return money.format(Number(value ?? 0));
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function humanize(value: string | null | undefined): string {
  if (!value) return "Not available";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function riskColour(value: string): ChipColour {
  switch (value.toUpperCase()) {
    case "LOW":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HIGH":
    case "CRITICAL":
      return "error";
    default:
      return "default";
  }
}

function statusColour(value: string): ChipColour {
  switch (value.toUpperCase()) {
    case "CLOSED":
    case "COMPLETED":
    case "VERIFIED":
    case "RECOVERED":
      return "success";
    case "ESCALATED":
    case "FAILED":
      return "error";
    case "UNDER_REVIEW":
    case "INVESTIGATION":
    case "PENDING":
    case "OPEN":
      return "warning";
    case "NEW":
      return "info";
    default:
      return "default";
  }
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  tone = "default",
}: SummaryCardProps) {
  const palette = {
    default: { bg: "rgba(21,101,192,0.08)", fg: "primary.main" },
    success: { bg: "rgba(46,125,50,0.08)", fg: "success.main" },
    warning: { bg: "rgba(237,108,2,0.08)", fg: "warning.main" },
    critical: { bg: "rgba(211,47,47,0.08)", fg: "error.main" },
  }[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 220px",
        minWidth: 0,
        p: 2.4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.6, fontWeight: 900 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 46,
            height: 46,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.4,
            backgroundColor: palette.bg,
            color: palette.fg,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, mb: 2.2 }}>
      <Box sx={{ color: "primary.main", mt: 0.15 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
      {text}
    </Typography>
  );
}

export default function FraudCaseDetails() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();

  const [fraudCase, setFraudCase] = useState<FraudCase | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [evidence, setEvidence] = useState<FraudEvidence[]>([]);
  const [notes, setNotes] = useState<FraudInvestigatorNote[]>([]);
  const [actions, setActions] = useState<FraudAction[]>([]);
  const [recoveries, setRecoveries] = useState<FraudRecovery[]>([]);
  const [timeline, setTimeline] = useState<FraudTimelineEvent[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkspace() {
      if (!caseId) {
        setLoadError("Fraud case identifier is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const decoded = decodeURIComponent(caseId);
        const cases = await getFraudCases({ skip: 0, limit: 500 });
        const selected =
          cases.find((item) => item.id === decoded) ??
          cases.find((item) => item.case_number === decoded);

        if (!selected) {
          throw new Error("Fraud case not found.");
        }

        const [
          caseAlerts,
          caseEvidence,
          caseNotes,
          caseActions,
          caseRecoveries,
          caseTimeline,
          claimsData,
          membersData,
          providersData,
        ] = await Promise.all([
          getFraudAlerts(selected.id),
          getFraudEvidence(selected.id),
          getFraudInvestigatorNotes(selected.id),
          getFraudActions(selected.id),
          getFraudRecoveries(selected.id),
          getFraudTimelineEvents(selected.id),
          getClaims(),
          getMembers(),
          getProviders(),
        ]);

        if (!active) return;

        setFraudCase(selected);
        setAlerts(caseAlerts);
        setEvidence(caseEvidence);
        setNotes(caseNotes);
        setActions(caseActions);
        setRecoveries(caseRecoveries);
        setClaims(claimsData);
        setMembers(membersData);
        setProviders(providersData);
        setTimeline(
          [...caseTimeline].sort(
            (a, b) =>
              new Date(b.event_timestamp).getTime() -
              new Date(a.event_timestamp).getTime(),
          ),
        );
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load the Fraud Investigation 360 workspace.",
        );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadWorkspace();

    return () => {
      active = false;
    };
  }, [caseId]);

  const recoveredAmount = useMemo(
    () =>
      recoveries.reduce(
        (total, item) => total + Number(item.recovered_amount ?? 0),
        0,
      ) || Number(fraudCase?.recovered_amount ?? 0),
    [recoveries, fraudCase],
  );

  const recoveryPotential = Number(fraudCase?.recovery_potential ?? 0);
  const recoveryProgress =
    recoveryPotential > 0
      ? Math.min(100, (recoveredAmount / recoveryPotential) * 100)
      : 0;

  if (isLoading) {
    return (
      <Box sx={{ py: 10, display: "grid", placeItems: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading Fraud Investigation 360...
        </Typography>
      </Box>
    );
  }

  if (loadError || !fraudCase) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="error" sx={{ maxWidth: 760, mx: "auto", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Fraud investigation unavailable
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {loadError ?? "The requested investigation could not be located."}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate("/fraud-investigations")}
            sx={{ mt: 2, borderRadius: 2, fontWeight: 800 }}
          >
            Return to Investigation Center
          </Button>
        </Alert>
      </Box>
    );
  }

  const riskScore = Math.max(
    0,
    Math.min(100, Number(fraudCase.ai_confidence ?? 0)),
  );

  const linkedClaim = fraudCase.primary_claim_id
    ? claims.find(
        (claim) => claim.id === fraudCase.primary_claim_id,
      )
    : undefined;

  const linkedMember = fraudCase.member_id
    ? members.find(
        (member) => member.id === fraudCase.member_id,
      )
    : undefined;

  const linkedProvider = fraudCase.provider_id
    ? providers.find(
        (provider) => provider.id === fraudCase.provider_id,
      )
    : undefined;

  const memberName = linkedMember
    ? [
        linkedMember.first_name,
        linkedMember.middle_name,
        linkedMember.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : fraudCase.member_id
      ? "Member record unavailable"
      : "No member linked";

  const memberReference =
    linkedMember?.member_number ??
    (fraudCase.member_id
      ? "Member record unavailable"
      : "No member linked");

  const providerName =
    linkedProvider?.provider_name ??
    (fraudCase.provider_id
      ? "Provider record unavailable"
      : "No provider linked");

  const providerReference =
    linkedProvider?.provider_code ??
    (fraudCase.provider_id
      ? "Provider record unavailable"
      : "No provider linked");

  const claimReference =
    linkedClaim?.claim_number ??
    (fraudCase.primary_claim_id
      ? "Claim record unavailable"
      : "No claim linked");

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Button
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate("/fraud-investigations")}
        sx={{ mb: 2, fontWeight: 800 }}
      >
        Back to Investigation Center
      </Button>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          color: "common.white",
          background:
            "linear-gradient(135deg, #2b0f1f 0%, #6d1838 52%, #a12a4c 100%)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 820 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShieldOutlinedIcon />
              <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1.2 }}>
                FRAUD INVESTIGATION 360
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mt: 0.7, fontWeight: 900 }}>
              {fraudCase.case_number}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.8, fontWeight: 800, opacity: 0.95 }}>
              {fraudCase.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.88 }}>
              Member {memberName} ({memberReference}) · Provider{" "}
              {providerName} ({providerReference}) · Claim{" "}
              {claimReference}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip label={humanize(fraudCase.status)} color={statusColour(fraudCase.status)} />
              <Chip label={`${humanize(fraudCase.risk_level)} Risk`} color={riskColour(fraudCase.risk_level)} />
              <Chip label={`${humanize(fraudCase.priority)} Priority`} color={riskColour(fraudCase.priority)} />
              <Chip
                label={`${Number(fraudCase.ai_confidence ?? 0).toFixed(0)}% AI Confidence`}
                sx={{
                  color: "common.white",
                  fontWeight: 800,
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: 290 },
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              AI Investigation Confidence
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.4, fontWeight: 900 }}>
              {riskScore}/100
            </Typography>
            <LinearProgress
              variant="determinate"
              value={riskScore}
              sx={{
                mt: 1.5,
                height: 8,
                borderRadius: 99,
                backgroundColor: "rgba(255,255,255,0.18)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 99,
                  backgroundColor: "common.white",
                },
              }}
            />
            <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.85 }}>
              Last updated {formatDateTime(fraudCase.updated_at)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <SummaryCard
          title="Suspected Exposure"
          value={formatCurrency(fraudCase.suspected_exposure)}
          subtitle="Potential financial exposure"
          icon={<AccountBalanceWalletOutlinedIcon />}
          tone="critical"
        />
        <SummaryCard
          title="Validated Exposure"
          value={formatCurrency(fraudCase.validated_exposure)}
          subtitle="Validated investigation exposure"
          icon={<WarningAmberOutlinedIcon />}
          tone="warning"
        />
        <SummaryCard
          title="Prevented Loss"
          value={formatCurrency(fraudCase.prevented_loss)}
          subtitle="Loss prevented through intervention"
          icon={<QueryStatsOutlinedIcon />}
          tone="success"
        />
        <SummaryCard
          title="Recovery Potential"
          value={formatCurrency(recoveryPotential)}
          subtitle="Recoverable amount identified"
          icon={<PaymentsOutlinedIcon />}
          tone="success"
        />
        <SummaryCard
          title="Recovered Amount"
          value={formatCurrency(recoveredAmount)}
          subtitle="Recovery ledger total"
          icon={<CheckCircleOutlinedIcon />}
          tone="success"
        />
        <SummaryCard
          title="AI Alerts"
          value={alerts.length}
          subtitle="Live machine-generated signals"
          icon={<InsightsOutlinedIcon />}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 2fr) minmax(330px, 1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "grid", gap: 3, minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader
              icon={<ManageSearchOutlinedIcon />}
              title="Executive Case Summary"
              subtitle="Live investigation context and AI rationale."
            />
            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.75 }}>
              {fraudCase.fraud_summary ?? fraudCase.description ?? "No case summary recorded."}
            </Typography>
            <Divider sx={{ my: 2.5 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Case Description</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.7 }}>
                  {fraudCase.description ?? "Not recorded."}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>AI Rationale</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.7 }}>
                  {fraudCase.ai_rationale ?? "No AI rationale recorded."}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<InsightsOutlinedIcon />} title="AI Alerts" subtitle="Live fraud and anomaly signals." />
            {alerts.length === 0 ? (
              <EmptyState text="No fraud alerts are linked to this investigation." />
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
                {alerts.map((alert) => (
                  <Paper key={alert.id} variant="outlined" sx={{ p: 2.3, borderRadius: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Typography sx={{ fontWeight: 900 }}>{alert.title}</Typography>
                      <Chip size="small" label={humanize(alert.risk_level)} color={riskColour(alert.risk_level)} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.65 }}>
                      {alert.description ?? "No description."}
                    </Typography>
                                          <Typography
                       variant="caption"
                       sx={{
                         display: "block",
                         mt: 1.4,
                       }}
                     >
                       {alert.alert_number} ·{" "}
                       {alert.model_name ?? "Model not recorded"} ·{" "}
                       {alert.confidence_score ?? 0}% confidence
                     </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<FactCheckOutlinedIcon />} title="Evidence Repository" subtitle="Verified investigation evidence." />
            {evidence.length === 0 ? (
              <EmptyState text="No evidence records are linked to this investigation." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>Evidence</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Source</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evidence.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.evidence_number}</Typography>
                        </TableCell>
                        <TableCell>{humanize(item.evidence_type)}</TableCell>
                        <TableCell>{item.source_reference ?? "—"}</TableCell>
                        <TableCell><Chip size="small" label={humanize(item.status)} color={statusColour(item.status)} /></TableCell>
                        <TableCell>{formatDate(item.uploaded_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<AssignmentOutlinedIcon />} title="Investigator Notes" subtitle="Live SIU investigation record." />
            {notes.length === 0 ? (
              <EmptyState text="No investigator notes have been recorded." />
            ) : (
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {notes.map((note) => (
                  <Paper key={note.id} variant="outlined" sx={{ p: 2.2, borderRadius: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 900 }}>{note.author}</Typography>
                      <Chip size="small" label={humanize(note.visibility)} variant="outlined" />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.7 }}>{note.note_text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {note.author_role ?? "Investigator"} · {formatDate(note.note_date)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<GavelOutlinedIcon />} title="Investigation Actions" subtitle="Assigned actions and remediation work." />
            {actions.length === 0 ? (
              <EmptyState text="No investigation actions have been recorded." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Due</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>Est. Recovery</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actions.map((action) => (
                      <TableRow key={action.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>{humanize(action.action_type)}</Typography>
                          <Typography variant="caption" color="text.secondary">{action.action_description}</Typography>
                        </TableCell>
                        <TableCell>{action.owner}</TableCell>
                        <TableCell><Chip size="small" label={humanize(action.priority)} color={riskColour(action.priority)} /></TableCell>
                        <TableCell><Chip size="small" label={humanize(action.status)} color={statusColour(action.status)} /></TableCell>
                        <TableCell>{formatDate(action.due_date)}</TableCell>
                        <TableCell align="right">{formatCurrency(action.estimated_recovery)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<PaymentsOutlinedIcon />} title="Recovery Ledger" subtitle="Financial recovery activity linked to the case." />
            {recoveries.length === 0 ? (
              <EmptyState text="No recovery records have been created." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900 }}>Recovery</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Counterparty</TableCell>
                      <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>Identified</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>Recovered</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recoveries.map((recovery) => (
                      <TableRow key={recovery.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>{humanize(recovery.recovery_type)}</Typography>
                          <Typography variant="caption" color="text.secondary">{recovery.recovery_number}</Typography>
                        </TableCell>
                        <TableCell>{recovery.counterparty ?? "—"}</TableCell>
                        <TableCell><Chip size="small" label={humanize(recovery.recovery_status)} color={statusColour(recovery.recovery_status)} /></TableCell>
                        <TableCell align="right">{formatCurrency(recovery.identified_amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(recovery.recovered_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<TimelineOutlinedIcon />} title="Investigation Timeline" subtitle="Chronological audit trail from the live backend." />
            {timeline.length === 0 ? (
              <EmptyState text="No timeline events have been recorded." />
            ) : (
              <Box sx={{ display: "grid", gap: 1.4 }}>
                {timeline.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "160px minmax(0, 1fr)" },
                      gap: 2,
                      p: 2,
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {formatDateTime(event.event_timestamp)}
                    </Typography>
                    <Box>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                        <Typography sx={{ fontWeight: 900 }}>{event.title}</Typography>
                        <Chip size="small" label={humanize(event.status)} color={statusColour(event.status)} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
                        {event.description ?? humanize(event.event_type)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.performed_by} · {event.source_reference ?? event.event_number}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ display: "grid", gap: 3 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<PersonSearchOutlinedIcon />} title="Case Identity" />
            <Box sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="body2">
                <strong>Member:</strong> {memberName}
              </Typography>
              <Typography variant="body2">
                <strong>Member Number:</strong> {memberReference}
              </Typography>
              <Typography variant="body2">
                <strong>Provider:</strong> {providerName}
              </Typography>
              <Typography variant="body2">
                <strong>Provider Code:</strong> {providerReference}
              </Typography>
              <Typography variant="body2">
                <strong>Primary Claim:</strong> {claimReference}
              </Typography>
              <Typography variant="body2">
                <strong>Source:</strong> {humanize(fraudCase.source)}
              </Typography>
              <Typography variant="body2">
                <strong>Case Type:</strong> {humanize(fraudCase.case_type)}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<ScheduleOutlinedIcon />} title="Investigation Control" />
            <Box sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="body2"><strong>Stage:</strong> {humanize(fraudCase.investigation_stage)}</Typography>
              <Typography variant="body2"><strong>Investigator:</strong> {fraudCase.assigned_investigator ?? "Unassigned"}</Typography>
              <Typography variant="body2"><strong>Unit:</strong> {fraudCase.investigation_unit ?? "Not assigned"}</Typography>
              <Typography variant="body2"><strong>Opened:</strong> {formatDate(fraudCase.opened_date)}</Typography>
              <Typography variant="body2"><strong>Target Resolution:</strong> {formatDate(fraudCase.target_resolution_date)}</Typography>
              <Typography variant="body2"><strong>Closed:</strong> {formatDate(fraudCase.closed_date)}</Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<PaymentsOutlinedIcon />} title="Recovery Progress" />
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {recoveryProgress.toFixed(0)}%
            </Typography>
            <LinearProgress variant="determinate" value={recoveryProgress} sx={{ mt: 1.4, height: 8, borderRadius: 99 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.3 }}>
              {formatCurrency(recoveredAmount)} recovered against{" "}
              {formatCurrency(recoveryPotential)} potential.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <SectionHeader icon={<DescriptionOutlinedIcon />} title="Case Outcome" />
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Final Outcome</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {fraudCase.final_outcome ? humanize(fraudCase.final_outcome) : "Pending investigation"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Closure Rationale</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {fraudCase.closure_rationale ?? "Case remains open; no closure rationale recorded."}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}