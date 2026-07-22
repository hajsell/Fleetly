import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Użytkownik o podanym emailu już istnieje.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'MANAGER',
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });

    const token = this.generateToken(
      result.user.id,
      result.user.email,
      result.organization.id,
      result.user.role,
    );

    return {
      message: 'Rejestracja zakończona sukcesem',
      accessToken: token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        organizationId: result.organization.id,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Niepoprawne dane logowania.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Niepoprawne dane logowania.');
    }

    const token = this.generateToken(
      user.id,
      user.email,
      user.organizationId,
      user.role,
    );

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  private generateToken(
    userId: string,
    email: string,
    organizationId: string,
    role: string,
  ): string {
    const payload = { sub: userId, email, organizationId, role };
    return this.jwtService.sign(payload);
  }
}
