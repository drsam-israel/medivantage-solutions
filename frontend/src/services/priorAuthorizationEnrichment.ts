import {
  getMember,
} from "./membersApi";

import {
  getProvider,
} from "./providersApi";

import {
  getEnrollment,
} from "./enrollmentsApi";

import type {
  PriorAuthorization,
} from "../types/priorAuthorization";

import type {
  Member,
} from "../types/member";

import type {
  Provider,
} from "../types/provider";

import type {
  Enrollment,
} from "../types/enrollment";

export interface EnrichedPriorAuthorization {
  authorization: PriorAuthorization;

  member: Member | null;
  provider: Provider | null;
  enrollment: Enrollment | null;
}

async function safelyResolve<T>(
  loader: () => Promise<T>,
): Promise<T | null> {
  try {
    return await loader();
  } catch (error) {
    console.error(
      "Prior Authorization enrichment lookup failed:",
      error,
    );

    return null;
  }
}

export async function enrichPriorAuthorization(
  authorization: PriorAuthorization,
): Promise<EnrichedPriorAuthorization> {
  const [
    member,
    provider,
    enrollment,
  ] = await Promise.all([
    safelyResolve(() =>
      getMember(authorization.member_id),
    ),

    safelyResolve(() =>
      getProvider(authorization.provider_id),
    ),

    authorization.enrollment_id
      ? safelyResolve(() =>
          getEnrollment(
            authorization.enrollment_id as string,
          ),
        )
      : Promise.resolve(null),
  ]);

  return {
    authorization,
    member,
    provider,
    enrollment,
  };
}

export async function enrichPriorAuthorizations(
  authorizations: PriorAuthorization[],
): Promise<EnrichedPriorAuthorization[]> {
  const memberCache = new Map<
    string,
    Promise<Member | null>
  >();

  const providerCache = new Map<
    string,
    Promise<Provider | null>
  >();

  const enrollmentCache = new Map<
    string,
    Promise<Enrollment | null>
  >();

  const resolveMember = (
    memberId: string,
  ): Promise<Member | null> => {
    const existing = memberCache.get(memberId);

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

  const resolveEnrollment = (
    enrollmentId: string,
  ): Promise<Enrollment | null> => {
    const existing =
      enrollmentCache.get(enrollmentId);

    if (existing) {
      return existing;
    }

    const request = safelyResolve(() =>
      getEnrollment(enrollmentId),
    );

    enrollmentCache.set(
      enrollmentId,
      request,
    );

    return request;
  };

  return Promise.all(
    authorizations.map(
      async (
        authorization,
      ): Promise<EnrichedPriorAuthorization> => {
        const [
          member,
          provider,
          enrollment,
        ] = await Promise.all([
          resolveMember(
            authorization.member_id,
          ),

          resolveProvider(
            authorization.provider_id,
          ),

          authorization.enrollment_id
            ? resolveEnrollment(
                authorization.enrollment_id,
              )
            : Promise.resolve(null),
        ]);

        return {
          authorization,
          member,
          provider,
          enrollment,
        };
      },
    ),
  );
}

export function getMemberDisplayName(
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

export function getProviderDisplayName(
  provider: Provider | null,
): string {
  return (
    provider?.provider_name ??
    "Provider details unavailable"
  );
}