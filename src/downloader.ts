import axios from "axios";
import { extname, join } from "path";
import { createWriteStream } from "fs";

import { download_path } from "./config";
import { IDownloadFileResponse, IDownloadResponse, IGetFilesSizeResponse, TDownloadProgressCallback, TFilename, TFileSizeProgressCallback } from "./interfaces/downloader.interface";
import { IDumpItem } from "./interfaces/dumper.interface";
import { Stream } from "stream";
import { createDirIfNotExists } from "./utils";

async function getFileSize(url: string) {
  try {
    let { headers } = await axios.head(url);
    return !Number.isNaN(Number(headers['Content-Length'])) ? Number(headers['Content-Length']) : 0;
  } catch (e) {
    return 0;
  }
}

function downloadFile(item: IDumpItem, filename?: TFilename): Promise<IDownloadFileResponse> {
  const full_file_path: string = join(download_path, `${filename ? filename(extname(item.filename)) : item.filename}`);
  return new Promise(async resolve => {
    try {
      const response = await axios.get<Stream>(item.url, { responseType: 'stream' });
      const writter = createWriteStream(full_file_path);
      const stream = response.data.pipe(writter);

      stream.on('error', (error) => resolve({
        error,
        full_file_path,
        bytes: 0
      }));


      stream.on('finish', () => resolve({
        error: null,
        full_file_path,
        bytes: Number.isNaN(response.headers['Content-Length']) ? Number(response.headers['Content-Length']) : 0
      }));

    } catch (error) {
      return resolve({
        error,
        full_file_path,
        bytes: 0
      });
    }
  });
}

export async function getFilesSize(urls: string[], progress_callback: TFileSizeProgressCallback): Promise<IGetFilesSizeResponse> {
  let bytes: number = 0;
  for (let i = 0; i < urls.length; i++) {
    await getFileSize(urls[i]).then(size => {
      bytes += size;
      return progress_callback({
        bytes,
        left_files: urls.length - i
      });
    });
  }
  return {
    bytes,
    left_files: 0
  };
}

export async function download(items: IDumpItem[], bytes_to_download: number, progress_callback: TDownloadProgressCallback): Promise<IDownloadResponse> {
  createDirIfNotExists(download_path);
  
  let info: IDownloadResponse['info'] = {
    requests_success: 0,
    requests_error: 0,
    requests_total: 0,
    requests_left: items.length,
    left_bytes: bytes_to_download,
    downloaded_bytes: 0,
    full_file_paths: []
  }

  for (let i = 0; i < items.length; i++) {
    await downloadFile(items[i]).then((data) => {
      if (data.error) {
        info.requests_error++;
      } else {
        info.requests_success++;
        info.full_file_paths.push(data.full_file_path);
      }
      info.requests_left--;
      info.requests_total++;
      info.downloaded_bytes += data.bytes;
      info.left_bytes -= data.bytes;
      return progress_callback({ ...info });
    });
  }
  return {
    info: {
      ...info,
      left_bytes: 0,
      requests_left: 0
    }
  }
}