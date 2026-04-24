import { randomUUID } from 'node:crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/providers/prisma/prisma.service';

interface UserRecord {
  id: string;
  nama: string;
  username: string;
  password: string;
}

interface CategoryRecord {
  id: string;
  nama: string;
  deskripsi: string;
}

interface TaskRecord {
  id: string;
  judul: string;
  deskripsi?: string;
  status: string;
  userId: string;
  categoryId: string;
}

interface StoreState {
  users: UserRecord[];
  categories: CategoryRecord[];
  tasks: TaskRecord[];
}

const createEmptyState = (): StoreState => ({
  users: [],
  categories: [],
  tasks: [],
});

const createPrismaHarness = () => {
  let state = createEmptyState();

  const findUser = (where: { id?: string; username?: string }) => {
    if (where.id) {
      return state.users.find((user) => user.id === where.id) ?? null;
    }

    if (where.username) {
      return state.users.find((user) => user.username === where.username) ?? null;
    }

    return null;
  };

  const findCategory = (where: { id?: string }) => {
    if (where.id) {
      return state.categories.find((category) => category.id === where.id) ?? null;
    }

    return null;
  };

  const attachTaskRelations = (task: TaskRecord) => ({
    ...task,
    user: state.users.find((user) => user.id === task.userId) ?? null,
    category:
      state.categories.find((category) => category.id === task.categoryId) ?? null,
  });

  return {
    prisma: {
      user: {
        create: jest.fn(async ({ data }: { data: Omit<UserRecord, 'id'> }) => {
          const user: UserRecord = {
            id: randomUUID(),
            ...data,
          };

          state.users.push(user);
          return user;
        }),
        findMany: jest.fn(async () => [...state.users].reverse()),
        findUnique: jest.fn(
          async ({
            where,
          }: {
            where: { id?: string; username?: string };
          }) => findUser(where),
        ),
        update: jest.fn(
          async ({
            where,
            data,
          }: {
            where: { id: string };
            data: Partial<Omit<UserRecord, 'id'>>;
          }) => {
            const user = findUser(where);
            if (!user) {
              throw new Error('User not found');
            }

            Object.assign(user, data);
            return user;
          },
        ),
        delete: jest.fn(async ({ where }: { where: { id: string } }) => {
          state.users = state.users.filter((user) => user.id !== where.id);
        }),
      },
      category: {
        create: jest.fn(
          async ({ data }: { data: Omit<CategoryRecord, 'id'> }) => {
            const category: CategoryRecord = {
              id: randomUUID(),
              ...data,
            };

            state.categories.push(category);
            return category;
          },
        ),
        findMany: jest.fn(async () => [...state.categories].reverse()),
        findUnique: jest.fn(
          async ({ where }: { where: { id: string } }) => findCategory(where),
        ),
        update: jest.fn(
          async ({
            where,
            data,
          }: {
            where: { id: string };
            data: Partial<Omit<CategoryRecord, 'id'>>;
          }) => {
            const category = findCategory(where);
            if (!category) {
              throw new Error('Category not found');
            }

            Object.assign(category, data);
            return category;
          },
        ),
        delete: jest.fn(async ({ where }: { where: { id: string } }) => {
          state.categories = state.categories.filter(
            (category) => category.id !== where.id,
          );
        }),
      },
      task: {
        create: jest.fn(async ({ data }: { data: Omit<TaskRecord, 'id'> }) => {
          const task: TaskRecord = {
            id: randomUUID(),
            status: data.status ?? 'pending',
            ...data,
          };

          state.tasks.push(task);
          return task;
        }),
        findMany: jest.fn(async () => state.tasks.map(attachTaskRelations)),
        findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
          const task = state.tasks.find((item) => item.id === where.id) ?? null;
          return task ? attachTaskRelations(task) : null;
        }),
        update: jest.fn(
          async ({
            where,
            data,
          }: {
            where: { id: string };
            data: Partial<Omit<TaskRecord, 'id'>>;
          }) => {
            const task = state.tasks.find((item) => item.id === where.id);
            if (!task) {
              throw new Error('Task not found');
            }

            Object.assign(task, data);
            return task;
          },
        ),
        delete: jest.fn(async ({ where }: { where: { id: string } }) => {
          state.tasks = state.tasks.filter((task) => task.id !== where.id);
        }),
      },
    },
    reset() {
      state = createEmptyState();
      jest.clearAllMocks();
    },
    getState() {
      return state;
    },
  };
};

describe('App (e2e)', () => {
  let app: INestApplication;
  const prismaHarness = createPrismaHarness();

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1d';
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/project_test_magang';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaHarness.prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    prismaHarness.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  const registerUser = async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send({
      nama: 'Test User',
      username: 'test-user',
      password: 'secret123',
    });

    return response;
  };

  const loginUser = async () => {
    await registerUser();

    return request(app.getHttpServer()).post('/auth/login').send({
      username: 'test-user',
      password: 'secret123',
    });
  };

  const createCategory = async () => {
    const response = await request(app.getHttpServer()).post('/categories').send({
      nama: 'Backend',
      deskripsi: 'Task kategori backend',
    });

    return response;
  };

  it('registers a user and stores a hashed password', async () => {
    const response = await registerUser();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: 'Register success',
      data: {
        nama: 'Test User',
        username: 'test-user',
      },
    });
    expect(response.body.data.id).toEqual(expect.any(String));

    const [savedUser] = prismaHarness.getState().users;
    expect(savedUser.password).not.toBe('secret123');
    expect(savedUser.password).toMatch(/^\$2[aby]\$/);
  });

  it('rejects duplicate usernames during registration', async () => {
    await registerUser();

    const response = await request(app.getHttpServer()).post('/auth/register').send({
      nama: 'Another User',
      username: 'test-user',
      password: 'secret123',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Username already exists');
  });

  it('returns an access token for a valid login', async () => {
    const response = await loginUser();

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toEqual(expect.any(String));
  });

  it('validates user id params as UUID', async () => {
    const response = await request(app.getHttpServer()).get('/users/not-a-uuid');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('id must be a UUID');
  });

  it('creates a category through the real HTTP endpoint', async () => {
    const response = await createCategory();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nama: 'Backend',
      deskripsi: 'Task kategori backend',
    });
    expect(response.body.id).toEqual(expect.any(String));
  });

  it('blocks task creation without a bearer token', async () => {
    const response = await request(app.getHttpServer()).post('/tasks').send({
      judul: 'Protected task',
      status: 'pending',
      userId: randomUUID(),
      categoryId: randomUUID(),
    });

    expect(response.status).toBe(401);
  });

  it('creates a task when auth and related entities are valid', async () => {
    const registerResponse = await registerUser();
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'test-user',
      password: 'secret123',
    });
    const categoryResponse = await createCategory();

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({
        judul: 'Implement e2e',
        deskripsi: 'Pastikan endpoint tasks teruji',
        status: 'pending',
        userId: registerResponse.body.data.id,
        categoryId: categoryResponse.body.id,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      judul: 'Implement e2e',
      deskripsi: 'Pastikan endpoint tasks teruji',
      status: 'pending',
      userId: registerResponse.body.data.id,
      categoryId: categoryResponse.body.id,
    });
    expect(response.body.id).toEqual(expect.any(String));
  });

  it('returns 404 when task category does not exist', async () => {
    const registerResponse = await registerUser();
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'test-user',
      password: 'secret123',
    });

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({
        judul: 'Broken relation',
        status: 'pending',
        userId: registerResponse.body.data.id,
        categoryId: randomUUID(),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Category not found');
  });
});
