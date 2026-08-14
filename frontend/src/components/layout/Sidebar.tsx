import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  AutoAwesomeOutlined,
  BadgeOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  HealthAndSafetyOutlined,
  LocalHospitalOutlined,
  SettingsOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import { NavLink } from "react-router-dom";

export const DRAWER_WIDTH = 280;
export const COLLAPSED_DRAWER_WIDTH = 88;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface DrawerContentProps {
  onClose: () => void;
  collapsed: boolean;
  mobile?: boolean;
  onToggleCollapse?: () => void;
}

const navigationItems = [
  {
    label: "Executive Dashboard",
    path: "/",
    icon: <DashboardOutlined />,
  },
  {
    label: "Claims Workspace",
    path: "/claims",
    icon: <DescriptionOutlined />,
  },
  {
    label: "Members 360",
    path: "/members",
    icon: <BadgeOutlined />,
  },
  {
    label: "Medical Underwriting",
    path: "/medical-underwriting",
    icon: <HealthAndSafetyOutlined />,
  },
  {
    label: "Policy Administration",
    path: "/policy-administration",
    icon: <FactCheckOutlined />,
  },
  {
    label: "Prior Authorization",
    path: "/prior-authorization",
    icon: <LocalHospitalOutlined />,
  },
  {
    label: "Provider Network",
    path: "/provider-network",
    icon: <ApartmentOutlined />,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: <AccountBalanceWalletOutlined />,
  },
  {
    label: "Fraud Investigation",
    path: "/fraud-investigations",
    icon: <ShieldOutlined />,
  },
  {
    label: "AI Insights",
    path: "/ai-insights",
    icon: <AutoAwesomeOutlined />,
  },
];

function DrawerContent({
  onClose,
  collapsed,
  mobile = false,
  onToggleCollapse,
}: DrawerContentProps) {
  const isCollapsed = collapsed && !mobile;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "visible",
        color: "common.white",
        background:
          "linear-gradient(180deg, #06355F 0%, #0B4F8A 58%, #087B83 100%)",
      }}
    >
      {!mobile && onToggleCollapse && (
        <Tooltip
          title={
            isCollapsed
              ? "Expand navigation"
              : "Collapse navigation"
          }
          placement="right"
          arrow
        >
          <IconButton
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            onClick={onToggleCollapse}
            sx={{
              position: "absolute",
              zIndex: 10,
              top: 92,
              right: -18,
              width: 36,
              height: 36,
              color: "#0B4F8A",
              border: "1px solid rgba(15,76,117,0.14)",
              backgroundColor: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(10px)",
              boxShadow:
                "0 8px 22px rgba(15,23,42,0.20)",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",

              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 10px 26px rgba(15,23,42,0.24)",
              },
            }}
          >
            {isCollapsed ? (
              <ChevronRightOutlined />
            ) : (
              <ChevronLeftOutlined />
            )}
          </IconButton>
        </Tooltip>
      )}

      <Box
        sx={{
          minHeight: 144,
          px: isCollapsed ? 1.25 : 2.5,
          py: 2.25,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed
            ? "center"
            : "flex-start",
          overflow: "hidden",
        }}
      >
        {isCollapsed ? (
          <Tooltip
            title="MediVantage Solutions™"
            placement="right"
            arrow
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                display: "grid",
                placeItems: "center",
                borderRadius: 2.5,
                color: "#0B4F8A",
                backgroundColor: "#FFFFFF",
                fontWeight: 900,
                fontSize: "1rem",
                letterSpacing: "0.04em",
                boxShadow:
                  "0 8px 20px rgba(15,23,42,0.16)",
              }}
            >
              MV
            </Box>
          </Tooltip>
        ) : (
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "common.white",
                fontWeight: 900,
                letterSpacing: "-0.025em",
                whiteSpace: "nowrap",
              }}
            >
              MediVantage
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "rgba(255,255,255,0.76)",
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              Solutions™
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.45,
                color: "rgba(255,255,255,0.58)",
                whiteSpace: "nowrap",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              Enterprise Insurance Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.14)",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          overflowY: "auto",
          px: isCollapsed ? 1 : 1.5,
          py: 2,
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 1.5,
              pb: 1,
              color: "rgba(255,255,255,0.58)",
              fontWeight: 800,
              letterSpacing: "0.09em",
              whiteSpace: "nowrap",
            }}
          >
            INSURANCE OPERATIONS
          </Typography>
        )}

        {isCollapsed && (
          <Tooltip
            title="Insurance Operations"
            placement="right"
            arrow
          >
            <Box
              sx={{
                width: 30,
                height: 4,
                mx: "auto",
                mb: 1.5,
                borderRadius: 99,
                backgroundColor:
                  "rgba(255,255,255,0.30)",
              }}
            />
          </Tooltip>
        )}

        <List disablePadding>
          {navigationItems.map((item) => {
            const navigationButton = (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                aria-label={item.label}
                sx={{
                  position: "relative",
                  minHeight: 50,
                  mb: 0.55,
                  px: isCollapsed ? 1.5 : 1.75,
                  justifyContent: isCollapsed
                    ? "center"
                    : "flex-start",
                  borderRadius: 2.25,
                  color: "rgba(255,255,255,0.80)",
                  transition:
                    "background-color 0.18s ease, color 0.18s ease, transform 0.18s ease",

                  "& .MuiListItemIcon-root": {
                    minWidth: isCollapsed ? 0 : 42,
                    justifyContent: "center",
                    color: "inherit",

                    "& svg": {
                      fontSize: 21,
                    },
                  },

                  "&.active": {
                    color: "common.white",
                    backgroundColor:
                      "rgba(255,255,255,0.16)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08)",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: "0 6px 6px 0",
                      backgroundColor: "#7DD3FC",
                    },

                    "& .MuiListItemIcon-root": {
                      backgroundColor:
                        "rgba(255,255,255,0.10)",
                      borderRadius: 1.75,
                    },
                  },

                  "&:hover": {
                    color: "common.white",
                    backgroundColor:
                      "rgba(255,255,255,0.11)",
                    transform: isCollapsed
                      ? "translateX(0)"
                      : "translateX(3px)",
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );

            if (!isCollapsed) {
              return navigationButton;
            }

            return (
              <Tooltip
                key={item.path}
                title={item.label}
                placement="right"
                arrow
              >
                {navigationButton}
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.14)",
        }}
      />

      <List
        sx={{
          px: isCollapsed ? 1 : 1.5,
          py: 1.25,
        }}
      >
        <Tooltip
          title={
            isCollapsed
              ? "Platform Settings"
              : ""
          }
          placement="right"
          arrow
        >
          <ListItemButton
            component={NavLink}
            to="/settings"
            onClick={onClose}
            aria-label="Platform Settings"
            sx={{
              position: "relative",
              minHeight: 48,
              px: isCollapsed ? 1.5 : 1.75,
              justifyContent: isCollapsed
                ? "center"
                : "flex-start",
              borderRadius: 2.25,
              color: "rgba(255,255,255,0.80)",
              transition:
                "background-color 0.18s ease, color 0.18s ease, transform 0.18s ease",

              "&.active": {
                color: "common.white",
                backgroundColor:
                  "rgba(255,255,255,0.16)",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 4,
                  borderRadius: "0 6px 6px 0",
                  backgroundColor: "#7DD3FC",
                },

                "& .MuiListItemIcon-root": {
                  backgroundColor:
                    "rgba(255,255,255,0.10)",
                  borderRadius: 1.75,
                },
              },

              "&:hover": {
                color: "common.white",
                backgroundColor:
                  "rgba(255,255,255,0.11)",
                transform: isCollapsed
                  ? "translateX(0)"
                  : "translateX(3px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: isCollapsed ? 0 : 42,
                justifyContent: "center",
                color: "inherit",

                "& svg": {
                  fontSize: 21,
                },
              }}
            >
              <SettingsOutlined />
            </ListItemIcon>

            {!isCollapsed && (
              <ListItemText
                primary="Platform Settings"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    },
                  },
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>

      {!isCollapsed ? (
        <Box
          sx={{
            px: 2.5,
            pb: 2.25,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2.25,
              border:
                "1px solid rgba(255,255,255,0.12)",
              backgroundColor:
                "rgba(255,255,255,0.07)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 900,
              }}
            >
              MediVantage™ Enterprise
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.15,
                color: "rgba(255,255,255,0.66)",
                fontWeight: 700,
              }}
            >
              Version 1.0.0 (MVP)
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.35,
              }}
            >
              Designed & Developed by
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "rgba(255,255,255,0.90)",
                fontWeight: 900,
              }}
            >
              Dr. Samuel Israel
            </Typography>
          </Box>
        </Box>
      ) : (
        <Tooltip
          title={
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900 }}
              >
                MediVantage™ Enterprise
              </Typography>

              <Typography
                variant="caption"
                sx={{ display: "block" }}
              >
                Version 1.0.0 (MVP)
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.75,
                }}
              >
                Designed & Developed by Dr. Samuel Israel
              </Typography>
            </Box>
          }
          placement="right"
          arrow
        >
          <Typography
            variant="caption"
            sx={{
              pb: 2,
              textAlign: "center",
              color: "rgba(255,255,255,0.72)",
              fontWeight: 900,
              letterSpacing: "0.04em",
            }}
          >
            1.0
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
}

export default function Sidebar({
  mobileOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const desktopWidth = collapsed
    ? COLLAPSED_DRAWER_WIDTH
    : DRAWER_WIDTH;

  return (
    <Box
      component="nav"
      aria-label="MediVantage navigation"
      sx={{
        width: {
          lg: desktopWidth,
        },
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing:
              theme.transitions.easing.sharp,
            duration:
              theme.transitions.duration.standard,
          }),
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: 0,
            overflow: "visible",
          },
        }}
      >
        <DrawerContent
          onClose={onClose}
          collapsed={false}
          mobile
        />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },

          "& .MuiDrawer-paper": {
            width: desktopWidth,
            overflow: "visible",
            border: 0,
            transition: (theme) =>
              theme.transitions.create(
                "width",
                {
                  easing:
                    theme.transitions.easing.sharp,
                  duration:
                    theme.transitions.duration.standard,
                },
              ),
          },
        }}
      >
        <DrawerContent
          onClose={onClose}
          collapsed={collapsed}
          onToggleCollapse={
            onToggleCollapse
          }
        />
      </Drawer>
    </Box>
  );
}