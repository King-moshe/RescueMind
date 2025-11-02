const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../testUtils/appForTest');
const User = require('../api/models/User');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

test('register -> success and returns accessToken', async () => {
  const payload = { name: 'Alice', phone: '+12345678901', password: 'password123' };
  const res = await request(app).post('/api/auth/register').send(payload).expect(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data).toHaveProperty('accessToken');
});

test('login -> success with correct credentials', async () => {
  const payload = { name: 'Bob', phone: '+19876543210', password: 'passw0rd!' };
  await request(app).post('/api/auth/register').send(payload).expect(200);
  const res = await request(app).post('/api/auth/login').send({ phone: payload.phone, password: payload.password }).expect(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data).toHaveProperty('accessToken');
});

test('login -> invalid credentials', async () => {
  const res = await request(app).post('/api/auth/login').send({ phone: '+00000000000', password: 'nope' }).expect(401);
  expect(res.body.status).toBe('error');
});
