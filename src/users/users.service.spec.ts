import { afterAll, beforeAll, describe, it } from '@jest/globals';

import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../types';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';

const ConfigServiceMock = {};

const container = new Container();
let configService: IConfigService;
let userRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind(TYPES.UserService).to(UserService);
});

describe('user service', () => {
	it('create user', async () => {});
});

afterAll(() => {});
