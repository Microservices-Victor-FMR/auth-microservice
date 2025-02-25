import { Test } from '@nestjs/testing';
import { FindByEmailUserUseCases } from './findByEmail-user.usecase';
import { USER_REPOSITORY } from '../../../token.contants';
import { RpcException } from '@nestjs/microservices';
describe('FindByEmailUserUseCases', () => {
  let findByEmailUserUseCases: FindByEmailUserUseCases;
  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByEmailUserUseCases,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    findByEmailUserUseCases = moduleRef.get<FindByEmailUserUseCases>(FindByEmailUserUseCases);
  });

  it('Deberia continuar si el usuario no existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const result = await findByEmailUserUseCases.verifyEmailExists('test@test');
    expect(result).toBeUndefined();
  });

  it('Deberia lanzar un error si el usuario ya existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({ email: 'test@test' });

    await expect(findByEmailUserUseCases.verifyEmailExists('test@test')).rejects.toThrow(RpcException);
  });
});
