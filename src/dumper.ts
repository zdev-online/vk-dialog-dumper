import { extname } from "path";
import { API, IAudioAttachmentPayload, IPhotoAttachmentPayload, IPhotoSize } from "vk-io";
import { IDumpItem, IDumpResponse, IHistoryAttachment, IHistoryAttachmentsOptions, IMediaTypes, TDumpProgressCallback } from "./interfaces/dumper.interface";
import logger from "./logger";

const GET_HISTORY_ATTACHMENTS_COUNT: number = 200;

const getBetterPhotoSize = (sizes: IPhotoSize[]): string => sizes.sort((a, b) => b.width * b.height - a.width * a.height)[0].url;

const getPhotos = (data: { photo: IPhotoAttachmentPayload}[]) => {
  let urls: string[] = Array.from(new Set(data.map(x => {
    return getBetterPhotoSize(x.photo.sizes);
  })));
  return urls.map(url => ({ url, filename: `photo${new Date().getTime()}${extname(url).replace(/\?[\w\W]+/, '')}` }));
}

const getAudios = (audio: IAudioAttachmentPayload[]) => {
  let urls: string[] = Array.from(new Set(audio.map(x => x.url)));
  return urls.map(url => ({ url, filename: `audio${new Date().getTime()}${extname(url).replace(/\?[\w\W]+/, '')}` }));
}

async function getHistoryAttachments(api: API, options: IHistoryAttachmentsOptions): Promise<IHistoryAttachment> {
  try {
    const { items, next_from } = await api.messages.getHistoryAttachments({
      peer_id: options.peer_id,
      media_type: options.media_type,
      start_from: options.start_from,
      count: GET_HISTORY_ATTACHMENTS_COUNT
    });

    switch (options.media_type) {
      case 'photo': {
        return {
          data: getPhotos(items.map(x => x.attachment)),
          error: null,
          next_from
        };
      }
      case 'audio': {
        return {
          data: getAudios(items.map(x => x.attachment)),
          error: null,
          next_from
        }
      }
    }
  } catch (e) {
    return {
      data: [],
      error: e
    }
  }
}

export default async (api: API, options: Omit<IHistoryAttachmentsOptions, "start_from">, progress_callback: TDumpProgressCallback): Promise<IDumpResponse> => {
  let info = {
    file_links_count: 0,
    requests_count: 0
  }

  logger(`[dumper] -> peer_id = ${options.peer_id}`).white();

  let items: IDumpItem[] = [];
  let start_from: string = undefined;

  do {
    let {
      data,
      error,
      next_from
    } = await getHistoryAttachments(api, { ...options, start_from });

    info.requests_count++;

    if (error) {
      logger(`[getHistoryAttachments] -> ${error.message}\n${error.stack}`).red();
      return {
        items,
        info
      };
    }

    info.file_links_count += data.length;
    
    items = [...items, ...data];
    logger(`[dumper] -> ItemsLength: ${items.length}`).white();
    
    start_from = next_from;
    progress_callback(info);
  } while (!!start_from);

  return {
    items,
    info
  };
}
