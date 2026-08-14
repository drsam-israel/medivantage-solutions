import {
  CheckCircleOutlined,
  CloudOffOutlined,
  SyncOutlined,
} from "@mui/icons-material";

import {
  Chip,
  Tooltip,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  getHealthStatus,
} from "../../services/healthApi";

type ApiStatus =
  | "checking"
  | "healthy"
  | "unavailable";

export default function ApiStatusIndicator() {
  const [status, setStatus] =
    useState<ApiStatus>("checking");

  const [serviceVersion, setServiceVersion] =
    useState<string | undefined>();

  useEffect(() => {
    let active = true;

    const checkApiHealth = async () => {
      try {
        const response =
          await getHealthStatus();

        if (!active) {
          return;
        }

        setStatus(
          response.status === "healthy"
            ? "healthy"
            : "unavailable",
        );

        setServiceVersion(
          response.version,
        );
      } catch {
        if (active) {
          setStatus("unavailable");
        }
      }
    };

    void checkApiHealth();

    const intervalId =
      window.setInterval(
        checkApiHealth,
        60_000,
      );

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (status === "checking") {
    return (
      <Tooltip title="Checking MediVantage API connection">
        <Chip
          icon={<SyncOutlined />}
          label="Connecting to API"
          size="small"
          variant="outlined"
          sx={{
            color: "#52657A",
            borderColor: "#CBD5E1",
            backgroundColor: "#FFFFFF",

            "& .MuiChip-icon": {
              color: "#64748B",
            },
          }}
        />
      </Tooltip>
    );
  }

  if (status === "unavailable") {
    return (
      <Tooltip title="The MediVantage API could not be reached">
        <Chip
          icon={<CloudOffOutlined />}
          label="API Unavailable"
          size="small"
          variant="outlined"
          sx={{
            color: "#B42318",
            borderColor: "#FDA29B",
            backgroundColor: "#FFF5F5",

            "& .MuiChip-icon": {
              color: "#D92D20",
            },
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        serviceVersion
          ? `MediVantage API version ${serviceVersion}`
          : "MediVantage API is operational"
      }
    >
      <Chip
        icon={<CheckCircleOutlined />}
        label="API Operational"
        size="small"
        variant="outlined"
        sx={{
          color: "#067647",
          borderColor: "#ABEFC6",
          backgroundColor: "#ECFDF3",

          "& .MuiChip-icon": {
            color: "#079455",
          },
        }}
      />
    </Tooltip>
  );
}