import {
  alpha,
  createTheme,
} from "@mui/material/styles";

import { palette } from "./palette";
import { typography } from "./typography";

export const theme = createTheme({
  palette,
  typography,

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },

        html: {
          minHeight: "100%",
          scrollBehavior: "smooth",
          backgroundColor: "#F4F7FB",
        },

        body: {
          margin: 0,
          minHeight: "100%",
          backgroundColor: "#F4F7FB",
          color: "#172033",
          WebkitFontSmoothing:
            "antialiased",
          MozOsxFontSmoothing:
            "grayscale",
        },

        "#root": {
          minHeight: "100vh",
        },

        "::selection": {
          color: "#FFFFFF",
          backgroundColor: "#155D91",
        },

        "*::-webkit-scrollbar": {
          width: 10,
          height: 10,
        },

        "*::-webkit-scrollbar-track":
          {
            backgroundColor: "#EEF2F6",
          },

        "*::-webkit-scrollbar-thumb":
          {
            border:
              "2px solid #EEF2F6",
            borderRadius: 999,
            backgroundColor: "#B8C4D1",
          },

        "*::-webkit-scrollbar-thumb:hover":
          {
            backgroundColor: "#8FA1B3",
          },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 42,
          paddingLeft: 18,
          paddingRight: 18,
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 800,
          letterSpacing: "-0.01em",
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",

          "&:hover": {
            transform:
              "translateY(-1px)",
          },

          "&:active": {
            transform: "translateY(0)",
          },
        },

        contained: {
          boxShadow:
            "0 6px 16px rgba(15, 76, 117, 0.16)",

          "&:hover": {
            boxShadow:
              "0 9px 22px rgba(15, 76, 117, 0.22)",
          },
        },

        outlined: {
          borderColor: "#C8D4DF",
          backgroundColor: "#FFFFFF",

          "&:hover": {
            borderColor: "#155D91",
            backgroundColor: "#F7FAFC",
          },
        },

        sizeSmall: {
          minHeight: 36,
          paddingLeft: 14,
          paddingRight: 14,
          borderRadius: 9,
        },

        sizeLarge: {
          minHeight: 48,
          paddingLeft: 22,
          paddingRight: 22,
          borderRadius: 12,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition:
            "background-color 0.18s ease, color 0.18s ease, transform 0.18s ease",

          "&:hover": {
            transform:
              "translateY(-1px)",
          },
        },

        sizeSmall: {
          borderRadius: 8,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border:
            "1px solid #E3E9F0",
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 5px 18px rgba(16, 24, 40, 0.045)",
          transition:
            "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",

          "&:hover": {
            borderColor: "#D5DFE9",
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },

        rounded: {
          borderRadius: 16,
        },

        elevation1: {
          boxShadow:
            "0 6px 20px rgba(16, 24, 40, 0.055)",
        },

        elevation2: {
          boxShadow:
            "0 10px 28px rgba(16, 24, 40, 0.07)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom:
            "1px solid #E3E9F0",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight:
            "1px solid rgba(255,255,255,0.10)",
          backgroundImage: "none",
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          scrollbarWidth: "thin",
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F7F9FC",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition:
            "background-color 0.16s ease",

          "&.MuiTableRow-hover:hover":
            {
              backgroundColor:
                "#F8FBFD",
            },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 15,
          paddingBottom: 15,
          borderBottom:
            "1px solid #E8EDF3",
          color: "#27364A",
          fontSize: "0.875rem",
        },

        head: {
          paddingTop: 13,
          paddingBottom: 13,
          color: "#52657A",
          fontSize: "0.75rem",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.045em",
          whiteSpace: "nowrap",
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop:
            "1px solid #E8EDF3",
          backgroundColor: "#FFFFFF",
        },

        toolbar: {
          minHeight: 58,
        },

        selectLabel: {
          color: "#60758A",
          fontWeight: 600,
        },

        displayedRows: {
          color: "#60758A",
          fontWeight: 600,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          minHeight: 26,
          borderRadius: 9,
          fontWeight: 800,
          letterSpacing: "-0.005em",
        },

        sizeSmall: {
          minHeight: 24,
          fontSize: "0.72rem",
        },

        outlined: {
          backgroundColor: "#FFFFFF",
        },

        icon: {
          marginLeft: 7,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          transition:
            "background-color 0.18s ease, box-shadow 0.18s ease",

          "& .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#CDD7E1",
              transition:
                "border-color 0.18s ease",
            },

          "&:hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#8EA3B7",
            },

          "&.Mui-focused": {
            boxShadow:
              "0 0 0 3px rgba(21, 93, 145, 0.10)",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderWidth: 1,
              borderColor: "#155D91",
            },

          "&.Mui-error": {
            boxShadow:
              "0 0 0 3px rgba(211, 47, 47, 0.08)",
          },

          "&.Mui-disabled": {
            backgroundColor: "#F4F6F8",
          },

          "&.MuiInputBase-sizeSmall .MuiOutlinedInput-input":
            {
              paddingTop: 9,
              paddingBottom: 9,
            },
        },

        input: {
          paddingTop: 10,
          paddingBottom: 10,
          color: "#172033",
          fontWeight: 500,

          "&::placeholder": {
            color: "#8290A3",
            opacity: 1,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#60758A",
          fontWeight: 600,

          "&.Mui-focused": {
            color: "#155D91",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          display: "flex",
          alignItems: "center",
          fontWeight: 600,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 6,
          border:
            "1px solid #E3E9F0",
          borderRadius: 12,
          boxShadow:
            "0 14px 36px rgba(16, 24, 40, 0.12)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 42,
          marginLeft: 6,
          marginRight: 6,
          borderRadius: 8,
          fontWeight: 600,

          "&.Mui-selected": {
            color: "#0F4C75",
            backgroundColor: alpha(
              "#155D91",
              0.09,
            ),
          },

          "&.Mui-selected:hover": {
            backgroundColor: alpha(
              "#155D91",
              0.13,
            ),
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          border:
            "1px solid #E3E9F0",
          borderRadius: 18,
          boxShadow:
            "0 24px 70px rgba(15, 23, 42, 0.20)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          letterSpacing: "-0.02em",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: "8px 11px",
          borderRadius: 8,
          backgroundColor: "#102A43",
          fontSize: "0.75rem",
          fontWeight: 700,
          boxShadow:
            "0 8px 20px rgba(15,23,42,0.16)",
        },

        arrow: {
          color: "#102A43",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border:
            "1px solid transparent",

          "&.MuiAlert-standardSuccess":
            {
              borderColor: "#B7E4CA",
              backgroundColor:
                "#F0FBF5",
            },

          "&.MuiAlert-standardWarning":
            {
              borderColor: "#F7D9A6",
              backgroundColor:
                "#FFF9ED",
            },

          "&.MuiAlert-standardError":
            {
              borderColor: "#F4C1C1",
              backgroundColor:
                "#FFF5F5",
            },

          "&.MuiAlert-standardInfo":
            {
              borderColor: "#B7DFF1",
              backgroundColor:
                "#F2FAFD",
            },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 7,
          borderRadius: 99,
          backgroundColor: "#E9EEF4",
        },

        bar: {
          borderRadius: 99,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          minWidth: 19,
          height: 19,
          borderRadius: 99,
          border:
            "2px solid #FFFFFF",
          fontSize: "0.66rem",
          fontWeight: 900,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 900,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E8EDF3",
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#E9EEF4",
        },
      },
    },
  },
});

export default theme;