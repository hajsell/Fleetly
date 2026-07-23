import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembershipRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Użytkownik o podanym emailu już istnieje.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName.trim(),
          type: dto.organizationType,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
        },
      });

      const membership = await tx.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: MembershipRole.OWNER,
        },
      });

      return { organization, user, membership };
    });

    const accessToken = this.generateToken({
      sub: result.user.id,
      membershipId: result.membership.id,
      organizationId: result.organization.id,
      role: result.membership.role,
      organizationType: result.organization.type,
    });

    return {
      message: 'Rejestracja zakończona sukcesem',
      accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.membership.role,
        organizationId: result.organization.id,
        organizationType: result.organization.type,
      },
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { organization: true },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Niepoprawne dane logowania.');
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException(
        'Użytkownik nie należy do żadnej organizacji.',
      );
    }

    const accessToken = this.generateToken({
      sub: user.id,
      membershipId: membership.id,
      organizationId: membership.organizationId,
      role: membership.role,
      organizationType: membership.organization.type,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: membership.role,
        organizationId: membership.organizationId,
        organizationType: membership.organization.type,
      },
    };
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
