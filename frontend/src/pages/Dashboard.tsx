import {
  ArrowForwardOutlined,
  AssignmentTurnedInOutlined,
  DashboardOutlined,
  GroupsOutlined,
  HealthAndSafetyOutlined,
  InsightsOutlined,
  PaymentsOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import WorkspaceHeader from "../components/shared/WorkspaceHeader";
import ApiStatusIndicator from "../components/system/ApiStatusIndicator";

const kpis = [
  {
    label: "Active Members",
    value: "184,526",
    change: "+4.8%",
    icon: <GroupsOutlined />,
  },
  {
    label: "Open Claims",
    value: "12,840",
    change: "-2.3%",
    icon: <AssignmentTurnedInOutlined />,
  },
  {
    label: "Underwriting Cases",
    value: "1,284",
    change: "+7.1%",
    icon: <HealthAndSafetyOutlined />,
  },
  {
    label: "Claims Paid",
    value: "SAR 48.7M",
    change: "+5.6%",
    icon: <PaymentsOutlined />,
  },
];

const workflowItems = [
  {
    label: "Claims awaiting clinical review",
    value: 328,
    progress: 68,
    status: "High priority",
  },
  {
    label: "Underwriting cases pending decision",
    value: 146,
    progress: 44,
    status: "Review required",
  },
  {
    label: "Prior authorizations approaching SLA",
    value: 87,
    progress: 76,
    status: "Time sensitive",
  },
];

export default function Dashboard() {
  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <WorkspaceHeader
        eyebrow="ENTERPRISE COMMAND CENTER"
        title="Executive Dashboard"
        description="Enterprise overview of insurance operations, clinical risk, financial performance and AI-enabled decision intelligence."
        icon={<DashboardOutlined />}
        context="MediVantage Insurance Operations"
        updatedText="Updated moments ago"
        statusLabel="Live Operations"
        statusTone="success"
        stats={[
          {
            label: "Active Members",
            value: "184,526",
            icon: <GroupsOutlined />,
            tone: "primary",
          },
          {
            label: "Open Claims",
            value: "12,840",
            icon: <AssignmentTurnedInOutlined />,
            tone: "warning",
          },
          {
            label: "AI Alerts",
            value: "10",
            icon: <InsightsOutlined />,
            tone: "info",
          },
        ]}
        actions={[
          {
            label: "Executive Report",
            icon: <ArrowForwardOutlined />,
            onClick: () => {
              console.log("Open executive report");
            },
            prominent: true,
          },
          {
            label: "Analytics",
            icon: <TrendingUpOutlined />,
            onClick: () => {
              console.log("Open enterprise analytics");
            },
            variant: "outlined",
          },
        ]}
      />

      <Box
        sx={{
          mt: 2,
          mb: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ApiStatusIndicator />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2.5,
        }}
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.label}
                  </Typography>

                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {kpi.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    color: "primary.main",
                    backgroundColor: "rgba(11,79,138,0.08)",
                  }}
                >
                  {kpi.icon}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mt: 2,
                }}
              >
                <TrendingUpOutlined color="success" sx={{ fontSize: 18 }} />

                <Typography
                  variant="caption"
                  sx={{
                    color: "success.main",
                    fontWeight: 700,
                  }}
                >
                  {kpi.change}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  vs previous month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.5fr) minmax(320px, 0.8fr)",
          },
          gap: 2.5,
          mt: 2.5,
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h5">Operational Performance</Typography>

                <Typography variant="body2" color="text.secondary">
                  Current workload and service-level exposure
                </Typography>
              </Box>

              <Chip
                label="Live operations"
                color="success"
                variant="outlined"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {workflowItems.map((item) => (
                <Box key={item.label}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{item.label}</Typography>

                      <Typography variant="caption" color="text.secondary">
                        {item.status}
                      </Typography>
                    </Box>

                    <Typography variant="h6">{item.value}</Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{
                      height: 8,
                      borderRadius: 10,
                      backgroundColor: "#EEF2F6",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5">Insurance Health Score</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Composite operational, clinical and financial performance
            </Typography>

            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 160,
                height: 160,
                mx: "auto",
                my: 3,
                borderRadius: "50%",
                border: "14px solid",
                borderColor: "secondary.main",
                backgroundColor: "#F7FFFF",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2">87</Typography>

                <Typography variant="caption" color="text.secondary">
                  OUT OF 100
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {[
                ["Claims efficiency", "91%"],
                ["Underwriting quality", "86%"],
                ["SLA compliance", "84%"],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">{label}</Typography>

                  <Typography variant="subtitle2">{value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}