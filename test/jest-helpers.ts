import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

const debug = false;

export const jestBeforeAll = async () => {
  if (debug) console.log('Creating app...');
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  if (debug) console.log('Starting app...');
  await app.init();
  if (debug) console.log('Started app!');
  return app;
};

export const jestAfterAll = async (app: INestApplication) => {
  //Stop container as well as postgresClient
  if (debug) console.log('Closing app...');
  await app.close();
  if (debug) console.log('Closed app!');
};
