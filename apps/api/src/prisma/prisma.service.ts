import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client/extension';
// import { PrismaClient } from 'generated/prisma';
// import { PrismaClient } from '@prisma/client/extension';
// import { PrismaClient } from '@prisma/client/extension';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}
