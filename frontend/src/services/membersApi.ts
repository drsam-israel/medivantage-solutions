import api from "./api";
import type { Member } from "../types/member";

export async function getMembers(): Promise<Member[]> {
  const response = await api.get<Member[]>("/members", {
    params: {
      skip: 0,
      limit: 500,
    },
  });

  return response.data;
}

export async function getMember(
  memberId: string,
): Promise<Member> {
  const response = await api.get<Member>(
    `/members/${memberId}`,
  );

  return response.data;
}