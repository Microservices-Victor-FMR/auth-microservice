import { Test } from '@nestjs/testing';
import { FindAllUserCases } from './findAll-user.usecase';
import { USER_REPOSITORY } from '../../../token.contants';

describe('FindByIdUserCases', () => {
  let findAllUserCases: FindAllUserCases;
  const mockUserRepository = {
    findAll: jest.fn(),
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllUserCases,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    findAllUserCases = moduleRef.get<FindAllUserCases>(FindAllUserCases);
  });

  it('Deberia retornar los usuarios ', async () => {
    const user = [{ id: 1, name: 'juan', email: 'juan@gmail.com', password: '123456' }];
    mockUserRepository.findAll.mockResolvedValue(user);

    const result = await findAllUserCases.execute();
    expect(result).toEqual(user);
  });

  it('Deberia retornar una respuesta ok si no hay usuarios registrados', async () => {
    mockUserRepository.findAll.mockResolvedValue('No hay usuarios registrados');

    const user = await findAllUserCases.execute();
    expect(user).toBe('No hay usuarios registrados');
  });
});
