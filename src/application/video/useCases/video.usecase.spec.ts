import { Test, TestingModule } from '@nestjs/testing';
import { VideoUseCase } from './video.usecase';
import { IStorageUseCase } from '../../storage/interfaces/storage.interface';
import { ITaskUseCase } from '../../task/interfaces/task.usecase.interfaces';
import { Readable } from 'stream';
import { Video } from '../entites/video';

describe('VideoUseCase', () => {
  let useCase: VideoUseCase;
  let storageMock: jest.Mocked<IStorageUseCase>;
  let taskMock: jest.Mocked<ITaskUseCase>;

  beforeEach(async () => {
    storageMock = {
      uploadFile: jest.fn(),
      downloadFile: jest.fn(),
      deleteFile: jest.fn(),
    } as any;

    taskMock = {
      sendVideo: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoUseCase,
        { provide: IStorageUseCase, useValue: storageMock },
        { provide: ITaskUseCase, useValue: taskMock },
      ],
    }).compile();

    useCase = module.get<VideoUseCase>(VideoUseCase);
  });

  it('should process video successfully', async () => {
    const video = new Video('sample-video.mp4');

    const videoStream = new Readable();
    videoStream.push(Buffer.from('mock video content'));
    videoStream.push(null);

    storageMock.downloadFile.mockResolvedValue(videoStream);

    await useCase.processVideo(video);

    expect(storageMock.downloadFile).toHaveBeenCalledWith('sample-video.mp4');
    expect(taskMock.sendVideo).toHaveBeenCalledWith(
      expect.stringContaining(`{"id": "sample-video.mp4", "status": "erro"}`),
    );
  });

  it('deve capturar erro e enviar mensagem de erro', async () => {
    const video = new Video('video_erro.mp4');

    await useCase.processVideo(video);

    expect(taskMock.sendVideo).toHaveBeenCalledWith(
      `{"id": "video_erro.mp4", "status": "erro"}`,
    );
  });

  it('deve capturar erro em downloadFileToDisk e disparar status erro', async () => {
    const video = new Video('video_teste.mp4');

    storageMock.downloadFile.mockRejectedValue(new Error('S3 Error'));

    await useCase.processVideo(video);

    expect(taskMock.sendVideo).toHaveBeenCalledWith(
      `{"id": "video_teste.mp4", "status": "erro"}`,
    );
  });
});
