export declare class StorageService {
    private bucket;
    getPresignedUrl(key: string, contentType: string): Promise<string>;
    uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string>;
    downloadBuffer(key: string): Promise<Buffer>;
    uploadLocal(file: Express.Multer.File): Promise<string>;
}
