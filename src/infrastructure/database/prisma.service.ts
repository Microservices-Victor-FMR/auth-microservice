import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const logger = new Logger(PrismaService.name,{timestamp: true})
    logger.log('PrismaService initialized')
    await this.$connect();
  }
}