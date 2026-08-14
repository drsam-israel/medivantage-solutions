import {
  getClaimById,
} from "./claimsApi";

import {
  getMember,
} from "./membersApi";

import {
  getProvider,
} from "./providersApi";

import type {
  Reimbursement,
} from "../types/reimbursement";

import type {
  Claim,
} from "../types/claim";

import type {
  Member,
} from "../types/member";

import type {
  Provider,
} from "../types/provider";

export interface EnrichedReimbursement {
  reimbursement: Reimbursement;

  claim: Claim | null;
  member: Member | null;
  provider: Provider | null;
}

async function safelyResolve<T>(
  loader: () => Promise<T>,
): Promise<T | null> {
  try {
    return await loader();
  } catch (error) {
    console.error(
      "Reimbursement enrichment lookup failed:",
      error,
    );

    return null;
  }
}

export async function enrichReimbursement(
  reimbursement: Reimbursement,
): Promise<EnrichedReimbursement> {
  const [
    claim,
    provider,
    member,
  ] = await Promise.all([
    safelyResolve(() =>
      getClaimById(reimbursement.claim_id),
    ),

    safelyResolve(() =>
      getProvider(reimbursement.provider_id),
    ),

    reimbursement.member_id
      ? safelyResolve(() =>
          getMember(
            reimbursement.member_id as string,
          ),
        )
      : Promise.resolve(null),
  ]);

  return {
    reimbursement,
    claim,
    member,
    provider,
  };
}

export async function enrichReimbursements(
  reimbursements: Reimbursement[],
): Promise<EnrichedReimbursement[]> {
  const claimCache = new Map<
    string,
    Promise<Claim | null>
  >();

  const memberCache = new Map<
    string,
    Promise<Member | null>
  >();

  const providerCache = new Map<
    string,
    Promise<Provider | null>
  >();

  const resolveClaim = (
    claimId: string,
  ): Promise<Claim | null> => {
    const existing =
      claimCache.get(claimId);

    if (existing) {
      return existing;
    }

    const request = safelyResolve(() =>
      getClaimById(claimId),
    );

    claimCache.set(
      claimId,
      request,
    );

    return request;
  };

  const resolveMember = (
    memberId: string,
  ): Promise<Member | null> => {
    const existing =
      memberCache.get(memberId);

    if (existing) {
      return existing;
    }

    const request = safelyResolve(() =>
      getMember(memberId),
    );

    memberCache.set(
      memberId,
      request,
    );

    return request;
  };

  const resolveProvider = (
    providerId: string,
  ): Promise<Provider | null> => {
    const existing =
      providerCache.get(providerId);

    if (existing) {
      return existing;
    }

    const request = safelyResolve(() =>
      getProvider(providerId),
    );

    providerCache.set(
      providerId,
      request,
    );

    return request;
  };

  return Promise.all(
    reimbursements.map(
      async (
        reimbursement,
      ): Promise<EnrichedReimbursement> => {
        const [
          claim,
          provider,
          member,
        ] = await Promise.all([
          resolveClaim(
            reimbursement.claim_id,
          ),

          resolveProvider(
            reimbursement.provider_id,
          ),

          reimbursement.member_id
            ? resolveMember(
                reimbursement.member_id,
              )
            : Promise.resolve(null),
        ]);

        return {
          reimbursement,
          claim,
          member,
          provider,
        };
      },
    ),
  );
}

export function getReimbursementMemberName(
  member: Member | null,
): string {
  if (!member) {
    return "Member details unavailable";
  }

  return [
    member.first_name,
    member.middle_name,
    member.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getReimbursementProviderName(
  provider: Provider | null,
): string {
  return (
    provider?.provider_name ??
    "Provider details unavailable"
  );
}