import api from "./api";

import type { Enrollment } from "../types/enrollment";


export async function getEnrollments(): Promise<
  Enrollment[]
> {
  const response = await api.get<Enrollment[]>(
    "/enrollments",
    {
      params: {
        skip: 0,
        limit: 500,
      },
    },
  );

  return response.data;
}


export async function getEnrollmentsByMember(
  memberId: string,
): Promise<Enrollment[]> {
  const response = await api.get<Enrollment[]>(
    "/enrollments",
    {
      params: {
        member_id: memberId,
        skip: 0,
        limit: 500,
      },
    },
  );

  return response.data;
}


export async function getEnrollment(
  enrollmentId: string,
): Promise<Enrollment> {
  const response = await api.get<Enrollment>(
    `/enrollments/${encodeURIComponent(
      enrollmentId,
    )}`,
  );

  return response.data;
}