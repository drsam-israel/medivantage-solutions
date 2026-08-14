import {
  AddOutlined,
  AssignmentLateOutlined,
  CheckCircleOutlined,
  FilterAltOutlined,
  HealthAndSafetyOutlined,
  MoreHorizOutlined,
  PaymentsOutlined,
  SearchOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
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

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import { getClaims } from "../services/claimsApi";
import { getMembers } from "../services/membersApi";
import { getProviders } from "../services/providersApi";

import type { Claim } from "../types/claim";
import type { Member } from "../types/member";
import type { Provider } from "../types/provider";


type StatusFilter =
  | "ALL"
  | Claim["claim_status"];


function getStatusColor(
  status: Claim["claim_status"],
):
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info" {
  switch (status) {
    case "APPROVED":
    case "PAID":
      return "success";

    case "DENIED":
    case "CANCELLED":
      return "error";

    case "UNDER_REVIEW":
      return "info";

    case "SUBMITTED":
    case "PARTIALLY_APPROVED":
      return "warning";

    default:
      return "default";
  }
}


function getStatusLabel(
  status: Claim["claim_status"],
): string {
  switch (status) {
    case "SUBMITTED":
      return "Submitted";

    case "UNDER_REVIEW":
      return "Under Review";

    case "APPROVED":
      return "Approved";

    case "PARTIALLY_APPROVED":
      return "Partially Approved";

    case "DENIED":
      return "Denied";

    case "PAID":
      return "Paid";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}


function formatCurrency(
  value: string | null,
): string {
  if (value === null) {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat(
    "en-SA",
    {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    },
  ).format(amount);
}


function formatDate(
  value: string,
): string {
  const date = new Date(
    `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}


function shortReference(
  value: string,
): string {
  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 8)}…`;
}


function getMemberFullName(
  member: Member,
): string {
  return [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}


export default function Claims() {
  const navigate = useNavigate();

  const [claims, setClaims] =
    useState<Claim[]>([]);

  const [members, setMembers] =
    useState<Member[]>([]);

  const [providers, setProviders] =
    useState<Provider[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");


  useEffect(() => {
    let active = true;

    async function loadClaimsWorkspace() {
      try {
        setLoading(true);
        setError(null);

        const [
          claimsData,
          membersData,
          providersData,
        ] = await Promise.all([
          getClaims(),
          getMembers(),
          getProviders(),
        ]);

        if (active) {
          setClaims(claimsData);
          setMembers(membersData);
          setProviders(providersData);
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load claims workspace.";

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadClaimsWorkspace();

    return () => {
      active = false;
    };
  }, []);


  const memberMap = useMemo(
    () =>
      new Map(
        members.map((member) => [
          member.id,
          member,
        ]),
      ),
    [members],
  );


  const providerMap = useMemo(
    () =>
      new Map(
        providers.map((provider) => [
          provider.id,
          provider,
        ]),
      ),
    [providers],
  );


  const filteredClaims = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        claim.claim_status === statusFilter;

      const member =
        memberMap.get(claim.member_id);

      const provider =
        providerMap.get(claim.provider_id);

      const memberName = member
        ? getMemberFullName(member)
            .toLowerCase()
        : "";

      const memberNumber =
        member?.member_number
          .toLowerCase() ?? "";

      const providerName =
        provider?.provider_name
          .toLowerCase() ?? "";

      const providerCode =
        provider?.provider_code
          .toLowerCase() ?? "";

      const diagnosisCode =
        claim.diagnosis_code
          ?.toLowerCase() ?? "";

      const procedureCode =
        claim.procedure_code
          ?.toLowerCase() ?? "";

      const matchesSearch =
        normalizedSearch.length === 0 ||
        claim.claim_number
          .toLowerCase()
          .includes(normalizedSearch) ||
        claim.member_id
          .toLowerCase()
          .includes(normalizedSearch) ||
        claim.provider_id
          .toLowerCase()
          .includes(normalizedSearch) ||
        memberName.includes(
          normalizedSearch,
        ) ||
        memberNumber.includes(
          normalizedSearch,
        ) ||
        providerName.includes(
          normalizedSearch,
        ) ||
        providerCode.includes(
          normalizedSearch,
        ) ||
        diagnosisCode.includes(
          normalizedSearch,
        ) ||
        procedureCode.includes(
          normalizedSearch,
        );

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    claims,
    memberMap,
    providerMap,
    search,
    statusFilter,
  ]);


  const operationalClaims =
    claims.filter(
      (claim) =>
        claim.claim_status === "SUBMITTED" ||
        claim.claim_status ===
          "UNDER_REVIEW" ||
        claim.claim_status ===
          "PARTIALLY_APPROVED",
    );


  const approvedClaims =
    claims.filter(
      (claim) =>
        claim.claim_status === "APPROVED" ||
        claim.claim_status === "PAID",
    );


  const paidClaims =
    claims.filter(
      (claim) =>
        claim.claim_status === "PAID",
    );


  const deniedClaims =
    claims.filter(
      (claim) =>
        claim.claim_status === "DENIED",
    );


  const totalPaidAmount =
    paidClaims.reduce(
      (total, claim) =>
        total +
        Number(
          claim.payer_responsibility ?? "0",
        ),
      0,
    );


  const approvalRate =
    claims.length > 0
      ? (
          (approvedClaims.length /
            claims.length) *
          100
        ).toFixed(1)
      : "0.0";


  const metrics = [
    {
      label: "Open Claims",
      value:
        operationalClaims.length.toLocaleString(),
      detail:
        `${claims.length.toLocaleString()} total claims`,
      icon: <AssignmentLateOutlined />,
    },
    {
      label: "Claims Approved",
      value: `${approvalRate}%`,
      detail:
        `${approvedClaims.length.toLocaleString()} approved or paid`,
      icon: <CheckCircleOutlined />,
    },
    {
      label: "Claims Paid",
      value: formatCurrency(
        totalPaidAmount.toFixed(2),
      ),
      detail:
        `${paidClaims.length.toLocaleString()} paid claims`,
      icon: <PaymentsOutlined />,
    },
    {
      label: "Denied Claims",
      value:
        deniedClaims.length.toLocaleString(),
      detail:
        "Claims with denial decisions",
      icon: <WarningAmberOutlined />,
    },
  ];


  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="CLAIMS OPERATIONS"
        title="Claims Workspace"
        description="Manage claims intake, adjudication, clinical review, settlement decisions and operational performance from one enterprise workspace."
        icon={<HealthAndSafetyOutlined />}
        context="MediVantage Claims Operations"
        updatedText="Live backend data"
        statusLabel={
          error
            ? "API Issue"
            : loading
              ? "Loading"
              : "Live Queue"
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
            label: "Open Claims",
            value:
              operationalClaims.length.toLocaleString(),
            icon: <AssignmentLateOutlined />,
            tone: "warning",
          },
          {
            label: "Approval Rate",
            value: `${approvalRate}%`,
            icon: <CheckCircleOutlined />,
            tone: "success",
          },
          {
            label: "Denied Claims",
            value:
              deniedClaims.length.toLocaleString(),
            icon: <WarningAmberOutlined />,
            tone: "error",
          },
        ]}
        actions={[
          {
            label: "Register New Claim",
            icon: <AddOutlined />,
            onClick: () => {
              console.log(
                "Register new claim",
              );
            },
            prominent: true,
          },
          {
            label: "Claims Analytics",
            icon: <TrendingUpOutlined />,
            onClick: () => {
              console.log(
                "Open claims analytics",
              );
            },
            variant: "outlined",
          },
        ]}
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2.5,
        }}
      >
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {metric.label}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 1,
                      fontWeight: 900,
                    }}
                  >
                    {metric.value}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 1,
                    }}
                  >
                    {metric.detail}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 2.5,
                    color: "primary.main",
                    backgroundColor:
                      "rgba(11,79,138,0.08)",
                  }}
                >
                  {metric.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card
        elevation={0}
        sx={{
          mt: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              flexDirection: {
                xs: "column",
                lg: "row",
              },
              alignItems: {
                xs: "stretch",
                lg: "center",
              },
              justifyContent:
                "space-between",
              gap: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900 }}
              >
                Claims Operations Queue
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Live claims enriched with member
                and provider master data
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1.5,
              }}
            >
              <TextField
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search claim, member or provider"
                sx={{
                  minWidth: {
                    sm: 300,
                  },
                }}
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

              <TextField
                select
                size="small"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }
                sx={{
                  minWidth: 180,
                }}
              >
                <MenuItem value="ALL">
                  All Statuses
                </MenuItem>

                <MenuItem value="SUBMITTED">
                  Submitted
                </MenuItem>

                <MenuItem value="UNDER_REVIEW">
                  Under Review
                </MenuItem>

                <MenuItem value="APPROVED">
                  Approved
                </MenuItem>

                <MenuItem value="PARTIALLY_APPROVED">
                  Partially Approved
                </MenuItem>

                <MenuItem value="DENIED">
                  Denied
                </MenuItem>

                <MenuItem value="PAID">
                  Paid
                </MenuItem>

                <MenuItem value="CANCELLED">
                  Cancelled
                </MenuItem>
              </TextField>

              <Button
                variant="outlined"
                startIcon={
                  <FilterAltOutlined />
                }
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                More Filters
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                py: 10,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <CircularProgress />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Loading claims workspace...
                </Typography>
              </Box>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Claim
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Member
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Provider
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Service
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Billed Amount
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Allowed Amount
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 900 }}
                    >
                      Status
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
                  {filteredClaims.map(
                    (claim) => {
                      const member =
                        memberMap.get(
                          claim.member_id,
                        );

                      const provider =
                        providerMap.get(
                          claim.provider_id,
                        );

                      return (
                        <TableRow
                          key={claim.id}
                          hover
                          sx={{
                            "&:last-child td":
                              {
                                borderBottom: 0,
                              },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color:
                                  "primary.main",
                                fontWeight: 900,
                              }}
                            >
                              {claim.claim_number}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Submitted{" "}
                              {formatDate(
                                claim.submission_date,
                              )}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {member ? (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 800,
                                  }}
                                >
                                  {getMemberFullName(
                                    member,
                                  )}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {
                                    member.member_number
                                  }
                                </Typography>
                              </>
                            ) : (
                              <Tooltip
                                title={
                                  claim.member_id
                                }
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {shortReference(
                                    claim.member_id,
                                  )}
                                </Typography>
                              </Tooltip>
                            )}
                          </TableCell>

                          <TableCell>
                            {provider ? (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 800,
                                  }}
                                >
                                  {
                                    provider.provider_name
                                  }
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {
                                    provider.provider_code
                                  }
                                </Typography>
                              </>
                            ) : (
                              <Tooltip
                                title={
                                  claim.provider_id
                                }
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {shortReference(
                                    claim.provider_id,
                                  )}
                                </Typography>
                              </Tooltip>
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {claim.procedure_code ??
                                claim.claim_type}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Diagnosis:{" "}
                              {claim.diagnosis_code ??
                                "Not specified"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 900,
                              }}
                            >
                              {formatCurrency(
                                claim.billed_amount,
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
                              {formatCurrency(
                                claim.allowed_amount,
                              )}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={getStatusLabel(
                                claim.claim_status,
                              )}
                              color={getStatusColor(
                                claim.claim_status,
                              )}
                              variant="outlined"
                              sx={{
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                navigate(
                                  `/claims/${claim.id}`,
                                )
                              }
                              sx={{
                                borderRadius: 2,
                                fontWeight: 800,
                                textTransform:
                                  "none",
                              }}
                            >
                              Open Claim
                            </Button>

                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                sx={{ ml: 0.5 }}
                              >
                                <MoreHorizOutlined />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    },
                  )}

                  {filteredClaims.length ===
                    0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{
                          py: 7,
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          No claims found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          No claims match the
                          current search and
                          status filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent:
                "space-between",
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Showing{" "}
              {filteredClaims.length.toLocaleString()}{" "}
              of{" "}
              {claims.length.toLocaleString()}{" "}
              claims
            </Typography>

            <Button
              size="small"
              endIcon={
                <MoreHorizOutlined />
              }
              sx={{
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              View Complete Claims Register
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Claims Operations ·
        Designed & Developed by Dr. Samuel
        Israel
      </Typography>
    </Box>
  );
}