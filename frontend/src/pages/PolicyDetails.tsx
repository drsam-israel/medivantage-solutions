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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import {
  getPolicy,
  updatePolicy,
} from "../services/policiesApi";

import {
  getMember,
} from "../services/membersApi";

import {
  getHealthPlan,
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


type PolicyAction =
  | "Renew Policy"
  | "Suspend Policy"
  | "Cancel Policy"
  | "Add Endorsement";


interface SectionHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}


interface DetailItemProps {
  label: string;
  value: string;
  emphasis?: boolean;
}


const formatCurrency = (
  value: number,
  currency = "SAR",
): string =>
  new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(value);


const parseMoney = (
  value: string | null | undefined,
): number => {
  if (value == null) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};


const formatDate = (
  value: string | null | undefined,
): string => {
  if (!value || value === "-") {
    return value || "Not available";
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
};


const humanize = (
  value: string | null | undefined,
): string => {
  if (!value) {
    return "Not available";
  }

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
};


const splitSummary = (
  value: string | null,
): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
};


const getStatusStyle = (
  status: string,
): {
  color: string;
  backgroundColor: string;
} => {
  switch (status) {
    case "Active":
    case "Paid":
      return {
        color: "#047857",
        backgroundColor: "#D1FAE5",
      };

    case "Pending":
    case "Renewal Due":
      return {
        color: "#B45309",
        backgroundColor: "#FEF3C7",
      };

    case "Suspended":
      return {
        color: "#7C3AED",
        backgroundColor: "#EDE9FE",
      };

    case "Cancelled":
    case "Expired":
    case "Overdue":
      return {
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
      };

    default:
      return {
        color: "#0369A1",
        backgroundColor: "#E0F2FE",
      };
  }
};


function SectionHeader({
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
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
        backgroundColor:
          "background.default",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
          }}
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

      {action}
    </Box>
  );
}


function DetailItem({
  label,
  value,
  emphasis = false,
}: DetailItemProps) {
  return (
    <Box
      sx={{
        p: 2,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant={
          emphasis
            ? "h6"
            : "body1"
        }
        sx={{
          mt: 0.5,
          fontWeight:
            emphasis
              ? 900
              : 800,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}


export default function PolicyDetails() {
  const navigate = useNavigate();

  const { policyId } =
    useParams<{
      policyId: string;
    }>();

  const [
    policy,
    setPolicy,
  ] = useState<Policy | null>(
    null,
  );

  const [
    member,
    setMember,
  ] = useState<Member | null>(
    null,
  );

  const [
    healthPlan,
    setHealthPlan,
  ] = useState<HealthPlan | null>(
    null,
  );

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
    selectedAction,
    setSelectedAction,
  ] = useState<
    PolicyAction | null
  >(null);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  useEffect(() => {
    let active = true;

    async function loadPolicy360() {
      if (!policyId) {
        if (active) {
          setError(
            "No policy identifier was supplied.",
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const decodedPolicyId =
          decodeURIComponent(
            policyId,
          );

        const policyData =
          await getPolicy(
            decodedPolicyId,
          );

        const [
          memberData,
          planData,
        ] = await Promise.all([
          getMember(
            policyData.policyholder_member_id,
          ),
          getHealthPlan(
            policyData.health_plan_id,
          ),
        ]);

        if (!active) {
          return;
        }

        setPolicy(policyData);
        setMember(memberData);
        setHealthPlan(planData);
      } catch (loadError) {
        console.error(
          "Unable to load Policy 360.",
          loadError,
        );

        if (active) {
          setError(
            "The requested live policy record could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPolicy360();

    return () => {
      active = false;
    };
  }, [policyId]);


  const benefits =
    useMemo(
      () =>
        splitSummary(
          policy?.benefits_summary ??
            null,
        ),
      [policy],
    );


  const exclusions =
    useMemo(
      () =>
        splitSummary(
          policy?.exclusions_summary ??
            null,
        ),
      [policy],
    );


  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 900,
          }}
        >
          Loading live Policy 360...
        </Typography>
      </Box>
    );
  }


  if (
    error ||
    !policy ||
    !member ||
    !healthPlan
  ) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
          }}
        >
          Policy record unavailable
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "text.secondary",
          }}
        >
          {error ??
            "The selected live policy record could not be loaded."}
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              "/policy-administration",
            )
          }
          sx={{
            mt: 3,
            textTransform: "none",
            fontWeight: 800,
          }}
        >
          Back to Policy Portfolio
        </Button>
      </Paper>
    );
  }


  const displayStatus =
    humanize(policy.status);

  const billingStatus =
    humanize(
      policy.billing_status,
    );

  const statusStyle =
    getStatusStyle(
      displayStatus,
    );

  const billingStyle =
    getStatusStyle(
      billingStatus,
    );

  const fullName = [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");


  const handleAction = async (
    action: PolicyAction,
  ) => {
    setSelectedAction(action);

    if (
      action ===
      "Add Endorsement"
    ) {
      setNotificationOpen(
        true,
      );

      return;
    }

    if (
      action ===
      "Renew Policy"
    ) {
      setNotificationOpen(
        true,
      );

      return;
    }

    try {
      setActionLoading(true);

      const update =
        action ===
        "Suspend Policy"
          ? {
              status:
                "SUSPENDED",
              suspension_reason:
                "Policy suspended through authorised Policy Administration workflow.",
            }
          : {
              status:
                "CANCELLED",
              is_active:
                false,
              cancellation_reason:
                "Policy cancelled through authorised Policy Administration workflow.",
            };

      const updated =
        await updatePolicy(
          policy.id,
          update,
        );

      setPolicy(updated);

      setNotificationOpen(
        true,
      );
    } catch (actionError) {
      console.error(
        "Unable to update policy.",
        actionError,
      );

      setError(
        "The policy lifecycle action could not be completed.",
      );
    } finally {
      setActionLoading(false);
    }
  };


  return (
    <Box sx={{ pb: 4 }}>
      <Button
        variant="outlined"
        onClick={() =>
          navigate(
            "/policy-administration",
          )
        }
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 800,
        }}
      >
        Back to Policy Portfolio
      </Button>


      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2.5,
            md: 3.5,
          },
          borderRadius: 3,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0F3D66 0%, #145A8D 58%, #0E7490 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -160,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: "50%",
            backgroundColor:
              "rgba(255,255,255,0.08)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            justifyContent:
              "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                letterSpacing: 1.4,
              }}
            >
              ENTERPRISE POLICY 360
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 0.5,
                fontWeight: 900,
              }}
            >
              {policy.policy_number}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              {healthPlan.plan_name}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={
                  displayStatus
                }
                sx={{
                  fontWeight: 900,
                  color:
                    statusStyle.color,
                  backgroundColor:
                    statusStyle.backgroundColor,
                }}
              />

              <Chip
                label={humanize(
                  policy.policy_type,
                )}
                sx={{
                  fontWeight: 800,
                  color: "#0F4C75",
                  backgroundColor:
                    "#E0F2FE",
                }}
              />

              <Chip
                label={
                  policy.renewal_eligible
                    ? "Renewal Eligible"
                    : "Renewal Review Required"
                }
                sx={{
                  fontWeight: 800,
                  color:
                    policy.renewal_eligible
                      ? "#047857"
                      : "#B45309",
                  backgroundColor:
                    policy.renewal_eligible
                      ? "#D1FAE5"
                      : "#FEF3C7",
                }}
              />
            </Stack>
          </Box>


          <Box
            sx={{
              width: {
                xs: "100%",
                lg: 340,
              },
              p: 2.5,
              borderRadius: 2.5,
              border:
                "1px solid rgba(255,255,255,0.20)",
              backgroundColor:
                "rgba(255,255,255,0.12)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                opacity: 0.85,
              }}
            >
              Policy Intelligence
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.75,
                fontWeight: 900,
              }}
            >
              Not Scored
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1.25,
                opacity: 0.85,
                lineHeight: 1.6,
              }}
            >
              Policy-level AI risk scoring has
              not yet been connected to the
              live Policy Intelligence service.
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
            <SectionHeader
              title="Policy Summary"
              subtitle="Core policy identification, status and coverage period."
              action={
                <Chip
                  label={
                    displayStatus
                  }
                  size="small"
                  sx={{
                    fontWeight: 800,
                    color:
                      statusStyle.color,
                    backgroundColor:
                      statusStyle.backgroundColor,
                  }}
                />
              }
            />

            <Divider />

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
                  policy.policy_number
                }
                emphasis
              />

              <DetailItem
                label="Plan Code"
                value={healthPlan.plan_code}
             />

              <DetailItem
                label="Plan"
                value={
                  healthPlan.plan_name
                }
              />

              <DetailItem
                label="Plan Type"
                value={humanize(
                  policy.policy_type,
                )}
              />

              <DetailItem
                label="Effective Date"
                value={formatDate(
                  policy.effective_date,
                )}
              />

              <DetailItem
                label="Expiry Date"
                value={formatDate(
                  policy.expiry_date,
                )}
              />
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
            <SectionHeader
              title="Policyholder 360"
              subtitle="Live primary member demographics and contact information."
            />

            <Divider />

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
                label="Policyholder"
                value={fullName}
                emphasis
              />

              <DetailItem
                label="Member ID"
                value={
                  member.member_number
                }
              />

              <DetailItem
                label="Gender"
                value={
                  member.gender
                }
              />

              <DetailItem
                label="Date of Birth"
                value={formatDate(
                  member.date_of_birth,
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
            <SectionHeader
              title="Covered Dependants"
              subtitle="Family members and beneficiaries enrolled under the policy."
              action={
                <Chip
                  label="Not yet connected"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 800,
                  }}
                />
              }
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                Dependant-level policy enrollment is not yet
                represented by the live Policy backend. No
                demonstration dependants are being displayed.
              </Alert>
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
            <SectionHeader
              title="Coverage and Cost Sharing"
              subtitle="Live network, benefit limits and member financial responsibility."
            />

            <Divider />

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
                label="Provider Network"
                value={
                  policy.network_name ??
                  "Not available"
                }
                emphasis
              />

              <DetailItem
                label="Annual Limit"
                value={formatCurrency(
                  parseMoney(
                    policy.annual_limit,
                  ),
                  policy.premium_currency,
                )}
              />

              <DetailItem
                label="Deductible"
                value={formatCurrency(
                  parseMoney(
                    policy.deductible_amount,
                  ),
                  policy.premium_currency,
                )}
              />

              <DetailItem
                label="Copay"
                value={formatCurrency(
                  parseMoney(
                    policy.copay_amount,
                  ),
                  policy.premium_currency,
                )}
              />

              <DetailItem
                label="Coinsurance"
                value={`${parseMoney(
                  policy.coinsurance_percentage,
                )}%`}
              />

              <DetailItem
                label="Out-of-Pocket Maximum"
                value={formatCurrency(
                  parseMoney(
                    policy.out_of_pocket_maximum,
                  ),
                  policy.premium_currency,
                )}
              />
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
            <SectionHeader
              title="Benefits and Exclusions"
              subtitle="Live covered services and policy limitations."
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md:
                    "repeat(2, minmax(0, 1fr))",
                },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 900,
                  }}
                >
                  Covered Benefits
                </Typography>

                <Stack spacing={1}>
                  {benefits.length >
                  0 ? (
                    benefits.map(
                      (benefit) => (
                        <Box
                          key={
                            benefit
                          }
                          sx={{
                            p: 1.5,
                            borderRadius:
                              2,
                            color:
                              "#047857",
                            backgroundColor:
                              "#ECFDF5",
                            fontWeight:
                              800,
                          }}
                        >
                          {benefit}
                        </Box>
                      ),
                    )
                  ) : (
                    <Alert severity="info">
                      No benefit summary is currently recorded.
                    </Alert>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 900,
                  }}
                >
                  Policy Exclusions
                </Typography>

                <Stack spacing={1}>
                  {exclusions.length >
                  0 ? (
                    exclusions.map(
                      (exclusion) => (
                        <Box
                          key={
                            exclusion
                          }
                          sx={{
                            p: 1.5,
                            borderRadius:
                              2,
                            color:
                              "#B91C1C",
                            backgroundColor:
                              "#FEF2F2",
                            fontWeight:
                              800,
                          }}
                        >
                          {
                            exclusion
                          }
                        </Box>
                      ),
                    )
                  ) : (
                    <Alert severity="info">
                      No policy exclusions are currently recorded.
                    </Alert>
                  )}
                </Stack>
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
            <SectionHeader
              title="Policy Endorsements"
              subtitle="Riders, amendments and approved changes."
              action={
                <Chip
                  label="0 endorsements"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 800,
                  }}
                />
              }
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                No live endorsement records are currently
                attached to this policy. A dedicated Policy
                Endorsements service will populate this section.
              </Alert>
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
            <SectionHeader
              title="Policy Lifecycle Timeline"
              subtitle="Auditable policy events and accountable actions."
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 2,
              }}
            >
              <Box
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
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                    backgroundColor:
                      "rgba(21, 93, 155, 0.1)",
                    fontWeight: 900,
                  }}
                >
                  1
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    Policy Record Created
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.75,
                      color:
                        "text.secondary",
                    }}
                  >
                    Live Policy Administration record created
                    in the MediVantage policy repository.
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.75,
                      display: "block",
                      color:
                        "primary.main",
                      fontWeight: 800,
                    }}
                  >
                    Policy Administration
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
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
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <SectionHeader
              title="Premium and Billing"
              subtitle="Current live premium obligation and collection status."
              action={
                <Chip
                  label={
                    billingStatus
                  }
                  size="small"
                  sx={{
                    fontWeight: 800,
                    color:
                      billingStyle.color,
                    backgroundColor:
                      billingStyle.backgroundColor,
                  }}
                />
              }
            />

            <Divider />

            <Box
              sx={{
                p: 2.5,
                display: "grid",
                gap: 2,
              }}
            >
              <DetailItem
                label="Premium Amount"
                value={formatCurrency(
                  parseMoney(
                    policy.premium_amount,
                  ),
                  policy.premium_currency,
                )}
                emphasis
              />

              <DetailItem
                label="Billing Frequency"
                value={humanize(
                  policy.billing_frequency,
                )}
              />

              <DetailItem
                label="Billing Status"
                value={
                  billingStatus
                }
              />

              <DetailItem
                label="Next Payment Date"
                value={formatDate(
                  policy.next_payment_date,
                )}
              />
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
            <SectionHeader
              title="AI Policy Risk Profile"
              subtitle="Explainable policy and renewal decision support."
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Chip
                label="Not Scored"
                variant="outlined"
                sx={{
                  fontWeight: 900,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color:
                    "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                No live Policy Intelligence risk score has
                been generated for this policy yet.
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Alert severity="info">
                AI risk insights will support policy
                administration decisions and require human
                review before adverse action.
              </Alert>
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
            <SectionHeader
              title="Renewal Readiness"
              subtitle="Eligibility and upcoming policy renewal status."
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Alert
                severity={
                  policy.renewal_eligible
                    ? "success"
                    : "warning"
                }
              >
                {policy.renewal_eligible
                  ? "This policy is currently eligible for renewal."
                  : "This policy requires additional review before renewal."}
              </Alert>

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gap: 2,
                }}
              >
                <DetailItem
                  label="Renewal Due"
                  value={formatDate(
                    policy.renewal_due_date,
                  )}
                />

                <DetailItem
                  label="Policy Expiry"
                  value={formatDate(
                    policy.expiry_date,
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
            <SectionHeader
              title="Policy Actions"
              subtitle="Controlled lifecycle actions requiring authorised review."
            />

            <Divider />

            <Box sx={{ p: 2.5 }}>
              {selectedAction && (
                <Alert
                  severity={
                    selectedAction ===
                    "Renew Policy"
                      ? "success"
                      : selectedAction ===
                          "Cancel Policy"
                        ? "error"
                        : "warning"
                  }
                  sx={{
                    mb: 2,
                  }}
                >
                  Selected action:{" "}
                  <strong>
                    {selectedAction}
                  </strong>
                </Alert>
              )}

              <Stack spacing={1.25}>
                <Button
                  variant="contained"
                  disabled={
                    !policy.renewal_eligible ||
                    actionLoading
                  }
                  onClick={() =>
                    void handleAction(
                      "Renew Policy",
                    )
                  }
                  sx={{
                    py: 1.25,
                    textTransform: "none",
                    fontWeight: 900,
                  }}
                >
                  Renew Policy
                </Button>

                <Button
                  variant="outlined"
                  disabled={
                    actionLoading
                  }
                  onClick={() =>
                    void handleAction(
                      "Add Endorsement",
                    )
                  }
                  sx={{
                    py: 1.25,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Add Endorsement
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  disabled={
                    actionLoading ||
                    policy.status ===
                      "SUSPENDED" ||
                    policy.status ===
                      "CANCELLED"
                  }
                  onClick={() =>
                    void handleAction(
                      "Suspend Policy",
                    )
                  }
                  sx={{
                    py: 1.25,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Suspend Policy
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={
                    actionLoading ||
                    policy.status ===
                      "CANCELLED"
                  }
                  onClick={() =>
                    void handleAction(
                      "Cancel Policy",
                    )
                  }
                  sx={{
                    py: 1.25,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Cancel Policy
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Box
              sx={{
                p: 2.5,
                backgroundColor:
                  "background.default",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color:
                    "text.secondary",
                  lineHeight: 1.6,
                }}
              >
                Policy suspension and cancellation are connected
                to the live Policy API. Renewal and endorsement
                workflows require their dedicated lifecycle
                services before they can modify production data.
              </Typography>
            </Box>
          </Paper>
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
        MediVantage Solutions™ Policy Administration ·
        Designed & Developed by Dr. Samuel Israel
      </Typography>


      <Snackbar
        open={
          notificationOpen
        }
        autoHideDuration={
          3500
        }
        onClose={() =>
          setNotificationOpen(
            false,
          )
        }
        message={
          selectedAction ===
          "Add Endorsement"
            ? "Policy Endorsements workflow is not yet connected."
            : selectedAction ===
                "Renew Policy"
              ? "Policy Renewal workflow is not yet connected."
              : selectedAction
                ? `${selectedAction} completed.`
                : "Policy action completed."
        }
      />
    </Box>
  );
}