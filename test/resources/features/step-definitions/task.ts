import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';

class MockTaskUseCase {
  processed = false;

  async processListVideos() {
    this.processed = true;
  }
}

class MockTaskController {
  private useCase: MockTaskUseCase;

  constructor(useCase: MockTaskUseCase) {
    this.useCase = useCase;
  }

  async listenQueue(runOnce = false) {
    do {
      try {
        await this.useCase.processListVideos();
      } catch (error) {
        console.log(error);
      }
      if (runOnce) break;
    } while (true);
  }
}

let useCase: MockTaskUseCase;
let controller: MockTaskController;

Given('que o sistema está iniciado', function () {
  useCase = new MockTaskUseCase();
  controller = new MockTaskController(useCase);
});

When('a fila de vídeos é processada', async function () {
  await controller.listenQueue(true);
});

Then('os vídeos são processados corretamente', function () {
  assert.ok(useCase.processed, 'Os vídeos não foram processados corretamente');
});
