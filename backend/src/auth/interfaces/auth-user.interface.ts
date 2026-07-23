import { MembershipRole, OrganizationType } from '@prisma/client';

export interface AuthUser {
  userId: string;
  membershipId: string;
  organizationId: string;
  role: MembershipRole;
  organizationType: OrganizationType;
}

export interface JwtPayload {
  sub: string;
  membershipId: string;
  organizationId: string;
  role: MembershipRole;
  organizationType: OrganizationType;
}
