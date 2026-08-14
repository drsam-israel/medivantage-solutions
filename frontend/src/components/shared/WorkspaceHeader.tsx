import type { ReactNode } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface WorkspaceHeaderStat {
  label: string;
  value?: string | number;
  icon?: ReactNode;
  tone?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info";
}

export interface WorkspaceHeaderAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  prominent?: boolean;
}

interface WorkspaceHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  context?: string;
  updatedText?: string;
  statusLabel?: string;
  statusTone?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info";
  stats?: WorkspaceHeaderStat[];
  actions?: WorkspaceHeaderAction[];
}

const statToneStyles = {
  default: {
    color: "#475569",
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  primary: {
    color: "#0F4C75",
    backgroundColor: "rgba(15,76,117,0.08)",
    borderColor: "rgba(15,76,117,0.16)",
  },
  success: {
    color: "#047857",
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  warning: {
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  error: {
    color: "#B91C1C",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  info: {
    color: "#0369A1",
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },
} as const;

export default function WorkspaceHeader({
  eyebrow,
  title,
  description,
  icon,
  context,
  updatedText,
  statusLabel,
  statusTone = "success",
  stats = [],
  actions = [],
}: WorkspaceHeaderProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        px: {
          xs: 2.25,
          sm: 2.75,
          md: 3.5,
        },
        py: {
          xs: 2.25,
          sm: 2.75,
          md: 3,
        },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(15,76,117,0.13)",
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #F8FBFD 100%)",
        boxShadow:
          "0 12px 34px rgba(15,23,42,0.055)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -110,
          right: -80,
          width: 270,
          height: 270,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(22,127,141,0.08) 0%, rgba(22,127,141,0) 72%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg:
              actions.length > 0
                ? "minmax(0, 1fr) minmax(280px, 340px)"
                : "1fr",
          },
          columnGap: {
            xs: 0,
            lg: 4,
          },
          rowGap: 2.5,
          alignItems: "start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {(eyebrow || icon) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.1,
                mb: 1.2,
              }}
            >
              {icon && (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 2.25,
                    color: "#0F4C75",
                    background:
                      "linear-gradient(135deg, rgba(15,76,117,0.10) 0%, rgba(22,127,141,0.10) 100%)",
                  }}
                >
                  {icon}
                </Box>
              )}

              {eyebrow && (
                <Typography
                  variant="overline"
                  sx={{
                    color: "#547086",
                    fontWeight: 900,
                    letterSpacing: "0.09em",
                    lineHeight: 1.25,
                  }}
                >
                  {eyebrow}
                </Typography>
              )}
            </Box>
          )}

          <Typography
            variant="h3"
            sx={{
              color: "#102A43",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              fontSize: {
                xs: "1.9rem",
                sm: "2.25rem",
                md: "2.6rem",
              },
              lineHeight: 1.08,
              maxWidth: "100%",
              whiteSpace: "normal",
              wordBreak: "normal",
              overflowWrap: "normal",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1.15,
              maxWidth: 900,
              color: "#60758A",
              fontSize: {
                xs: "0.95rem",
                md: "1.04rem",
              },
              lineHeight: 1.65,
            }}
          >
            {description}
          </Typography>

          {(context || updatedText || statusLabel) && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                mt: 1.6,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {context && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#60758A",
                    fontWeight: 700,
                  }}
                >
                  {context}
                </Typography>
              )}

              {context && updatedText && (
                <Typography
                  component="span"
                  sx={{
                    color: "#94A3B8",
                    fontSize: "0.8rem",
                  }}
                >
                  •
                </Typography>
              )}

              {updatedText && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#60758A",
                    fontWeight: 700,
                  }}
                >
                  {updatedText}
                </Typography>
              )}

              {statusLabel && (
                <Chip
                  label={statusLabel}
                  size="small"
                  color={statusTone}
                  variant="outlined"
                  sx={{
                    height: 26,
                    fontWeight: 800,
                  }}
                />
              )}
            </Stack>
          )}

          {stats.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat) => {
                const style =
                  statToneStyles[
                    stat.tone ?? "default"
                  ];

                return (
                  <Box
                    key={`${stat.label}-${String(
                      stat.value ?? "",
                    )}`}
                    sx={{
                      minHeight: 38,
                      px: 1.3,
                      py: 0.75,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor:
                        style.borderColor,
                      color: style.color,
                      backgroundColor:
                        style.backgroundColor,
                    }}
                  >
                    {stat.icon && (
                      <Box
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,

                          "& svg": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {stat.icon}
                      </Box>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stat.value !== undefined
                        ? `${stat.value} ${stat.label}`
                        : stat.label}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>

        {actions.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "1fr",
              },
              gap: 1.15,
              alignSelf: "center",
            }}
          >
            {actions.map((action, index) => (
              <Button
                key={action.label}
                fullWidth
                variant={
                  action.variant ??
                  (action.prominent
                    ? "contained"
                    : "outlined")
                }
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  minHeight: 50,
                  px: 2,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 900,
                  whiteSpace: "normal",
                  lineHeight: 1.25,
                  justifyContent: "center",
                  gridColumn: {
                    xs: "auto",
                    sm:
                      actions.length % 2 === 1 &&
                      index ===
                        actions.length - 1
                        ? "1 / -1"
                        : "auto",
                    lg: "auto",
                  },
                  boxShadow:
                    action.prominent ||
                    action.variant ===
                      "contained"
                      ? "0 8px 18px rgba(15,76,117,0.16)"
                      : "none",
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}