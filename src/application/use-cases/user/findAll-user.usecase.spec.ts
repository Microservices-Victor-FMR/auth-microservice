import { Test } from '@nestjs/testing';
import { FindAllUserUseCases } from './findAll-user.usecase';
import { USER_REPOSITORY } from '../../../token.contants';
import { RpcException } from '@nestjs/microservices';

describe('FindByIdUserCases', () => {
  let findAllUserUseCases: FindAllUserUseCases;
  const mockUserRepository = {
    findAll: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllUserUseCases,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    findAllUserUseCases = moduleRef.get<FindAllUserUseCases>(FindAllUserUseCases);
  });

  it('Deberia retornar los usuarios ', async () => {
    const user = [{ id: 1, name: 'juan', email: 'juan@gmail.com', password: '123456' }];
    mockUserRepository.findAll.mockResolvedValue(user);

    const result = await findAllUserUseCases.execute();
    expect(result).toEqual(user);
  });

  it('Deberia retornar una respuesta ok si no hay usuarios registrados', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    await expect(findAllUserUseCases.execute()).rejects.toThrow(RpcException);
  });
});
