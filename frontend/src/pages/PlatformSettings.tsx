import type { ReactNode } from "react";

import {
  AdminPanelSettingsOutlined,
  AutoAwesomeOutlined,
  BusinessOutlined,
  CheckCircleOutlined,
  DataObjectOutlined,
  LockOutlined,
  NotificationsActiveOutlined,
  RestartAltOutlined,
  SaveOutlined,
  SecurityOutlined,
  SettingsOutlined,
  ShieldOutlined,
  TuneOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

interface SettingSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
  highlighted?: boolean;
}

interface PlatformSettingsData {
  organizationName: string;
  organizationRegion: string;
  defaultCurrency: string;
  timezone: string;
  emailNotifications: boolean;
  criticalAlerts: boolean;
  workflowUpdates: boolean;
  weeklyDigest: boolean;
  multiFactorAuthentication: boolean;
  sessionTimeout: string;
  auditLogging: boolean;
  aiRecommendations: boolean;
  humanReviewRequired: boolean;
  explainabilityRequired: boolean;
  driftMonitoring: boolean;
}

const PLATFORM_SETTINGS_STORAGE_KEY =
  "medivantage-platform-settings";

const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsData = {
  organizationName: "MediVantage Solutions™",
  organizationRegion: "Saudi Arabia",
  defaultCurrency: "SAR",
  timezone: "Asia/Riyadh",
  emailNotifications: true,
  criticalAlerts: true,
  workflowUpdates: true,
  weeklyDigest: false,
  multiFactorAuthentication: true,
  sessionTimeout: "30",
  auditLogging: true,
  aiRecommendations: true,
  humanReviewRequired: true,
  explainabilityRequired: true,
  driftMonitoring: true,
};

function loadStoredSettings(): PlatformSettingsData {
  try {
    const storedSettings =
      window.localStorage.getItem(
        PLATFORM_SETTINGS_STORAGE_KEY,
      );

    if (!storedSettings) {
      return DEFAULT_PLATFORM_SETTINGS;
    }

    const parsedSettings: unknown =
      JSON.parse(storedSettings);

    if (
      typeof parsedSettings !== "object" ||
      parsedSettings === null
    ) {
      return DEFAULT_PLATFORM_SETTINGS;
    }

    const candidate =
      parsedSettings as Partial<PlatformSettingsData>;

    return {
      organizationName:
        typeof candidate.organizationName === "string"
          ? candidate.organizationName
          : DEFAULT_PLATFORM_SETTINGS.organizationName,

      organizationRegion:
        typeof candidate.organizationRegion === "string"
          ? candidate.organizationRegion
          : DEFAULT_PLATFORM_SETTINGS.organizationRegion,

      defaultCurrency:
        typeof candidate.defaultCurrency === "string"
          ? candidate.defaultCurrency
          : DEFAULT_PLATFORM_SETTINGS.defaultCurrency,

      timezone:
        typeof candidate.timezone === "string"
          ? candidate.timezone
          : DEFAULT_PLATFORM_SETTINGS.timezone,

      emailNotifications:
        typeof candidate.emailNotifications === "boolean"
          ? candidate.emailNotifications
          : DEFAULT_PLATFORM_SETTINGS.emailNotifications,

      criticalAlerts:
        typeof candidate.criticalAlerts === "boolean"
          ? candidate.criticalAlerts
          : DEFAULT_PLATFORM_SETTINGS.criticalAlerts,

      workflowUpdates:
        typeof candidate.workflowUpdates === "boolean"
          ? candidate.workflowUpdates
          : DEFAULT_PLATFORM_SETTINGS.workflowUpdates,

      weeklyDigest:
        typeof candidate.weeklyDigest === "boolean"
          ? candidate.weeklyDigest
          : DEFAULT_PLATFORM_SETTINGS.weeklyDigest,

      multiFactorAuthentication:
        typeof candidate.multiFactorAuthentication === "boolean"
          ? candidate.multiFactorAuthentication
          : DEFAULT_PLATFORM_SETTINGS.multiFactorAuthentication,

      sessionTimeout:
        typeof candidate.sessionTimeout === "string"
          ? candidate.sessionTimeout
          : DEFAULT_PLATFORM_SETTINGS.sessionTimeout,

      auditLogging:
        typeof candidate.auditLogging === "boolean"
          ? candidate.auditLogging
          : DEFAULT_PLATFORM_SETTINGS.auditLogging,

      aiRecommendations:
        typeof candidate.aiRecommendations === "boolean"
          ? candidate.aiRecommendations
          : DEFAULT_PLATFORM_SETTINGS.aiRecommendations,

      humanReviewRequired:
        typeof candidate.humanReviewRequired === "boolean"
          ? candidate.humanReviewRequired
          : DEFAULT_PLATFORM_SETTINGS.humanReviewRequired,

      explainabilityRequired:
        typeof candidate.explainabilityRequired === "boolean"
          ? candidate.explainabilityRequired
          : DEFAULT_PLATFORM_SETTINGS.explainabilityRequired,

      driftMonitoring:
        typeof candidate.driftMonitoring === "boolean"
          ? candidate.driftMonitoring
          : DEFAULT_PLATFORM_SETTINGS.driftMonitoring,
    };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

function SettingSection({
  title,
  description,
  icon,
  children,
  sectionRef,
  highlighted = false,
}: SettingSectionProps) {
  return (
    <Card
      ref={sectionRef}
      elevation={0}
      sx={{
        scrollMarginTop: 110,
        borderColor: highlighted
          ? "primary.main"
          : "divider",
        boxShadow: highlighted
          ? "0 0 0 3px rgba(21,93,145,0.08)"
          : undefined,
        transition:
          "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "flex-start" }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 2.25,
              color: "primary.main",
              backgroundColor:
                "rgba(21,93,145,0.08)",
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                color: "text.secondary",
                lineHeight: 1.55,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {children}
      </CardContent>
    </Card>
  );
}

export default function PlatformSettings() {
  const [searchParams] =
    useSearchParams();

  const requestedSection =
    searchParams.get("section");

  const preferencesRef =
    useRef<HTMLDivElement | null>(null);

  const rolesRef =
    useRef<HTMLDivElement | null>(null);

  const [
    settings,
    setSettings,
  ] = useState<PlatformSettingsData>(
    loadStoredSettings,
  );

  const [
    saveConfirmationVisible,
    setSaveConfirmationVisible,
  ] = useState(false);

  const [
    resetConfirmationVisible,
    setResetConfirmationVisible,
  ] = useState(false);

  const updateSetting = <
    Key extends keyof PlatformSettingsData,
  >(
    key: Key,
    value: PlatformSettingsData[Key],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    const target =
      requestedSection === "preferences"
        ? preferencesRef.current
        : requestedSection === "roles"
          ? rolesRef.current
          : null;

    if (!target) {
      return;
    }

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, [requestedSection]);

  const handleSave = () => {
    try {
      window.localStorage.setItem(
        PLATFORM_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
      );
    } catch {
      // The current session remains usable
      // when browser storage is unavailable.
    }

    setSaveConfirmationVisible(true);
    setResetConfirmationVisible(false);

    window.setTimeout(() => {
      setSaveConfirmationVisible(false);
    }, 3000);
  };

  const handleResetToDefaults = () => {
    try {
      window.localStorage.removeItem(
        PLATFORM_SETTINGS_STORAGE_KEY,
      );
    } catch {
      // Reset still applies to the current
      // session when storage is unavailable.
    }

    setSettings(
      DEFAULT_PLATFORM_SETTINGS,
    );
    setSaveConfirmationVisible(false);
    setResetConfirmationVisible(true);

    window.setTimeout(() => {
      setResetConfirmationVisible(false);
    }, 3000);
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="PLATFORM ADMINISTRATION"
        title="Platform Settings"
        description="Configure enterprise preferences, security controls, notification policies, AI governance requirements and system-level defaults."
        icon={<SettingsOutlined />}
        context="MediVantage Administration"
        updatedText="Configuration workspace"
        statusLabel="Platform Operational"
        statusTone="success"
        stats={[
          {
            label: "Security Controls",
            value: settings.multiFactorAuthentication
              ? "Active"
              : "Limited",
            icon: <SecurityOutlined />,
            tone: settings.multiFactorAuthentication
              ? "success"
              : "warning",
          },
          {
            label: "Audit Logging",
            value: settings.auditLogging
              ? "Enabled"
              : "Disabled",
            icon: <ShieldOutlined />,
            tone: settings.auditLogging
              ? "primary"
              : "warning",
          },
          {
            label: "AI Governance",
            value:
              settings.humanReviewRequired &&
              settings.explainabilityRequired
                ? "Enforced"
                : "Partial",
            icon: <AutoAwesomeOutlined />,
            tone:
              settings.humanReviewRequired &&
              settings.explainabilityRequired
                ? "info"
                : "warning",
          },
          {
            label: "System Version",
            value: "1.0.0",
            icon: <DataObjectOutlined />,
            tone: "default",
          },
        ]}
        actions={[
          {
            label: "Save Configuration",
            icon: <SaveOutlined />,
            onClick: handleSave,
            prominent: true,
          },
          {
            label: "Reset to Defaults",
            icon: <RestartAltOutlined />,
            onClick:
              handleResetToDefaults,
            variant: "outlined",
          },
        ]}
      />

      {saveConfirmationVisible && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlined />}
          sx={{ mt: 3 }}
        >
          Platform settings have been saved and will remain available after refreshing the browser.
        </Alert>
      )}

      {resetConfirmationVisible && (
        <Alert
          severity="info"
          sx={{ mt: 3 }}
        >
          Platform settings have been restored to the MediVantage default configuration.
        </Alert>
      )}

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2.5,
        }}
      >
        <SettingSection
          title="Organization Profile"
          description="Define the organization identity and operating defaults used across the platform."
          icon={<BusinessOutlined />}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Organization Name"
              value={
                settings.organizationName
              }
              onChange={(event) =>
                updateSetting(
                  "organizationName",
                  event.target.value,
                )
              }
            />

            <TextField
              label="Operating Region"
              value={
                settings.organizationRegion
              }
              onChange={(event) =>
                updateSetting(
                  "organizationRegion",
                  event.target.value,
                )
              }
            />

            <FormControl size="small">
              <InputLabel>
                Default Currency
              </InputLabel>

              <Select
                value={
                  settings.defaultCurrency
                }
                label="Default Currency"
                onChange={(event) =>
                  updateSetting(
                    "defaultCurrency",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="SAR">
                  SAR — Saudi Riyal
                </MenuItem>
                <MenuItem value="AED">
                  AED — UAE Dirham
                </MenuItem>
                <MenuItem value="USD">
                  USD — US Dollar
                </MenuItem>
                <MenuItem value="NGN">
                  NGN — Nigerian Naira
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>
                Default Timezone
              </InputLabel>

              <Select
                value={settings.timezone}
                label="Default Timezone"
                onChange={(event) =>
                  updateSetting(
                    "timezone",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="Asia/Riyadh">
                  Asia/Riyadh
                </MenuItem>
                <MenuItem value="Africa/Lagos">
                  Africa/Lagos
                </MenuItem>
                <MenuItem value="Europe/London">
                  Europe/London
                </MenuItem>
                <MenuItem value="UTC">
                  UTC
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </SettingSection>

        <SettingSection
          title="Notification Preferences"
          description="Control which operational events are surfaced to platform administrators."
          icon={
            <NotificationsActiveOutlined />
          }
          sectionRef={preferencesRef}
          highlighted={
            requestedSection ===
            "preferences"
          }
        >
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.emailNotifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "emailNotifications",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Email notifications"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.criticalAlerts
                  }
                  onChange={(event) =>
                    updateSetting(
                      "criticalAlerts",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Critical operational alerts"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.workflowUpdates
                  }
                  onChange={(event) =>
                    updateSetting(
                      "workflowUpdates",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Workflow status updates"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.weeklyDigest
                  }
                  onChange={(event) =>
                    updateSetting(
                      "weeklyDigest",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Weekly executive digest"
            />
          </Stack>
        </SettingSection>

        <SettingSection
          title="Security & Access"
          description="Manage baseline security controls for users and administrative sessions."
          icon={<LockOutlined />}
          sectionRef={rolesRef}
          highlighted={
            requestedSection === "roles"
          }
        >
          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.multiFactorAuthentication
                  }
                  onChange={(event) =>
                    updateSetting(
                      "multiFactorAuthentication",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Require multi-factor authentication"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.auditLogging
                  }
                  onChange={(event) =>
                    updateSetting(
                      "auditLogging",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Enable enterprise audit logging"
            />

            <FormControl size="small">
              <InputLabel>
                Session Timeout
              </InputLabel>

              <Select
                value={
                  settings.sessionTimeout
                }
                label="Session Timeout"
                onChange={(event) =>
                  updateSetting(
                    "sessionTimeout",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="15">
                  15 minutes
                </MenuItem>
                <MenuItem value="30">
                  30 minutes
                </MenuItem>
                <MenuItem value="60">
                  60 minutes
                </MenuItem>
                <MenuItem value="120">
                  120 minutes
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={
                <AdminPanelSettingsOutlined />
              }
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Manage Roles & Permissions
            </Button>
          </Stack>
        </SettingSection>

        <SettingSection
          title="Responsible AI Controls"
          description="Define mandatory governance requirements for AI-assisted decisions and recommendations."
          icon={<AutoAwesomeOutlined />}
        >
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.aiRecommendations
                  }
                  onChange={(event) =>
                    updateSetting(
                      "aiRecommendations",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Enable AI recommendations"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.humanReviewRequired
                  }
                  onChange={(event) =>
                    updateSetting(
                      "humanReviewRequired",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Require human review for high-risk decisions"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.explainabilityRequired
                  }
                  onChange={(event) =>
                    updateSetting(
                      "explainabilityRequired",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Require explainability for AI outputs"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.driftMonitoring
                  }
                  onChange={(event) =>
                    updateSetting(
                      "driftMonitoring",
                      event.target.checked,
                    )
                  }
                />
              }
              label="Enable model drift monitoring"
            />
          </Stack>
        </SettingSection>

        <SettingSection
          title="System Information"
          description="Review the current platform build and operational configuration."
          icon={<TuneOutlined />}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Product
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ mt: 0.35 }}
              >
                MediVantage™ Enterprise
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Version
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ mt: 0.35 }}
              >
                1.0.0 (MVP)
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Build Status
              </Typography>

              <Chip
                label="Operational"
                size="small"
                color="success"
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Prepared By
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ mt: 0.35 }}
              >
                Dr. Samuel Israel
              </Typography>
            </Box>
          </Box>
        </SettingSection>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        MediVantage™ Enterprise Platform Settings · Designed & Developed by Dr. Samuel Israel
      </Typography>
    </Box>
  );
}