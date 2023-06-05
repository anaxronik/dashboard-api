import dotenv, { DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { ILogger } from '../src/logger/logger.interface';
import { TYPES } from '../src/types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result = dotenv.config();
		if (result.error) {
			this.logger.error('[ConfigService] Can not read .env');
		} else {
			this.config = result.parsed as DotenvParseOutput;
			this.logger.log('[ConfigService] Config read success');
		}
	}

	get<T extends string | number>(key: string) {
		return this.config[key] as T;
	}
}

export enum CONFIG_KEYS {
	'SECRET',
}
