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
  FormControl,
  InputAdornment,
  InputLabel,
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
  Typography,
} from "@mui/material";

import type {
  SelectChangeEvent,
} from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import GroupsIcon from "@mui/icons-material/Groups";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScienceIcon from "@mui/icons-material/Science";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VisibilityIcon from "@mui/icons-material/Visibility";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

import {
  getProviders,
} from "../services/providersApi";

import type {
  Provider,
} from "../types/provider";


interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  tone:
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral";
}


const toneStyles = {
  primary: {
    background: "rgba(21,101,192,0.10)",
    iconBackground: "rgba(21,101,192,0.16)",
    iconColour: "#1565C0",
  },

  success: {
    background: "rgba(46,125,50,0.10)",
    iconBackground: "rgba(46,125,50,0.16)",
    iconColour: "#2E7D32",
  },

  warning: {
    background: "rgba(237,108,2,0.10)",
    iconBackground: "rgba(237,108,2,0.16)",
    iconColour: "#ED6C02",
  },

  error: {
    background: "rgba(211,47,47,0.10)",
    iconBackground: "rgba(211,47,47,0.16)",
    iconColour: "#D32F2F",
  },

  info: {
    background: "rgba(2,136,209,0.10)",
    iconBackground: "rgba(2,136,209,0.16)",
    iconColour: "#0288D1",
  },

  neutral: {
    background: "rgba(69,90,100,0.10)",
    iconBackground: "rgba(69,90,100,0.16)",
    iconColour: "#455A64",
  },
};


function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: MetricCardProps) {
  const style = toneStyles[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 220px",
        minWidth: 220,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: style.background,
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
            variant="h4"
            sx={{
              mt: 0.7,
              color: "text.primary",
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
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2.5,
            color: style.iconColour,
            background: style.iconBackground,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
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


function getNetworkStatusColour(
  value: string,
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" {
  const normalized = value
    .trim()
    .toLowerCase();

  if (
    normalized === "in_network" ||
    normalized === "in network" ||
    normalized === "active"
  ) {
    return "success";
  }

  if (
    normalized === "pending" ||
    normalized === "pending_network"
  ) {
    return "warning";
  }

  if (
    normalized === "out_of_network" ||
    normalized === "out of network" ||
    normalized === "suspended"
  ) {
    return "error";
  }

  return "default";
}


function providerTypeMatches(
  provider: Provider,
  term: string,
): boolean {
  return provider.provider_type
    .trim()
    .toLowerCase()
    .includes(
      term.toLowerCase(),
    );
}


export default function ProviderNetworkDashboard() {
  const navigate = useNavigate();

  const [
    providers,
    setProviders,
  ] = useState<Provider[]>([]);

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
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    providerType,
    setProviderType,
  ] = useState("All");

  const [
    networkStatus,
    setNetworkStatus,
  ] = useState("All");

  const [
    recordStatus,
    setRecordStatus,
  ] = useState("All");

  const [
    licenceStatus,
    setLicenceStatus,
  ] = useState("All");

  const [
    regionFilter,
    setRegionFilter,
  ] = useState("All");


  useEffect(() => {
    let active = true;

    async function loadProviders() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getProviders();

        if (!active) {
          return;
        }

        setProviders(data);
      } catch (loadError) {
        console.error(
          "Unable to load live Provider Network.",
          loadError,
        );

        if (active) {
          setError(
            "Unable to load the live Provider Network. Confirm that the MediVantage backend is running and try again.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProviders();

    return () => {
      active = false;
    };
  }, []);


  const providerTypes =
    useMemo(() => {
      return [
        "All",
        ...Array.from(
          new Set(
            providers
              .map(
                (provider) =>
                  humanize(
                    provider.provider_type,
                  ),
              )
              .filter(Boolean),
          ),
        ).sort(),
      ];
    }, [providers]);


  const networkStatuses =
    useMemo(() => {
      return [
        "All",
        ...Array.from(
          new Set(
            providers
              .map(
                (provider) =>
                  humanize(
                    provider.network_status,
                  ),
              )
              .filter(Boolean),
          ),
        ).sort(),
      ];
    }, [providers]);


  const regions =
    useMemo(() => {
      return [
        "All",
        ...Array.from(
          new Set(
            providers
              .map(
                (provider) =>
                  provider.region?.trim(),
              )
              .filter(
                (
                  region,
                ): region is string =>
                  Boolean(region),
              ),
          ),
        ).sort(),
      ];
    }, [providers]);


  const dashboardMetrics =
    useMemo(() => {
      const activeProviders =
        providers.filter(
          (provider) =>
            provider.is_active,
        ).length;

      const hospitals =
        providers.filter(
          (provider) =>
            providerTypeMatches(
              provider,
              "hospital",
            ),
        ).length;

      const clinics =
        providers.filter(
          (provider) =>
            providerTypeMatches(
              provider,
              "clinic",
            ),
        ).length;

      const laboratories =
        providers.filter(
          (provider) =>
            providerTypeMatches(
              provider,
              "laboratory",
            ) ||
            providerTypeMatches(
              provider,
              "lab",
            ),
        ).length;

      const pharmacies =
        providers.filter(
          (provider) =>
            providerTypeMatches(
              provider,
              "pharmacy",
            ),
        ).length;

      const licensedProviders =
        providers.filter(
          (provider) =>
            Boolean(
              provider.license_number
                ?.trim(),
            ),
        ).length;

      const missingLicence =
        providers.length -
        licensedProviders;

      const inNetworkProviders =
        providers.filter(
          (provider) => {
            const value =
              provider.network_status
                .trim()
                .toLowerCase();

            return (
              value === "in_network" ||
              value === "in network" ||
              value === "active"
            );
          },
        ).length;

      const cities = new Set(
        providers
          .map(
            (provider) =>
              provider.city?.trim(),
          )
          .filter(Boolean),
      ).size;

      const regionsCovered =
        new Set(
          providers
            .map(
              (provider) =>
                provider.region?.trim(),
            )
            .filter(Boolean),
        ).size;

      return {
        totalProviders:
          providers.length,

        activeProviders,

        hospitals,

        clinics,

        laboratories,

        pharmacies,

        licensedProviders,

        missingLicence,

        inNetworkProviders,

        cities,

        regionsCovered,
      };
    }, [providers]);


  const filteredProviders =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return providers.filter(
        (provider) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            provider.provider_code
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            provider.provider_name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (
              provider.specialty ??
              ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (
              provider.city ??
              ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (
              provider.region ??
              ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (
              provider.license_number ??
              ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesType =
            providerType ===
              "All" ||
            humanize(
              provider.provider_type,
            ) ===
              providerType;

          const matchesNetwork =
            networkStatus ===
              "All" ||
            humanize(
              provider.network_status,
            ) ===
              networkStatus;

          const matchesRecordStatus =
            recordStatus ===
              "All" ||
            (
              recordStatus ===
                "Active" &&
              provider.is_active
            ) ||
            (
              recordStatus ===
                "Inactive" &&
              !provider.is_active
            );

          const hasLicence =
            Boolean(
              provider.license_number
                ?.trim(),
            );

          const matchesLicence =
            licenceStatus ===
              "All" ||
            (
              licenceStatus ===
                "On File" &&
              hasLicence
            ) ||
            (
              licenceStatus ===
                "Not Recorded" &&
              !hasLicence
            );

          const matchesRegion =
            regionFilter ===
              "All" ||
            provider.region ===
              regionFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesNetwork &&
            matchesRecordStatus &&
            matchesLicence &&
            matchesRegion
          );
        },
      );
    }, [
      providers,
      searchTerm,
      providerType,
      networkStatus,
      recordStatus,
      licenceStatus,
      regionFilter,
    ]);


  const clearFilters = () => {
    setSearchTerm("");
    setProviderType("All");
    setNetworkStatus("All");
    setRecordStatus("All");
    setLicenceStatus("All");
    setRegionFilter("All");
  };


  const handleProviderTypeChange = (
    event: SelectChangeEvent,
  ) => {
    setProviderType(
      event.target.value,
    );
  };


  const handleNetworkStatusChange = (
    event: SelectChangeEvent,
  ) => {
    setNetworkStatus(
      event.target.value,
    );
  };


  const handleRecordStatusChange = (
    event: SelectChangeEvent,
  ) => {
    setRecordStatus(
      event.target.value,
    );
  };


  const handleLicenceStatusChange = (
    event: SelectChangeEvent,
  ) => {
    setLicenceStatus(
      event.target.value,
    );
  };


  const handleRegionChange = (
    event: SelectChangeEvent,
  ) => {
    setRegionFilter(
      event.target.value,
    );
  };


  const handleViewProvider = (
    providerId: string,
  ) => {
    navigate(
      `/provider-network/${encodeURIComponent(
        providerId,
      )}`,
    );
  };


  return (
    <Box
      sx={{
        width: "100%",
        pb: 4,
      }}
    >
      <WorkspaceHeader
        eyebrow="PROVIDER NETWORK OPERATIONS"
        title="Provider Network Management"
        description="Manage the live provider registry, network participation, provider specialties, licensing records and geographic network presence from one enterprise workspace."
        icon={
          <HealthAndSafetyIcon />
        }
        context="MediVantage Provider Operations"
        updatedText="Live operational data"
        statusLabel="Live Provider Network"
        statusTone="success"
        stats={[
          {
            label:
              "Active Providers",
            value:
              dashboardMetrics
                .activeProviders,
            icon:
              <VerifiedUserIcon />,
            tone: "success",
          },

          {
            label:
              "In-Network",
            value:
              dashboardMetrics
                .inNetworkProviders,
            icon:
              <HealthAndSafetyIcon />,
            tone: "primary",
          },

          {
            label:
              "Licence on File",
            value:
              dashboardMetrics
                .licensedProviders,
            icon:
              <BadgeOutlinedIcon />,
            tone: "success",
          },

          {
            label:
              "Regions Covered",
            value:
              dashboardMetrics
                .regionsCovered,
            icon:
              <LocationCityOutlinedIcon />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "Add Provider",
            icon:
              <AddBusinessIcon />,
            onClick: () => {
              console.log(
                "Add provider workflow not yet connected.",
              );
            },
            prominent: true,
          },

          {
            label:
              "Provider Analytics",
            icon:
              <AnalyticsIcon />,
            onClick: () => {
              console.log(
                "Provider analytics workspace not yet connected.",
              );
            },
            variant: "outlined",
          },
        ]}
      />


      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: 3,
          }}
        >
          {error}
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
          title="Total Providers"
          value={
            dashboardMetrics
              .totalProviders
          }
          subtitle="Live provider registry"
          icon={<GroupsIcon />}
          tone="primary"
        />

        <MetricCard
          title="Active Providers"
          value={
            dashboardMetrics
              .activeProviders
          }
          subtitle="Active provider records"
          icon={
            <VerifiedUserIcon />
          }
          tone="success"
        />

        <MetricCard
          title="Hospitals"
          value={
            dashboardMetrics
              .hospitals
          }
          subtitle="Hospital providers"
          icon={
            <LocalHospitalIcon />
          }
          tone="info"
        />

        <MetricCard
          title="Clinics"
          value={
            dashboardMetrics
              .clinics
          }
          subtitle="Clinic providers"
          icon={
            <MedicalServicesIcon />
          }
          tone="primary"
        />

        <MetricCard
          title="Laboratories"
          value={
            dashboardMetrics
              .laboratories
          }
          subtitle="Laboratory providers"
          icon={<ScienceIcon />}
          tone="neutral"
        />

        <MetricCard
          title="Pharmacies"
          value={
            dashboardMetrics
              .pharmacies
          }
          subtitle="Pharmacy providers"
          icon={
            <LocalPharmacyIcon />
          }
          tone="info"
        />

        <MetricCard
          title="In-Network"
          value={
            dashboardMetrics
              .inNetworkProviders
          }
          subtitle="Participating providers"
          icon={
            <HealthAndSafetyIcon />
          }
          tone="success"
        />

        <MetricCard
          title="Licence on File"
          value={
            dashboardMetrics
              .licensedProviders
          }
          subtitle="Licence number recorded"
          icon={
            <BadgeOutlinedIcon />
          }
          tone="success"
        />

        <MetricCard
          title="Licence Not Recorded"
          value={
            dashboardMetrics
              .missingLicence
          }
          subtitle="Requires licence data"
          icon={
            <BadgeOutlinedIcon />
          }
          tone={
            dashboardMetrics
              .missingLicence > 0
              ? "warning"
              : "success"
          }
        />

        <MetricCard
          title="Cities"
          value={
            dashboardMetrics.cities
          }
          subtitle="Cities represented"
          icon={
            <BusinessOutlinedIcon />
          }
          tone="neutral"
        />

        <MetricCard
          title="Regions"
          value={
            dashboardMetrics
              .regionsCovered
          }
          subtitle="Regional network footprint"
          icon={
            <LocationCityOutlinedIcon />
          }
          tone="primary"
        />
      </Box>


      <Alert
        severity="info"
        sx={{
          mt: 3,
          borderRadius: 3,
        }}
      >
        Credentialing verification, contracts,
        quality scoring, network adequacy,
        claims analytics and AI Provider
        Intelligence will be added as dedicated
        live services. Demonstration metrics are
        intentionally excluded from this live
        registry.
      </Alert>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
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
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
              }}
            >
              Provider Registry Filters
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color:
                  "text.secondary",
              }}
            >
              Search and segment the
              live provider network.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              <FilterAltOffIcon />
            }
            onClick={
              clearFilters
            }
            sx={{
              borderRadius: 2.5,
              fontWeight: 800,
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Clear Filters
          </Button>
        </Box>


        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Search provider, code, specialty, licence or city"
            size="small"
            sx={{
              flex: "2 1 300px",
              minWidth: 260,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />


          <FormControl
            size="small"
            sx={{
              flex: "1 1 180px",
              minWidth: 170,
            }}
          >
            <InputLabel>
              Provider Type
            </InputLabel>

            <Select
              value={providerType}
              label="Provider Type"
              onChange={
                handleProviderTypeChange
              }
            >
              {providerTypes.map(
                (type) => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>


          <FormControl
            size="small"
            sx={{
              flex: "1 1 180px",
              minWidth: 170,
            }}
          >
            <InputLabel>
              Network Status
            </InputLabel>

            <Select
              value={networkStatus}
              label="Network Status"
              onChange={
                handleNetworkStatusChange
              }
            >
              {networkStatuses.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>


          <FormControl
            size="small"
            sx={{
              flex: "1 1 150px",
              minWidth: 150,
            }}
          >
            <InputLabel>
              Record Status
            </InputLabel>

            <Select
              value={recordStatus}
              label="Record Status"
              onChange={
                handleRecordStatusChange
              }
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>


          <FormControl
            size="small"
            sx={{
              flex: "1 1 170px",
              minWidth: 160,
            }}
          >
            <InputLabel>
              Licence
            </InputLabel>

            <Select
              value={licenceStatus}
              label="Licence"
              onChange={
                handleLicenceStatusChange
              }
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="On File">
                On File
              </MenuItem>

              <MenuItem value="Not Recorded">
                Not Recorded
              </MenuItem>
            </Select>
          </FormControl>


          <FormControl
            size="small"
            sx={{
              flex: "1 1 170px",
              minWidth: 160,
            }}
          >
            <InputLabel>
              Region
            </InputLabel>

            <Select
              value={regionFilter}
              label="Region"
              onChange={
                handleRegionChange
              }
            >
              {regions.map(
                (region) => (
                  <MenuItem
                    key={region}
                    value={region}
                  >
                    {region}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
      </Paper>


      <Paper
        elevation={0}
        sx={{
          mt: 3,
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 900,
            }}
          >
            Provider Results
          </Typography>

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
                color="text.secondary"
              >
                Loading live network...
              </Typography>
            </Box>
          ) : (
            <Chip
              label={`${filteredProviders.length} provider${
                filteredProviders.length ===
                1
                  ? ""
                  : "s"
              }`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 800,
              }}
            />
          )}
        </Box>


        <TableContainer>
          <Table
            sx={{
              minWidth: 1180,
            }}
            aria-label="Provider network registry"
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "rgba(15,76,117,0.05)",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Provider
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Type
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Primary Specialty
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Network Status
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Licence
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Location
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Contact
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 900,
                  }}
                >
                  Record Status
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
                filteredProviders.map(
                  (provider) => (
                    <TableRow
                      key={provider.id}
                      hover
                      sx={{
                        "&:last-child td":
                          {
                            borderBottom:
                              0,
                          },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        >
                          {
                            provider.provider_name
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              "text.secondary",
                          }}
                        >
                          {
                            provider.provider_code
                          }
                        </Typography>
                      </TableCell>


                      <TableCell>
                        {humanize(
                          provider.provider_type,
                        )}
                      </TableCell>


                      <TableCell>
                        {provider.specialty ??
                          "Not recorded"}
                      </TableCell>


                      <TableCell>
                        <Chip
                          label={humanize(
                            provider.network_status,
                          )}
                          size="small"
                          color={getNetworkStatusColour(
                            provider.network_status,
                          )}
                          variant="outlined"
                          sx={{
                            fontWeight:
                              800,
                          }}
                        />
                      </TableCell>


                      <TableCell>
                        {provider.license_number ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight:
                                  800,
                              }}
                            >
                              {
                                provider.license_number
                              }
                            </Typography>

                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{
                                fontWeight:
                                  700,
                              }}
                            >
                              On file
                            </Typography>
                          </Box>
                        ) : (
                          <Chip
                            label="Not Recorded"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </TableCell>


                      <TableCell>
                        <Typography
                          variant="body2"
                        >
                          {[
                            provider.city,
                            provider.region,
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(
                              ", ",
                            ) ||
                            "Not recorded"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            provider.country
                          }
                        </Typography>
                      </TableCell>


                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {provider.phone ??
                            "Phone not recorded"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display:
                              "block",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {provider.email ??
                            "Email not recorded"}
                        </Typography>
                      </TableCell>


                      <TableCell>
                        <Chip
                          label={
                            provider.is_active
                              ? "Active"
                              : "Inactive"
                          }
                          size="small"
                          color={
                            provider.is_active
                              ? "success"
                              : "default"
                          }
                          sx={{
                            fontWeight:
                              800,
                          }}
                        />
                      </TableCell>


                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            <VisibilityIcon />
                          }
                          onClick={() =>
                            handleViewProvider(
                              provider.id,
                            )
                          }
                          sx={{
                            borderRadius:
                              2,
                            fontWeight:
                              800,
                            whiteSpace:
                              "nowrap",
                            textTransform:
                              "none",
                          }}
                        >
                          View 360
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}


              {!loading &&
                filteredProviders.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      sx={{
                        py: 7,
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
                        No providers found
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.7,
                          color:
                            "text.secondary",
                        }}
                      >
                        Adjust your
                        search criteria
                        or clear the
                        active filters.
                      </Typography>

                      <Button
                        variant="outlined"
                        startIcon={
                          <FilterAltOffIcon />
                        }
                        onClick={
                          clearFilters
                        }
                        sx={{
                          mt: 2,
                          borderRadius:
                            2,
                          fontWeight:
                            800,
                          textTransform:
                            "none",
                        }}
                      >
                        Clear Filters
                      </Button>
                    </TableCell>
                  </TableRow>
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
        MediVantage Provider Network Management ·
        Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}