import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import ClaimDetails from "./pages/ClaimDetails";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import MedicalUnderwriting from "./pages/MedicalUnderwriting";
import UnderwritingApplicationDetails from "./pages/UnderwritingApplicationDetails";
import PriorAuthorizationDashboard from "./pages/PriorAuthorizationDashboard";
import PriorAuthorizationDetails from "./pages/PriorAuthorizationDetails";
import PolicyAdministrationDashboard from "./pages/PolicyAdministrationDashboard";
import PolicyDetails from "./pages/PolicyDetails";
import ProviderNetworkDashboard from "./pages/ProviderNetworkDashboard";
import ProviderDetails from "./pages/ProviderDetails";
import PaymentManagementDashboard from "./pages/PaymentManagementDashboard";
import PaymentDetails from "./pages/PaymentDetails";
import FraudInvestigationDashboard from "./pages/FraudInvestigationDashboard";
import FraudCaseDetails from "./pages/FraudCaseDetails";
import AIInsightsDashboard from "./pages/AIInsightsDashboard";
import AIInsightDetails from "./pages/AIInsightDetails";
import PlatformSettings from "./pages/PlatformSettings";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="claims"
            element={<Claims />}
          />

          <Route
            path="claims/:claimId"
            element={<ClaimDetails />}
          />

          <Route
            path="members"
            element={<Members />}
          />

          <Route
            path="members/:memberId"
            element={<MemberDetails />}
          />

          <Route
            path="medical-underwriting"
            element={<MedicalUnderwriting />}
          />

          <Route
            path="medical-underwriting/:applicationId"
            element={
              <UnderwritingApplicationDetails />
            }
          />

          <Route
            path="prior-authorization"
            element={
              <PriorAuthorizationDashboard />
            }
          />

          <Route
            path="prior-authorization/:authorizationId"
            element={
              <PriorAuthorizationDetails />
            }
          />

          <Route
            path="policy-administration"
            element={
              <PolicyAdministrationDashboard />
            }
          />

          <Route
            path="policy-administration/:policyId"
            element={<PolicyDetails />}
          />

          <Route
            path="provider-network"
            element={
              <ProviderNetworkDashboard />
            }
          />

          <Route
            path="provider-network/:providerId"
            element={<ProviderDetails />}
          />

          <Route
            path="payments"
            element={
              <PaymentManagementDashboard />
            }
          />

          <Route
            path="payments/:paymentId"
            element={<PaymentDetails />}
          />

          <Route
            path="fraud-investigations"
            element={
              <FraudInvestigationDashboard />
            }
          />

          <Route
            path="fraud-investigations/:caseId"
            element={<FraudCaseDetails />}
          />

          <Route
            path="ai-insights"
            element={<AIInsightsDashboard />}
          />

          <Route
            path="ai-insights/:insightId"
            element={<AIInsightDetails />}
          />

          <Route
            path="profile"
            element={<UserProfile />}
          />

          <Route
            path="settings"
            element={<PlatformSettings />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}