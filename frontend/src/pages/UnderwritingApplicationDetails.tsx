
import {
  ArrowBackOutlined,
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  GavelOutlined,
  PersonOutlineOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUnderwritingApplication,
} from "../services/underwritingApi";
import { getMember } from "../services/membersApi";
import type { UnderwritingApplication } from "../types/underwriting";
import type { Member } from "../types/member";

const medicalHistory = {
  conditions: [
    "Hypertension",
    "Hyperlipidemia",
  ],
  medications: [
    "Amlodipine",
    "Atorvastatin",
  ],
  smoker: "No",
  bmi: "27.3",
  familyHistory: "Coronary Artery Disease",
  lastMedicalExam: "2026-06-18",
};

const coverageRecommendation = {
  aiRecommendation: "Standard Coverage",
  coverageDecision: "Comprehensive",
  monthlyPremium: "SAR 1,250",
  premiumLoading: "15%",
  waitingPeriod: "90 Days",
  policyRider: "Critical Illness Rider",
  exclusions: "Pre-existing Cardiac Disease",
  annualPremium: "SAR 15,000",
  lifetimeValue: "SAR 126,000",
};

const evidenceWorkspace = {
  laboratoryResults: [
    { name: "Complete Blood Count", status: "Available" },
    { name: "HbA1c", status: "Available" },
    { name: "Lipid Profile", status: "Available" },
    { name: "Liver Function Test", status: "Available" },
    { name: "Kidney Function Test", status: "Available" },
    { name: "Echocardiogram", status: "Pending" },
  ],

  documents: [
    "Physician Report",
    "Hospital Discharge Summary",
    "ECG Report",
    "Chest X-ray",
  ],

  aiSummary: [
    "Hypertension is well controlled.",
    "Mild hyperlipidemia under treatment.",
    "No evidence of diabetes mellitus.",
    "No active smoking history.",
    "Overall cardiovascular risk remains moderate.",
    "Clinical documentation supports standard coverage.",
  ],

  checklist: [
    "Identity Verified",
    "Medical History Complete",
    "Laboratory Results Reviewed",
    "Fraud Screening Passed",
    "Financial Declaration Complete",
  ],
};


const underwritingDecision = {
  aiRecommendation: "Approve with Premium Loading",
  finalDecision: "Pending Underwriter Approval",
  riskClass: "Moderate Risk",
  approvedCoverage: "Comprehensive Health Plan",
  approvedPremium: "SAR 1,250 / month",
  premiumLoading: "15%",
  decisionRationale:
    "Applicant demonstrates controlled hypertension and treated hyperlipidemia. Clinical evidence supports acceptance with moderate premium loading and targeted coverage conditions.",
  humanOversight: "Required",
  decisionOwner: "Senior Medical Underwriter",
  reviewDeadline: "2026-07-25",
};


function getMemberName(member: Member): string {
  return [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function calculateAge(dateOfBirth: string): string {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return "—";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return `${age}`;
}

function getRiskLabel(score: number | null): string {
  if (score === null) {
    return "Not Scored";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
}

function getRecommendationLabel(
  application: UnderwritingApplication,
): string {
  if (application.ai_recommendation) {
    return application.ai_recommendation
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return "Pending AI Recommendation";
}

export default function UnderwritingApplicationDetails() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [application, setApplication] =
    useState<UnderwritingApplication | null>(null);

  const [member, setMember] =
    useState<Member | null>(null);

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadApplication360() {
      if (!applicationId) {
        setError("No underwriting application identifier was provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const applicationData =
          await getUnderwritingApplication(
            decodeURIComponent(applicationId),
          );

        const memberData =
          await getMember(applicationData.member_id);

        if (!active) {
          return;
        }

        setApplication(applicationData);
        setMember(memberData);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load underwriting application.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadApplication360();

    return () => {
      active = false;
    };
  }, [applicationId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 420,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Loading underwriting application...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !application || !member) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Underwriting application could not be loaded
        </Typography>

        <Alert severity="error" sx={{ mt: 2 }}>
          {error ?? "The selected underwriting application was not found."}
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={() => navigate("/medical-underwriting")}
          sx={{ mt: 2, fontWeight: 800 }}
        >
          Back to Underwriting
        </Button>
      </Paper>
    );
  }

  const riskScore = application.risk_score;
  const recommendation = getRecommendationLabel(application);

  return (
    <Box>
      <Button
        startIcon={<ArrowBackOutlined />}
        onClick={() => navigate("/medical-underwriting")}
        sx={{ mb: 2, fontWeight: 800 }}
      >
        Back to Applications
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Underwriting Application
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            {application.application_number} · {application.product}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.75,
              color: "text.secondary",
            }}
          >
            Assigned to {application.assigned_underwriter ?? "Unassigned"} ·
            Status {application.status.replaceAll("_", " ")}
          </Typography>
        </Box>

        <Chip
          label={recommendation}
          color={
            (riskScore ?? 0) >= 70
              ? "warning"
              : (riskScore ?? 0) >= 40
                ? "primary"
                : "success"
          }
          sx={{ fontWeight: 900 }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
          },
          gap: 3,
        }}
      >
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
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonOutlineOutlined color="primary" />

            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Applicant 360
            </Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              p: 2.5,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {[
              ["Applicant", getMemberName(member)],
              ["Member Number", member.member_number],
              ["Age", calculateAge(member.date_of_birth)],
              ["Gender", member.gender],
              ["Occupation", "Not yet available"],
              ["Country", member.country],
              ["Product", application.product],
              ["Current Risk", getRiskLabel(riskScore)],
            ].map(([label, value]) => (
              <Box key={label}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {label}
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.4 }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

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
              alignItems: "center",
              gap: 1,
            }}
          >
            <AutoAwesomeOutlined color="primary" />

            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              AI Risk Assessment
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Overall Risk Score
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mt: 0.5,
                color:
                  (riskScore ?? 0) >= 70
                    ? "error.main"
                    : (riskScore ?? 0) >= 40
                      ? "warning.main"
                      : "success.main",
              }}
            >
              {riskScore ?? "Not Scored"}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: "grid", gap: 1.75 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  AI Recommendation
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 900 }}>
                  {recommendation}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Clinical Summary
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 900 }}>
                  {application.clinical_summary ?? "Not yet available"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Governance
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 900 }}>
                  Human review required
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
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
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShieldOutlined color="primary" />

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Medical History & Clinical Risk Summary
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2,minmax(0,1fr))",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800 }}
            >
              Existing Conditions
            </Typography>

            <Typography variant="body2">
              {medicalHistory.conditions.join(", ")}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{ mt: 2, fontWeight: 800 }}
            >
              Current Medications
            </Typography>

            <Typography variant="body2">
              {medicalHistory.medications.join(", ")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">
              <strong>BMI:</strong> {medicalHistory.bmi}
            </Typography>

            <Typography variant="body2">
              <strong>Smoking Status:</strong> {medicalHistory.smoker}
            </Typography>

            <Typography variant="body2">
              <strong>Family History:</strong> {medicalHistory.familyHistory}
            </Typography>

            <Typography variant="body2">
              <strong>Last Medical Exam:</strong>{" "}
              {medicalHistory.lastMedicalExam}
            </Typography>
          </Box>
        </Box>
      </Paper>
            <Paper
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              md: "row",
            },
            bgcolor: "background.default",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Coverage & Premium Recommendation
            </Typography>

            <Typography variant="body2" color="text.secondary">
              AI-supported underwriting pricing, coverage terms, and business value
              assessment.
            </Typography>
          </Box>

          <Chip
            label={coverageRecommendation.aiRecommendation}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,minmax(0,1fr))",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Coverage Decision
            </Typography>

            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 900 }}>
              {coverageRecommendation.coverageDecision}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Monthly Premium
            </Typography>

            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 900 }}>
              {coverageRecommendation.monthlyPremium}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Premium Loading
            </Typography>

            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 900 }}>
              +{coverageRecommendation.premiumLoading}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Waiting Period
            </Typography>

            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
              {coverageRecommendation.waitingPeriod}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Policy Rider
            </Typography>

            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
              {coverageRecommendation.policyRider}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Coverage Exclusion
            </Typography>

            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
              {coverageRecommendation.exclusions}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2,minmax(0,1fr))",
            },
            gap: 2,
            bgcolor: "background.default",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Expected Annual Premium
            </Typography>

            <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 900 }}>
              {coverageRecommendation.annualPremium}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Projected Customer Lifetime Value
            </Typography>

            <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 900 }}>
              {coverageRecommendation.lifetimeValue}
            </Typography>
          </Box>
        </Box>
      </Paper>

            <Paper
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Evidence & Clinical Documentation
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Clinical evidence supporting the underwriting recommendation.
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0,1fr))",
            },
            gap: 3,
          }}
        >
          {/* Laboratory Results */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, mb: 2 }}
            >
              Laboratory Results
            </Typography>

            {evidenceWorkspace.laboratoryResults.map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2">
                  {item.name}
                </Typography>

                <Chip
                  size="small"
                  label={item.status}
                  color={
                    item.status === "Available"
                      ? "success"
                      : "warning"
                  }
                />
              </Box>
            ))}
          </Box>

          {/* Supporting Documents */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, mb: 2 }}
            >
              Supporting Documents
            </Typography>

            {evidenceWorkspace.documents.map((doc) => (
              <Typography
                key={doc}
                variant="body2"
                sx={{ mb: 1.5 }}
              >
                📄 {doc}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            AI Clinical Summary
          </Typography>

          {evidenceWorkspace.aiSummary.map((summary) => (
            <Typography
              key={summary}
              variant="body2"
              sx={{ mb: 1 }}
            >
              • {summary}
            </Typography>
          ))}
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            Underwriter Checklist
          </Typography>

          {evidenceWorkspace.checklist.map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <CheckCircleOutlined
                color="success"
                fontSize="small"
              />

              <Typography variant="body2">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <GavelOutlined color="primary" />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Final Underwriting Decision
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Human-reviewed decision, rationale, accountability, and approval
                controls.
              </Typography>
            </Box>
          </Box>

          <Chip
            label={underwritingDecision.finalDecision}
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {[
            ["AI Recommendation", underwritingDecision.aiRecommendation],
            ["Risk Classification", underwritingDecision.riskClass],
            ["Human Oversight", underwritingDecision.humanOversight],
            ["Approved Coverage", underwritingDecision.approvedCoverage],
            ["Approved Premium", underwritingDecision.approvedPremium],
            ["Premium Loading", `+${underwritingDecision.premiumLoading}`],
          ].map(([label, value]) => (
            <Box
              key={label}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>

              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            Decision Rationale
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {underwritingDecision.decisionRationale}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            bgcolor: "background.default",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">Decision Owner</Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
              {underwritingDecision.decisionOwner}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">Review Deadline</Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 800 }}>
              {underwritingDecision.reviewDeadline}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Button variant="outlined" color="error">Decline Application</Button>
          <Button variant="outlined">Request More Evidence</Button>
          <Button variant="contained">Approve Underwriting Decision</Button>
        </Box>
      </Paper>
    </Box>
  );
}
