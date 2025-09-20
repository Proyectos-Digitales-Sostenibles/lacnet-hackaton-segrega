import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { jestAfterAll, jestBeforeAll } from './jest-helpers';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => jestBeforeAll().then((a) => (app = a)));

  it('/health/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/ping')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(typeof response.body.timestamp).toBe('number'); // Check that timestamp is a number
        expect(response.body).toHaveProperty('headers', { test: 'ping' });
      });
  });

  afterAll(() => jestAfterAll(app));
});
