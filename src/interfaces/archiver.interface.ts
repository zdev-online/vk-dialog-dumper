export interface IArchiverProgressData {
  total: number;
  processed: number;
  filename: string;
  path: string;
}

export type TArhiverProgressCallback = (data: IArchiverProgressData) => void;

export interface IArchiverResponse {
  message: string,
  error: null | Error,
  filename: string,
  path: string;
}