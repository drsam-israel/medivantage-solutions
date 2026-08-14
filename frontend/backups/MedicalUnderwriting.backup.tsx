import {
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  PersonSearchOutlined,
  ScheduleOutlined,
  ShieldOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { members } from "../data/insuranceDemoData";
import ModuleHero from "../components/shared/ModuleHero";
import { moduleHeroGradients } from "../theme/moduleHeroGradients";

type UnderwritingStatus =
  | "Pending Review"
  | "AI Review"
  | "Manual Review"
  | "Approved";

interface UnderwritingApplication {
  id: string;
  memberId: string;
  product: string;
  submittedDate: string;
  riskScore: number;
  status: UnderwritingStatus;
  assignedUnderwriter: string;
}

const applications: UnderwritingApplication[] = [
  {
    id: "UW-2026-10021",
    memberId: "MBR-10021",
    product: "Comprehensive Family Health Plan",
    submittedDate: "21 Jul 2026",
    riskScore: 24,
    status: "Pending Review",
    assignedUnderwriter: "Dr. Nora Al-Salem",
  },
  {
    id: "UW-2026-10022",
    memberId: "MBR-10022",
    product: "Executive Medical Plan",
    submittedDate: "20 Jul 2026",
    riskScore: 48,
    status: "AI Review",
    assignedUnderwriter: "Dr. Nora Al-Salem",
  },
  {
    id: "UW-2026-10023",
    memberId: "MBR-10023",
    product: "Individual Premium Plan",
    submittedDate: "19 Jul 2026",
    riskScore: 18,
    status: "Approved",
    assignedUnderwriter: "Dr. Samuel Israel",
  },
  {
    id: "UW-2026-10024",
    memberId: "MBR-10024",
    product: "Comprehensive Medical Plan",
    submittedDate: "18 Jul 2026",
    riskScore: 76,
    status: "Manual Review",
    assignedUnderwriter: "Dr. Samuel Israel",
  },
];

function getRiskLabel(score: number) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getRiskColor(score: number): "success" | "warning" | "error" {
  if (score >= 70) return "error";
  if (score >= 40) return "warning";
  return "success";
}

function getStatusColor(
  status: UnderwritingStatus,
): "default" | "primary" | "warning" | "success" {
  if (status === "Approved") return "success";
  if (status === "AI Review") return "primary";
  if (status === "Manual Review") return "warning";
  return "default";
}

export default function MedicalUnderwriting() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const applicationRows = useMemo(() => {
    return applications
      .map((application) => {
        const member = members.find(
          (item) => item.id === application.memberId,
        );

        return {
          ...application,
          member,
        };
      })
      .filter((application) => {
        const searchValue = searchTerm.toLowerCase();

        return (
          application.id.toLowerCase().includes(searchValue) ||
          application.member?.fullName.toLowerCase().includes(searchValue) ||
          application.product.toLowerCase().includes(searchValue) ||
          application.status.toLowerCase().includes(searchValue)
        );
      });
  }, [searchTerm]);

  const highRiskCount = applications.filter(
    (application) => application.riskScore >= 70,
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "Approved",
  ).length;

  const pendingCount = applications.filter(
    (application) => application.status !== "Approved",
  ).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Medical Underwriting
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mt: 0.75 }}
        >
          Assess applicant health risk, clinical evidence and policy
          recommendations.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Applications",
            value: applications.length,
            supportingText: "Current underwriting queue",
            icon: <PersonSearchOutlined />,
          },
          {
            label: "Pending Review",
            value: pendingCount,
            supportingText: "Requires underwriting action",
            icon: <ScheduleOutlined />,
          },
          {
            label: "High Risk",
            value: highRiskCount,
            supportingText: "Manual review required",
            icon: <WarningAmberOutlined />,
          },
          {
            label: "Approval Rate",
            value: `${Math.round(
              (approvedCount / applications.length) * 100,
            )}%`,
            supportingText: "Current demo portfolio",
            icon: <CheckCircleOutlined />,
          },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2.25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 700 }}
                >
                  {item.label}
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    mt: 0.75,
                  }}
                >
                  {item.supportingText}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "primary.50",
                  color: "primary.main",
                }}
              >
                {item.icon}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Underwriting Applications Queue
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Review applicant risk, clinical history and policy
              recommendations.
            </Typography>
          </Box>

          <TextField
            size="small"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search applications..."
            sx={{ minWidth: { md: 300 } }}
          />
        </Box>

        <Divider />

        <Box sx={{ overflowX: "auto" }}>
          <Box
            sx={{
              minWidth: 1050,
              display: "grid",
              gridTemplateColumns:
                "150px 220px minmax(220px, 1fr) 130px 150px 190px 130px",
              gap: 1.5,
              px: 2.5,
              py: 1.5,
              bgcolor: "background.default",
            }}
          >
            {[
              "Application",
              "Applicant",
              "Product",
              "Risk",
              "Status",
              "Assigned Underwriter",
              "Action",
            ].map((heading) => (
              <Typography
                key={heading}
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {heading}
              </Typography>
            ))}
          </Box>

          {applicationRows.map((application) => (
            <Box
              key={application.id}
              sx={{
                minWidth: 1050,
                display: "grid",
                gridTemplateColumns:
                  "150px 220px minmax(220px, 1fr) 130px 150px 190px 130px",
                gap: 1.5,
                alignItems: "center",
                px: 2.5,
                py: 1.75,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 900 }}>
                  {application.id}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary" }}
                >
                  {application.submittedDate}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {application.member?.fullName}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary" }}
                >
                  {application.member?.occupation}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {application.product}
              </Typography>

              <Box>
                <Chip
                  label={`${getRiskLabel(
                    application.riskScore,
                  )} - ${application.riskScore}`}
                  color={getRiskColor(application.riskScore)}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Chip
                label={application.status}
                color={getStatusColor(application.status)}
                size="small"
                variant={
                  application.status === "Pending Review"
                    ? "outlined"
                    : "filled"
                }
                sx={{ fontWeight: 800, justifySelf: "start" }}
              />

              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {application.assignedUnderwriter}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  navigate(`/medical-underwriting/${application.id}`)
                }
                sx={{ fontWeight: 800 }}
              >
                Open
              </Button>
            </Box>
          ))}

          {applicationRows.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: 800 }}>
                No applications found
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Try a different applicant, application ID or status.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mt: 3,
        }}
      >
        {[
          {
            title: "AI-Assisted Risk Assessment",
            description:
              "Applicant risk scoring, medical evidence review and recommendation support.",
            icon: <AutoAwesomeOutlined color="primary" />,
          },
          {
            title: "Clinical Governance",
            description:
              "Human underwriting review remains mandatory for final decisions.",
            icon: <ShieldOutlined color="primary" />,
          },
          {
            title: "Portfolio Insight",
            description:
              "Track approval patterns, high-risk applications and underwriting performance.",
            icon: <TrendingUpOutlined color="primary" />,
          },
        ].map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2.25,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.25 }}>
              {item.icon}

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}