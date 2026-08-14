import type { ThemeOptions } from "@mui/material/styles";

export const typography: ThemeOptions["typography"] = {
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',

  h1: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
  },

  h2: {
    fontSize: "1.75rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.015em",
  },

  h3: {
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: 1.35,
  },

  h4: {
    fontSize: "1.25rem",
    fontWeight: 700,
    lineHeight: 1.4,
  },

  h5: {
    fontSize: "1.1rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  subtitle1: {
    fontSize: "0.95rem",
    fontWeight: 600,
  },

  subtitle2: {
    fontSize: "0.85rem",
    fontWeight: 600,
  },

  body1: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },

  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.55,
  },

  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "none",
  },

  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.4,
  },
};
