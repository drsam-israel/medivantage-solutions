import {
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  GppGoodOutlined,
  PaymentsOutlined,
  PsychologyOutlined,
  ShieldOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

interface FinancialMetricProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

function FinancialMetric({
  label,
  value,
  emphasized = false,
}: FinancialMetricProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: emphasized ? "success.light" : "divider",
        bgcolor: emphasized ? "success.50" : "background.paper",
        borderRadius: 2,
        p: 1.75,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: emphasized ? "success.dark" : "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

interface ValidationItemProps {
  label: string;
}

function ValidationItem({ label }: ValidationItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TaskAltOutlined color="success" fontSize="small" />

      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
    </Box>
  );
}

interface AiIndicatorProps {
  label: string;
  value: string;
  color?: "success" | "warning" | "error" | "primary";
}

function AiIndicator({
  label,
  value,
  color = "success",
}: AiIndicatorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        py: 1.2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>

      <Chip
        label={value}
        color={color}
        size="small"
        variant={color === "primary" ? "filled" : "outlined"}
        sx={{ fontWeight: 800 }}
      />
    </Box>
  );
}

export default function FinancialAdjudication() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          xl: "minmax(0, 1fr) minmax(0, 1fr)",
        },
        gap: 3,
        mt: 3,
        alignItems: "start",
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
            gap: 1.25,
          }}
        >
          <PaymentsOutlined color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Financial Adjudication
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Benefit calculations, member liability and recommended payment
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            <FinancialMetric label="Claim Amount" value="SAR 18,500" />
            <FinancialMetric label="Covered Amount" value="SAR 16,800" />
            <FinancialMetric label="Deductible" value="SAR 500" />
            <FinancialMetric label="Co-payment" value="SAR 1,200" />
            <FinancialMetric label="Coinsurance" value="SAR 0" />
            <FinancialMetric
              label="Recommended Payment"
              value="SAR 16,300"
              emphasized
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              border: "1px solid",
              borderColor: "primary.light",
              borderRadius: 2,
              p: 2,
              bgcolor: "primary.50",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
              }}
            >
              Remaining Annual Benefit
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.5,
                fontWeight: 900,
                color: "primary.main",
              }}
            >
              SAR 183,700
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Annual Benefit Utilization
                </Typography>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  SAR 66,300 used from SAR 250,000 annual limit
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: "primary.main" }}
              >
                27%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={27}
              sx={{
                height: 10,
                borderRadius: 10,
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Policy and Benefit Validation
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <ValidationItem label="Policy Active" />
              <ValidationItem label="Member Eligible" />
              <ValidationItem label="Waiting Period Passed" />
              <ValidationItem label="Benefit Available" />
              <ValidationItem label="Network Provider" />
              <ValidationItem label="Coverage Verified" />
              <ValidationItem label="Annual Limit Available" />
              <ValidationItem label="Emergency Waiver Valid" />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "primary.light",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            bgcolor: "primary.50",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <AutoAwesomeOutlined color="primary" />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                MediVantage AI™
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Explainable AI-assisted claims decision support
              </Typography>
            </Box>
          </Box>

          <Chip
            label="AI Review Complete"
            color="success"
            icon={<CheckCircleOutlined />}
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              textAlign: "center",
              border: "1px solid",
              borderColor: "success.light",
              bgcolor: "success.50",
              borderRadius: 3,
              p: 2.5,
              mb: 2.5,
            }}
          >
            <PsychologyOutlined
              color="success"
              sx={{ fontSize: 38, mb: 0.5 }}
            />

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Approval Probability
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: "success.dark",
                lineHeight: 1.1,
                my: 0.75,
              }}
            >
              94%
            </Typography>

            <Chip
              label="RECOMMEND APPROVAL"
              color="success"
              sx={{ fontWeight: 900 }}
            />
          </Box>

          <AiIndicator label="Fraud Risk" value="LOW" color="success" />
          <AiIndicator
            label="Duplicate Claim"
            value="NONE DETECTED"
            color="success"
          />
          <AiIndicator
            label="Medical Necessity"
            value="SUPPORTED"
            color="success"
          />
          <AiIndicator
            label="Coverage Validation"
            value="PASSED"
            color="success"
          />
          <AiIndicator
            label="Policy Compliance"
            value="PASSED"
            color="success"
          />
          <AiIndicator
            label="Provider Network"
            value="IN NETWORK"
            color="primary"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
              AI Risk Indicators
            </Typography>

            <Box sx={{ mb: 1.75 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.6,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Fraud Risk
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  8%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={8}
                color="success"
                sx={{ height: 8, borderRadius: 10 }}
              />
            </Box>

            <Box sx={{ mb: 1.75 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.6,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Duplicate Risk
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  3%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={3}
                color="success"
                sx={{ height: 8, borderRadius: 10 }}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.6,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Clinical Confidence
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  96%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={96}
                color="primary"
                sx={{ height: 8, borderRadius: 10 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <GppGoodOutlined color="primary" />

              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Explainable Decision Factors
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.25,
              }}
            >
              <ValidationItem label="Emergency admission verified" />
              <ValidationItem label="Diagnosis covered" />
              <ValidationItem label="Procedure covered" />
              <ValidationItem label="Policy active" />
              <ValidationItem label="Benefits available" />
              <ValidationItem label="No duplicate detected" />
              <ValidationItem label="Medical necessity supported" />
              <ValidationItem label="Documentation substantially complete" />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              border: "1px solid",
              borderColor: "primary.light",
              bgcolor: "primary.50",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <ShieldOutlined color="primary" />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  Executive Recommendation
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.6,
                    lineHeight: 1.7,
                  }}
                >
                  The claim satisfies the applicable clinical, policy and
                  financial conditions. No material fraud or duplication
                  indicators were detected. Approval is recommended after
                  confirmation of the outstanding pathology report.
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1.25,
                    color: "primary.main",
                    fontWeight: 800,
                  }}
                >
                  Estimated remaining processing time: 12 minutes
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}