import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Kod P2002 w Prismie oznacza: Unique constraint failed (rekord już istnieje)
    if (exception.code === 'P2002') {
      const status = HttpStatus.CONFLICT; // 409 Conflict
      const targets = (exception.meta?.target as string[]) || [];

      return response.status(status).json({
        statusCode: status,
        error: 'Conflict',
        message: `Rekord z polami [${targets.join(', ')}] już istnieje w bazie.`,
        timestamp: new Date().toISOString(),
      });
    }

    // Dla pozostałych błędów bazy zwracamy standardowy 400/500
    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: exception.message.replace(/\n/g, ''),
      timestamp: new Date().toISOString(),
    });
  }
}
