import type {
  AIRecommendation,
  AuthorizationPriority,
  AuthorizationStatus,
  PriorAuthorizationRequest,
} from "../data/priorAuthorizationDemoData";

import type {
  EnrichedPriorAuthorization,
} from "../services/priorAuthorizationEnrichment";

import type {
  PriorAuthorization,
} from "../types/priorAuthorization";

import type {
  Member,
} from "../types/member";

import type {
  Provider,
} from "../types/provider";

export type LivePriorAuthorizationRequest =
  PriorAuthorizationRequest & {
    backendId: string;
  };

function mapStatus(
  status: PriorAuthorization["status"],
): AuthorizationStatus {
  switch (status) {
    case "APPROVED":
      return "Approved";

    case "DENIED":
      return "Denied";

    case "MORE_INFORMATION_REQUIRED":
      return "More Information Required";

    case "ESCALATED":
      return "Escalated";

    case "PENDING_REVIEW":
    default:
      return "Pending Review";
  }
}

function mapPriority(
  priority: string,
): AuthorizationPriority {
  switch (priority.toUpperCase()) {
    case "EMERGENCY":
      return "Emergency";

    case "URGENT":
      return "Urgent";

    case "HIGH":
      return "High";

    default:
      return "Routine";
  }
}

function mapRecommendation(
  recommendation: string | null,
): AIRecommendation {
  switch (recommendation?.toUpperCase()) {
    case "DENY":
      return "Deny";

    case "REQUEST_MORE_INFORMATION":
      return "Request More Information";

    case "ESCALATE":
    case "ESCALATE_TO_MEDICAL_DIRECTOR":
      return "Escalate to Medical Director";

    case "APPROVE":
    default:
      return "Approve";
  }
}

function calculateAge(
  dateOfBirth: string | null | undefined,
): number {
  if (!dateOfBirth) {
    return 0;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function mapGender(
  member: Member | null,
): "Male" | "Female" {
  return member?.gender?.trim().toUpperCase() ===
    "FEMALE"
    ? "Female"
    : "Male";
}

function mapNetworkStatus(
  provider: Provider | null,
): "In Network" | "Out of Network" {
  const normalized =
    provider?.network_status
      ?.trim()
      .toUpperCase()
      .replaceAll("-", "_")
      .replaceAll(" ", "_");

  return normalized === "OUT_OF_NETWORK"
    ? "Out of Network"
    : "In Network";
}

function getMemberName(
  member: Member | null,
): string {
  if (!member) {
    return "Member details unavailable";
  }

  const fullName = [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value?.trim()),
    )
    .join(" ");

  return (
    fullName ||
    member.member_number ||
    "Member details unavailable"
  );
}

function getProviderName(
  provider: Provider | null,
): string {
  return (
    provider?.provider_name?.trim() ||
    "Provider details unavailable"
  );
}

export function mapPriorAuthorizationToDashboard(
  enriched: EnrichedPriorAuthorization,
): LivePriorAuthorizationRequest {
  const {
    authorization,
    member,
    provider,
    enrollment,
  } = enriched;

  const serviceCovered =
    authorization.service_covered
      ?.toUpperCase() === "YES";

  const authorizationRequired =
    authorization.authorization_required
      ?.toUpperCase() === "YES";

  return {
    backendId: authorization.id,

    authorizationId:
      authorization.authorization_number,

    requestDate:
      authorization.created_at,

    priority:
      mapPriority(
        authorization.priority,
      ),

    status:
      mapStatus(
        authorization.status,
      ),

    assignedReviewer:
      authorization.assigned_reviewer ??
      authorization.decided_by ??
      "Unassigned",

    reviewDueDate:
      authorization.review_due_at ??
      authorization.updated_at,

    member: {
      memberId:
        member?.member_number ??
        authorization.member_id,

      fullName:
        getMemberName(member),

      age:
        calculateAge(
          member?.date_of_birth,
        ),

      gender:
        mapGender(member),

      policyNumber:
        enrollment?.policy_number ??
        "Not available",

      planName:
        "Not available",

      employerGroup:
        enrollment?.employer_name ??
        enrollment?.group_number ??
        "Not available",

      phoneNumber:
        "Not available",
    },

    provider: {
      providerId:
        provider?.provider_code ??
        authorization.provider_id,

      providerName:
        getProviderName(provider),

      physicianName:
        "Not available",

      specialty:
        provider?.specialty ??
        provider?.provider_type ??
        "Not available",

      facilityName:
        provider?.provider_name ??
        "Not available",

      city:
        provider?.city ??
        provider?.region ??
        "Not available",

      networkStatus:
        mapNetworkStatus(provider),
    },

    clinical: {
      primaryDiagnosis: {
        code:
          authorization.diagnosis_code ??
          "N/A",

        description:
          authorization.diagnosis_description ??
          "Diagnosis description unavailable",
      },

      secondaryDiagnoses: [],

      requestedProcedure: {
        code:
          authorization.procedure_code ??
          "N/A",

        description:
          authorization.procedure_description,
      },

      serviceCategory:
        authorization.benefit_category ??
        "Not available",

      symptoms: [],

      clinicalNotes:
        authorization.clinical_summary ??
        "",

      comorbidities: [],

      previousTreatments: [],

      currentMedications: [],

      requestedServiceDate:
        authorization.requested_service_date ??
        "",
    },

    coverage: {
      policyStatus:
        authorization.coverage_status
          ?.toUpperCase() === "ACTIVE"
          ? "Active"
          : "Coverage Verification Required",

      benefitCovered:
        serviceCovered,

      preAuthorizationRequired:
        authorizationRequired,

      waitingPeriodSatisfied:
        false,

      annualBenefitLimit:
        0,

      utilizedBenefitAmount:
        0,

      remainingBenefitAmount:
        0,

      estimatedMemberCopay:
        0,

      coverageNotes:
        enrollment
          ? `Policy ${enrollment.policy_number} is linked to this authorization. Enrollment status: ${enrollment.enrollment_status}.`
          : "Coverage values shown are limited to data currently returned by the Prior Authorization API.",
    },

    documents: [],

    aiAssessment: {
      recommendation:
        mapRecommendation(
          authorization.ai_recommendation,
        ),

      confidence:
        authorization.ai_confidence ??
        0,

      medicalNecessityScore:
        authorization.medical_necessity_score ??
        0,

      evidenceStrength:
        authorization.medical_necessity_score !== null &&
        authorization.medical_necessity_score >= 80
          ? "Strong"
          : authorization.medical_necessity_score !== null &&
              authorization.medical_necessity_score >= 60
            ? "Moderate"
            : "Limited",

      summary:
        authorization.ai_rationale ??
        "No AI rationale available.",

      clinicalFactors: [],
      guidelineReferences: [],
      riskFlags: [],

      modelName:
        "MediVantage Prior Authorization Intelligence",

      modelVersion:
        "MVP-1.0",

      reviewedByHuman:
        authorization.decided_at !== null,
    },

    timeline: [
      {
        id:
          `${authorization.id}-created`,

        timestamp:
          authorization.created_at,

        event:
          "Authorization Created",

        actor:
          "MediVantage Platform",

        details:
          "Prior authorization request created and persisted.",

        status:
          "Completed",
      },

      ...(
        authorization.decided_at
          ? [
              {
                id:
                  `${authorization.id}-decision`,

                timestamp:
                  authorization.decided_at,

                event:
                  authorization.final_decision ??
                  authorization.status,

                actor:
                  authorization.decided_by ??
                  "Clinical Reviewer",

                details:
                  authorization.decision_rationale ??
                  authorization.escalation_reason ??
                  authorization.information_requested ??
                  "Clinical review action recorded.",

                status:
                  "Completed" as const,
              },
            ]
          : []
      ),
    ],
  };
}