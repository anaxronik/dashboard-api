import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { LoggerService } from '../../logger/logger.service';
import { TYPES } from '../../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: LoggerService) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] connect');
		} catch (error: any) {
			this.logger.error(
				'[PrismaService] connect failed: ' + String(error?.message || error),
			);
		}
	}

	async disconnect() {
		await this.client.$disconnect();
		this.logger.log('[PrismaService] disconnect');
	}
}
