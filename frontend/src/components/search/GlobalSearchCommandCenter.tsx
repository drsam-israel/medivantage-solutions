import {
  AssignmentOutlined,
  CloseOutlined,
  DashboardOutlined,
  FactCheckOutlined,
  GavelOutlined,
  GroupsOutlined,
  HealthAndSafetyOutlined,
  KeyboardArrowRightOutlined,
  LocalHospitalOutlined,
  PaymentsOutlined,
  PsychologyOutlined,
  SearchOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";

import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { globalSearchItems } from "../../data/globalSearchIndex";

import type {
  GlobalSearchItem,
  GlobalSearchModule,
} from "../../types/globalSearch";

interface GlobalSearchCommandCenterProps {
  open: boolean;
  onClose: () => void;
}

const moduleOrder: GlobalSearchModule[] = [
  "Dashboard",
  "Claims",
  "Members",
  "Medical Underwriting",
  "Policy Administration",
  "Prior Authorization",
  "Provider Network",
  "Payments",
  "Fraud Investigation",
  "AI Insights",
];

function getModuleIcon(
  module: GlobalSearchModule,
): ReactNode {
  switch (module) {
    case "Dashboard":
      return <DashboardOutlined />;

    case "Claims":
      return <AssignmentOutlined />;

    case "Members":
      return <GroupsOutlined />;

    case "Medical Underwriting":
      return <HealthAndSafetyOutlined />;

    case "Policy Administration":
      return <FactCheckOutlined />;

    case "Prior Authorization":
      return <LocalHospitalOutlined />;

    case "Provider Network":
      return <StorefrontOutlined />;

    case "Payments":
      return <PaymentsOutlined />;

    case "Fraud Investigation":
      return <GavelOutlined />;

    case "AI Insights":
      return <PsychologyOutlined />;

    default:
      return <SearchOutlined />;
  }
}

function matchesSearch(
  item: GlobalSearchItem,
  query: string,
): boolean {
  const normalizedQuery = query
    .trim()
    .toLowerCase();

  if (!normalizedQuery) {
    return item.id.startsWith("MODULE-");
  }

  const searchableContent = [
    item.id,
    item.module,
    item.title,
    item.subtitle,
    item.description ?? "",
    item.status ?? "",
    ...item.keywords,
  ]
    .join(" ")
    .toLowerCase();

  return searchableContent.includes(
    normalizedQuery,
  );
}

export default function GlobalSearchCommandCenter({
  open,
  onClose,
}: GlobalSearchCommandCenterProps) {
  const navigate = useNavigate();

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filteredItems = useMemo(
    () =>
      globalSearchItems.filter((item) =>
        matchesSearch(item, query),
      ),
    [query],
  );

  const groupedResults = useMemo(
    () =>
      moduleOrder
        .map((module) => ({
          module,
          items: filteredItems
            .filter(
              (item) =>
                item.module === module,
            )
            .slice(0, 6),
        }))
        .filter(
          (group) =>
            group.items.length > 0,
        ),
    [filteredItems],
  );

  const handleOpenResult = (
    item: GlobalSearchItem,
  ) => {
    navigate(item.path);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            maxHeight: "82vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          color: "common.white",
          background:
            "linear-gradient(135deg, #123E67 0%, #1A5E96 58%, #167F8D 100%)",
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2.5,
              md: 3,
            },
            py: 2.5,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                letterSpacing: "0.1em",
                opacity: 0.8,
              }}
            >
              MEDIVANTAGE COMMAND CENTER
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.25,
                fontWeight: 900,
              }}
            >
              Enterprise Global Search
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                opacity: 0.82,
              }}
            >
              Search records and navigate
              across the complete insurance
              platform.
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            aria-label="Close global search"
            sx={{
              flexShrink: 0,
              color: "common.white",
              backgroundColor:
                "rgba(255,255,255,0.10)",

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.18)",
              },
            }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          backgroundColor: "#F8FAFC",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            p: {
              xs: 2,
              md: 2.5,
            },
            backgroundColor:
              "rgba(248,250,252,0.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            autoFocus
            fullWidth
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search members, claims, policies, providers, payments, fraud or AI insights..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label="ESC"
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 24,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  minHeight: 56,
                  borderRadius: 3,
                  backgroundColor:
                    "common.white",
                },
            }}
          />
        </Box>

        <Box
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          {groupedResults.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                py: 7,
                px: 3,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <SearchOutlined
                sx={{
                  fontSize: 50,
                  color: "text.disabled",
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  fontWeight: 900,
                }}
              >
                No matching records found
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >
                Try a record ID, member name,
                module, provider, policy or
                status.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 2,
              }}
            >
              {groupedResults.map(
                (group) => (
                  <Paper
                    key={group.module}
                    elevation={0}
                    sx={{
                      overflow: "hidden",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        px: 2.25,
                        py: 1.4,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor:
                          "rgba(18,62,103,0.045)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          color:
                            "primary.main",
                        }}
                      >
                        {getModuleIcon(
                          group.module,
                        )}
                      </Box>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        {group.module}
                      </Typography>

                      <Chip
                        label={
                          group.items.length
                        }
                        size="small"
                        sx={{
                          ml: "auto",
                          height: 23,
                          fontWeight: 800,
                        }}
                      />
                    </Box>

                    <Divider />

                    <List disablePadding>
                      {group.items.map(
                        (item) => (
                          <ListItemButton
                            key={item.id}
                            onClick={() =>
                              handleOpenResult(
                                item,
                              )
                            }
                            sx={{
                              px: 2.25,
                              py: 1.5,
                              alignItems:
                                "flex-start",

                              "&:not(:last-child)":
                                {
                                  borderBottom:
                                    "1px solid",
                                  borderColor:
                                    "divider",
                                },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 42,
                                mt: 0.25,
                                color:
                                  "primary.main",
                              }}
                            >
                              {getModuleIcon(
                                item.module,
                              )}
                            </ListItemIcon>

                            <ListItemText
                              sx={{
                                my: 0,
                                minWidth: 0,
                              }}
                              primary={
                                <Box
                                  sx={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    alignItems:
                                      "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight:
                                        900,
                                      overflowWrap:
                                        "anywhere",
                                    }}
                                  >
                                    {item.title}
                                  </Typography>

                                  {item.status && (
                                    <Chip
                                      label={
                                        item.status
                                      }
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        height: 22,
                                        fontSize:
                                          "0.68rem",
                                        fontWeight:
                                          800,
                                      }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box
                                  sx={{
                                    mt: 0.35,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        "text.secondary",
                                      fontWeight:
                                        700,
                                      overflowWrap:
                                        "anywhere",
                                    }}
                                  >
                                    {
                                      item.subtitle
                                    }
                                  </Typography>

                                  {item.description && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display:
                                          "block",
                                        mt: 0.2,
                                        color:
                                          "text.secondary",
                                        overflowWrap:
                                          "anywhere",
                                      }}
                                    >
                                      {
                                        item.description
                                      }
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />

                            <KeyboardArrowRightOutlined
                              sx={{
                                mt: 0.7,
                                ml: 1,
                                flexShrink: 0,
                                color:
                                  "text.disabled",
                              }}
                            />
                          </ListItemButton>
                        ),
                      )}
                    </List>
                  </Paper>
                ),
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}