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
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import DescriptionIcon from "@mui/icons-material/Description";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InsightsIcon from "@mui/icons-material/Insights";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TimelineIcon from "@mui/icons-material/Timeline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import {
  getProvider,
} from "../services/providersApi";

import {
  getClaims,
} from "../services/claimsApi";

import {
  getPriorAuthorizations,
} from "../services/priorAuthorizationsApi";

import type {
  Provider,
} from "../types/provider";

import type {
  Claim,
} from "../types/claim";

import type {
  PriorAuthorization,
} from "../types/priorAuthorization";


interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}


interface DetailItemProps {
  label: string;
  value: ReactNode;
}


interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}


function humanize(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Not available";
  }

  return value
    .trim()
    .toLowerCase()
    .split(/[_\s-]+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}


function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}


function parseMoney(
  value: string | null | undefined,
): number {
  if (!value) {
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


function getNetworkColour(
  value: string,
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" {
  const normalized =
    value.trim().toLowerCase();

  if (
    normalized.includes(
      "preferred",
    ) ||
    normalized.includes(
      "network",
    ) ||
    normalized === "active"
  ) {
    return "success";
  }

  if (
    normalized.includes(
      "pending",
    )
  ) {
    return "warning";
  }

  if (
    normalized.includes(
      "suspend",
    ) ||
    normalized.includes(
      "out",
    )
  ) {
    return "error";
  }

  return "default";
}


function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 210px",
        minWidth: 210,
        p: 2.25,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems:
            "flex-start",
          justifyContent:
            "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
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
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              "rgba(21,101,192,0.10)",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}


function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 700,
          textTransform:
            "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.45,
          fontWeight: 700,
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}


function SectionHeader({
  icon,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems:
          "flex-start",
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            "rgba(21,101,192,0.10)",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}


export default function ProviderDetails() {
  const navigate =
    useNavigate();

  const { providerId } =
    useParams<{
      providerId: string;
    }>();

  const [
    provider,
    setProvider,
  ] = useState<
    Provider | null
  >(null);

  const [
    claims,
    setClaims,
  ] = useState<Claim[]>([]);

  const [
    authorizations,
    setAuthorizations,
  ] = useState<
    PriorAuthorization[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    let active = true;

    async function loadProvider360() {
      if (!providerId) {
        if (active) {
          setError(
            "No provider identifier was supplied.",
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const decodedId =
          decodeURIComponent(
            providerId,
          );

        const [
          providerData,
          claimsData,
          authorizationData,
        ] = await Promise.all([
          getProvider(decodedId),
          getClaims(),
          getPriorAuthorizations(),
        ]);

        if (!active) {
          return;
        }

        setProvider(
          providerData,
        );

        setClaims(
          claimsData.filter(
            (claim) =>
              claim.provider_id ===
              providerData.id,
          ),
        );

        setAuthorizations(
          authorizationData.filter(
            (authorization) =>
              authorization.provider_id ===
              providerData.id,
          ),
        );
      } catch (loadError) {
        console.error(
          "Unable to load Provider 360.",
          loadError,
        );

        if (active) {
          setError(
            "The requested live provider record could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProvider360();

    return () => {
      active = false;
    };
  }, [providerId]);


  const claimsMetrics =
    useMemo(() => {
      const totalBilled =
        claims.reduce(
          (
            total,
            claim,
          ) =>
            total +
            parseMoney(
              claim.billed_amount,
            ),
          0,
        );

      const totalAllowed =
        claims.reduce(
          (
            total,
            claim,
          ) =>
            total +
            parseMoney(
              claim.allowed_amount,
            ),
          0,
        );

      const approved =
        claims.filter(
          (claim) =>
            claim.claim_status ===
              "APPROVED" ||
            claim.claim_status ===
              "PARTIALLY_APPROVED",
        ).length;

      const denied =
        claims.filter(
          (claim) =>
            claim.claim_status ===
            "DENIED",
        ).length;

      const open =
        claims.filter(
          (claim) =>
            claim.claim_status ===
              "SUBMITTED" ||
            claim.claim_status ===
              "UNDER_REVIEW",
        ).length;

      return {
        total: claims.length,
        totalBilled,
        totalAllowed,
        approved,
        denied,
        open,
      };
    }, [claims]);


  const authorizationMetrics =
    useMemo(() => {
      const approved =
        authorizations.filter(
          (item) =>
            item.status ===
            "APPROVED",
        ).length;

      const denied =
        authorizations.filter(
          (item) =>
            item.status ===
            "DENIED",
        ).length;

      const pending =
        authorizations.filter(
          (item) =>
            item.status ===
              "PENDING_REVIEW" ||
            item.status ===
              "MORE_INFORMATION_REQUIRED" ||
            item.status ===
              "ESCALATED",
        ).length;

      return {
        total:
          authorizations.length,
        approved,
        denied,
        pending,
      };
    }, [authorizations]);


  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
          }}
        >
          Loading live Provider 360...
        </Typography>
      </Box>
    );
  }


  if (
    error ||
    !provider
  ) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert
          severity="error"
          sx={{
            maxWidth: 760,
            mx: "auto",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
            }}
          >
            Provider unavailable
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
            }}
          >
            {error ??
              "The requested provider record could not be located."}
          </Typography>

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              navigate(
                "/provider-network",
              )
            }
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform:
                "none",
            }}
          >
            Return to Provider Network
          </Button>
        </Alert>
      </Box>
    );
  }


  const networkStatus =
    humanize(
      provider.network_status,
    );

  const recordStatus =
    provider.is_active
      ? "Active"
      : "Inactive";


  return (
    <Box
      sx={{
        width: "100%",
        pb: 4,
      }}
    >
      <Button
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          navigate(
            "/provider-network",
          )
        }
        sx={{
          mb: 2,
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to Provider Network
      </Button>


      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2.5,
            md: 4,
          },
          borderRadius: 4,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0b3d66 0%, #145b8f 55%, #1781a6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position:
              "absolute",
            top: -150,
            right: -100,
            width: 330,
            height: 330,
            borderRadius:
              "50%",
            backgroundColor:
              "rgba(255,255,255,0.07)",
          }}
        />

        <Box
          sx={{
            position:
              "relative",
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
                letterSpacing: 1.5,
              }}
            >
              PROVIDER 360
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 0.5,
                fontWeight: 900,
              }}
            >
              {
                provider.provider_name
              }
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              {
                provider.provider_code
              }{" "}
              ·{" "}
              {humanize(
                provider.provider_type,
              )}{" "}
              ·{" "}
              {provider.specialty ??
                "Specialty not recorded"}
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
                  recordStatus
                }
                color={
                  provider.is_active
                    ? "success"
                    : "default"
                }
                sx={{
                  fontWeight: 900,
                }}
              />

              <Chip
                label={
                  networkStatus
                }
                color={getNetworkColour(
                  provider.network_status,
                )}
                sx={{
                  fontWeight: 900,
                }}
              />

              <Chip
                label={
                  provider.license_number
                    ? "Licence on File"
                    : "Licence Not Recorded"
                }
                color={
                  provider.license_number
                    ? "success"
                    : "warning"
                }
                variant="outlined"
                sx={{
                  fontWeight: 900,
                  color:
                    "common.white",
                  borderColor:
                    "rgba(255,255,255,0.55)",
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
              borderRadius: 3,
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
              Provider Intelligence
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
                mt: 1,
                lineHeight: 1.65,
                opacity: 0.85,
              }}
            >
              Live AI provider-risk scoring is not
              yet connected to this provider record.
            </Typography>
          </Box>
        </Box>
      </Paper>


      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
        }}
      >
        <SummaryCard
          title="Claims"
          value={
            claimsMetrics.total
          }
          subtitle="Live submitted claims"
          icon={
            <MedicalServicesIcon />
          }
        />

        <SummaryCard
          title="Billed Value"
          value={formatCurrency(
            claimsMetrics.totalBilled,
          )}
          subtitle="Live claim charges"
          icon={
            <DescriptionIcon />
          }
        />

        <SummaryCard
          title="Allowed Value"
          value={formatCurrency(
            claimsMetrics.totalAllowed,
          )}
          subtitle="Live allowed amounts"
          icon={
            <HealthAndSafetyIcon />
          }
        />

        <SummaryCard
          title="Prior Authorizations"
          value={
            authorizationMetrics.total
          }
          subtitle="Live authorization requests"
          icon={
            <PendingActionsIcon />
          }
        />
      </Box>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg:
              "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
          mt: 3,
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
          <SectionHeader
            icon={
              <BusinessIcon />
            }
            title="Provider Profile"
            subtitle="Live registration and network information."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            <DetailItem
              label="Provider Code"
              value={
                provider.provider_code
              }
            />

            <DetailItem
              label="Provider Type"
              value={humanize(
                provider.provider_type,
              )}
            />

            <DetailItem
              label="Primary Specialty"
              value={
                provider.specialty ??
                "Not recorded"
              }
            />

            <DetailItem
              label="Licence Number"
              value={
                provider.license_number ??
                "Not recorded"
              }
            />

            <DetailItem
              label="Network Status"
              value={
                networkStatus
              }
            />

            <DetailItem
              label="Record Status"
              value={
                recordStatus
              }
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
          <SectionHeader
            icon={
              <ContactPhoneIcon />
            }
            title="Contact Information"
            subtitle="Live provider communication and location data."
          />

          <Box
            sx={{
              display: "grid",
              gap: 2.5,
            }}
          >
            <DetailItem
              label="Phone"
              value={
                provider.phone ??
                "Not recorded"
              }
            />

            <DetailItem
              label="Email"
              value={
                provider.email ??
                "Not recorded"
              }
            />

            <DetailItem
              label="City"
              value={
                provider.city ??
                "Not recorded"
              }
            />

            <DetailItem
              label="Region"
              value={
                provider.region ??
                "Not recorded"
              }
            />

            <DetailItem
              label="Country"
              value={
                provider.country
              }
            />
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
        <SectionHeader
          icon={
            <BadgeOutlinedIcon />
          }
          title="Credentialing"
          subtitle="Licence and credential verification."
        />

        {provider.license_number ? (
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(3, minmax(0, 1fr))",
                },
                gap: 3,
              }}
            >
              <DetailItem
                label="Credential"
                value="Provider Licence"
              />

              <DetailItem
                label="Licence Number"
                value={
                  provider.license_number
                }
              />

              <DetailItem
                label="Record Status"
                value="On File"
              />
            </Box>

            <Alert
              severity="info"
              sx={{
                mt: 2,
              }}
            >
              Issuing authority, verification date,
              expiry date and credential history will
              be populated by the dedicated
              Credentialing service.
            </Alert>
          </Box>
        ) : (
          <Alert severity="warning">
            No licence number is currently recorded
            for this provider.
          </Alert>
        )}
      </Paper>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg:
              "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
          mt: 3,
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
          <SectionHeader
            icon={
              <DescriptionIcon />
            }
            title="Claims Summary"
            subtitle="Live claims associated with this provider."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            <DetailItem
              label="Total Claims"
              value={
                claimsMetrics.total
              }
            />

            <DetailItem
              label="Approved"
              value={
                claimsMetrics.approved
              }
            />

            <DetailItem
              label="Denied"
              value={
                claimsMetrics.denied
              }
            />

            <DetailItem
              label="Open"
              value={
                claimsMetrics.open
              }
            />

            <DetailItem
              label="Total Billed"
              value={formatCurrency(
                claimsMetrics.totalBilled,
              )}
            />

            <DetailItem
              label="Allowed Amount"
              value={formatCurrency(
                claimsMetrics.totalAllowed,
              )}
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
          <SectionHeader
            icon={
              <PendingActionsIcon />
            }
            title="Prior Authorization Summary"
            subtitle="Live authorization activity associated with this provider."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            <DetailItem
              label="Requests"
              value={
                authorizationMetrics.total
              }
            />

            <DetailItem
              label="Approved"
              value={
                authorizationMetrics.approved
              }
            />

            <DetailItem
              label="Denied"
              value={
                authorizationMetrics.denied
              }
            />

            <DetailItem
              label="Pending / Review"
              value={
                authorizationMetrics.pending
              }
            />
          </Box>
        </Paper>
      </Box>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg:
              "repeat(3, minmax(0, 1fr))",
          },
          gap: 3,
          mt: 3,
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
          <SectionHeader
            icon={
              <LocationOnIcon />
            }
            title="Facilities"
          />

          <Alert severity="info">
            Facility-level provider locations are not
            yet represented by the live Provider
            backend.
          </Alert>
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
          <SectionHeader
            icon={
              <VerifiedUserIcon />
            }
            title="Contracts"
          />

          <Alert severity="info">
            Provider participation contracts and
            reimbursement agreements are not yet
            connected.
          </Alert>
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
          <SectionHeader
            icon={
              <InsightsIcon />
            }
            title="AI Provider Intelligence"
          />

          <Chip
            label="Not Scored"
            variant="outlined"
            sx={{
              fontWeight: 900,
            }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1.5,
              lineHeight: 1.7,
            }}
          >
            No live fraud-risk, quality-risk or
            network-risk model output has been
            generated for this provider yet.
          </Typography>
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
        <SectionHeader
          icon={
            <TimelineIcon />
          }
          title="Provider Timeline"
          subtitle="Auditable lifecycle information currently available from the live provider record."
        />

        <Box
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor:
                "rgba(15,76,117,0.035)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 900,
              }}
            >
              Provider Record Created
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {formatDate(
                provider.created_at,
              )}{" "}
              · Provider Administration
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
              }}
            >
              Provider was added to the MediVantage
              provider registry.
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor:
                "rgba(15,76,117,0.035)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 900,
              }}
            >
              Provider Record Updated
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {formatDate(
                provider.updated_at,
              )}{" "}
              · Provider Administration
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
              }}
            >
              Latest update to the provider master
              record.
            </Typography>
          </Box>
        </Box>
      </Paper>


      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
        }}
      >
        MediVantage Provider 360 · Designed &
        Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}