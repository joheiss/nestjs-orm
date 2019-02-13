import { Test, TestingModule } from '@nestjs/testing';
import { UserApiService } from './user.api.service';

describe('UserService', () => {
  let service: UserApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserApiService],
    }).compile();

    service = module.get<UserApiService>(UserApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
