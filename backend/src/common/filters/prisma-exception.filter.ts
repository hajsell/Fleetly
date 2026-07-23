import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception.code === 'P2002') {
      return this.send(
        response,
        HttpStatus.CONFLICT,
        'Rekord o podanych danych już istnieje.',
      );
    }

    if (exception.code === 'P2025') {
      return this.send(
        response,
        HttpStatus.NOT_FOUND,
        'Nie znaleziono wskazanego zasobu.',
      );
    }

    if (['P2003', 'P2014'].includes(exception.code)) {
      return this.send(
        response,
        HttpStatus.BAD_REQUEST,
        'Operacja narusza powiązania między danymi.',
      );
    }

    this.logger.error(
      `Nieobsłużony błąd Prisma ${exception.code}`,
      exception.stack,
    );
    return this.send(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Wystąpił wewnętrzny błąd serwera.',
    );
  }

  private send(response: Response, statusCode: HttpStatus, message: string) {
    return response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
