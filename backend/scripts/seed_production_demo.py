from __future__ import annotations

import os
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import SessionLocal

# Import models explicitly so all SQLAlchemy relationships are registered.
from app.models.ai_insight import AIInsight
from app.models.claim import Claim
from app.models.claim_intelligence import ClaimIntelligence
from app.models.enrollment import Enrollment
from app.models.fraud_alert import FraudAlert
from app.models.fraud_case import FraudCase
from app.models.fraud_action import FraudAction
from app.models.fraud_evidence import FraudEvidence
from app.models.fraud_investigator_note import FraudInvestigatorNote
from app.models.fraud_recovery import FraudRecovery
from app.models.fraud_timeline_event import FraudTimelineEvent
from app.models.health_plan import HealthPlan
from app.models.member import Member
from app.models.policy import Policy
from app.models.prior_authorization import PriorAuthorization
from app.models.provider import Provider
from app.models.reimbursement import Reimbursement
from app.models.underwriting_application import UnderwritingApplication


SEED_CONFIRMATION = "PRODUCTION_DEMO"


def require_confirmation() -> None:
    """
    Prevent accidental execution.

    Run only when SEED_CONFIRM=PRODUCTION_DEMO has been
    explicitly set in the current terminal session.
    """

    confirmation = os.getenv("SEED_CONFIRM", "")

    if confirmation != SEED_CONFIRMATION:
        raise RuntimeError(
            "\nProduction demo seed blocked.\n\n"
            "Set the following environment variable first:\n\n"
            "    SEED_CONFIRM=PRODUCTION_DEMO\n\n"
            "Then run the script again.\n"
        )


def get_or_create(
    db: Session,
    model: type,
    lookup_field: str,
    lookup_value: Any,
    **values: Any,
):
    """
    Return an existing record or create it.

    This makes the demo seed safe to re-run without
    intentionally duplicating the seeded business records.
    """

    column = getattr(model, lookup_field)

    existing = db.execute(
        select(model).where(
            column == lookup_value,
        )
    ).scalar_one_or_none()

    if existing is not None:
        return existing, False

    record = model(
        **{
            lookup_field: lookup_value,
            **values,
        }
    )

    db.add(record)
    db.flush()

    return record, True


def seed_providers(db: Session) -> list[Provider]:
    records = [
        {
            "provider_code": "PRV-1001",
            "provider_name": "MediCare Specialist Hospital",
            "provider_type": "Hospital",
            "specialty": "Multispecialty",
            "license_number": "MOH-PRV-1001",
            "network_status": "in_network",
            "email": "network@medicare-demo.example",
            "phone": "+966500000101",
            "city": "Riyadh",
            "region": "Riyadh",
            "country": "Saudi Arabia",
            "is_active": True,
        },
        {
            "provider_code": "PRV-1002",
            "provider_name": "Riyadh Advanced Cardiac Centre",
            "provider_type": "Specialist Center",
            "specialty": "Cardiology",
            "license_number": "MOH-PRV-1002",
            "network_status": "in_network",
            "email": "network@cardiac-demo.example",
            "phone": "+966500000102",
            "city": "Riyadh",
            "region": "Riyadh",
            "country": "Saudi Arabia",
            "is_active": True,
        },
        {
            "provider_code": "PRV-1003",
            "provider_name": "Al Noor Family Medical Center",
            "provider_type": "Clinic",
            "specialty": "Family Medicine",
            "license_number": "MOH-PRV-1003",
            "network_status": "in_network",
            "email": "network@alnoor-demo.example",
            "phone": "+966500000103",
            "city": "Jeddah",
            "region": "Makkah",
            "country": "Saudi Arabia",
            "is_active": True,
        },
        {
            "provider_code": "PRV-1004",
            "provider_name": "Kingdom Oncology Institute",
            "provider_type": "Specialist Center",
            "specialty": "Oncology",
            "license_number": "MOH-PRV-1004",
            "network_status": "in_network",
            "email": "network@oncology-demo.example",
            "phone": "+966500000104",
            "city": "Riyadh",
            "region": "Riyadh",
            "country": "Saudi Arabia",
            "is_active": True,
        },
        {
            "provider_code": "PRV-1005",
            "provider_name": "Gulf Diagnostic and Day Surgery Center",
            "provider_type": "Diagnostic Center",
            "specialty": "Diagnostics",
            "license_number": "MOH-PRV-1005",
            "network_status": "under_review",
            "email": "network@gulfdiagnostic-demo.example",
            "phone": "+966500000105",
            "city": "Dammam",
            "region": "Eastern Province",
            "country": "Saudi Arabia",
            "is_active": True,
        },
    ]

    providers: list[Provider] = []

    for data in records:
        provider, _ = get_or_create(
            db,
            Provider,
            "provider_code",
            data["provider_code"],
            **{
                key: value
                for key, value in data.items()
                if key != "provider_code"
            },
        )

        providers.append(provider)

    return providers


def seed_members(db: Session) -> list[Member]:
    records = [
        ("MBR-2026-0001", "Ahmed", "Al-Harbi", date(1983, 4, 12), "Male", "Riyadh"),
        ("MBR-2026-0002", "Mariam", "Al-Qahtani", date(1990, 9, 21), "Female", "Riyadh"),
        ("MBR-2026-0003", "Khalid", "Al-Dosari", date(1975, 2, 8), "Male", "Dammam"),
        ("MBR-2026-0004", "Noura", "Al-Shehri", date(1988, 11, 16), "Female", "Jeddah"),
        ("MBR-2026-0005", "Faisal", "Al-Mutairi", date(1994, 6, 1), "Male", "Riyadh"),
        ("MBR-2026-0006", "Sara", "Al-Otaibi", date(1986, 7, 14), "Female", "Jeddah"),
        ("MBR-2026-0007", "Omar", "Al-Zahrani", date(1968, 1, 25), "Male", "Riyadh"),
        ("MBR-2026-0008", "Layla", "Al-Ghamdi", date(1997, 3, 19), "Female", "Dammam"),
        ("MBR-2026-0009", "Yousef", "Al-Rashid", date(1981, 10, 30), "Male", "Riyadh"),
        ("MBR-2026-0010", "Huda", "Al-Anazi", date(1992, 5, 7), "Female", "Riyadh"),
    ]

    members: list[Member] = []

    for index, (
        member_number,
        first_name,
        last_name,
        dob,
        gender,
        city,
    ) in enumerate(records, start=1):
        member, _ = get_or_create(
            db,
            Member,
            "member_number",
            member_number,
            national_id=f"DEMO-{1000000000 + index}",
            first_name=first_name,
            middle_name=None,
            last_name=last_name,
            date_of_birth=dob,
            gender=gender,
            email=f"member{index}@medivantage-demo.example",
            phone=f"+966500001{index:02d}",
            city=city,
            region=(
                "Eastern Province"
                if city == "Dammam"
                else "Makkah"
                if city == "Jeddah"
                else "Riyadh"
            ),
            country="Saudi Arabia",
            enrollment_status="active",
            is_active=True,
        )

        members.append(member)

    return members


def seed_health_plans(db: Session) -> list[HealthPlan]:
    records = [
        {
            "plan_code": "PLAN-GOLD-2026",
            "plan_name": "MediVantage Gold",
            "plan_type": "PPO",
            "coverage_level": "Gold",
            "annual_deductible": Decimal("500.00"),
            "out_of_pocket_maximum": Decimal("7500.00"),
            "monthly_premium": Decimal("1450.00"),
            "coinsurance_percentage": Decimal("10.00"),
            "primary_care_copay": Decimal("25.00"),
            "specialist_copay": Decimal("50.00"),
        },
        {
            "plan_code": "PLAN-SILVER-2026",
            "plan_name": "MediVantage Silver",
            "plan_type": "PPO",
            "coverage_level": "Silver",
            "annual_deductible": Decimal("1000.00"),
            "out_of_pocket_maximum": Decimal("10000.00"),
            "monthly_premium": Decimal("950.00"),
            "coinsurance_percentage": Decimal("20.00"),
            "primary_care_copay": Decimal("40.00"),
            "specialist_copay": Decimal("75.00"),
        },
        {
            "plan_code": "PLAN-EXEC-2026",
            "plan_name": "MediVantage Executive",
            "plan_type": "Corporate",
            "coverage_level": "Executive",
            "annual_deductible": Decimal("250.00"),
            "out_of_pocket_maximum": Decimal("5000.00"),
            "monthly_premium": Decimal("2200.00"),
            "coinsurance_percentage": Decimal("5.00"),
            "primary_care_copay": Decimal("0.00"),
            "specialist_copay": Decimal("25.00"),
        },
    ]

    plans: list[HealthPlan] = []

    for data in records:
        plan, _ = get_or_create(
            db,
            HealthPlan,
            "plan_code",
            data["plan_code"],
            plan_name=data["plan_name"],
            plan_type=data["plan_type"],
            coverage_level=data["coverage_level"],
            annual_deductible=data["annual_deductible"],
            out_of_pocket_maximum=data["out_of_pocket_maximum"],
            monthly_premium=data["monthly_premium"],
            coinsurance_percentage=data["coinsurance_percentage"],
            primary_care_copay=data["primary_care_copay"],
            specialist_copay=data["specialist_copay"],
            effective_date=date(2026, 1, 1),
            expiration_date=date(2026, 12, 31),
            currency="SAR",
            is_active=True,
        )

        plans.append(plan)

    return plans


def seed_enrollments(
    db: Session,
    members: list[Member],
    plans: list[HealthPlan],
) -> list[Enrollment]:
    enrollments: list[Enrollment] = []

    for index, member in enumerate(members, start=1):
        plan = plans[(index - 1) % len(plans)]

        enrollment, _ = get_or_create(
            db,
            Enrollment,
            "policy_number",
            f"ENR-POL-2026-{index:04d}",
            member_id=member.id,
            health_plan_id=plan.id,
            enrollment_type="individual",
            relationship_to_subscriber="self",
            subscriber_member_id=member.id,
            group_number=(
                "GRP-ENTERPRISE-01"
                if index in {3, 6, 9}
                else None
            ),
            employer_name=(
                "MediVantage Demo Corporate Group"
                if index in {3, 6, 9}
                else None
            ),
            coverage_start_date=date(2026, 1, 1),
            coverage_end_date=date(2026, 12, 31),
            enrollment_status="active",
            termination_reason=None,
            is_primary=True,
            is_active=True,
        )

        enrollments.append(enrollment)

    return enrollments


def seed_policies(
    db: Session,
    members: list[Member],
    plans: list[HealthPlan],
) -> list[Policy]:
    policies: list[Policy] = []

    for index, member in enumerate(members, start=1):
        plan = plans[(index - 1) % len(plans)]

        policy, _ = get_or_create(
            db,
            Policy,
            "policy_number",
            f"POL-2026-{index:04d}",
            policyholder_member_id=member.id,
            health_plan_id=plan.id,
            status="ACTIVE",
            policy_type=(
                "CORPORATE"
                if index in {3, 6, 9}
                else "INDIVIDUAL"
            ),
            effective_date=date(2026, 1, 1),
            expiry_date=date(2026, 12, 31),
            network_name="MediVantage Preferred Network",
            annual_limit=Decimal("500000.00"),
            deductible_amount=Decimal("500.00"),
            copay_amount=Decimal("50.00"),
            coinsurance_percentage=Decimal("10.00"),
            out_of_pocket_maximum=Decimal("7500.00"),
            premium_amount=Decimal("1450.00"),
            premium_currency="SAR",
            billing_frequency="MONTHLY",
            billing_status="CURRENT",
            next_payment_date=date(2026, 9, 1),
            benefits_summary=(
                "Inpatient, outpatient, diagnostics, pharmacy, "
                "emergency and specialist care."
            ),
            exclusions_summary=(
                "Standard policy exclusions and non-covered "
                "elective services apply."
            ),
            renewal_eligible=True,
            renewal_due_date=date(2026, 11, 30),
            cancellation_reason=None,
            suspension_reason=None,
            is_active=True,
        )

        policies.append(policy)

    return policies


def seed_claims(
    db: Session,
    members: list[Member],
    providers: list[Provider],
    enrollments: list[Enrollment],
) -> list[Claim]:
    specs = [
        ("CLM-2026-0001", 0, 0, "APPROVED", "I10", "99214", "1850", "1650"),
        ("CLM-2026-0002", 1, 1, "PENDING_REVIEW", "I25.10", "93458", "16500", "14500"),
        ("CLM-2026-0003", 2, 2, "APPROVED", "E11.9", "80053", "980", "850"),
        ("CLM-2026-0004", 3, 3, "PENDING_REVIEW", "C50.919", "96413", "28500", "25000"),
        ("CLM-2026-0005", 4, 4, "DENIED", "M54.50", "72148", "4200", "0"),
        ("CLM-2026-0006", 5, 0, "APPROVED", "J18.9", "99223", "7600", "6900"),
        ("CLM-2026-0007", 6, 1, "PENDING_REVIEW", "I50.9", "93306", "5400", "4800"),
        ("CLM-2026-0008", 7, 2, "APPROVED", "K21.9", "43235", "3100", "2700"),
        ("CLM-2026-0009", 8, 4, "PENDING_REVIEW", "R10.9", "74177", "6200", "5500"),
        ("CLM-2026-0010", 9, 0, "APPROVED", "N39.0", "99213", "1250", "1100"),
        ("CLM-2026-0011", 0, 4, "DENIED", "Z00.00", "99999", "8900", "0"),
        ("CLM-2026-0012", 2, 1, "APPROVED", "I48.91", "93000", "2100", "1850"),
    ]

    claims: list[Claim] = []

    for index, spec in enumerate(specs):
        (
            claim_number,
            member_index,
            provider_index,
            status,
            diagnosis,
            procedure,
            billed,
            allowed,
        ) = spec

        billed_amount = Decimal(billed)
        allowed_amount = Decimal(allowed)

        deductible = (
            Decimal("0.00")
            if status == "DENIED"
            else Decimal("100.00")
        )

        copay = (
            Decimal("0.00")
            if status == "DENIED"
            else Decimal("50.00")
        )

        member_responsibility = deductible + copay

        payer_responsibility = (
            Decimal("0.00")
            if status == "DENIED"
            else max(
                allowed_amount - member_responsibility,
                Decimal("0.00"),
            )
        )

        claim, _ = get_or_create(
            db,
            Claim,
            "claim_number",
            claim_number,
            member_id=members[member_index].id,
            provider_id=providers[provider_index].id,
            enrollment_id=enrollments[member_index].id,
            service_date=date(2026, 7, 10) + timedelta(days=index * 2),
            submission_date=date(2026, 7, 11) + timedelta(days=index * 2),
            claim_type="medical",
            diagnosis_code=diagnosis,
            procedure_code=procedure,
            billed_amount=billed_amount,
            allowed_amount=allowed_amount,
            deductible_amount=deductible,
            copay_amount=copay,
            coinsurance_amount=Decimal("0.00"),
            payer_responsibility=payer_responsibility,
            member_responsibility=member_responsibility,
            claim_status=status,
            denial_reason=(
                "Service requires additional coverage validation."
                if status == "DENIED"
                else None
            ),
            adjudication_notes=(
                "Synthetic demonstration claim generated for "
                "MediVantage production POC."
            ),
            is_active=True,
        )

        claims.append(claim)

    return claims


def seed_underwriting(
    db: Session,
    members: list[Member],
) -> list[UnderwritingApplication]:
    records = [
        ("UW-2026-0001", 0, 28.0, "APPROVED", "APPROVE"),
        ("UW-2026-0002", 1, 42.0, "PENDING_REVIEW", None),
        ("UW-2026-0003", 2, 71.0, "REFERRED", None),
        ("UW-2026-0004", 3, 36.0, "APPROVED", "APPROVE"),
        ("UW-2026-0005", 6, 82.0, "REFERRED", None),
        ("UW-2026-0006", 8, 55.0, "PENDING_REVIEW", None),
    ]

    applications: list[UnderwritingApplication] = []

    for app_number, member_index, score, status, decision in records:
        application, _ = get_or_create(
            db,
            UnderwritingApplication,
            "application_number",
            app_number,
            member_id=members[member_index].id,
            product="Comprehensive Medical Insurance",
            submitted_date=date(2026, 8, 1),
            risk_score=score,
            status=status,
            assigned_underwriter="Clinical Underwriting Team",
            clinical_summary=(
                "Synthetic medical underwriting profile for "
                "demonstration purposes only."
            ),
            ai_recommendation=(
                "Human review recommended based on clinical "
                "risk profile and declared history."
            ),
            decision=decision,
            decision_rationale=(
                "Risk is within approved underwriting tolerance."
                if decision
                else None
            ),
            reviewed_at=(
                datetime.now(timezone.utc)
                if decision
                else None
            ),
        )

        applications.append(application)

    return applications


def seed_prior_authorizations(
    db: Session,
    members: list[Member],
    providers: list[Provider],
    enrollments: list[Enrollment],
) -> list[PriorAuthorization]:
    specs = [
        ("PA-2026-0001", 1, 1, "URGENT", "PENDING_REVIEW", "93458", "Coronary angiography"),
        ("PA-2026-0002", 3, 3, "URGENT", "APPROVED", "96413", "Oncology infusion therapy"),
        ("PA-2026-0003", 4, 4, "ROUTINE", "MORE_INFO_REQUIRED", "72148", "Lumbar spine MRI"),
        ("PA-2026-0004", 6, 1, "URGENT", "PENDING_REVIEW", "93306", "Echocardiography"),
        ("PA-2026-0005", 7, 2, "ROUTINE", "APPROVED", "43235", "Diagnostic endoscopy"),
        ("PA-2026-0006", 8, 4, "ROUTINE", "PENDING_REVIEW", "74177", "CT abdomen and pelvis"),
        ("PA-2026-0007", 0, 0, "ROUTINE", "APPROVED", "99214", "Specialist consultation"),
        ("PA-2026-0008", 2, 1, "URGENT", "ESCALATED", "93656", "Cardiac ablation"),
    ]

    authorizations: list[PriorAuthorization] = []

    for (
        auth_number,
        member_index,
        provider_index,
        priority,
        status,
        procedure_code,
        procedure_description,
    ) in specs:
        authorization, _ = get_or_create(
            db,
            PriorAuthorization,
            "authorization_number",
            auth_number,
            member_id=members[member_index].id,
            provider_id=providers[provider_index].id,
            enrollment_id=enrollments[member_index].id,
            diagnosis_code="Z71.1",
            diagnosis_description=(
                "Clinical condition requiring authorization review"
            ),
            procedure_code=procedure_code,
            procedure_description=procedure_description,
            requested_service_date=date(2026, 8, 20),
            priority=priority,
            status=status,
            clinical_summary=(
                "Clinical documentation submitted for medical "
                "necessity review."
            ),
            coverage_status="ACTIVE",
            benefit_category="Medical",
            service_covered=True,
            authorization_required=True,
            ai_recommendation=(
                "APPROVE"
                if status == "APPROVED"
                else "HUMAN_REVIEW"
            ),
            ai_confidence=88.0,
            medical_necessity_score=84.0,
            ai_rationale=(
                "Recommendation based on coverage, diagnosis, "
                "procedure and utilization signals."
            ),
            assigned_reviewer="Utilization Management Team",
            review_due_at=datetime.now(timezone.utc) + timedelta(days=2),
            final_decision=(
                "APPROVED"
                if status == "APPROVED"
                else None
            ),
            decision_rationale=(
                "Medical necessity criteria satisfied."
                if status == "APPROVED"
                else None
            ),
            information_requested=(
                "Submit specialist report and previous imaging."
                if status == "MORE_INFO_REQUIRED"
                else None
            ),
            escalation_reason=(
                "High-cost complex cardiac intervention."
                if status == "ESCALATED"
                else None
            ),
            escalated_to=(
                "Senior Medical Director"
                if status == "ESCALATED"
                else None
            ),
            decided_by=(
                "Medical Review Team"
                if status == "APPROVED"
                else None
            ),
            decided_at=(
                datetime.now(timezone.utc)
                if status == "APPROVED"
                else None
            ),
        )

        authorizations.append(authorization)

    return authorizations


def seed_reimbursements(
    db: Session,
    claims: list[Claim],
    providers: list[Provider],
    members: list[Member],
) -> list[Reimbursement]:
    reimbursements: list[Reimbursement] = []

    for index, claim in enumerate(claims[:8], start=1):
        approved = Decimal(
            str(
                claim.allowed_amount
                if claim.allowed_amount is not None
                else 0
            )
        )

        if claim.claim_status == "DENIED":
            approved = Decimal("0.00")

        reimbursement, _ = get_or_create(
            db,
            Reimbursement,
            "reimbursement_number",
            f"RMB-2026-{index:04d}",
            claim_id=claim.id,
            provider_id=claim.provider_id,
            member_id=claim.member_id,
            reimbursement_type="PROVIDER",
            currency="SAR",
            billed_amount=Decimal(str(claim.billed_amount)),
            approved_amount=approved,
            withholding_amount=Decimal("0.00"),
            recovery_amount=Decimal("0.00"),
            net_payable_amount=approved,
            status=(
                "PAID"
                if index in {1, 3, 6}
                else "PENDING_APPROVAL"
            ),
            approval_status=(
                "APPROVED"
                if index in {1, 3, 6}
                else "PENDING"
            ),
            approved_by=(
                "Claims Payment Operations"
                if index in {1, 3, 6}
                else None
            ),
            approved_at=(
                datetime.now(timezone.utc)
                if index in {1, 3, 6}
                else None
            ),
            approval_notes=(
                "Approved following claims adjudication review."
                if index in {1, 3, 6}
                else None
            ),
            payment_method=(
                "BANK_TRANSFER"
                if index in {1, 3, 6}
                else None
            ),
            scheduled_payment_date=date(2026, 8, 25),
            payment_reference=(
                f"PAY-2026-{index:04d}"
                if index in {1, 3, 6}
                else None
            ),
            paid_at=(
                datetime.now(timezone.utc)
                if index in {1, 3, 6}
                else None
            ),
            reconciliation_status=(
                "RECONCILED"
                if index in {1, 3}
                else "NOT_RECONCILED"
            ),
            reconciliation_reference=(
                f"REC-2026-{index:04d}"
                if index in {1, 3}
                else None
            ),
            reconciled_by=(
                "Finance Operations"
                if index in {1, 3}
                else None
            ),
            reconciled_at=(
                datetime.now(timezone.utc)
                if index in {1, 3}
                else None
            ),
            ai_risk_score=(
                82.0
                if index == 5
                else 24.0 + index
            ),
            ai_risk_level=(
                "HIGH"
                if index == 5
                else "LOW"
            ),
            ai_risk_reason=(
                "Elevated reimbursement anomaly signal."
                if index == 5
                else "No material financial anomaly detected."
            ),
        )

        reimbursements.append(reimbursement)

    return reimbursements


def seed_fraud_cases(
    db: Session,
    claims: list[Claim],
    members: list[Member],
    providers: list[Provider],
) -> list[FraudCase]:
    specs = [
        ("FWA-2026-0001", 4, 4, 4, "HIGH", Decimal("8900")),
        ("FWA-2026-0002", 8, 4, 8, "HIGH", Decimal("6200")),
        ("FWA-2026-0003", 1, 1, 1, "MEDIUM", Decimal("16500")),
        ("FWA-2026-0004", 3, 3, 3, "MEDIUM", Decimal("28500")),
        ("FWA-2026-0005", 0, 4, 10, "CRITICAL", Decimal("8900")),
    ]

    cases: list[FraudCase] = []

    for (
        case_number,
        member_index,
        provider_index,
        claim_index,
        risk,
        exposure,
    ) in specs:
        case, _ = get_or_create(
            db,
            FraudCase,
            "case_number",
            case_number,
            title="Potential Billing and Utilization Anomaly",
            case_type="CLAIMS_BILLING_REVIEW",
            status="OPEN",
            priority=(
                "CRITICAL"
                if risk == "CRITICAL"
                else "HIGH"
                if risk == "HIGH"
                else "MEDIUM"
            ),
            risk_level=risk,
            investigation_stage="INVESTIGATION",
            source="AI_DETECTION",
            description=(
                "Synthetic FWA investigation generated for "
                "MediVantage production demonstration."
            ),
            member_id=members[member_index].id,
            provider_id=providers[provider_index].id,
            primary_claim_id=claims[claim_index].id,
            assigned_investigator="Special Investigations Unit",
            investigation_unit="Fraud, Waste and Abuse",
            opened_date=date(2026, 8, 14),
            target_resolution_date=date(2026, 9, 14),
            closed_date=None,
            ai_confidence=91.0 if risk == "CRITICAL" else 84.0,
            suspected_exposure=exposure,
            validated_exposure=Decimal("0.00"),
            prevented_loss=Decimal("0.00"),
            recovery_potential=exposure,
            recovered_amount=Decimal("0.00"),
            currency="SAR",
            fraud_summary=(
                "Pattern requires targeted human investigation "
                "before final disposition."
            ),
            ai_rationale=(
                "Billing frequency, service mix and utilization "
                "signals differ from expected peer behavior."
            ),
            final_outcome=None,
            closure_rationale=None,
        )

        cases.append(case)

    return cases


def seed_fraud_alerts(
    db: Session,
    fraud_cases: list[FraudCase],
) -> list[FraudAlert]:
    alerts: list[FraudAlert] = []

    for index in range(7):
        fraud_case = fraud_cases[index % len(fraud_cases)]

        alert, _ = get_or_create(
            db,
            FraudAlert,
            "alert_number",
            f"FRA-2026-{index + 1:04d}",
            fraud_case_id=fraud_case.id,
            source="MediVantage Claims Intelligence",
            title=(
                "Provider Billing Pattern Requires Review"
                if index % 2 == 0
                else "Utilization Anomaly Detected"
            ),
            description=(
                "Synthetic fraud alert generated from claims "
                "behavior for demonstration purposes."
            ),
            detected_date=date(2026, 8, 14),
            risk_level=(
                "HIGH"
                if index in {0, 2, 4, 6}
                else "MEDIUM"
            ),
            confidence_score=82.0 + index,
            model_name="MediVantage FWA Intelligence",
            model_version="0.1.0",
            status=(
                "NEW"
                if index < 4
                else "UNDER_REVIEW"
            ),
        )

        alerts.append(alert)

    return alerts


def seed_ai_insights(db: Session) -> list[AIInsight]:
    records = [
        (
            "AI-INS-2026-001",
            "Claims expenditure expected to exceed monthly forecast",
            "CLAIMS_COST_FORECAST",
            "CLAIMS",
            "PORTFOLIO-CLAIMS-2026-08",
            "CRITICAL",
            94.0,
        ),
        (
            "AI-INS-2026-002",
            "Critical provider fraud risk concentration detected",
            "PROVIDER_FRAUD_RISK",
            "FRAUD",
            "FWA-2026-0001",
            "CRITICAL",
            96.0,
        ),
        (
            "AI-INS-2026-003",
            "High-risk members likely to become high-cost next quarter",
            "MEMBER_COST_RISK",
            "MEMBERS",
            "PORTFOLIO-HIGH-RISK-MEMBERS",
            "HIGH",
            91.0,
        ),
        (
            "AI-INS-2026-004",
            "Prior authorization backlog likely to breach SLA",
            "AUTHORIZATION_SLA_RISK",
            "PRIOR_AUTHORIZATION",
            "PA-QUEUE-2026-08",
            "HIGH",
            89.0,
        ),
        (
            "AI-INS-2026-005",
            "Payment leakage detected in duplicate reimbursement pattern",
            "PAYMENT_LEAKAGE",
            "REIMBURSEMENTS",
            "RMB-2026-0005",
            "CRITICAL",
            95.0,
        ),
        (
            "AI-INS-2026-006",
            "Underwriting portfolio risk is shifting upward",
            "UNDERWRITING_PORTFOLIO_RISK",
            "UNDERWRITING",
            "UW-PORTFOLIO-2026-08",
            "HIGH",
            88.0,
        ),
        (
            "AI-INS-2026-007",
            "Member churn risk is rising in two employer groups",
            "MEMBER_CHURN_RISK",
            "MEMBERS",
            "EMPLOYER-GROUP-PORTFOLIO",
            "MEDIUM",
            84.0,
        ),
        (
            "AI-INS-2026-008",
            "Provider quality decline detected in Tier 2 network",
            "PROVIDER_QUALITY_RISK",
            "PROVIDERS",
            "TIER-2-NETWORK",
            "HIGH",
            90.0,
        ),
        (
            "AI-INS-2026-009",
            "Claims denial rate is increasing in outpatient imaging",
            "CLAIMS_DENIAL_TREND",
            "CLAIMS",
            "OUTPATIENT-IMAGING-2026-08",
            "HIGH",
            87.0,
        ),
        (
            "AI-INS-2026-010",
            "Operational bottleneck predicted in claims review team",
            "OPERATIONS_CAPACITY_RISK",
            "CLAIMS",
            "CLAIMS-REVIEW-TEAM-2026-08",
            "MEDIUM",
            85.0,
        ),
    ]

    insights: list[AIInsight] = []

    for (
        number,
        title,
        insight_type,
        source_module,
        source_reference,
        risk_level,
        confidence,
    ) in records:
        insight, _ = get_or_create(
            db,
            AIInsight,
            "insight_number",
            number,
            title=title,
            insight_type=insight_type,
            status="NEW",
            priority=(
                "CRITICAL"
                if risk_level == "CRITICAL"
                else "HIGH"
                if risk_level == "HIGH"
                else "MEDIUM"
            ),
            risk_level=risk_level,
            description=(
                "MediVantage AI identified an operational, clinical "
                "or financial pattern requiring authorised human review."
            ),
            recommendation=(
                "Review the underlying clinical, financial and operational "
                "evidence before taking action."
            ),
            ai_rationale=(
                "The MediVantage intelligence engine detected a material "
                "deviation from expected healthcare operations and risk "
                "patterns. Human review is required before operational "
                "intervention."
            ),
            confidence_score=confidence,
            model_name="MediVantage Intelligence Engine",
            model_version="1.0.0",
            source_module=source_module,
            source_reference=source_reference,
            assigned_reviewer=None,
            review_status="PENDING",
            review_comment=None,
            review_date=None,
            detected_date=date(2026, 8, 14),
        )

        insights.append(insight)

    return insights


def print_summary(
    providers: list[Provider],
    members: list[Member],
    plans: list[HealthPlan],
    enrollments: list[Enrollment],
    claims: list[Claim],
    underwriting: list[UnderwritingApplication],
    prior_auths: list[PriorAuthorization],
    reimbursements: list[Reimbursement],
    policies: list[Policy],
    fraud_cases: list[FraudCase],
    fraud_alerts: list[FraudAlert],
    ai_insights: list[AIInsight],
) -> None:
    print("\n" + "=" * 60)
    print("MEDIVANTAGE PRODUCTION DEMO SEED COMPLETE")
    print("=" * 60)
    print(f"Providers:               {len(providers)}")
    print(f"Members:                 {len(members)}")
    print(f"Health Plans:            {len(plans)}")
    print(f"Enrollments:             {len(enrollments)}")
    print(f"Claims:                  {len(claims)}")
    print(f"Underwriting Apps:       {len(underwriting)}")
    print(f"Prior Authorizations:    {len(prior_auths)}")
    print(f"Reimbursements:          {len(reimbursements)}")
    print(f"Policies:                {len(policies)}")
    print(f"Fraud Cases:             {len(fraud_cases)}")
    print(f"Fraud Alerts:            {len(fraud_alerts)}")
    print(f"AI Insights:             {len(ai_insights)}")
    print("=" * 60)
    print("All records are synthetic demonstration data.")
    print("=" * 60 + "\n")


def main() -> None:
    require_confirmation()

    db = SessionLocal()

    try:
        print("\nStarting MediVantage production demo seed...")
        print("All records created by this script are synthetic.\n")

        providers = seed_providers(db)
        members = seed_members(db)
        plans = seed_health_plans(db)

        enrollments = seed_enrollments(
            db,
            members,
            plans,
        )

        policies = seed_policies(
            db,
            members,
            plans,
        )

        claims = seed_claims(
            db,
            members,
            providers,
            enrollments,
        )

        underwriting = seed_underwriting(
            db,
            members,
        )

        prior_auths = seed_prior_authorizations(
            db,
            members,
            providers,
            enrollments,
        )

        reimbursements = seed_reimbursements(
            db,
            claims,
            providers,
            members,
        )

        fraud_cases = seed_fraud_cases(
            db,
            claims,
            members,
            providers,
        )

        fraud_alerts = seed_fraud_alerts(
            db,
            fraud_cases,
        )

        ai_insights = seed_ai_insights(db)

        db.commit()

        print_summary(
            providers=providers,
            members=members,
            plans=plans,
            enrollments=enrollments,
            claims=claims,
            underwriting=underwriting,
            prior_auths=prior_auths,
            reimbursements=reimbursements,
            policies=policies,
            fraud_cases=fraud_cases,
            fraud_alerts=fraud_alerts,
            ai_insights=ai_insights,
        )

    except Exception:
        db.rollback()

        print(
            "\nSeed failed. Database transaction was rolled back.\n"
        )

        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()