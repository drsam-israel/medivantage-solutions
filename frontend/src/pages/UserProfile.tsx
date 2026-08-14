import {
  AdminPanelSettingsOutlined,
  BadgeOutlined,
  BusinessCenterOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EmailOutlined,
  HealthAndSafetyOutlined,
  LocationOnOutlined,
  MedicalServicesOutlined,
  PersonOutlineOutlined,
  PhoneOutlined,
  RestartAltOutlined,
  SaveOutlined,
  SecurityOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  useMemo,
  useState,
} from "react";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";

interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  department: string;
}

const USER_PROFILE_STORAGE_KEY =
  "medivantage-user-profile";

const DEFAULT_USER_PROFILE: UserProfileData = {
  fullName: "Dr. Samuel Israel",
  email: "samuel.israel@medivantage.com",
  phone: "+966 50 000 0000",
  location: "Riyadh, Saudi Arabia",
  jobTitle: "Product Administrator",
  department:
    "Healthcare AI & Product Operations",
};

function loadStoredProfile(): UserProfileData {
  try {
    const storedProfile =
      window.localStorage.getItem(
        USER_PROFILE_STORAGE_KEY,
      );

    if (!storedProfile) {
      return DEFAULT_USER_PROFILE;
    }

    const parsedProfile: unknown =
      JSON.parse(storedProfile);

    if (
      typeof parsedProfile !== "object" ||
      parsedProfile === null
    ) {
      return DEFAULT_USER_PROFILE;
    }

    const candidate =
      parsedProfile as Partial<UserProfileData>;

    return {
      fullName:
        typeof candidate.fullName ===
        "string"
          ? candidate.fullName
          : DEFAULT_USER_PROFILE.fullName,

      email:
        typeof candidate.email === "string"
          ? candidate.email
          : DEFAULT_USER_PROFILE.email,

      phone:
        typeof candidate.phone === "string"
          ? candidate.phone
          : DEFAULT_USER_PROFILE.phone,

      location:
        typeof candidate.location ===
        "string"
          ? candidate.location
          : DEFAULT_USER_PROFILE.location,

      jobTitle:
        typeof candidate.jobTitle ===
        "string"
          ? candidate.jobTitle
          : DEFAULT_USER_PROFILE.jobTitle,

      department:
        typeof candidate.department ===
        "string"
          ? candidate.department
          : DEFAULT_USER_PROFILE.department,
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

function getInitials(
  fullName: string,
): string {
  const cleanedName = fullName
    .replace(/^Dr\.\s*/i, "")
    .trim();

  const parts = cleanedName
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "SI";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

export default function UserProfile() {
  const [
    savedProfile,
    setSavedProfile,
  ] = useState<UserProfileData>(
    loadStoredProfile,
  );

  const [
    draftProfile,
    setDraftProfile,
  ] = useState<UserProfileData>(
    savedProfile,
  );

  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [resetComplete, setResetComplete] =
    useState(false);

  const initials = useMemo(
    () =>
      getInitials(
        savedProfile.fullName,
      ),
    [savedProfile.fullName],
  );

  const updateDraftField = (
    field: keyof UserProfileData,
    value: string,
  ) => {
    setDraftProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleStartEditing = () => {
    setDraftProfile(savedProfile);
    setEditing(true);
    setSaved(false);
    setResetComplete(false);
  };

  const handleCancel = () => {
    setDraftProfile(savedProfile);
    setEditing(false);
  };

  const handleSave = () => {
    const normalizedProfile: UserProfileData =
      {
        fullName:
          draftProfile.fullName.trim(),
        email:
          draftProfile.email.trim(),
        phone:
          draftProfile.phone.trim(),
        location:
          draftProfile.location.trim(),
        jobTitle:
          draftProfile.jobTitle.trim(),
        department:
          draftProfile.department.trim(),
      };

    try {
      window.localStorage.setItem(
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify(
          normalizedProfile,
        ),
      );
    } catch {
      // The profile remains usable in the
      // current session when storage is unavailable.
    }

    setSavedProfile(
      normalizedProfile,
    );
    setDraftProfile(
      normalizedProfile,
    );
    setEditing(false);
    setSaved(true);
    setResetComplete(false);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleResetToDefaults = () => {
    try {
      window.localStorage.removeItem(
        USER_PROFILE_STORAGE_KEY,
      );
    } catch {
      // The reset still applies to the
      // current session when storage is unavailable.
    }

    setSavedProfile(
      DEFAULT_USER_PROFILE,
    );
    setDraftProfile(
      DEFAULT_USER_PROFILE,
    );
    setEditing(false);
    setSaved(false);
    setResetComplete(true);

    window.setTimeout(() => {
      setResetComplete(false);
    }, 3000);
  };

  const displayedProfile = editing
    ? draftProfile
    : savedProfile;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="USER ACCOUNT"
        title="My Profile"
        description="Manage your personal information, enterprise role, access status and professional profile within MediVantage."
        icon={<PersonOutlineOutlined />}
        context="MediVantage Identity"
        updatedText="User account workspace"
        statusLabel="Account Active"
        statusTone="success"
        stats={[
          {
            label: "Access Level",
            value: "Administrator",
            icon: (
              <AdminPanelSettingsOutlined />
            ),
            tone: "primary",
          },
          {
            label: "Account Status",
            value: "Verified",
            icon: (
              <VerifiedUserOutlined />
            ),
            tone: "success",
          },
          {
            label: "Security",
            value: "Protected",
            icon: <SecurityOutlined />,
            tone: "info",
          },
          {
            label: "Clinical Profile",
            value: "Active",
            icon: (
              <MedicalServicesOutlined />
            ),
            tone: "default",
          },
        ]}
        actions={[
          {
            label: editing
              ? "Save Profile"
              : "Edit Profile",
            icon: editing ? (
              <SaveOutlined />
            ) : (
              <EditOutlined />
            ),
            onClick: editing
              ? handleSave
              : handleStartEditing,
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

      {saved && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlined />}
          sx={{ mt: 3 }}
        >
          Your profile has been saved and
          will remain available after
          refreshing the browser.
        </Alert>
      )}

      {resetComplete && (
        <Alert
          severity="info"
          sx={{ mt: 3 }}
        >
          Your profile has been restored to
          the MediVantage default values.
        </Alert>
      )}

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "340px minmax(0, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <Card elevation={0}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  color: "common.white",
                  background:
                    "linear-gradient(135deg, #123E67 0%, #155D91 55%, #167F8D 100%)",
                  boxShadow:
                    "0 12px 28px rgba(15,76,117,0.22)",
                  fontSize: "1.65rem",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                {initials}
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900 }}
                >
                  {savedProfile.fullName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.4,
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  {savedProfile.jobTitle}
                </Typography>
              </Box>

              <Chip
                label="Enterprise Access"
                color="primary"
                variant="outlined"
              />

              <Divider flexItem />

              <Stack
                spacing={1.25}
                sx={{
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <BadgeOutlined
                    fontSize="small"
                    color="action"
                  />

                  <Typography variant="body2">
                    User ID: MV-ADM-001
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <HealthAndSafetyOutlined
                    fontSize="small"
                    color="action"
                  />

                  <Typography variant="body2">
                    Clinical profile enabled
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <SecurityOutlined
                    fontSize="small"
                    color="action"
                  />

                  <Typography variant="body2">
                    MFA protection active
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              Personal & Professional
              Information
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.4,
                color: "text.secondary",
              }}
            >
              Review and maintain your profile
              information.
            </Typography>

            <Divider sx={{ my: 2.5 }} />

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
                label="Full Name"
                value={
                  displayedProfile.fullName
                }
                onChange={(event) =>
                  updateDraftField(
                    "fullName",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PersonOutlineOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Email Address"
                value={
                  displayedProfile.email
                }
                onChange={(event) =>
                  updateDraftField(
                    "email",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <EmailOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Phone Number"
                value={
                  displayedProfile.phone
                }
                onChange={(event) =>
                  updateDraftField(
                    "phone",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PhoneOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Location"
                value={
                  displayedProfile.location
                }
                onChange={(event) =>
                  updateDraftField(
                    "location",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <LocationOnOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Job Title"
                value={
                  displayedProfile.jobTitle
                }
                onChange={(event) =>
                  updateDraftField(
                    "jobTitle",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <BusinessCenterOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Department"
                value={
                  displayedProfile.department
                }
                onChange={(event) =>
                  updateDraftField(
                    "department",
                    event.target.value,
                  )
                }
                disabled={!editing}
                slotProps={{
                  input: {
                    startAdornment: (
                      <MedicalServicesOutlined
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />
            </Box>

            {editing && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  mt: 3,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  onClick={handleSave}
                  disabled={
                    !draftProfile.fullName.trim() ||
                    !draftProfile.email.trim()
                  }
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
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
        MediVantage™ Enterprise User
        Profile · Designed & Developed by
        Dr. Samuel Israel
      </Typography>
    </Box>
  );
}