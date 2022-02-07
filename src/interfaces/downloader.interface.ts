export type TFilename = (filetype: string) => string;

export type TFileSizeProgressCallback = (data: IGetFilesSizeResponse) => void;

export type TDownloadProgressCallback = (data: IDownloadResponse['info']) => void;

export interface IGetFilesSizeResponse {
  bytes: number;
  left_files: number;
}

export interface IDownloadResponse {
  info: {
    requests_success: number;
    requests_error: number;
    requests_total: number;
    requests_left: number;
    left_bytes: number;
    downloaded_bytes: number;
    full_file_paths: string[];
  }
}

export interface IDownloadFileResponse {
  error: Error;
  full_file_path: string;
  bytes: number;
}