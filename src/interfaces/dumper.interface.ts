export interface IHistoryAttachment {
  data: IDumpItem[],
  error: null | Error,
  next_from?: string
}

export interface IDumpItem {
  url: string;
  filename: string;
}

export interface IHistoryAttachmentsOptions {
  peer_id: number;
  media_type: IMediaTypes;
  start_from?: string;
}

export interface IDumpResponse {
  info: {
    file_links_count: number;
    requests_count: number;
  };
  items: IDumpItem[]
}

export type IMediaTypes = "photo" | "audio";

export type TDumpProgressCallback = (data: IDumpResponse['info']) => void;