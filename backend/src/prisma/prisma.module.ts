import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Dzięki temu Prisma będzie dostępna w całej aplikacji bez ciągłego importowania
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
