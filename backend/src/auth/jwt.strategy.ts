import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser, JwtPayload } from './interfaces/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const membership = await this.prisma.organizationMembership.findFirst({
      where: {
        id: payload.membershipId,
        userId: payload.sub,
        organizationId: payload.organizationId,
      },
      include: { organization: true },
    });

    if (!membership) {
      throw new UnauthorizedException('Sesja użytkownika jest nieaktualna.');
    }

    return {
      userId: membership.userId,
      membershipId: membership.id,
      organizationId: membership.organizationId,
      role: membership.role,
      organizationType: membership.organization.type,
    };
  }
}
