import {
  AdminPanelSettingsOutlined,
  AutoAwesomeOutlined,
  ExpandMoreOutlined,
  LogoutOutlined,
  MenuOutlined,
  NotificationsNoneOutlined,
  PersonOutlineOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  useState,
} from "react";

import type {
  MouseEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from "./Sidebar";

interface TopbarProps {
  onMenuClick: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  sidebarCollapsed: boolean;
}

function AiSearchBadge() {
  return (
    <Chip
      aria-hidden="true"
      icon={<AutoAwesomeOutlined />}
      label="AI Search"
      size="small"
      sx={{
        display: {
          xs: "none",
          md: "inline-flex",
        },
        height: 34,
        px: 0.35,
        borderRadius: 2.2,
        color: "#155D91",
        border:
          "1px solid rgba(21,93,145,0.18)",
        background:
          "linear-gradient(135deg, rgba(240,249,255,0.96) 0%, rgba(236,253,245,0.96) 100%)",
        boxShadow:
          "0 3px 10px rgba(15,76,117,0.08)",

        "& .MuiChip-icon": {
          ml: 0.6,
          color: "#155D91",
          fontSize: 18,
        },

        "& .MuiChip-label": {
          px: 1,
          fontSize: "0.76rem",
          fontWeight: 900,
          letterSpacing: "-0.01em",
        },
      }}
    />
  );
}

export default function Topbar({
  onMenuClick,
  onOpenSearch,
  onOpenNotifications,
  notificationCount,
  sidebarCollapsed,
}: TopbarProps) {
  const navigate = useNavigate();

  const [
    profileAnchorEl,
    setProfileAnchorEl,
  ] = useState<HTMLElement | null>(null);

  const profileMenuOpen =
    Boolean(profileAnchorEl);

  const desktopDrawerWidth =
    sidebarCollapsed
      ? COLLAPSED_DRAWER_WIDTH
      : DRAWER_WIDTH;

  const handleOpenProfileMenu = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setProfileAnchorEl(
      event.currentTarget,
    );
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleNavigate = (
    path: string,
  ) => {
    handleCloseProfileMenu();
    navigate(path);
  };

  const handleSignOut = () => {
    handleCloseProfileMenu();

    const confirmed =
      window.confirm(
        "Are you sure you want to sign out of MediVantage?",
      );

    if (!confirmed) {
      return;
    }

    try {
      window.localStorage.removeItem(
        "medivantage-notifications",
      );
    } catch {
      // Sign-out flow remains functional
      // when browser storage is unavailable.
    }

    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: {
            lg: `calc(100% - ${desktopDrawerWidth}px)`,
          },
          ml: {
            lg: `${desktopDrawerWidth}px`,
          },
          backgroundColor:
            "rgba(255,255,255,0.92)",
          backdropFilter:
            "blur(18px)",
          WebkitBackdropFilter:
            "blur(18px)",
          borderBottom: "1px solid",
          borderColor:
            "rgba(15, 76, 117, 0.10)",
          boxShadow:
            "0 4px 24px rgba(15, 23, 42, 0.035)",
          zIndex: (theme) =>
            theme.zIndex.drawer - 1,
          transition: (theme) =>
            theme.transitions.create(
              [
                "width",
                "margin-left",
              ],
              {
                easing:
                  theme.transitions
                    .easing.sharp,
                duration:
                  theme.transitions
                    .duration.standard,
              },
            ),
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 72,
              md: 82,
            },
            px: {
              xs: 2,
              md: 3,
              xl: 4,
            },
            gap: {
              xs: 1.5,
              md: 2,
            },
          }}
        >
          <IconButton
            edge="start"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            sx={{
              display: {
                lg: "none",
              },
              width: 42,
              height: 42,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor:
                "#FFFFFF",

              "&:hover": {
                backgroundColor:
                  "#F8FAFC",
              },
            }}
          >
            <MenuOutlined />
          </IconButton>

          <Tooltip
            title="Open AI-powered enterprise search"
            placement="bottom"
          >
            <Box
              onClick={onOpenSearch}
              sx={{
                width: {
                  xs: "100%",
                  sm: 430,
                  md: 560,
                  xl: 660,
                },
                maxWidth: "100%",
                cursor: "pointer",
              }}
            >
              <TextField
                value=""
                fullWidth
                placeholder="Search members, claims, policies, providers, payments..."
                onFocus={onOpenSearch}
                aria-label="Open AI-powered enterprise search"
                slotProps={{
                  input: {
                    readOnly: true,

                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            display:
                              "grid",
                            placeItems:
                              "center",
                            borderRadius: 2,
                            color:
                              "#155D91",
                            background:
                              "linear-gradient(135deg, rgba(21,93,145,0.11) 0%, rgba(22,127,141,0.11) 100%)",
                          }}
                        >
                          <SearchOutlined
                            sx={{
                              fontSize: 23,
                            }}
                          />
                        </Box>
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <AiSearchBadge />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  pointerEvents: "none",

                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: 56,
                      pr: 1.1,
                      borderRadius: 3.5,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,250,252,0.98) 100%)",
                      boxShadow:
                        "0 5px 18px rgba(15, 23, 42, 0.055)",
                      transition:
                        "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",

                      "& fieldset": {
                        borderWidth: 1,
                        borderColor:
                          "rgba(15, 76, 117, 0.17)",
                      },

                      "&:hover": {
                        transform:
                          "translateY(-1px)",
                        boxShadow:
                          "0 8px 26px rgba(15, 76, 117, 0.10)",

                        "& fieldset":
                          {
                            borderColor:
                              "rgba(21, 93, 145, 0.40)",
                          },
                      },
                    },

                  "& .MuiInputBase-input":
                    {
                      py: 1.55,
                      fontSize: {
                        xs: "0.93rem",
                        md: "1rem",
                      },
                      fontWeight: 600,
                      color:
                        "text.primary",

                      "&::placeholder":
                        {
                          color:
                            "#8290A3",
                          opacity: 1,
                          fontWeight: 500,
                        },
                    },

                  "& .MuiInputAdornment-root":
                    {
                      my: 0,
                    },
                }}
              />
            </Box>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 0.5,
                md: 1,
              },
            }}
          >
            <Tooltip title="Open Notification Center">
              <IconButton
                aria-label="Open Notification Center"
                onClick={
                  onOpenNotifications
                }
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  color: "#506174",
                  border: "1px solid",
                  borderColor:
                    "rgba(15, 76, 117, 0.10)",
                  backgroundColor:
                    "rgba(255,255,255,0.85)",

                  "&:hover": {
                    color:
                      "primary.main",
                    backgroundColor:
                      "rgba(21, 93, 145, 0.07)",
                  },
                }}
              >
                <Badge
                  badgeContent={
                    notificationCount
                  }
                  color="error"
                  overlap="circular"
                  invisible={
                    notificationCount === 0
                  }
                  sx={{
                    "& .MuiBadge-badge":
                      {
                        minWidth: 20,
                        height: 20,
                        px: 0.6,
                        border:
                          "2px solid white",
                        fontSize:
                          "0.66rem",
                        fontWeight: 900,
                      },
                  }}
                >
                  <NotificationsNoneOutlined />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box
              component="button"
              type="button"
              onClick={
                handleOpenProfileMenu
              }
              aria-label="Open profile menu"
              aria-controls={
                profileMenuOpen
                  ? "profile-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                profileMenuOpen
                  ? "true"
                  : undefined
              }
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                alignItems: "center",
                gap: 1.15,
                ml: {
                  sm: 0.5,
                  md: 1,
                },
                pl: {
                  sm: 1,
                  md: 1.5,
                },
                pr: 0.75,
                py: 0.5,
                border: 0,
                borderLeft: "1px solid",
                borderColor:
                  "rgba(15, 76, 117, 0.10)",
                background: "transparent",
                cursor: "pointer",
                borderRadius: 2.5,
                transition:
                  "background-color 0.18s ease, transform 0.18s ease",

                "&:hover": {
                  backgroundColor:
                    "rgba(21,93,145,0.06)",
                  transform:
                    "translateY(-1px)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  color: "common.white",
                  background:
                    "linear-gradient(135deg, #123E67 0%, #155D91 55%, #167F8D 100%)",
                  boxShadow:
                    "0 5px 14px rgba(15, 76, 117, 0.20)",
                  fontSize:
                    "0.85rem",
                  fontWeight: 900,
                  letterSpacing:
                    "0.03em",
                }}
              >
                SI
              </Avatar>

              <Box
                sx={{
                  display: {
                    sm: "none",
                    md: "block",
                  },
                  minWidth: 0,
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color:
                      "text.primary",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  Dr. Samuel Israel
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.2,
                    color:
                      "text.secondary",
                    fontWeight: 600,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  Product Administrator
                </Typography>
              </Box>

              <ExpandMoreOutlined
                sx={{
                  ml: 0.25,
                  fontSize: 20,
                  color:
                    "text.secondary",
                  transform:
                    profileMenuOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition:
                    "transform 0.18s ease",
                }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        open={profileMenuOpen}
        onClose={
          handleCloseProfileMenu
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              width: 290,
              overflow: "hidden",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 18px 46px rgba(15,23,42,0.16)",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.75,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
            }}
          >
            Dr. Samuel Israel
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.25,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Product Administrator
          </Typography>

          <Chip
            label="Enterprise Access"
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              mt: 1.25,
            }}
          />
        </Box>

        <Divider />

        <MenuItem
          onClick={() =>
            handleNavigate("/profile")
          }
        >
          <ListItemIcon>
            <PersonOutlineOutlined fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleNavigate(
              "/settings?section=preferences",
            )
          }
        >
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          Preferences
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleNavigate(
              "/settings?section=roles",
            )
          }
        >
          <ListItemIcon>
            <AdminPanelSettingsOutlined fontSize="small" />
          </ListItemIcon>
          Role & Permissions
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: "error.main",

            "& .MuiListItemIcon-root":
              {
                color: "error.main",
              },
          }}
        >
          <ListItemIcon>
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}