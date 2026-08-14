import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { getMember } from "../services/membersApi";
import {
  getEnrollmentsByMember,
} from "../services/enrollmentsApi";
import { getHealthPlan } from "../services/healthPlansApi";
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


interface DetailItemProps {
  label: string;
  value: ReactNode;
}

interface SectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
}


const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});


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

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}


function formatDateTime(
  value: string | null | undefined,
): string {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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


function maskNationalId(
  value: string | null,
): string {
  if (!value) {
    return "Not available";
  }

  if (value.length <= 4) {
    return value;
  }

  const firstTwo = value.slice(0, 2);
  const lastTwo = value.slice(-2);

  return `${firstTwo}${"*".repeat(
    Math.max(value.length - 4, 4),
  )}${lastTwo}`;
}


function normalizeMemberStatus(
  member: Member,
  enrollment: Enrollment | null,
): string {
  if (!member.is_active) {
    return "Inactive";
  }

  const status = (
    enrollment?.enrollment_status ??
    member.enrollment_status ??
    ""
  )
    .trim()
    .toUpperCase();

  if (
    status === "ACTIVE" ||
    status === "ENROLLED"
  ) {
    return "Active";
  }

  if (
    status === "PENDING" ||
    status === "PENDING_ENROLLMENT"
  ) {
    return "Pending";
  }

  if (status === "SUSPENDED") {
    return "Suspended";
  }

  if (
    status === "TERMINATED" ||
    status === "CANCELLED"
  ) {
    return "Inactive";
  }

  return "Active";
}


function getStatusStyle(
  status: string,
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


function getClaimStatusColor(
  status: string,
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" {
  switch (status.toUpperCase()) {
    case "PAID":
    case "APPROVED":
      return "success";

    case "SUBMITTED":
    case "UNDER_REVIEW":
    case "PARTIALLY_APPROVED":
      return "warning";

    case "DENIED":
    case "CANCELLED":
      return "error";

    default:
      return "default";
  }
}


function getAuthorizationStatusColor(
  status: string,
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "success";

    case "PENDING_REVIEW":
    case "MORE_INFORMATION_REQUIRED":
      return "warning";

    case "ESCALATED":
      return "info";

    case "DENIED":
      return "error";

    default:
      return "default";
  }
}


function humanizeStatus(
  value: string,
): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}


function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor:
          "background.paper",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 0.75,
          fontWeight: 900,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}


function Section({
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
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
          px: 2.5,
          py: 2,
          backgroundColor:
            "background.default",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 900 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.25,
            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Divider />

      {children}
    </Paper>
  );
}


export default function MemberDetails() {
  const navigate = useNavigate();

  const { memberId } = useParams<{
    memberId: string;
  }>();

  const [member, setMember] =
    useState<Member | null>(null);

  const [
    enrollments,
    setEnrollments,
  ] = useState<Enrollment[]>([]);

  const [healthPlan, setHealthPlan] =
    useState<HealthPlan | null>(null);

  const [claims, setClaims] =
    useState<Claim[]>([]);

  const [
    authorizations,
    setAuthorizations,
  ] = useState<PriorAuthorization[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    let active = true;

    async function loadMember360() {
      if (!memberId) {
        if (active) {
          setError(
            "No member identifier was supplied.",
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const decodedId =
          decodeURIComponent(memberId);

        const memberData =
          await getMember(decodedId);

        const [
          enrollmentData,
          allClaims,
          allAuthorizations,
        ] = await Promise.all([
          getEnrollmentsByMember(
            memberData.id,
          ),
          getClaims(),
          getPriorAuthorizations(),
        ]);

        if (!active) {
          return;
        }

        const memberClaims =
          allClaims.filter(
            (claim) =>
              claim.member_id ===
              memberData.id,
          );

        const memberAuthorizations =
          allAuthorizations.filter(
            (authorization) =>
              authorization.member_id ===
              memberData.id,
          );

        const primaryEnrollment =
          enrollmentData.find(
            (enrollment) =>
              enrollment.is_primary &&
              enrollment.is_active,
          ) ??
          enrollmentData.find(
            (enrollment) =>
              enrollment.is_active,
          ) ??
          enrollmentData[0] ??
          null;

        let planData: HealthPlan | null =
          null;

        if (primaryEnrollment) {
          try {
            planData =
              await getHealthPlan(
                primaryEnrollment.health_plan_id,
              );
          } catch (planError) {
            console.warn(
              "Unable to load health plan.",
              planError,
            );
          }
        }

        if (!active) {
          return;
        }

        setMember(memberData);
        setEnrollments(
          enrollmentData,
        );
        setClaims(memberClaims);
        setAuthorizations(
          memberAuthorizations,
        );
        setHealthPlan(planData);
      } catch (loadError) {
        console.error(
          "Unable to load Member 360.",
          loadError,
        );

        if (active) {
          setError(
            "The requested live member record could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMember360();

    return () => {
      active = false;
    };
  }, [memberId]);


  const primaryEnrollment =
    useMemo(() => {
      return (
        enrollments.find(
          (enrollment) =>
            enrollment.is_primary &&
            enrollment.is_active,
        ) ??
        enrollments.find(
          (enrollment) =>
            enrollment.is_active,
        ) ??
        enrollments[0] ??
        null
      );
    }, [enrollments]);


  const claimsPaid = useMemo(() => {
    return claims.reduce(
      (total, claim) => {
        const status =
          claim.claim_status
            .trim()
            .toUpperCase();

        if (
          status !== "PAID" &&
          status !== "APPROVED" &&
          status !==
            "PARTIALLY_APPROVED"
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
  }, [claims]);


  const openAuthorizations =
    useMemo(() => {
      const openStatuses = new Set([
        "PENDING_REVIEW",
        "MORE_INFORMATION_REQUIRED",
        "ESCALATED",
      ]);

      return authorizations.filter(
        (authorization) =>
          openStatuses.has(
            authorization.status
              .trim()
              .toUpperCase(),
          ),
      ).length;
    }, [authorizations]);


  const timeline =
    useMemo<TimelineEvent[]>(() => {
      if (!member) {
        return [];
      }

      const events: TimelineEvent[] =
        [];

      for (const enrollment of enrollments) {
        events.push({
          id: `ENR-${enrollment.id}`,
          date: enrollment.created_at,
          title: "Enrollment Record Created",
          description:
            `Policy ${enrollment.policy_number} was associated with the member.`,
          actor:
            "Enrollment Operations",
        });
      }

      for (const claim of claims) {
        events.push({
          id: `CLM-${claim.id}`,
          date: claim.created_at,
          title: `Claim ${humanizeStatus(
            claim.claim_status,
          )}`,
          description:
            `${claim.claim_number} · ${claim.claim_type}`,
          actor: "Claims Operations",
        });
      }

      for (
        const authorization
        of authorizations
      ) {
        events.push({
          id: `PA-${authorization.id}`,
          date:
            authorization.created_at,
          title:
            "Prior Authorization Activity",
          description:
            `${authorization.authorization_number} · ${authorization.procedure_description}`,
          actor:
            authorization.assigned_reviewer ??
            "Utilization Management",
        });
      }

      return events.sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      );
    }, [
      member,
      enrollments,
      claims,
      authorizations,
    ]);


  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: 800 }}
        >
          Loading live Member 360...
        </Typography>
      </Box>
    );
  }


  if (error || !member) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 900 }}
        >
          Member record unavailable
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "text.secondary",
          }}
        >
          {error ??
            "The selected member could not be found."}
        </Typography>

        <Button
          variant="outlined"
          startIcon={
            <ArrowBackOutlinedIcon />
          }
          onClick={() =>
            navigate("/members")
          }
          sx={{
            mt: 3,
            textTransform: "none",
            fontWeight: 800,
          }}
        >
          Back to Members 360
        </Button>
      </Paper>
    );
  }


  const fullName = [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const memberStatus =
    normalizeMemberStatus(
      member,
      primaryEnrollment,
    );

  const memberStatusStyle =
    getStatusStyle(memberStatus);


  return (
    <Box sx={{ pb: 4 }}>
      <Button
        variant="outlined"
        startIcon={
          <ArrowBackOutlinedIcon />
        }
        onClick={() =>
          navigate("/members")
        }
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 800,
        }}
      >
        Back to Members 360
      </Button>


      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: {
            xs: 2.5,
            md: 3.5,
          },
          borderRadius: 3,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0F3D66 0%, #145A8D 58%, #0E7490 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -150,
            right: -100,
            width: 280,
            height: 280,
            borderRadius: "50%",
            backgroundColor:
              "rgba(255, 255, 255, 0.08)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
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
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              MEMBER 360 PROFILE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 0.5,
                fontWeight: 900,
              }}
            >
              {fullName}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              {member.member_number}
              {" · "}
              {primaryEnrollment?.policy_number ??
                "No active policy"}
              {" · "}
              {healthPlan?.plan_name ??
                "Plan not available"}
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={memberStatus}
                sx={{
                  fontWeight: 900,
                  color:
                    memberStatusStyle.color,
                  backgroundColor:
                    memberStatusStyle.backgroundColor,
                }}
              />

              <Chip
                label="Risk Not Scored"
                sx={{
                  color: "#475569",
                  backgroundColor:
                    "#F1F5F9",
                  fontWeight: 900,
                }}
              />

              <Chip
                label={`${claims.length} claims`}
                sx={{
                  color: "common.white",
                  backgroundColor:
                    "rgba(255, 255, 255, 0.16)",
                  fontWeight: 800,
                }}
              />
            </Box>
          </Box>


          <Box
            sx={{
              width: {
                xs: "100%",
                md: 300,
              },
              p: 2.5,
              border:
                "1px solid rgba(255,255,255,0.20)",
              borderRadius: 2.5,
              backgroundColor:
                "rgba(255,255,255,0.12)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ opacity: 0.85 }}
            >
              Member Intelligence
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.5,
                fontWeight: 900,
              }}
            >
              Not Scored
            </Typography>

            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                opacity: 0.85,
              }}
            >
              Predictive member risk and
              engagement scoring have not yet
              been connected to a live
              intelligence service.
            </Typography>
          </Box>
        </Box>
      </Paper>


      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl:
              "minmax(0, 2fr) minmax(320px, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 3,
            minWidth: 0,
          }}
        >
          <Section
            title="Personal Information"
            subtitle="Live demographics, identity and communication information."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(2, minmax(0, 1fr))",
                  lg:
                    "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Member ID"
                value={
                  member.member_number
                }
              />

              <DetailItem
                label="Date of Birth"
                value={formatDate(
                  member.date_of_birth,
                )}
              />

              <DetailItem
                label="Gender"
                value={
                  member.gender ||
                  "Not available"
                }
              />

              <DetailItem
                label="National ID"
                value={maskNationalId(
                  member.national_id,
                )}
              />

              <DetailItem
                label="Phone"
                value={
                  member.phone ??
                  "Not available"
                }
              />

              <DetailItem
                label="Email"
                value={
                  member.email ??
                  "Not available"
                }
              />

              <DetailItem
                label="City"
                value={
                  member.city ??
                  "Not available"
                }
              />

              <DetailItem
                label="Region"
                value={
                  member.region ??
                  "Not available"
                }
              />

              <DetailItem
                label="Country"
                value={
                  member.country ??
                  "Not available"
                }
              />
            </Box>
          </Section>


          <Section
            title="Insurance & Coverage"
            subtitle="Live enrollment, policy and health-plan information."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(2, minmax(0, 1fr))",
                  lg:
                    "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <DetailItem
                label="Policy Number"
                value={
                  primaryEnrollment?.policy_number ??
                  "Not enrolled"
                }
              />

              <DetailItem
                label="Plan"
                value={
                  healthPlan?.plan_name ??
                  "Not available"
                }
              />

              <DetailItem
                label="Plan Code"
                value={
                  healthPlan?.plan_code ??
                  "Not available"
                }
              />

              <DetailItem
                label="Employer"
                value={
                  primaryEnrollment?.employer_name ??
                  "Not available"
                }
              />

              <DetailItem
                label="Enrollment Type"
                value={
                  primaryEnrollment?.enrollment_type ??
                  "Not available"
                }
              />

              <DetailItem
                label="Relationship"
                value={
                  primaryEnrollment?.relationship_to_subscriber ??
                  "Not available"
                }
              />

              <DetailItem
                label="Coverage Start"
                value={formatDate(
                  primaryEnrollment?.coverage_start_date,
                )}
              />

              <DetailItem
                label="Coverage End"
                value={formatDate(
                  primaryEnrollment?.coverage_end_date,
                )}
              />

              <DetailItem
                label="Group Number"
                value={
                  primaryEnrollment?.group_number ??
                  "Not available"
                }
              />
            </Box>
          </Section>


          <Section
            title="Clinical Profile"
            subtitle="Clinical profile service is not yet connected to the live Member 360 backend."
          >
            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                Chronic conditions, allergies,
                medications and care gaps are
                intentionally not displayed from
                demonstration data. A dedicated
                clinical-profile service will
                populate this section when
                implemented.
              </Alert>
            </Box>
          </Section>


          <Section
            title="Claims History"
            subtitle="Live claims associated with this member."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 1.5,
              }}
            >
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <Box
                    key={claim.id}
                    sx={{
                      p: 2,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md:
                          "1.2fr 1fr 1fr 0.8fr",
                      },
                      gap: 2,
                      alignItems: "center",
                      border:
                        "1px solid",
                      borderColor:
                        "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 900,
                          color:
                            "primary.main",
                        }}
                      >
                        {
                          claim.claim_number
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(
                          claim.service_date,
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                        }}
                      >
                        {
                          claim.claim_type
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Diagnosis:{" "}
                        {claim.diagnosis_code ??
                          "Not recorded"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                      }}
                    >
                      {money.format(
                        parseMoney(
                          claim.billed_amount,
                        ),
                      )}
                    </Typography>

                    <Chip
                      label={humanizeStatus(
                        claim.claim_status,
                      )}
                      size="small"
                      color={getClaimStatusColor(
                        claim.claim_status,
                      )}
                      variant="outlined"
                      sx={{
                        justifySelf: {
                          md: "start",
                        },
                        fontWeight: 800,
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Alert severity="info">
                  No live claims are currently
                  associated with this member.
                </Alert>
              )}
            </Box>
          </Section>


          <Section
            title="Prior Authorizations"
            subtitle="Live utilization-management requests associated with this member."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 1.5,
              }}
            >
              {authorizations.length >
              0 ? (
                authorizations.map(
                  (authorization) => (
                    <Box
                      key={
                        authorization.id
                      }
                      sx={{
                        p: 2,
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md:
                            "1fr 1.7fr 0.8fr",
                        },
                        gap: 2,
                        alignItems:
                          "center",
                        border:
                          "1px solid",
                        borderColor:
                          "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box>
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
                            authorization.authorization_number
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(
                            authorization.requested_service_date ??
                              authorization.created_at,
                          )}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                        }}
                      >
                        {
                          authorization.procedure_description
                        }
                      </Typography>

                      <Chip
                        label={humanizeStatus(
                          authorization.status,
                        )}
                        size="small"
                        color={getAuthorizationStatusColor(
                          authorization.status,
                        )}
                        variant="outlined"
                        sx={{
                          justifySelf: {
                            md: "start",
                          },
                          fontWeight:
                            800,
                        }}
                      />
                    </Box>
                  ),
                )
              ) : (
                <Alert severity="info">
                  No live prior authorization
                  requests are currently associated
                  with this member.
                </Alert>
              )}
            </Box>
          </Section>


          <Section
            title="Member Timeline"
            subtitle="Auditable events derived from live enrollment, claims and authorization activity."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 2,
              }}
            >
              {timeline.length > 0 ? (
                timeline.map(
                  (event, index) => (
                    <Box
                      key={event.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "36px minmax(0, 1fr)",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display: "grid",
                          placeItems:
                            "center",
                          borderRadius:
                            "50%",
                          color:
                            "primary.main",
                          backgroundColor:
                            "rgba(21, 93, 155, 0.10)",
                          fontWeight:
                            900,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box
                        sx={{
                          pb:
                            index ===
                            timeline.length -
                              1
                              ? 0
                              : 2,
                          borderBottom:
                            index ===
                            timeline.length -
                              1
                              ? "none"
                              : "1px solid",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            flexDirection:
                              {
                                xs:
                                  "column",
                                md: "row",
                              },
                            justifyContent:
                              "space-between",
                            alignItems: {
                              xs:
                                "flex-start",
                              md: "center",
                            },
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {event.title}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDateTime(
                              event.date,
                            )}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.75,
                            color:
                              "text.secondary",
                          }}
                        >
                          {
                            event.description
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.75,
                            display: "block",
                            color:
                              "primary.main",
                            fontWeight:
                              800,
                          }}
                        >
                          {event.actor}
                        </Typography>
                      </Box>
                    </Box>
                  ),
                )
              ) : (
                <Alert severity="info">
                  No auditable member activity is
                  available yet.
                </Alert>
              )}
            </Box>
          </Section>
        </Box>


        <Box
          sx={{
            display: "grid",
            gap: 3,
            position: {
              xl: "sticky",
            },
            top: {
              xl: 88,
            },
          }}
        >
          <Section
            title="Member Intelligence"
            subtitle="Live operational indicators and future predictive intelligence."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 2,
              }}
            >
              <DetailItem
                label="Risk Score"
                value="Not Scored"
              />

              <DetailItem
                label="Predicted Annual Cost"
                value="Not Available"
              />

              <DetailItem
                label="Engagement Score"
                value="Not Available"
              />

              <DetailItem
                label="Claims Paid"
                value={money.format(
                  claimsPaid,
                )}
              />

              <DetailItem
                label="Open Authorizations"
                value={String(
                  openAuthorizations,
                )}
              />

              <Alert severity="info">
                Member risk, cost prediction and
                engagement scoring will be
                populated by the future
                MediVantage Member Intelligence
                service.
              </Alert>

              <Alert severity="info">
                Decision-support intelligence is
                intended to support authorised
                human review and does not replace
                clinical or administrative
                decision-making.
              </Alert>
            </Box>
          </Section>


          <Section
            title="Member Actions"
            subtitle="Operational shortcuts for authorised users."
          >
            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 1.25,
              }}
            >
              <Button
                variant="contained"
                disabled
                sx={{
                  py: 1.15,
                  textTransform:
                    "none",
                  fontWeight: 900,
                }}
              >
                Start Care Management Review
              </Button>

              <Button
                variant="outlined"
                disabled={
                  !primaryEnrollment
                }
                onClick={() => {
                  if (
                    primaryEnrollment
                  ) {
                    navigate(
                      `/policy-administration/${encodeURIComponent(
                        primaryEnrollment.policy_number,
                      )}`,
                    );
                  }
                }}
                sx={{
                  py: 1.15,
                  textTransform:
                    "none",
                  fontWeight: 800,
                }}
              >
                Open Policy
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/claims")
                }
                sx={{
                  py: 1.15,
                  textTransform:
                    "none",
                  fontWeight: 800,
                }}
              >
                View Claims Workspace
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    "/prior-authorization",
                  )
                }
                sx={{
                  py: 1.15,
                  textTransform:
                    "none",
                  fontWeight: 800,
                }}
              >
                View Prior Authorizations
              </Button>
            </Box>
          </Section>
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
        MediVantage Solutions™ Member 360 ·
        Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}