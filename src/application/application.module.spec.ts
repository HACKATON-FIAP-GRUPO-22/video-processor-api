import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationModule } from './application.module';

describe('ApplicationModule', () => {
  let module: ApplicationModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    module = testingModule.get<ApplicationModule>(ApplicationModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
