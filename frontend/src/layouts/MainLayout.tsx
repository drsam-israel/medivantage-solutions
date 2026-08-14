import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Toolbar,
} from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import GlobalSearchCommandCenter from "../components/search/GlobalSearchCommandCenter";
import NotificationCenter from "../components/notifications/NotificationCenter";

import {
  notificationDemoData,
} from "../data/notificationDemoData";

import type {
  EnterpriseNotification,
} from "../data/notificationDemoData";

const SIDEBAR_STORAGE_KEY =
  "medivantage-sidebar-collapsed";

const NOTIFICATION_STORAGE_KEY =
  "medivantage-notifications";

function loadStoredNotifications(): EnterpriseNotification[] {
  try {
    const storedNotifications =
      window.localStorage.getItem(
        NOTIFICATION_STORAGE_KEY,
      );

    if (!storedNotifications) {
      return notificationDemoData;
    }

    const parsedNotifications: unknown =
      JSON.parse(storedNotifications);

    if (!Array.isArray(parsedNotifications)) {
      return notificationDemoData;
    }

    return parsedNotifications as EnterpriseNotification[];
  } catch {
    return notificationDemoData;
  }
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [
    globalSearchOpen,
    setGlobalSearchOpen,
  ] = useState(false);

  const [
    notificationCenterOpen,
    setNotificationCenterOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<EnterpriseNotification[]>(
    loadStoredNotifications,
  );

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState<boolean>(() => {
    try {
      return (
        window.localStorage.getItem(
          SIDEBAR_STORAGE_KEY,
        ) === "true"
      );
    } catch {
      return false;
    }
  });

  const unreadNotificationCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.read,
        ).length,
      [notifications],
    );

  useEffect(() => {
    const handleKeyboardShortcut = (
      event: KeyboardEvent,
    ) => {
      const isSearchShortcut =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        setGlobalSearchOpen(true);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut,
      );
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(notifications),
      );
    } catch {
      // Notification persistence is skipped
      // when browser storage is unavailable.
    }
  }, [notifications]);

  const handleMenuClick = () => {
    setMobileOpen(
      (current) => !current,
    );
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((current) => {
      const nextValue = !current;

      try {
        window.localStorage.setItem(
          SIDEBAR_STORAGE_KEY,
          String(nextValue),
        );
      } catch {
        // The interface remains functional
        // when browser storage is unavailable.
      }

      return nextValue;
    });
  };

  const handleMarkNotificationAsRead = (
    notificationId: string,
  ) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id ===
        notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  const handleMarkAllNotificationsAsRead =
    () => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        overflowX: "hidden",
        backgroundColor:
          "background.default",
      }}
    >
      <Topbar
        onMenuClick={handleMenuClick}
        onOpenSearch={() =>
          setGlobalSearchOpen(true)
        }
        onOpenNotifications={() =>
          setNotificationCenterOpen(true)
        }
        notificationCount={
          unreadNotificationCount
        }
        sidebarCollapsed={
          sidebarCollapsed
        }
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
        collapsed={sidebarCollapsed}
        onToggleCollapse={
          handleSidebarToggle
        }
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: "100%",
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #F6F9FC 0%, #F4F7FB 100%)",
          transition: (theme) =>
            theme.transitions.create(
              ["margin", "width"],
              {
                duration:
                  theme.transitions
                    .duration.standard,
                easing:
                  theme.transitions
                    .easing.sharp,
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
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 1920,
            mx: "auto",
            px: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
              xl: 4,
            },
            pt: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            pb: {
              xs: 3,
              md: 4,
              xl: 5,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              animation:
                "medivantagePageIn 220ms ease-out",

              "@keyframes medivantagePageIn":
                {
                  from: {
                    opacity: 0,
                    transform:
                      "translateY(5px)",
                  },

                  to: {
                    opacity: 1,
                    transform:
                      "translateY(0)",
                  },
                },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <GlobalSearchCommandCenter
        open={globalSearchOpen}
        onClose={() =>
          setGlobalSearchOpen(false)
        }
      />

      <NotificationCenter
        open={notificationCenterOpen}
        onClose={() =>
          setNotificationCenterOpen(false)
        }
        notifications={notifications}
        onMarkAsRead={
          handleMarkNotificationAsRead
        }
        onMarkAllAsRead={
          handleMarkAllNotificationsAsRead
        }
      />
    </Box>
  );
}