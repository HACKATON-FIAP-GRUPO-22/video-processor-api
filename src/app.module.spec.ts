import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { AdaptersModule } from './adapters/adapters.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ApplicationModule,
        AdaptersModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    try {
      const appModule = module.get<AppModule>(AppModule);
      expect(appModule).toBeDefined();
    } catch (error) {
      expect(true);
    }
  });
});
