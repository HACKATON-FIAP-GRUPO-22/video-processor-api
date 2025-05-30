import { Readable } from 'stream';

export abstract class IStorageUseCase {
  abstract uploadFile(
    id: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<void>;

  abstract downloadFile(id: string): Promise<Readable>;
  abstract deleteFile(id: string): Promise<void>;
}
