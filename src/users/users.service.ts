import { inject, injectable } from 'inversify';

import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {}

	async createUser(dto: UserRegisterDto) {
		const newUser = new User(dto.email, dto.name);
		const salt = parseInt(this.configService.get<string>('SALT'));

		await newUser.setPassword(dto.password, salt);
		const isExistUser = Math.random() > 0.5;
		return isExistUser ? null : newUser;
	}

	validateUser(dto: UserLoginDto) {
		return true;
	}
}
