import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page not found</Typography>

      <Typography color="text.secondary">
        The requested MediVantage module is not yet available.
      </Typography>

      <Button component={Link} to="/" variant="contained">
        Return to Dashboard
      </Button>
    </Box>
  );
}
