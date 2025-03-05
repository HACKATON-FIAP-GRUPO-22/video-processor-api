import { Test, TestingModule } from '@nestjs/testing';
import { IVideoUseCase } from '../../video/interfaces/video.usecase.interface';
import { ITaskGateway } from '../interfaces/task.gateway.interfaces';
import { Video } from '../../../application/video/entites/video';
import { TaskUseCase } from './task.usecase';

describe('TaskUseCase', () => {
  let taskUseCase: TaskUseCase;
  let videoUseCaseMock: jest.Mocked<IVideoUseCase>;
  let taskGatewayMock: jest.Mocked<ITaskGateway>;

  beforeEach(async () => {
    videoUseCaseMock = {
      processVideo: jest.fn(),
    } as jest.Mocked<IVideoUseCase>;

    taskGatewayMock = {
      getQueueVideoForProcess: jest.fn(),
      deleteVideoTask: jest.fn(),
      sendVideo: jest.fn(),
    } as jest.Mocked<ITaskGateway>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskUseCase,
        { provide: IVideoUseCase, useValue: videoUseCaseMock },
        { provide: ITaskGateway, useValue: taskGatewayMock },
      ],
    }).compile();

    taskUseCase = module.get<TaskUseCase>(TaskUseCase);
  });

  it('deve ser definido', () => {
    expect(taskUseCase).toBeDefined();
  });

  describe('processListVideos', () => {
    it('deve processar mensagens da fila e chamar o videoUseCase', async () => {
      const mockMessage = {
        Body: 'video123.mp4',
        ReceiptHandle: 'abc123',
      };

      taskGatewayMock.getQueueVideoForProcess.mockResolvedValue([mockMessage]);

      await taskUseCase.processListVideos();

      expect(taskGatewayMock.getQueueVideoForProcess).toHaveBeenCalled();
      expect(videoUseCaseMock.processVideo).toHaveBeenCalledWith(
        expect.any(Video),
      );
      expect(taskGatewayMock.deleteVideoTask).toHaveBeenCalledWith('abc123');
    });

    it('deve ignorar se não houver mensagens na fila', async () => {
      taskGatewayMock.getQueueVideoForProcess.mockResolvedValue([]);

      await taskUseCase.processListVideos();

      expect(videoUseCaseMock.processVideo).not.toHaveBeenCalled();
      expect(taskGatewayMock.deleteVideoTask).not.toHaveBeenCalled();
    });

    it('deve logar erro se processar vídeo falhar', async () => {
      const mockMessage = {
        Body: 'video123.mp4',
        ReceiptHandle: 'abc123',
      };

      taskGatewayMock.getQueueVideoForProcess.mockResolvedValue([mockMessage]);

      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      videoUseCaseMock.processVideo.mockRejectedValue(
        new Error('Erro no processamento'),
      );

      await taskUseCase.processListVideos();

      expect(errorSpy).toHaveBeenCalledWith(
        'TaskUseCase: Erro ao processar mensagem:',
        expect.any(Error),
      );

      expect(taskGatewayMock.deleteVideoTask).toHaveBeenCalledWith('abc123');

      errorSpy.mockRestore();
    });
  });

  describe('sendVideo', () => {
    it('deve enviar uma mensagem para a fila', async () => {
      const message = 'video123.mp4';

      await taskUseCase.sendVideo(message);

      expect(taskGatewayMock.sendVideo).toHaveBeenCalledWith(message);
    });
  });
});
