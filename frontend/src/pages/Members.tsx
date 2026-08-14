import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

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
  TextField,
  Typography,
} from "@mui/material";

import {
  AddOutlined,
  GroupsOutlined,
  HealthAndSafetyOutlined,
  InsightsOutlined,
  LocalHospitalOutlined,
  PaidOutlined,
  SearchOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import { getMembers } from "../services/membersApi";
import { getEnrollments } from "../services/enrollmentsApi";
import { getHealthPlans } from "../services/healthPlansApi";
import { getClaims } from "../services/claimsApi";
import {
  getPriorAuthorizations,
} from "../services/priorAuthorizationsApi";

import type { Member } from "../types/member";
import type { Enrollment } from "../types/enrollment";
import type { HealthPlan } from "../types/healthPlan";
import type { Claim } from "../types/claim";
import type {
  PriorAuthorization,
} from "../types/priorAuthorization";


type RegistryStatus =
  | "Active"
  | "Pending"
  | "Suspended"
  | "Inactive";

type RiskDisplay = "Not Scored";


interface MemberRegistryRow {
  id: string;
  memberNumber: string;
  fullName: string;

  policyNumber: string;
  employer: string;
  planName: string;

  status: RegistryStatus;
  riskLevel: RiskDisplay;

  claimsCount: number;
  claimsPaid: number;

  openAuthorizations: number;
}


interface KpiCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}


const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});


const OPEN_AUTHORIZATION_STATUSES = new Set([
  "PENDING_REVIEW",
  "MORE_INFORMATION_REQUIRED",
  "ESCALATED",
]);


const PAID_CLAIM_STATUSES = new Set([
  "PAID",
  "APPROVED",
  "PARTIALLY_APPROVED",
]);


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


function normalizeStatus(
  member: Member,
  enrollment?: Enrollment,
): RegistryStatus {
  if (!member.is_active) {
    return "Inactive";
  }

  const rawStatus = (
    enrollment?.enrollment_status ??
    member.enrollment_status ??
    ""
  )
    .trim()
    .toUpperCase();

  if (
    rawStatus === "ACTIVE" ||
    rawStatus === "ENROLLED"
  ) {
    return "Active";
  }

  if (
    rawStatus === "PENDING" ||
    rawStatus === "PENDING_ENROLLMENT"
  ) {
    return "Pending";
  }

  if (
    rawStatus === "SUSPENDED" ||
    rawStatus === "TERMINATED"
  ) {
    return "Suspended";
  }

  return member.is_active
    ? "Active"
    : "Inactive";
}


function statusStyle(
  status: RegistryStatus,
): {
  color: string;
  backgroundColor: string;
} {
  if (status === "Active") {
    return {
      color: "#047857",
      backgroundColor: "#D1FAE5",
    };
  }

  if (status === "Pending") {
    return {
      color: "#B45309",
      backgroundColor: "#FEF3C7",
    };
  }

  return {
    color: "#B91C1C",
    backgroundColor: "#FEE2E2",
  };
}


function KpiCard({
  label,
  value,
  helper,
  icon,
}: KpiCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
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
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 0.75,
              fontWeight: 900,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
            }}
          >
            {helper}
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
            backgroundColor:
              "rgba(21, 93, 155, 0.10)",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}


export default function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>(
    [],
  );

  const [
    enrollments,
    setEnrollments,
  ] = useState<Enrollment[]>([]);

  const [
    healthPlans,
    setHealthPlans,
  ] = useState<HealthPlan[]>([]);

  const [claims, setClaims] = useState<Claim[]>(
    [],
  );

  const [
    priorAuthorizations,
    setPriorAuthorizations,
  ] = useState<PriorAuthorization[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [query, setQuery] =
    useState("");

  const [status, setStatus] =
    useState<"All" | RegistryStatus>("All");

  const [risk, setRisk] =
    useState<"All" | RiskDisplay>("All");


  useEffect(() => {
    let active = true;

    async function loadRegistry() {
      try {
        setLoading(true);
        setError(null);

        const [
          memberData,
          enrollmentData,
          healthPlanData,
          claimData,
          authorizationData,
        ] = await Promise.all([
          getMembers(),
          getEnrollments(),
          getHealthPlans(),
          getClaims(),
          getPriorAuthorizations(),
        ]);

        if (!active) {
          return;
        }

        setMembers(memberData);
        setEnrollments(enrollmentData);
        setHealthPlans(healthPlanData);
        setClaims(claimData);
        setPriorAuthorizations(
          authorizationData,
        );
      } catch (loadError) {
        console.error(
          "Unable to load Members 360 registry.",
          loadError,
        );

        if (active) {
          setError(
            "Unable to load the live member registry. Confirm that the MediVantage backend is running and try again.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRegistry();

    return () => {
      active = false;
    };
  }, []);


  const registryRows = useMemo<
    MemberRegistryRow[]
  >(() => {
    const healthPlanMap = new Map(
      healthPlans.map((plan) => [
        plan.id,
        plan,
      ]),
    );

    const enrollmentsByMember =
      new Map<string, Enrollment[]>();

    for (const enrollment of enrollments) {
      const existing =
        enrollmentsByMember.get(
          enrollment.member_id,
        ) ?? [];

      existing.push(enrollment);

      enrollmentsByMember.set(
        enrollment.member_id,
        existing,
      );
    }

    const claimsByMember =
      new Map<string, Claim[]>();

    for (const claim of claims) {
      const existing =
        claimsByMember.get(
          claim.member_id,
        ) ?? [];

      existing.push(claim);

      claimsByMember.set(
        claim.member_id,
        existing,
      );
    }

    const authorizationsByMember =
      new Map<string, PriorAuthorization[]>();

    for (
      const authorization
      of priorAuthorizations
    ) {
      const existing =
        authorizationsByMember.get(
          authorization.member_id,
        ) ?? [];

      existing.push(authorization);

      authorizationsByMember.set(
        authorization.member_id,
        existing,
      );
    }

    return members.map((member) => {
      const memberEnrollments =
        enrollmentsByMember.get(
          member.id,
        ) ?? [];

      const primaryEnrollment =
        memberEnrollments.find(
          (enrollment) =>
            enrollment.is_primary &&
            enrollment.is_active,
        ) ??
        memberEnrollments.find(
          (enrollment) =>
            enrollment.is_active,
        ) ??
        memberEnrollments[0];

      const healthPlan = primaryEnrollment
        ? healthPlanMap.get(
            primaryEnrollment.health_plan_id,
          )
        : undefined;

      const memberClaims =
        claimsByMember.get(
          member.id,
        ) ?? [];

      const memberAuthorizations =
        authorizationsByMember.get(
          member.id,
        ) ?? [];

      const claimsPaid =
        memberClaims.reduce(
          (total, claim) => {
            if (
              !PAID_CLAIM_STATUSES.has(
                claim.claim_status
                  .trim()
                  .toUpperCase(),
              )
            ) {
              return total;
            }

            return (
              total +
              parseMoney(
                claim.payer_responsibility ??
                  claim.allowed_amount,
              )
            );
          },
          0,
        );

      const openAuthorizations =
        memberAuthorizations.filter(
          (authorization) =>
            OPEN_AUTHORIZATION_STATUSES.has(
              authorization.status
                .trim()
                .toUpperCase(),
            ),
        ).length;

      const fullName = [
        member.first_name,
        member.middle_name,
        member.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: member.id,
        memberNumber:
          member.member_number,
        fullName,

        policyNumber:
          primaryEnrollment?.policy_number ??
          "Not enrolled",

        employer:
          primaryEnrollment?.employer_name ??
          "Not available",

        planName:
          healthPlan?.plan_name ??
          "Not available",

        status: normalizeStatus(
          member,
          primaryEnrollment,
        ),

        riskLevel: "Not Scored",

        claimsCount: memberClaims.length,
        claimsPaid,
        openAuthorizations,
      };
    });
  }, [
    members,
    enrollments,
    healthPlans,
    claims,
    priorAuthorizations,
  ]);


  const memberKpis = useMemo(() => {
    const totalMembers =
      registryRows.length;

    const activeMembers =
      registryRows.filter(
        (member) =>
          member.status === "Active",
      ).length;

    const openAuthorizations =
      registryRows.reduce(
        (total, member) =>
          total +
          member.openAuthorizations,
        0,
      );

    const claimsPaid =
      registryRows.reduce(
        (total, member) =>
          total + member.claimsPaid,
        0,
      );

    return {
      totalMembers,
      activeMembers,
      openAuthorizations,
      claimsPaid,
    };
  }, [registryRows]);


  const filteredMembers = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    return registryRows.filter(
      (member) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          member.fullName
            .toLowerCase()
            .includes(normalizedQuery) ||
          member.memberNumber
            .toLowerCase()
            .includes(normalizedQuery) ||
          member.id
            .toLowerCase()
            .includes(normalizedQuery) ||
          member.policyNumber
            .toLowerCase()
            .includes(normalizedQuery) ||
          member.employer
            .toLowerCase()
            .includes(normalizedQuery) ||
          member.planName
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesStatus =
          status === "All" ||
          member.status === status;

        const matchesRisk =
          risk === "All" ||
          member.riskLevel === risk;

        return (
          matchesQuery &&
          matchesStatus &&
          matchesRisk
        );
      },
    );
  }, [
    registryRows,
    query,
    status,
    risk,
  ]);


  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="MEMBER INTELLIGENCE"
        title="Members 360"
        description="Unified member demographics, enrollment, health plan, claims and authorization intelligence from live payer operations data."
        icon={<GroupsOutlined />}
        context="MediVantage Member Intelligence"
        updatedText="Live operational data"
        statusLabel="Live Member Registry"
        statusTone="success"
        stats={[
          {
            label: "Total Members",
            value: memberKpis.totalMembers,
            icon: <GroupsOutlined />,
            tone: "primary",
          },
          {
            label: "Active Members",
            value: memberKpis.activeMembers,
            icon:
              <HealthAndSafetyOutlined />,
            tone: "success",
          },
          {
            label: "Risk Scoring",
            value: "Pending",
            icon: <TrendingUpOutlined />,
            tone: "warning",
          },
        ]}
        actions={[
          {
            label: "Register Member",
            icon: <AddOutlined />,
            onClick: () => {
              console.log(
                "Register member",
              );
            },
            prominent: true,
          },
          {
            label: "Member Analytics",
            icon: <InsightsOutlined />,
            onClick: () => {
              console.log(
                "Open member analytics",
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
            sm:
              "repeat(2, minmax(0, 1fr))",
            xl:
              "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <KpiCard
          label="Total Members"
          value={String(
            memberKpis.totalMembers,
          )}
          helper="Live member registry"
          icon={<GroupsOutlined />}
        />

        <KpiCard
          label="Active Members"
          value={String(
            memberKpis.activeMembers,
          )}
          helper="Currently active"
          icon={
            <HealthAndSafetyOutlined />
          }
        />

        <KpiCard
          label="Member Risk"
          value="—"
          helper="Member Intelligence pending"
          icon={<TrendingUpOutlined />}
        />

        <KpiCard
          label="Open Authorizations"
          value={String(
            memberKpis.openAuthorizations,
          )}
          helper="Awaiting final determination"
          icon={
            <LocalHospitalOutlined />
          }
        />

        <KpiCard
          label="Claims Paid"
          value={money.format(
            memberKpis.claimsPaid,
          )}
          helper="Live claims portfolio"
          icon={<PaidOutlined />}
        />
      </Box>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              alignItems: {
                xs: "stretch",
                md: "center",
              },
              justifyContent:
                "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                Member Registry
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.25,
                  color: "text.secondary",
                }}
              >
                Search, segment and open a
                complete Member 360 profile.
              </Typography>
            </Box>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
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
                  Loading live registry...
                </Typography>
              </Box>
            ) : (
              <Chip
                label={`${filteredMembers.length} visible members`}
                color="primary"
                variant="outlined"
                sx={{
                  alignSelf: {
                    xs: "flex-start",
                    md: "center",
                  },
                  fontWeight: 800,
                }}
              />
            )}
          </Box>


          <Box
            sx={{
              mt: 2.5,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md:
                  "minmax(260px, 2fr) 1fr 1fr",
              },
              gap: 1.5,
            }}
          >
            <TextField
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search member, ID, policy, employer or plan"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined
                        sx={{
                          color:
                            "text.secondary",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "All"
                    | RegistryStatus,
                )
              }
              size="small"
              fullWidth
            >
              {[
                "All",
                "Active",
                "Pending",
                "Suspended",
                "Inactive",
              ].map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Risk"
              value={risk}
              onChange={(event) =>
                setRisk(
                  event.target.value as
                    | "All"
                    | RiskDisplay,
                )
              }
              size="small"
              fullWidth
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Not Scored">
                Not Scored
              </MenuItem>
            </TextField>
          </Box>
        </Box>


        <Divider />


        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 1120 }}>
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                display: "grid",
                gridTemplateColumns:
                  "1.4fr 1fr 1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr",
                gap: 2,
                backgroundColor:
                  "background.default",
              }}
            >
              {[
                "Member",
                "Policy",
                "Employer",
                "Plan",
                "Status",
                "Risk",
                "Claims",
                "Action",
              ].map((heading) => (
                <Typography
                  key={heading}
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    color:
                      "text.secondary",
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>


            {!loading &&
              filteredMembers.map(
                (member) => (
                  <Box
                    key={member.id}
                    sx={{
                      px: 2.5,
                      py: 2,
                      display: "grid",
                      gridTemplateColumns:
                        "1.4fr 1fr 1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr",
                      gap: 2,
                      alignItems:
                        "center",
                      borderTop:
                        "1px solid",
                      borderColor:
                        "divider",
                      transition:
                        "background-color 0.2s ease",

                      "&:hover": {
                        backgroundColor:
                          "action.hover",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 900,
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {member.fullName}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "text.secondary",
                        }}
                      >
                        {
                          member.memberNumber
                        }
                      </Typography>
                    </Box>


                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {
                        member.policyNumber
                      }
                    </Typography>


                    <Typography
                      variant="body2"
                      sx={{
                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      {member.employer}
                    </Typography>


                    <Typography
                      variant="body2"
                      sx={{
                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      {member.planName}
                    </Typography>


                    <Chip
                      label={member.status}
                      size="small"
                      sx={{
                        justifySelf:
                          "start",
                        fontWeight: 800,
                        ...statusStyle(
                          member.status,
                        ),
                      }}
                    />


                    <Chip
                      label="Not Scored"
                      size="small"
                      variant="outlined"
                      sx={{
                        justifySelf:
                          "start",
                        fontWeight: 800,
                        color:
                          "text.secondary",
                        borderColor:
                          "divider",
                      }}
                    />


                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                        }}
                      >
                        {
                          member.claimsCount
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "text.secondary",
                        }}
                      >
                        {money.format(
                          member.claimsPaid,
                        )}
                      </Typography>
                    </Box>


                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/members/${encodeURIComponent(
                            member.id,
                          )}`,
                        )
                      }
                      sx={{
                        justifySelf:
                          "start",
                        whiteSpace:
                          "nowrap",
                        textTransform:
                          "none",
                        fontWeight: 800,
                        borderRadius: 2,
                      }}
                    >
                      View 360
                    </Button>
                  </Box>
                ),
              )}


            {!loading &&
              filteredMembers.length ===
                0 && (
                <Box
                  sx={{
                    p: 4,
                    textAlign:
                      "center",
                    borderTop:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    No members found
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color:
                        "text.secondary",
                    }}
                  >
                    Adjust the search
                    term or selected
                    filters.
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>
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
        MediVantage Solutions™ Members 360 ·
        Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}