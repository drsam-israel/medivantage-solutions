import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  AccessTimeOutlined,
  AddOutlined,
  AssignmentTurnedInOutlined,
  AutorenewOutlined,
  CheckCircleOutlined,
  FilterAltOffOutlined,
  LocalHospitalOutlined,
  OpenInNewOutlined,
  PsychologyOutlined,
  SearchOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import type {
  AIRecommendation,
  AuthorizationPriority,
  AuthorizationStatus,
} from "../data/priorAuthorizationDemoData";

import {
  getPriorAuthorizations,
} from "../services/priorAuthorizationsApi";

import {
  mapPriorAuthorizationToDashboard,
} from "../adapters/priorAuthorizationAdapter";

import {
  enrichPriorAuthorizations,
} from "../services/priorAuthorizationEnrichment";

import type {
  LivePriorAuthorizationRequest,
} from "../adapters/priorAuthorizationAdapter";

type FilterValue = "All" | string;

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  accent: string;
  progress?: number;
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  progress,
}: KpiCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 4,
          backgroundColor: accent,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.75, color: "text.secondary", fontWeight: 700 }}
            >
              {title}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: accent,
              backgroundColor: `${accent}14`,
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1.5, color: "text.secondary" }}
        >
          {subtitle}
        </Typography>

        {typeof progress === "number" && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 1.5,
              height: 6,
              borderRadius: 99,
              backgroundColor: `${accent}18`,
              "& .MuiLinearProgress-bar": {
                backgroundColor: accent,
                borderRadius: 99,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

const priorityChipStyles: Record<
  AuthorizationPriority,
  { color: string; backgroundColor: string }
> = {
  Routine: { color: "#0369A1", backgroundColor: "#E0F2FE" },
  High: { color: "#B45309", backgroundColor: "#FEF3C7" },
  Urgent: { color: "#C2410C", backgroundColor: "#FFEDD5" },
  Emergency: { color: "#B91C1C", backgroundColor: "#FEE2E2" },
};

const statusChipStyles: Record<
  AuthorizationStatus,
  { color: string; backgroundColor: string }
> = {
  "Pending Review": { color: "#6D28D9", backgroundColor: "#EDE9FE" },
  "AI Recommended": { color: "#0369A1", backgroundColor: "#E0F2FE" },
  Approved: { color: "#047857", backgroundColor: "#D1FAE5" },
  Denied: { color: "#B91C1C", backgroundColor: "#FEE2E2" },
  "More Information Required": {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
  },
  Escalated: { color: "#BE123C", backgroundColor: "#FFE4E6" },
};

const recommendationChipStyles: Record<
  AIRecommendation,
  { color: string; backgroundColor: string }
> = {
  Approve: { color: "#047857", backgroundColor: "#D1FAE5" },
  Deny: { color: "#B91C1C", backgroundColor: "#FEE2E2" },
  "Request More Information": {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
  },
  "Escalate to Medical Director": {
    color: "#7E22CE",
    backgroundColor: "#F3E8FF",
  },
};

function formatDate(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateTime(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function getScoreColour(score: number): string {
  if (score >= 80) return "#047857";
  if (score >= 60) return "#B45309";
  return "#B91C1C";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  return "Limited";
}

export default function PriorAuthorizationDashboard() {
  const navigate = useNavigate();

  const [authorizationRequests, setAuthorizationRequests] = useState<
    LivePriorAuthorizationRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<FilterValue>("All");
  const [statusFilter, setStatusFilter] = useState<FilterValue>("All");
  const [providerFilter, setProviderFilter] = useState<FilterValue>("All");
  const [recommendationFilter, setRecommendationFilter] =
    useState<FilterValue>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadPriorAuthorizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

     const authorizations =
  await getPriorAuthorizations();

const enrichedAuthorizations =
  await enrichPriorAuthorizations(
    authorizations,
  );

setAuthorizationRequests(
  enrichedAuthorizations.map(
    mapPriorAuthorizationToDashboard,
  ),
);
      setPage(0);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load prior authorizations.",
      );
      setAuthorizationRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPriorAuthorizations();
  }, [loadPriorAuthorizations]);

  const liveKpis = useMemo(() => {
    const totalRequests = authorizationRequests.length;
    const pendingRequests = authorizationRequests.filter(
      (request) => request.status === "Pending Review",
    ).length;
    const approvedRequests = authorizationRequests.filter(
      (request) => request.status === "Approved",
    ).length;
    const urgentReviews = authorizationRequests.filter(
      (request) =>
        request.priority === "Urgent" ||
        request.priority === "Emergency",
    ).length;
    const aiReviewedRequests = authorizationRequests.filter(
      (request) => request.aiAssessment.confidence > 0,
    ).length;
    const aiRecommendationRate =
      totalRequests === 0
        ? 0
        : Math.round((aiReviewedRequests / totalRequests) * 100);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      urgentReviews,
      aiRecommendationRate,
    };
  }, [authorizationRequests]);

  const providers = useMemo(
    () =>
      Array.from(
        new Set(
          authorizationRequests.map(
            (request) => request.provider.providerName,
          ),
        ),
      ).sort(),
    [authorizationRequests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return authorizationRequests.filter((request) => {
      const searchableContent = [
        request.authorizationId,
        request.member.fullName,
        request.member.memberId,
        request.member.policyNumber,
        request.member.employerGroup,
        request.provider.providerName,
        request.provider.providerId,
        request.provider.specialty,
        request.provider.city,
        request.clinical.primaryDiagnosis.code,
        request.clinical.primaryDiagnosis.description,
        request.clinical.requestedProcedure.code,
        request.clinical.requestedProcedure.description,
        request.assignedReviewer,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedSearch || searchableContent.includes(normalizedSearch)) &&
        (priorityFilter === "All" || request.priority === priorityFilter) &&
        (statusFilter === "All" || request.status === statusFilter) &&
        (providerFilter === "All" ||
          request.provider.providerName === providerFilter) &&
        (recommendationFilter === "All" ||
          request.aiAssessment.recommendation === recommendationFilter)
      );
    });
  }, [
    authorizationRequests,
    priorityFilter,
    providerFilter,
    recommendationFilter,
    searchTerm,
    statusFilter,
  ]);

  const paginatedRequests = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRequests.slice(start, start + rowsPerPage);
  }, [filteredRequests, page, rowsPerPage]);

  const activeFilterCount = [
    priorityFilter,
    statusFilter,
    providerFilter,
    recommendationFilter,
  ].filter((value) => value !== "All").length;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange =
    (setter: (value: FilterValue) => void) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
      setPage(0);
    };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("All");
    setStatusFilter("All");
    setProviderFilter("All");
    setRecommendationFilter("All");
    setPage(0);
  };

  const handleOpenReview = (
    request: LivePriorAuthorizationRequest,
  ) => {
    navigate(
      `/prior-authorization/${encodeURIComponent(request.backendId)}`,
    );
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="UTILIZATION MANAGEMENT"
        title="Prior Authorization"
        description="Review healthcare service requests, validate member coverage, assess medical necessity and manage payer decisions through one integrated clinical workspace."
        icon={<LocalHospitalOutlined />}
        context="MediVantage Clinical Utilization Management"
        updatedText="Updated moments ago"
        statusLabel="Live Authorization Queue"
        statusTone="success"
        stats={[
          {
            label: "Total Requests",
            value: liveKpis.totalRequests,
            icon: <AssignmentTurnedInOutlined />,
            tone: "primary",
          },
          {
            label: "Pending Reviews",
            value: liveKpis.pendingRequests,
            icon: <AccessTimeOutlined />,
            tone: "warning",
          },
          {
            label: "Urgent Reviews",
            value: liveKpis.urgentReviews,
            icon: <WarningAmberOutlined />,
            tone: "error",
          },
          {
            label: "AI Recommendation Rate",
            value: `${liveKpis.aiRecommendationRate}%`,
            icon: <PsychologyOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "Register Request",
            icon: <AddOutlined />,
            onClick: () => console.log("Register authorization request"),
            prominent: true,
          },
          {
            label: "AI Clinical Review",
            icon: <PsychologyOutlined />,
            onClick: () => console.log("Open AI clinical review"),
            variant: "outlined",
          },
          {
            label: "Refresh Queue",
            icon: <AutorenewOutlined />,
            onClick: () => void loadPriorAuthorizations(),
            variant: "outlined",
          },
        ]}
      />

      {isLoading && <LinearProgress sx={{ mt: 2 }} />}

      {loadError && (
        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 2, fontWeight: 700 }}
        >
          {loadError}
        </Typography>
      )}

      <Box
        sx={{
          mt: 3,
          mb: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <KpiCard title="Total Requests" value={liveKpis.totalRequests} subtitle="Current authorization portfolio" icon={<AssignmentTurnedInOutlined />} accent="#2563EB" />
        <KpiCard title="Pending Requests" value={liveKpis.pendingRequests} subtitle="Awaiting clinical determination" icon={<AccessTimeOutlined />} accent="#7C3AED" />
        <KpiCard title="Approved" value={liveKpis.approvedRequests} subtitle="Persisted approval decisions" icon={<CheckCircleOutlined />} accent="#059669" />
        <KpiCard title="Urgent Reviews" value={liveKpis.urgentReviews} subtitle="Priority cases requiring action" icon={<WarningAmberOutlined />} accent="#EA580C" />
        <KpiCard title="AI Recommendation Rate" value={`${liveKpis.aiRecommendationRate}%`} subtitle="Requests with AI confidence scoring" icon={<PsychologyOutlined />} accent="#0891B2" progress={liveKpis.aiRecommendationRate} />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", lg: "center" },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Authorization Queue
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Search, prioritize and open requests for clinical review.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Chip label={`${filteredRequests.length} visible requests`} size="small" variant="outlined" color="primary" />
            {activeFilterCount > 0 && (
              <Chip
                label={`${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`}
                size="small"
                color="primary"
              />
            )}
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(260px, 2fr) repeat(2, minmax(150px, 1fr))",
              xl: "minmax(280px, 2fr) repeat(4, minmax(150px, 1fr)) auto",
            },
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            placeholder="Search member, provider, diagnosis, procedure or ID"
            fullWidth
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

          <FormControl size="small" fullWidth>
            <Select value={priorityFilter} onChange={handleFilterChange(setPriorityFilter)} displayEmpty>
              {["All", "Routine", "High", "Urgent", "Emergency"].map((value) => (
                <MenuItem key={value} value={value}>
                  {value === "All" ? "All priorities" : value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <Select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} displayEmpty>
              {["All", "Pending Review", "AI Recommended", "Approved", "Denied", "More Information Required", "Escalated"].map((value) => (
                <MenuItem key={value} value={value}>
                  {value === "All" ? "All statuses" : value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <Select value={providerFilter} onChange={handleFilterChange(setProviderFilter)} displayEmpty>
              <MenuItem value="All">All providers</MenuItem>
              {providers.map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <Select value={recommendationFilter} onChange={handleFilterChange(setRecommendationFilter)} displayEmpty>
              {["All", "Approve", "Deny", "Request More Information", "Escalate to Medical Director"].map((value) => (
                <MenuItem key={value} value={value}>
                  {value === "All" ? "All AI recommendations" : value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterAltOffOutlined />}
            onClick={handleResetFilters}
            disabled={!searchTerm && activeFilterCount === 0}
            sx={{ minHeight: 40, whiteSpace: "nowrap", textTransform: "none", fontWeight: 800 }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F8FAFC",
                  "& th": {
                    color: "text.secondary",
                    fontSize: 12,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 0.45,
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell>Authorization</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Clinical Request</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>AI Recommendation</TableCell>
                <TableCell>Necessity Score</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Review Due</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRequests.map((request) => {
                const priorityStyle = priorityChipStyles[request.priority];
                const statusStyle = statusChipStyles[request.status];
                const recommendationStyle =
                  recommendationChipStyles[request.aiAssessment.recommendation];
                const scoreColour = getScoreColour(
                  request.aiAssessment.medicalNecessityScore,
                );

                return (
                  <TableRow key={request.authorizationId} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 900, whiteSpace: "nowrap" }}>
                        {request.authorizationId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Submitted {formatDate(request.requestDate)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {request.member.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                        {request.member.memberId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.member.policyNumber}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {request.provider.providerName}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                        {request.provider.specialty}
                      </Typography>
                      <Chip label={request.provider.networkStatus} size="small" variant="outlined" sx={{ mt: 0.75, height: 22, fontSize: 11 }} />
                    </TableCell>

                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {request.clinical.requestedProcedure.description}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                        CPT/HCPCS {request.clinical.requestedProcedure.code}
                      </Typography>
                      <Tooltip title={request.clinical.primaryDiagnosis.description}>
                        <Typography variant="caption" sx={{ display: "block", mt: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "text.secondary" }}>
                          ICD-10 {request.clinical.primaryDiagnosis.code} · {request.clinical.primaryDiagnosis.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Chip label={request.priority} size="small" sx={{ fontWeight: 800, color: priorityStyle.color, backgroundColor: priorityStyle.backgroundColor }} />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={request.status}
                        size="small"
                        sx={{
                          maxWidth: 190,
                          height: "auto",
                          minHeight: 24,
                          fontWeight: 800,
                          color: statusStyle.color,
                          backgroundColor: statusStyle.backgroundColor,
                          "& .MuiChip-label": { whiteSpace: "normal", py: 0.35 },
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<PsychologyOutlined />}
                        label={request.aiAssessment.recommendation}
                        size="small"
                        sx={{
                          maxWidth: 215,
                          height: "auto",
                          minHeight: 24,
                          fontWeight: 800,
                          color: recommendationStyle.color,
                          backgroundColor: recommendationStyle.backgroundColor,
                          "& .MuiChip-icon": { color: recommendationStyle.color },
                          "& .MuiChip-label": { whiteSpace: "normal", py: 0.35 },
                        }}
                      />
                      <Typography variant="caption" sx={{ display: "block", mt: 0.65, color: "text.secondary" }}>
                        {request.aiAssessment.confidence}% confidence
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ minWidth: 160 }}>
                      <Stack direction="row" sx={{ mb: 0.6, justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: scoreColour, fontWeight: 900 }}>
                          {request.aiAssessment.medicalNecessityScore}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getScoreLabel(request.aiAssessment.medicalNecessityScore)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={request.aiAssessment.medicalNecessityScore}
                        sx={{
                          height: 7,
                          borderRadius: 99,
                          backgroundColor: `${scoreColour}20`,
                          "& .MuiLinearProgress-bar": { backgroundColor: scoreColour, borderRadius: 99 },
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                        {request.assignedReviewer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clinical reviewer
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                        {formatDateTime(request.reviewDueDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Service: {formatDate(request.clinical.requestedServiceDate)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<OpenInNewOutlined />}
                        onClick={() => handleOpenReview(request)}
                        sx={{ boxShadow: "none", whiteSpace: "nowrap", textTransform: "none", fontWeight: 800 }}
                      >
                        Open Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginatedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11}>
                    <Box sx={{ py: 8, px: 2, textAlign: "center" }}>
                      <SearchOutlined sx={{ mb: 1, fontSize: 44, color: "text.disabled" }} />
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        No authorization requests found
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, mb: 2, color: "text.secondary" }}>
                        Adjust your search criteria or reset the active filters.
                      </Typography>
                      <Button variant="outlined" startIcon={<FilterAltOffOutlined />} onClick={handleResetFilters}>
                        Reset Filters
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredRequests.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number.parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Requests per page"
        />
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
        MediVantage Solutions™ Prior Authorization Workspace · Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}