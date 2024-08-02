import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/userModel';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.email).toBe('testuser@example.com');
  });

  it('should throw validation error for missing required fields', async () => {
    const user = new User({});
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should enforce unique constraint on email', async () => {
    const user1 = new User({
      username: 'user1',
      email: 'unique@example.com',
      password: 'password123',
    });
    await user1.save();

    const user2 = new User({
      username: 'user2',
      email: 'unique@example.com',
      password: 'password456',
    });
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error);
    expect(err.code).toBe(11000); // Duplicate key error code
  });
});
