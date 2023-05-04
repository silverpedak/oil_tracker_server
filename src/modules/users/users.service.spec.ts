import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, connect } from 'mongoose';
import { User, UserSchema } from './schemas';
import { getModelToken } from '@nestjs/mongoose';
import { createUserDtoStub } from '../../../test/stubs';

describe('UsersService', () => {
  let usersService: UsersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: mongoose.Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    })
      .useMocker(createMock)
      .compile();
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('findByUsername', () => {
    beforeAll(async () => {
      const createUser = createUserDtoStub();
      await userModel.create(createUser);
    });

    describe('successful', () => {
      it('returns user when username exists', async () => {
        const createdUser = createUserDtoStub();
        const userFound = await usersService.findByUsername(
          createdUser.username,
        );
        expect(userFound.username).toEqual(createdUser.username);
      });
    });

    describe('failed', () => {
      it('throws exception when username doesnt exist', async () => {
        await expect(usersService.findByUsername('')).rejects.toThrow();
      });
    });
  });

  describe('findById', () => {
    beforeAll(async () => {
      const createUser = createUserDtoStub();
      await userModel.create(createUser);
    });

    describe('successful', () => {
      it('returns user when id found', async () => {
        const createdUser = createUserDtoStub();
        const { _id } = await usersService.findByUsername(createdUser.username);
        const userId = _id.toString();
        const userFound = await usersService.findById(userId);
        expect(userFound.username).toEqual(createdUser.username);
      });
    });

    describe('failed', () => {
      it('throws exception when id not found', async () => {
        const createUser = createUserDtoStub();
        const { _id } = await userModel.create(createUser);
        const inCorrectId = _id.toString().replace(/\d/, 'a');
        await expect(usersService.findById(inCorrectId)).rejects.toThrow();
      });
    });
  });

  describe('create', () => {
    describe('successful', () => {
      it('return created user', async () => {
        const signUpDto = createUserDtoStub();
        const createdUser = await usersService.create(signUpDto);
        expect(createdUser.username).toEqual(signUpDto.username);
      });
    });

    describe('failed', () => {
      it('throws when username already exists', async () => {
        const createUser = createUserDtoStub();
        await userModel.create(createUser);
        const signUpDto = createUserDtoStub();
        await expect(usersService.create(signUpDto)).rejects.toThrow();
      });
    });
  });

  describe('update', () => {
    describe('successful', () => {
      it('returns updated user', async () => {
        const createUser = createUserDtoStub();
        const { _id } = await userModel.create(createUser);
        const userId = _id.toString();
        const newUsername = 'newUsername';
        const updatedUser = await usersService.update(userId, {
          username: newUsername,
        });
        expect(updatedUser.username).toEqual(newUsername);
      });
    });

    describe('failed', () => {
      it('throws when user not found', async () => {
        const createUser = createUserDtoStub();
        const { _id } = await userModel.create(createUser);
        const inCorrectId = _id.toString().replace(/\d/, 'a');
        await expect(usersService.update(inCorrectId, {})).rejects.toThrow();
      });
    });
  });
});
