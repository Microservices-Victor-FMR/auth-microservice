import { Test } from '@nestjs/testing';
import { FindByIdUserCases } from './findById-user.usecase';
import { USER_REPOSITORY } from '../../../token.contants';
import { RpcException } from '@nestjs/microservices';

describe('FindByIdUserCases', () => {
  let findByIdindByIdUserCases: FindByIdUserCases;
  const mockUserRepository = {
    findById: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByIdUserCases,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    findByIdindByIdUserCases = moduleRef.get<FindByIdUserCases>(FindByIdUserCases);
  });

  it('Deberia retornar un usuario si existe', async () => {
    const user = { id: '1', name: 'Juan' };
    mockUserRepository.findById.mockResolvedValue(user);
    const result = await findByIdindByIdUserCases.execute('1');

    expect(result).toEqual(user);
  });
  it('Deberia lanzar un error si no encuentra el usuario', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(findByIdindByIdUserCases.execute(null)).rejects.toThrow(RpcException);
  });
});
