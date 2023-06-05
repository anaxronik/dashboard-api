import { inject, injectable } from 'inversify';

import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: IUsersRepository,
	) {}

	async createUser(dto: UserRegisterDto) {
		if (await this.userRepository.find(dto.email)) return null;
		const newUser = new User(dto.email, dto.name);
		const salt = parseInt(this.configService.get<string>('SALT'));
		await newUser.setPassword(dto.password, salt);
		return this.userRepository.create(newUser);
	}

	async validateUser(dto: UserLoginDto) {
		const user = await this.userRepository.find(dto.email);
		if (!user) return false;
		const newUser = new User(user.email, user.name, user.password);
		return newUser.comparePassword(dto.password);
	}

	async findUser(email: string) {
		return this.userRepository.find(email);
	}
}
