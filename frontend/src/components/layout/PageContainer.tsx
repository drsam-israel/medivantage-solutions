import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import AppBreadcrumbs from "./Breadcrumbs";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  actions,
  children,
}: PageContainerProps) {
  return (
    <Box>
      <AppBreadcrumbs />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h3">{title}</Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && <Box>{actions}</Box>}
      </Box>

      {children}
    </Box>
  );
}
