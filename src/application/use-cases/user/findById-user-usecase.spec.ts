import { Test } from '@nestjs/testing';
import { FindByIdUserUseCases } from './findById-user.usecase';
import { USER_REPOSITORY } from '../../../token.contants';
import { RpcException } from '@nestjs/microservices';

describe('FindByIdUserCases', () => {
  let findByIdUserUseCases: FindByIdUserUseCases;
  const mockUserRepository = {
    findById: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByIdUserUseCases,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    findByIdUserUseCases = moduleRef.get<FindByIdUserUseCases>(FindByIdUserUseCases);
  });

  it('Deberia retornar un usuario si existe', async () => {
    const user = { id: '1', name: 'Juan' };
    mockUserRepository.findById.mockResolvedValue(user);
    const result = await findByIdUserUseCases.execute('1');

    expect(result).toEqual(user);
  });
  it('Deberia lanzar un error si no encuentra el usuario', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(findByIdUserUseCases.execute(null)).rejects.toThrow(RpcException);
  });
});
