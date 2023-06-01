import { injectable } from 'inversify';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser(dto: UserRegisterDto) {
		const newUser = new User(dto.email, dto.name);
		await newUser.setPassword(dto.password);
		const isExistUser = Math.random() > 0.5;
		return isExistUser ? null : newUser;
	}

	validateUser(dto: UserLoginDto) {
		return true;
	}
}
