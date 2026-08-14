import {
  ArrowBack,
  CheckCircleOutlined,
  DescriptionOutlined,
  LocalHospitalOutlined,
  PaymentsOutlined,
  PersonOutlined,
  PolicyOutlined,
  WarningAmberOutlined,
  CalendarMonthOutlined,
  BadgeOutlined,
  AccountBalanceWalletOutlined,
  HealthAndSafetyOutlined,
  BusinessOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getClaimById } from "../services/claimsApi";
import { getClaimIntelligence } from "../services/claimIntelligenceApi";
import { getEnrollment } from "../services/enrollmentsApi";
import { getMember } from "../services/membersApi";
import { getProvider } from "../services/providersApi";

import type { Claim } from "../types/claim";
import type { ClaimIntelligence } from "../types/claimIntelligence";
import type { Enrollment } from "../types/enrollment";
import type { Member } from "../types/member";
import type { Provider } from "../types/provider";

interface InformationItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}


function InformationItem({
  label,
  value,
  highlight = false,
}: InformationItemProps) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
        bgcolor: highlight
          ? "action.hover"
          : "transparent",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          display: "block",
          mb: 0.45,
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: highlight
            ? "primary.main"
            : "text.primary",
          fontWeight: highlight
            ? 800
            : 650,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}


interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}


function MetricCard({
  label,
  value,
  icon,
}: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "action.hover",
          color: "primary.main",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            display: "block",
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 900,
            mt: 0.25,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
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
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

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
      month: "long",
      year: "numeric",
    },
  ).format(date);
}


function formatDateTime(
  value: string | null,
): string {
  if (!value) {
    return "—";
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
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}


function formatIntelligenceLabel(
  value: string | null,
): string {
  if (!value) {
    return "Not available";
  }

  return value
    .trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}


function calculateAge(
  dateOfBirth: string,
): string {
  const birthDate =
    new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return "—";
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return `${age} years`;
}


function getMemberName(
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


function getInitials(
  member: Member,
): string {
  return [
    member.first_name,
    member.last_name,
  ]
    .filter(Boolean)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}


function normalizeStatus(
  status: string,
): string {
  return status
    .trim()
    .toUpperCase();
}


function getStatusLabel(
  status: string,
): string {
  switch (normalizeStatus(status)) {
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


function getStatusColor(
  status: string,
):
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info" {
  switch (normalizeStatus(status)) {
    case "PAID":
    case "APPROVED":
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


export default function ClaimDetails() {
  const navigate = useNavigate();

  const { claimId } =
    useParams<{ claimId: string }>();

  const [claim, setClaim] =
    useState<Claim | null>(null);

  const [member, setMember] =
    useState<Member | null>(null);

  const [provider, setProvider] =
    useState<Provider | null>(null);

  const [enrollment, setEnrollment] =
    useState<Enrollment | null>(null);

  const [
    claimIntelligence,
    setClaimIntelligence,
  ] = useState<ClaimIntelligence | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    let active = true;

    async function loadClaimWorkspace() {
      if (!claimId) {
        setError(
          "No claim identifier was provided.",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const claimData =
          await getClaimById(claimId);

        const [
          memberData,
          providerData,
          enrollmentData,
          intelligenceData,
        ] = await Promise.all([
          getMember(
            claimData.member_id,
          ),
          getProvider(
            claimData.provider_id,
          ),
          getEnrollment(
            claimData.enrollment_id,
          ),
          getClaimIntelligence(
            claimData.id,
          ).catch(() => null),
        ]);

        if (active) {
          setClaim(claimData);
          setMember(memberData);
          setProvider(providerData);
          setEnrollment(
            enrollmentData,
          );
          setClaimIntelligence(
            intelligenceData,
          );
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load claim details.";

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadClaimWorkspace();

    return () => {
      active = false;
    };
  }, [claimId]);


  const financialBalance =
    useMemo(() => {
      if (!claim) {
        return null;
      }

      const allowed =
        Number(
          claim.allowed_amount ?? "0",
        );

      const payer =
        Number(
          claim.payer_responsibility ??
            "0",
        );

      const memberResponsibility =
        Number(
          claim.member_responsibility ??
            "0",
        );

      if (
        !Number.isFinite(allowed) ||
        !Number.isFinite(payer) ||
        !Number.isFinite(
          memberResponsibility,
        )
      ) {
        return null;
      }

      return (
        allowed -
        payer -
        memberResponsibility
      );
    }, [claim]);


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 420,
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
            Loading Claim 360 workspace...
          </Typography>
        </Box>
      </Box>
    );
  }


  if (
    error ||
    !claim ||
    !member ||
    !provider ||
    !enrollment
  ) {
    return (
      <Box sx={{ pb: 5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/claims")
          }
          sx={{ mb: 3 }}
        >
          Back to Claims
        </Button>

        <Alert severity="error">
          {error ??
            "Claim details could not be loaded."}
        </Alert>
      </Box>
    );
  }


  const memberName =
    getMemberName(member);

  const status =
    normalizeStatus(
      claim.claim_status,
    );


  return (
    <Box sx={{ pb: 5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            lg: "center",
          },
          justifyContent:
            "space-between",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            {claim.claim_number}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Enterprise Claims Review Workspace
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/claims")
          }
          sx={{ fontWeight: 700 }}
        >
          Back to Claims
        </Button>
      </Box>


      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: {
            xs: 2,
            md: 3,
          },
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 0.5,
              }}
            >
              Claim Summary
            </Typography>

            <Typography
              variant="body1"
             sx={{
                 mt: 0.75,
                 color: "text.secondary",
                 fontWeight: 500,
                }}
              >
                Claim 360 • Live Enterprise Record
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
              label={getStatusLabel(
                claim.claim_status,
              )}
              color={getStatusColor(
                claim.claim_status,
              )}
              sx={{ fontWeight: 800 }}
            />

            <Chip
              label={claim.claim_type}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />

            <Chip
              label={
                claim.is_active
                  ? "Active Record"
                  : "Inactive Record"
              }
              color={
                claim.is_active
                  ? "success"
                  : "default"
              }
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label="Member"
          value={memberName}
          icon={<BadgeOutlined fontSize="small" />}
        />

        <MetricCard
          label="Provider"
          value={provider.provider_name}
          icon={<BusinessOutlined fontSize="small" />}
        />

        <MetricCard
          label="Service Date"
          value={formatDate(claim.service_date)}
          icon={<CalendarMonthOutlined fontSize="small" />}
        />

        <MetricCard
          label="Billed Amount"
          value={formatCurrency(claim.billed_amount)}
          icon={<AccountBalanceWalletOutlined fontSize="small" />}
        />
      </Box>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1fr) minmax(0, 1.45fr)",
          },
          gap: 3,
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
            <PersonOutlined color="primary" />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                Member 360
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Member identity and
                enrollment profile
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor:
                    "primary.main",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {getInitials(member)}
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900 }}
                >
                  {memberName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Member ID:{" "}
                  {member.member_number}
                </Typography>

                <Chip
                  label={
                    member.enrollment_status
                  }
                  color={
                    member.is_active
                      ? "success"
                      : "default"
                  }
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    textTransform:
                      "capitalize",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              <InformationItem
                label="Age"
                value={calculateAge(
                  member.date_of_birth,
                )}
              />

              <InformationItem
                label="Gender"
                value={member.gender}
              />

              <InformationItem
                label="Policy Number"
                value={
                  enrollment.policy_number
                }
                highlight
              />

              <InformationItem
                label="Enrollment Type"
                value={
                  enrollment.enrollment_type
                }
              />

              <InformationItem
                label="Employer Group"
                value={
                  enrollment.employer_name ??
                  "—"
                }
              />

              <InformationItem
                label="Group Number"
                value={
                  enrollment.group_number ??
                  "—"
                }
              />

              <InformationItem
                label="Coverage Start"
                value={formatDate(
                  enrollment.coverage_start_date,
                )}
              />

              <InformationItem
                label="Coverage End"
                value={formatDate(
                  enrollment.coverage_end_date,
                )}
              />
            </Box>
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
              gap: 1.25,
            }}
          >
            <LocalHospitalOutlined color="primary" />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                Claim & Clinical Review
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Service, diagnosis,
                provider and adjudication
                information
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              <InformationItem
                label="Diagnosis Code"
                value={
                  claim.diagnosis_code ??
                  "Not specified"
                }
                highlight
              />

              <InformationItem
                label="Procedure Code"
                value={
                  claim.procedure_code ??
                  "Not specified"
                }
              />

              <InformationItem
                label="Claim Type"
                value={claim.claim_type}
              />

              <InformationItem
                label="Service Date"
                value={formatDate(
                  claim.service_date,
                )}
              />

              <InformationItem
                label="Submission Date"
                value={formatDate(
                  claim.submission_date,
                )}
              />

              <InformationItem
                label="Claim Status"
                value={getStatusLabel(
                  claim.claim_status,
                )}
              />

              <InformationItem
                label="Provider"
                value={
                  provider.provider_name
                }
                highlight
              />

              <InformationItem
                label="Provider Code"
                value={
                  provider.provider_code
                }
              />

              <InformationItem
                label="Provider Type"
                value={
                  provider.provider_type
                }
              />

              <InformationItem
                label="Specialty"
                value={
                  provider.specialty ??
                  "Not specified"
                }
              />
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <HealthAndSafetyOutlined
                  fontSize="small"
                  color="primary"
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Clinical Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    {getStatusLabel(claim.claim_status)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <ReceiptLongOutlined
                  fontSize="small"
                  color="primary"
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Claim Type
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    {claim.claim_type}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <PolicyOutlined
                  fontSize="small"
                  color="primary"
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Policy
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    {enrollment.policy_number}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {status === "DENIED" && (
              <Alert
                severity="error"
                icon={
                  <WarningAmberOutlined />
                }
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800 }}
                >
                  Claim Denied
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  {claim.denial_reason ??
                    "No denial reason was recorded."}
                </Typography>
              </Alert>
            )}

            {(
              status === "APPROVED" ||
              status === "PAID"
            ) && (
              <Alert
                severity="success"
                icon={
                  <CheckCircleOutlined />
                }
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800 }}
                >
                  Adjudication Complete
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  This claim has completed
                  the approval workflow.
                </Typography>
              </Alert>
            )}

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                mb: 1,
              }}
            >
              Adjudication Notes
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
              }}
            >
              {claim.adjudication_notes ??
                "No adjudication notes have been recorded."}
            </Typography>
          </Box>
        </Paper>
      </Box>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
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
          <PaymentsOutlined color="primary" />

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              Financial Adjudication
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Billed, allowed and
              responsibility allocation
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          <InformationItem
            label="Billed Amount"
            value={formatCurrency(
              claim.billed_amount,
            )}
            highlight
          />

          <InformationItem
            label="Allowed Amount"
            value={formatCurrency(
              claim.allowed_amount,
            )}
          />

          <InformationItem
            label="Deductible"
            value={formatCurrency(
              claim.deductible_amount,
            )}
          />

          <InformationItem
            label="Copay"
            value={formatCurrency(
              claim.copay_amount,
            )}
          />

          <InformationItem
            label="Coinsurance"
            value={formatCurrency(
              claim.coinsurance_amount,
            )}
          />

          <InformationItem
            label="Payer Responsibility"
            value={formatCurrency(
              claim.payer_responsibility,
            )}
          />

          <InformationItem
            label="Member Responsibility"
            value={formatCurrency(
              claim.member_responsibility,
            )}
          />

          <InformationItem
            label="Unallocated Balance"
            value={
              financialBalance === null
                ? "—"
                : formatCurrency(
                    financialBalance.toFixed(
                      2,
                    ),
                  )
            }
          />
        </Box>
      </Paper>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <PolicyOutlined color="primary" />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 900 }}
            >
              Coverage & Enrollment
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 2,
              }}
            >
              Live policy and enrollment
              relationship associated with
              this claim.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              <InformationItem
                label="Policy Number"
                value={
                  enrollment.policy_number
                }
                highlight
              />

              <InformationItem
                label="Enrollment Status"
                value={
                  enrollment.enrollment_status
                }
              />

              <InformationItem
                label="Relationship"
                value={
                  enrollment.relationship_to_subscriber
                }
              />

              <InformationItem
                label="Primary Coverage"
                value={
                  enrollment.is_primary
                    ? "Yes"
                    : "No"
                }
              />

              <InformationItem
                label="Coverage Start"
                value={formatDate(
                  enrollment.coverage_start_date,
                )}
              />

              <InformationItem
                label="Coverage End"
                value={formatDate(
                  enrollment.coverage_end_date,
                )}
              />

              <InformationItem
                label="Employer"
                value={
                  enrollment.employer_name ??
                  "—"
                }
              />

              <InformationItem
                label="Group Number"
                value={
                  enrollment.group_number ??
                  "—"
                }
              />
            </Box>
          </Box>
        </Box>
      </Paper>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
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
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >
            <DescriptionOutlined color="primary" />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900 }}
              >
                Claims Intelligence Command Center
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Live fraud, clinical-review, SLA and
                decision-support intelligence for this claim.
              </Typography>
            </Box>
          </Box>

          {claimIntelligence && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={`Risk: ${formatIntelligenceLabel(
                  claimIntelligence.fraud_risk_level,
                )}`}
                color={
                  claimIntelligence.fraud_risk_level === "LOW"
                    ? "success"
                    : claimIntelligence.fraud_risk_level ===
                        "MEDIUM"
                      ? "warning"
                      : claimIntelligence.fraud_risk_level
                          ? "error"
                          : "default"
                }
                sx={{ fontWeight: 800 }}
              />

              <Chip
                label={formatIntelligenceLabel(
                  claimIntelligence.sla_status,
                )}
                color={
                  claimIntelligence.sla_breached
                    ? "error"
                    : "success"
                }
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />

              <Chip
                label={
                  claimIntelligence.requires_manual_review
                    ? "Manual Review Required"
                    : "No Manual Review Required"
                }
                color={
                  claimIntelligence.requires_manual_review
                    ? "warning"
                    : "success"
                }
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />
            </Box>
          )}
        </Box>

        <Divider />

        {!claimIntelligence ? (
          <Box sx={{ p: 2.5 }}>
            <Alert severity="info">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800 }}
              >
                Claims Intelligence not yet available
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 0.5 }}
              >
                This claim does not currently have a persisted
                Claims Intelligence record. The core Claim 360
                workspace remains fully available.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              <InformationItem
                label="Fraud Risk Score"
                value={
                  claimIntelligence.fraud_risk_score === null
                    ? "—"
                    : `${claimIntelligence.fraud_risk_score.toFixed(
                        1,
                      )} / 100`
                }
                highlight
              />

              <InformationItem
                label="Fraud Risk Level"
                value={formatIntelligenceLabel(
                  claimIntelligence.fraud_risk_level,
                )}
              />

              <InformationItem
                label="Clinical Review"
                value={formatIntelligenceLabel(
                  claimIntelligence.clinical_review_status,
                )}
              />

              <InformationItem
                label="SLA Status"
                value={formatIntelligenceLabel(
                  claimIntelligence.sla_status,
                )}
              />

              <InformationItem
                label="SLA Due"
                value={formatDateTime(
                  claimIntelligence.sla_due_at,
                )}
              />

              <InformationItem
                label="SLA Breached"
                value={
                  claimIntelligence.sla_breached
                    ? "Yes"
                    : "No"
                }
              />

              <InformationItem
                label="Decision Recommendation"
                value={formatIntelligenceLabel(
                  claimIntelligence.decision_recommendation,
                )}
                highlight
              />

              <InformationItem
                label="Decision Confidence"
                value={
                  claimIntelligence.decision_confidence === null
                    ? "—"
                    : `${claimIntelligence.decision_confidence.toFixed(
                        1,
                      )}%`
                }
              />

              <InformationItem
                label="Manual Review"
                value={
                  claimIntelligence.requires_manual_review
                    ? "Required"
                    : "Not required"
                }
              />

              <InformationItem
                label="Reviewed By"
                value={
                  claimIntelligence.reviewed_by ??
                  "Not recorded"
                }
              />

              <InformationItem
                label="Reviewed At"
                value={formatDateTime(
                  claimIntelligence.reviewed_at,
                )}
              />

              <InformationItem
                label="AI Model"
                value={
                  claimIntelligence.model_name ??
                  "Not recorded"
                }
              />

              <InformationItem
                label="Model Version"
                value={
                  claimIntelligence.model_version ??
                  "Not recorded"
                }
              />

              <InformationItem
                label="Intelligence Updated"
                value={formatDateTime(
                  claimIntelligence.updated_at,
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 900 }}
                >
                  Fraud Assessment
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, lineHeight: 1.7 }}
                >
                  {claimIntelligence.fraud_risk_reason ??
                    "No fraud-risk rationale has been recorded."}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 900 }}
                >
                  Clinical Review Summary
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, lineHeight: 1.7 }}
                >
                  {claimIntelligence.clinical_review_summary ??
                    "No clinical-review summary has been recorded."}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 900 }}
                >
                  Decision Rationale
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, lineHeight: 1.7 }}
                >
                  {claimIntelligence.decision_reason ??
                    "No decision rationale has been recorded."}
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}