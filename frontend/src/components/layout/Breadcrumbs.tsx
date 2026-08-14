import { NavigateNextOutlined } from "@mui/icons-material";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const pageNames: Record<string, string> = {
  claims: "Claims Workspace",
  members: "Members 360",
  "medical-underwriting": "Medical Underwriting",
  "policy-administration": "Policy Administration",
  "prior-authorization": "Prior Authorization",
  "provider-network": "Provider Network",
  payments: "Payments",
  "ai-insights": "AI Insights",
};

export default function AppBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextOutlined fontSize="small" />}
      aria-label="Page breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color={segments.length === 0 ? "text.primary" : "inherit"}
        sx={{ fontSize: "0.825rem", fontWeight: 600 }}
      >
        Home
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const name = pageNames[segment] ?? segment;

        return (
          <Typography
            key={segment}
            color={isLast ? "text.primary" : "text.secondary"}
            sx={{ fontSize: "0.825rem", fontWeight: isLast ? 600 : 400 }}
          >
            {name}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}
