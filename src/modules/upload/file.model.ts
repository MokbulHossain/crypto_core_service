export interface BufferedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: AppMimeType;
    size: number;
    buffer: Buffer | string;
  }
  
  export interface BufferedCsvFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: AppMimeType2;
    size: number;
    path: string;
    buffer: Buffer | string;
  }

  export interface StoredFile extends HasFile, StoredFileMetadata {}
  
  export interface HasFile {
    file: Buffer | string;
  }
  export interface StoredFileMetadata {
    id: string;
    name: string;
    encoding: string;
    mimetype: AppMimeType;
    size: number;
    updatedAt: Date;
    fileSrc?: string;
  }
  
  export type AppMimeType =
    | 'image/png'
    | 'image/jpg'
    | 'image/jpeg';

    export type AppMimeType2 = | 'text/csv' | 'application/octet-stream'