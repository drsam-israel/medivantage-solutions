import type { ReactNode } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

export interface ModuleHeroStat {
  label: string;
  icon?: ReactNode;
}

export interface ModuleHeroAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ModuleHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;

  stats?: ModuleHeroStat[];

  primaryAction?: ModuleHeroAction;
  secondaryAction?: ModuleHeroAction;
  tertiaryAction?: ModuleHeroAction;

  brandLabel?: string;
  minHeight?: number;
  titleMaxWidth?: number;
}

export default function ModuleHero({
  eyebrow,
  title,
  description,
  icon,
  gradient,
  stats = [],
  primaryAction,
  secondaryAction,
  tertiaryAction,
  brandLabel = "MEDIVANTAGE SOLUTIONS™",
  minHeight = 300,
  titleMaxWidth = 820,
}: ModuleHeroProps) {
  const hasActions =
    Boolean(primaryAction) ||
    Boolean(secondaryAction) ||
    Boolean(tertiaryAction);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight,
        p: {
          xs: 3,
          sm: 3.5,
          md: 4.5,
        },
        borderRadius: {
          xs: 3.5,
          md: 5,
        },
        color: "common.white",
        background: gradient,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 220,
            md: 300,
          },
          height: {
            xs: 220,
            md: 300,
          },
          borderRadius: "50%",
          top: {
            xs: -110,
            md: -145,
          },
          right: {
            xs: -80,
            md: -80,
          },
          backgroundColor: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 150,
            md: 210,
          },
          height: {
            xs: 150,
            md: 210,
          },
          borderRadius: "50%",
          right: {
            xs: 70,
            md: 210,
          },
          bottom: {
            xs: -105,
            md: -145,
          },
          backgroundColor: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: {
            xs: "auto",
            md: minHeight - 72,
          },
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            lg: "center",
          },
          gap: {
            xs: 3,
            lg: 5,
          },
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            maxWidth: titleMaxWidth,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              mb: 1.3,
            }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                color: "common.white",
                "& svg": {
                  fontSize: {
                    xs: 26,
                    md: 30,
                  },
                },
              }}
            >
              {icon}
            </Box>

            <Typography
              variant="overline"
              sx={{
                color: "common.white",
                fontWeight: 900,
                letterSpacing: "0.11em",
                lineHeight: 1.3,
              }}
            >
              {eyebrow || brandLabel}
            </Typography>
          </Box>

          {eyebrow && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1.25,
                color: "rgba(255,255,255,0.72)",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              {brandLabel}
            </Typography>
          )}

          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              fontSize: {
                xs: "2.1rem",
                sm: "2.5rem",
                md: "3.15rem",
              },
              maxWidth: titleMaxWidth,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              maxWidth: 820,
              color: "rgba(255,255,255,0.90)",
              lineHeight: 1.7,
              fontSize: {
                xs: "1rem",
                md: "1.08rem",
              },
            }}
          >
            {description}
          </Typography>

          {stats.length > 0 && (
            <Box
              sx={{
                mt: 2.6,
                display: "flex",
                flexWrap: "wrap",
                gap: 1.2,
              }}
            >
              {stats.slice(0, 4).map((stat) => (
                <Chip
                  key={stat.label}
                  icon={
                    stat.icon ? (
                      <Box
                        component="span"
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          color: "inherit",
                          "& svg": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {stat.icon}
                      </Box>
                    ) : undefined
                  }
                  label={stat.label}
                  sx={{
                    minHeight: 38,
                    px: 0.5,
                    borderRadius: 2,
                    color: "common.white",
                    backgroundColor: "rgba(255,255,255,0.14)",
                    fontWeight: 900,
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                    "& .MuiChip-label": {
                      px: 1.25,
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {hasActions && (
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                lg: 285,
              },
              display: "grid",
              gap: 1.35,
              alignSelf: {
                xs: "stretch",
                lg: "center",
              },
            }}
          >
            {primaryAction && (
              <Button
                variant="contained"
                startIcon={primaryAction.icon}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                sx={{
                  minHeight: 56,
                  px: 3,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: "1rem",
                  color: "#123E67",
                  backgroundColor: "common.white",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.91)",
                    boxShadow: "none",
                  },
                }}
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant="outlined"
                startIcon={secondaryAction.icon}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
                sx={{
                  minHeight: 56,
                  px: 3,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: "1rem",
                  color: "common.white",
                  borderColor: "rgba(255,255,255,0.58)",
                  "&:hover": {
                    borderColor: "common.white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {secondaryAction.label}
              </Button>
            )}

            {tertiaryAction && (
              <Button
                variant="text"
                startIcon={tertiaryAction.icon}
                onClick={tertiaryAction.onClick}
                disabled={tertiaryAction.disabled}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.88)",
                  "&:hover": {
                    color: "common.white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {tertiaryAction.label}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}