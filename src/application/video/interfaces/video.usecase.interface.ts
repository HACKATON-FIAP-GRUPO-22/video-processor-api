import { Video } from '../entites/video';

export abstract class IVideoUseCase {
  abstract processVideo(video: Video): Promise<void>;
}
