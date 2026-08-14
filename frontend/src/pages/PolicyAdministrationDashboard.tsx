import type {
  ChangeEvent,
} from "react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  AddOutlined,
  AutorenewOutlined,
  FactCheckOutlined,
  InsightsOutlined,
  PolicyOutlined,
  SearchOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import {
  getPolicies,
} from "../services/policiesApi";

import {
  getMembers,
} from "../services/membersApi";

import {
  getHealthPlans,
} from "../services/healthPlansApi";

import type {
  Policy,
} from "../types/policy";

import type {
  Member,
} from "../types/member";

import type {
  HealthPlan,
} from "../types/healthPlan";


const PAGE_SIZE_OPTIONS = [
  5,
  10,
  25,
];


interface PolicyRow {
  policy: Policy;

  policyholderName: string;
  memberNumber: string;

  planName: string;
  planType: string;

  displayStatus: string;
  displayBillingStatus: string;
  displayPolicyType: string;
}


interface MetricCardProps {
  label: string;
  value: string;
  supportingText: string;
  accent: string;
}


function formatCurrency(
  value: number,
  currency = "SAR",
): string {
  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(value);
}


function parseMoney(
  value: string | null | undefined,
): number {
  if (value == null) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

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


function humanize(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}


function getStatusStyle(
  status: string,
): {
  colour: string;
  backgroundColour: string;
} {
  switch (status) {
    case "Active":
      return {
        colour: "#047857",
        backgroundColour: "#D1FAE5",
      };

    case "Pending":
      return {
        colour: "#B45309",
        backgroundColour: "#FEF3C7",
      };

    case "Renewal Due":
      return {
        colour: "#C2410C",
        backgroundColour: "#FFEDD5",
      };

    case "Suspended":
      return {
        colour: "#7C3AED",
        backgroundColour: "#EDE9FE",
      };

    case "Expired":
    case "Cancelled":
      return {
        colour: "#B91C1C",
        backgroundColour: "#FEE2E2",
      };

    default:
      return {
        colour: "#0369A1",
        backgroundColour: "#E0F2FE",
      };
  }
}


function getBillingStyle(
  status: string,
): {
  colour: string;
  backgroundColour: string;
} {
  switch (status) {
    case "Paid":
      return {
        colour: "#047857",
        backgroundColour: "#D1FAE5",
      };

    case "Pending":
      return {
        colour: "#B45309",
        backgroundColour: "#FEF3C7",
      };

    case "Overdue":
      return {
        colour: "#B91C1C",
        backgroundColour: "#FEE2E2",
      };

    default:
      return {
        colour: "#475569",
        backgroundColour: "#F1F5F9",
      };
  }
}


function MetricCard({
  label,
  value,
  supportingText,
  accent,
}: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          backgroundColor: accent,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          mt: 1,
          fontWeight: 900,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          mt: 1,
          display: "block",
          color: "text.secondary",
        }}
      >
        {supportingText}
      </Typography>
    </Paper>
  );
}


export default function PolicyAdministrationDashboard() {
  const navigate = useNavigate();

  const [
    policies,
    setPolicies,
  ] = useState<Policy[]>([]);

  const [
    members,
    setMembers,
  ] = useState<Member[]>([]);

  const [
    healthPlans,
    setHealthPlans,
  ] = useState<HealthPlan[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    planTypeFilter,
    setPlanTypeFilter,
  ] = useState("All");

  const [
    billingFilter,
    setBillingFilter,
  ] = useState("All");

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(10);


  useEffect(() => {
    let active = true;

    async function loadPolicyPortfolio() {
      try {
        setLoading(true);
        setError(null);

        const [
          policyData,
          memberData,
          healthPlanData,
        ] = await Promise.all([
          getPolicies(),
          getMembers(),
          getHealthPlans(),
        ]);

        if (!active) {
          return;
        }

        setPolicies(policyData);
        setMembers(memberData);
        setHealthPlans(
          healthPlanData,
        );
      } catch (loadError) {
        console.error(
          "Unable to load live Policy Administration portfolio.",
          loadError,
        );

        if (active) {
          setError(
            "Unable to load the live Policy Administration portfolio. Confirm that the MediVantage backend is running and try again.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPolicyPortfolio();

    return () => {
      active = false;
    };
  }, []);


  const policyRows = useMemo<
    PolicyRow[]
  >(() => {
    const memberMap = new Map(
      members.map(
        (member) => [
          member.id,
          member,
        ],
      ),
    );

    const healthPlanMap = new Map(
      healthPlans.map(
        (plan) => [
          plan.id,
          plan,
        ],
      ),
    );

    return policies.map(
      (policy) => {
        const member =
          memberMap.get(
            policy.policyholder_member_id,
          );

        const healthPlan =
          healthPlanMap.get(
            policy.health_plan_id,
          );

        const policyholderName =
          member
            ? [
                member.first_name,
                member.middle_name,
                member.last_name,
              ]
                .filter(Boolean)
                .join(" ")
            : "Member unavailable";

        const rawStatus =
          policy.status
            .trim()
            .toUpperCase();

        let displayStatus =
          humanize(policy.status);

        const today =
          new Date();

        const expiryDate =
          new Date(
            policy.expiry_date,
          );

        const renewalDueDate =
          policy.renewal_due_date
            ? new Date(
                policy.renewal_due_date,
              )
            : null;

        if (
          rawStatus === "ACTIVE" &&
          renewalDueDate &&
          renewalDueDate <= today &&
          expiryDate >= today
        ) {
          displayStatus =
            "Renewal Due";
        }

        if (
          rawStatus === "ACTIVE" &&
          expiryDate < today
        ) {
          displayStatus =
            "Expired";
        }

        return {
          policy,

          policyholderName,

          memberNumber:
            member?.member_number ??
            "Not available",

          planName:
            healthPlan?.plan_name ??
            "Plan unavailable",

          planType:
            healthPlan?.plan_type ??
            humanize(
              policy.policy_type,
            ),

          displayStatus,

          displayBillingStatus:
            humanize(
              policy.billing_status,
            ),

          displayPolicyType:
            humanize(
              policy.policy_type,
            ),
        };
      },
    );
  }, [
    policies,
    members,
    healthPlans,
  ]);


  const policyMetrics =
    useMemo(() => {
      const totalPolicies =
        policyRows.length;

      const activePolicies =
        policyRows.filter(
          (row) =>
            row.displayStatus ===
            "Active",
        ).length;

      const pendingPolicies =
        policyRows.filter(
          (row) =>
            row.displayStatus ===
            "Pending",
        ).length;

      const renewalsDue =
        policyRows.filter(
          (row) =>
            row.displayStatus ===
              "Renewal Due" ||
            (
              row.policy
                .renewal_eligible &&
              row.policy
                .renewal_due_date !==
                null
            ),
        ).length;

      const monthlyPremium =
        policyRows.reduce(
          (total, row) => {
            const amount =
              parseMoney(
                row.policy
                  .premium_amount,
              );

            const frequency =
              row.policy
                .billing_frequency
                .trim()
                .toUpperCase();

            if (
              frequency ===
              "MONTHLY"
            ) {
              return (
                total + amount
              );
            }

            if (
              frequency ===
              "QUARTERLY"
            ) {
              return (
                total +
                amount / 3
              );
            }

            if (
              frequency ===
              "ANNUAL"
            ) {
              return (
                total +
                amount / 12
              );
            }

            return (
              total + amount
            );
          },
          0,
        );

      const outstandingPremiums =
        policyRows.reduce(
          (total, row) => {
            const billingStatus =
              row.policy
                .billing_status
                .trim()
                .toUpperCase();

            if (
              billingStatus ===
                "PENDING" ||
              billingStatus ===
                "OVERDUE"
            ) {
              return (
                total +
                parseMoney(
                  row.policy
                    .premium_amount,
                )
              );
            }

            return total;
          },
          0,
        );

      return {
        totalPolicies,
        activePolicies,
        pendingPolicies,
        renewalsDue,
        monthlyPremium,
        outstandingPremiums,
      };
    }, [policyRows]);


  const filteredPolicies =
    useMemo(() => {
      const normalisedSearch =
        searchText
          .trim()
          .toLowerCase();

      return policyRows.filter(
        (row) => {
          const matchesSearch =
            normalisedSearch.length ===
              0 ||
            row.policy
              .policy_number
              .toLowerCase()
              .includes(
                normalisedSearch,
              ) ||
            row.policyholderName
              .toLowerCase()
              .includes(
                normalisedSearch,
              ) ||
            row.memberNumber
              .toLowerCase()
              .includes(
                normalisedSearch,
              ) ||
            row.planName
              .toLowerCase()
              .includes(
                normalisedSearch,
              );

          const matchesStatus =
            statusFilter ===
              "All" ||
            row.displayStatus ===
              statusFilter;

          const matchesPlanType =
            planTypeFilter ===
              "All" ||
            row.displayPolicyType ===
              planTypeFilter ||
            humanize(
              row.planType,
            ) ===
              planTypeFilter;

          const matchesBilling =
            billingFilter ===
              "All" ||
            row
              .displayBillingStatus ===
              billingFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPlanType &&
            matchesBilling
          );
        },
      );
    }, [
      policyRows,
      billingFilter,
      planTypeFilter,
      searchText,
      statusFilter,
    ]);


  const paginatedPolicies =
    useMemo(() => {
      const startIndex =
        page * rowsPerPage;

      return filteredPolicies.slice(
        startIndex,
        startIndex +
          rowsPerPage,
      );
    }, [
      filteredPolicies,
      page,
      rowsPerPage,
    ]);


  const clearFilters = () => {
    setSearchText("");
    setStatusFilter("All");
    setPlanTypeFilter("All");
    setBillingFilter("All");
    setPage(0);
  };


  const handleSearchChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(
      event.target.value,
    );

    setPage(0);
  };


  return (
    <Box
      sx={{
        width: "100%",
        pb: 4,
      }}
    >
      <WorkspaceHeader
        eyebrow="POLICY LIFECYCLE OPERATIONS"
        title="Policy Administration"
        description="Manage live policy issuance, activation, coverage, billing, renewals and lifecycle activity across the enterprise insurance portfolio."
        icon={
          <PolicyOutlined />
        }
        context="MediVantage Policy Operations"
        updatedText="Live operational data"
        statusLabel="Live Policy Portfolio"
        statusTone="success"
        stats={[
          {
            label:
              "Total Policies",
            value:
              policyMetrics
                .totalPolicies,
            icon:
              <PolicyOutlined />,
            tone: "primary",
          },
          {
            label:
              "Active Policies",
            value:
              policyMetrics
                .activePolicies,
            icon:
              <FactCheckOutlined />,
            tone: "success",
          },
          {
            label:
              "Renewals Due",
            value:
              policyMetrics
                .renewalsDue,
            icon:
              <AutorenewOutlined />,
            tone: "warning",
          },
          {
            label:
              "Pending Policies",
            value:
              policyMetrics
                .pendingPolicies,
            icon:
              <WarningAmberOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label:
              "Issue New Policy",
            icon:
              <AddOutlined />,
            onClick: () => {
              console.log(
                "Issue new policy",
              );
            },
            prominent: true,
          },
          {
            label:
              "Policy Analytics",
            icon:
              <InsightsOutlined />,
            onClick: () => {
              console.log(
                "Open policy analytics",
              );
            },
            variant:
              "outlined",
          },
          {
            label:
              "Renewal Queue",
            icon:
              <AutorenewOutlined />,
            onClick: () => {
              console.log(
                "Open renewal queue",
              );
            },
            variant:
              "outlined",
          },
        ]}
      />


      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 3,
          }}
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
            sm:
              "repeat(2, minmax(0, 1fr))",
            xl:
              "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <MetricCard
          label="Total Policies"
          value={
            policyMetrics
              .totalPolicies
              .toLocaleString(
                "en-GB",
              )
          }
          supportingText="Live policies in PostgreSQL"
          accent="#1565C0"
        />

        <MetricCard
          label="Active Policies"
          value={
            policyMetrics
              .activePolicies
              .toLocaleString(
                "en-GB",
              )
          }
          supportingText="Policies with active coverage"
          accent="#047857"
        />

        <MetricCard
          label="Pending Issuance"
          value={
            policyMetrics
              .pendingPolicies
              .toLocaleString(
                "en-GB",
              )
          }
          supportingText="Awaiting activation or payment"
          accent="#B45309"
        />

        <MetricCard
          label="Renewals Due"
          value={
            policyMetrics
              .renewalsDue
              .toLocaleString(
                "en-GB",
              )
          }
          supportingText="Renewal-eligible or approaching renewal"
          accent="#C2410C"
        />

        <MetricCard
          label="Monthly Premium"
          value={formatCurrency(
            policyMetrics
              .monthlyPremium,
          )}
          supportingText={`${formatCurrency(
            policyMetrics
              .outstandingPremiums,
          )} outstanding`}
          accent="#7C3AED"
        />
      </Box>


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
            p: 2.5,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
              }}
            >
              Policy Portfolio
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color:
                  "text.secondary",
              }}
            >
              Search, filter and open
              live policy records for
              lifecycle management.
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
              }}
            >
              <CircularProgress
                size={18}
              />

              <Typography
                variant="caption"
                sx={{
                  color:
                    "text.secondary",
                }}
              >
                Loading live
                portfolio...
              </Typography>
            </Box>
          ) : (
            <Chip
              label={`${filteredPolicies.length} polic${
                filteredPolicies.length ===
                1
                  ? "y"
                  : "ies"
              }`}
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 800,
              }}
            />
          )}
        </Box>


        <Divider />


        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md:
                "minmax(260px, 2fr) repeat(3, minmax(150px, 1fr)) auto",
            },
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Search policies"
            placeholder="Policy number, member, plan or ID"
            value={searchText}
            onChange={
              handleSearchChange
            }
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
            fullWidth
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value,
              );

              setPage(0);
            }}
          >
            <MenuItem value="All">
              All statuses
            </MenuItem>

            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Pending">
              Pending
            </MenuItem>

            <MenuItem value="Renewal Due">
              Renewal Due
            </MenuItem>

            <MenuItem value="Suspended">
              Suspended
            </MenuItem>

            <MenuItem value="Expired">
              Expired
            </MenuItem>

            <MenuItem value="Cancelled">
              Cancelled
            </MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Plan type"
            value={
              planTypeFilter
            }
            onChange={(event) => {
              setPlanTypeFilter(
                event.target.value,
              );

              setPage(0);
            }}
          >
            <MenuItem value="All">
              All plan types
            </MenuItem>

            <MenuItem value="Individual">
              Individual
            </MenuItem>

            <MenuItem value="Family">
              Family
            </MenuItem>

            <MenuItem value="Corporate">
              Corporate
            </MenuItem>

            <MenuItem value="Senior">
              Senior
            </MenuItem>

            <MenuItem value="Student">
              Student
            </MenuItem>

            <MenuItem value="Ppo">
              PPO
            </MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Billing"
            value={billingFilter}
            onChange={(event) => {
              setBillingFilter(
                event.target.value,
              );

              setPage(0);
            }}
          >
            <MenuItem value="All">
              All billing statuses
            </MenuItem>

            <MenuItem value="Paid">
              Paid
            </MenuItem>

            <MenuItem value="Pending">
              Pending
            </MenuItem>

            <MenuItem value="Overdue">
              Overdue
            </MenuItem>
          </TextField>

          <Button
            variant="outlined"
            onClick={
              clearFilters
            }
            sx={{
              minHeight: 40,
              whiteSpace:
                "nowrap",
              textTransform:
                "none",
              fontWeight: 800,
              borderRadius: 2,
            }}
          >
            Clear Filters
          </Button>
        </Box>


        <Divider />


        <TableContainer>
          <Table
            sx={{
              minWidth: 1120,
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "background.default",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Policy
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Policyholder
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Plan
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Coverage Period
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Premium
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Billing
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Renewal
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {!loading &&
              paginatedPolicies.length >
                0 ? (
                paginatedPolicies.map(
                  (row) => {
                    const {
                      policy,
                    } = row;

                    const statusStyle =
                      getStatusStyle(
                        row.displayStatus,
                      );

                    const billingStyle =
                      getBillingStyle(
                        row
                          .displayBillingStatus,
                      );

                    return (
                      <TableRow
                        key={
                          policy.id
                        }
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
                            variant="body2"
                            sx={{
                              fontWeight:
                                900,
                              color:
                                "primary.main",
                            }}
                          >
                            {
                              policy.policy_number
                            }
                          </Typography>

          

                        </TableCell>


                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                800,
                            }}
                          >
                            {
                              row.policyholderName
                            }
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.25,
                              display:
                                "block",
                              color:
                                "text.secondary",
                            }}
                          >
                            {
                              row.memberNumber
                            }
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                800,
                            }}
                          >
                            {
                              row.planName
                            }
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.25,
                              display:
                                "block",
                              color:
                                "text.secondary",
                            }}
                          >
                            {
                              row.displayPolicyType
                            }
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Chip
                            label={
                              row.displayStatus
                            }
                            size="small"
                            sx={{
                              fontWeight:
                                800,
                              color:
                                statusStyle.colour,
                              backgroundColor:
                                statusStyle.backgroundColour,
                            }}
                          />
                        </TableCell>


                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(
                              policy.effective_date,
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "text.secondary",
                            }}
                          >
                            to{" "}
                            {formatDate(
                              policy.expiry_date,
                            )}
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {formatCurrency(
                              parseMoney(
                                policy.premium_amount,
                              ),
                              policy.premium_currency,
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "text.secondary",
                            }}
                          >
                            {humanize(
                              policy.billing_frequency,
                            )}
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Chip
                            label={
                              row.displayBillingStatus
                            }
                            size="small"
                            sx={{
                              fontWeight:
                                800,
                              color:
                                billingStyle.colour,
                              backgroundColor:
                                billingStyle.backgroundColour,
                            }}
                          />
                        </TableCell>


                        <TableCell>
                          {policy
                            .renewal_eligible ? (
                            <Chip
                              label={
                                policy.renewal_due_date
                                  ? `Eligible · ${formatDate(
                                      policy.renewal_due_date,
                                    )}`
                                  : "Eligible"
                              }
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{
                                fontWeight:
                                  800,
                              }}
                            />
                          ) : (
                            <Chip
                              label="Not Eligible"
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight:
                                  800,
                                color:
                                  "text.secondary",
                              }}
                            />
                          )}
                        </TableCell>


                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              navigate(
                                `/policy-administration/${encodeURIComponent(
                                  policy.id,
                                )}`,
                              )
                            }
                            sx={{
                              textTransform:
                                "none",
                              fontWeight:
                                800,
                              whiteSpace:
                                "nowrap",
                              borderRadius:
                                2,
                            }}
                          >
                            Open Policy
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )
              ) : !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    sx={{
                      py: 6,
                      textAlign:
                        "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight:
                          900,
                      }}
                    >
                      No policies found
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.75,
                        color:
                          "text.secondary",
                      }}
                    >
                      Adjust the search
                      criteria or clear
                      the active filters.
                    </Typography>

                    <Button
                      variant="outlined"
                      onClick={
                        clearFilters
                      }
                      sx={{
                        mt: 2,
                        textTransform:
                          "none",
                        fontWeight:
                          800,
                        borderRadius:
                          2,
                      }}
                    >
                      Clear Filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>


        <Divider />


        <TablePagination
          component="div"
          count={
            filteredPolicies.length
          }
          page={page}
          rowsPerPage={
            rowsPerPage
          }
          rowsPerPageOptions={
            PAGE_SIZE_OPTIONS
          }
          onPageChange={(
            _,
            newPage,
          ) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(
            event,
          ) => {
            setRowsPerPage(
              Number.parseInt(
                event.target.value,
                10,
              ),
            );

            setPage(0);
          }}
        />
      </Paper>


      <Typography
        variant="caption"
        sx={{
          mt: 3,
          display: "block",
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage Solutions™ Policy Administration ·
        Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}