import type { ReactNode } from "react";

import {
  CheckCircleOutlined,
  CircleNotificationsOutlined,
  CloseOutlined,
  DoneAllOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
  OpenInNewOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type {
  EnterpriseNotification,
  NotificationSeverity,
} from "../../data/notificationDemoData";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  notifications: EnterpriseNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

interface SeverityStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: ReactNode;
  label: string;
}

const severityStyles: Record<
  NotificationSeverity,
  SeverityStyle
> = {
  info: {
    color: "#0369A1",
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    icon: <InfoOutlined />,
    label: "Information",
  },

  success: {
    color: "#047857",
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    icon: <CheckCircleOutlined />,
    label: "Completed",
  },

  warning: {
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    icon: <WarningAmberOutlined />,
    label: "Attention",
  },

  critical: {
    color: "#B91C1C",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    icon: <ErrorOutlineOutlined />,
    label: "Critical",
  },
};

function formatRelativeTime(
  timestamp: string,
): string {
  const date = new Date(timestamp);
  const now = new Date();

  const differenceInMinutes = Math.max(
    0,
    Math.floor(
      (now.getTime() - date.getTime()) /
        60_000,
    ),
  );

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60,
  );

  if (differenceInHours < 24) {
    return `${differenceInHours} hr ago`;
  }

  const differenceInDays = Math.floor(
    differenceInHours / 24,
  );

  return `${differenceInDays} day${
    differenceInDays === 1 ? "" : "s"
  } ago`;
}

export default function NotificationCenter({
  open,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const navigate = useNavigate();

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.read,
      ).length,
    [notifications],
  );

  const handleOpenNotification = (
    notification: EnterpriseNotification,
  ) => {
    onMarkAsRead(notification.id);

    if (notification.path) {
      navigate(notification.path);
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 440,
            },
            maxWidth: "100%",
            borderLeft: "1px solid",
            borderColor: "divider",
            backgroundColor: "#F8FAFC",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.25,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <CircleNotificationsOutlined
                color="primary"
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                }}
              >
                Notification Center
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
                lineHeight: 1.55,
              }}
            >
              Operational alerts and decision
              updates across MediVantage.
            </Typography>
          </Box>

          <Tooltip title="Close notifications">
            <IconButton
              onClick={onClose}
              aria-label="Close notifications"
            >
              <CloseOutlined />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Chip
            label={`${unreadCount} unread`}
            size="small"
            color={
              unreadCount > 0
                ? "primary"
                : "default"
            }
            variant={
              unreadCount > 0
                ? "filled"
                : "outlined"
            }
          />

          <Button
            size="small"
            startIcon={<DoneAllOutlined />}
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 1.5,
        }}
      >
        {notifications.length === 0 ? (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: "center",
            }}
          >
            <CircleNotificationsOutlined
              sx={{
                fontSize: 48,
                color: "text.disabled",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mt: 1.5,
                fontWeight: 900,
              }}
            >
              No notifications
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              New operational alerts will
              appear here.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map(
              (notification) => {
                const style =
                  severityStyles[
                    notification.severity
                  ];

                return (
                  <ListItemButton
                    key={notification.id}
                    onClick={() =>
                      handleOpenNotification(
                        notification,
                      )
                    }
                    sx={{
                      mb: 1.25,
                      p: 1.75,
                      alignItems: "flex-start",
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor:
                        notification.read
                          ? "divider"
                          : style.borderColor,
                      backgroundColor:
                        notification.read
                          ? "#FFFFFF"
                          : style.backgroundColor,
                      transition:
                        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",

                      "&:hover": {
                        transform:
                          "translateY(-1px)",
                        backgroundColor:
                          notification.read
                            ? "#FFFFFF"
                            : style.backgroundColor,
                        boxShadow:
                          "0 8px 22px rgba(15,23,42,0.07)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        mr: 1.5,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 2,
                        color: style.color,
                        backgroundColor:
                          "#FFFFFF",
                        border: "1px solid",
                        borderColor:
                          style.borderColor,

                        "& svg": {
                          fontSize: 20,
                        },
                      }}
                    >
                      {style.icon}
                    </Box>

                    <Box
                      sx={{
                        minWidth: 0,
                        flexGrow: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems:
                            "flex-start",
                          justifyContent:
                            "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight:
                              notification.read
                                ? 800
                                : 900,
                            lineHeight: 1.35,
                          }}
                        >
                          {
                            notification.title
                          }
                        </Typography>

                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              mt: 0.65,
                              flexShrink: 0,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                style.color,
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.6,
                          color:
                            "text.secondary",
                          lineHeight: 1.55,
                        }}
                      >
                        {
                          notification.message
                        }
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{
                          mt: 1.25,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={
                            notification.module
                          }
                          size="small"
                          variant="outlined"
                        />

                        <Chip
                          label={style.label}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: style.color,
                            borderColor:
                              style.borderColor,
                            backgroundColor:
                              style.backgroundColor,
                          }}
                        />

                        <Typography
                          variant="caption"
                          sx={{
                            ml: "auto",
                            color:
                              "text.secondary",
                            fontWeight: 700,
                          }}
                        >
                          {formatRelativeTime(
                            notification.timestamp,
                          )}
                        </Typography>
                      </Stack>

                      {notification.path && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            mt: 1,
                            alignItems:
                              "center",
                            color:
                              "primary.main",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                            }}
                          >
                            Open record
                          </Typography>

                          <OpenInNewOutlined
                            sx={{
                              fontSize: 14,
                            }}
                          />
                        </Stack>
                      )}
                    </Box>
                  </ListItemButton>
                );
              },
            )}
          </List>
        )}
      </Box>
    </Drawer>
  );
}