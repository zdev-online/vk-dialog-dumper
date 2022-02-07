import { Server as IOServer, Socket } from 'socket.io';

import { IO_START, SOCKET_ARCHIVE, SOCKET_DOWNLOAD, SOCKET_DUMP, SOCKET_ERROR, SOCKET_ERRORS, SOCKET_FILES_SIZE, SOCKET_FINISH, UNDEFINED_PROPERTY_MESSAGE_ERROR } from './constants';
import dumper from './dumper';
import { download, getFilesSize } from './downloader';
import { filesToZip } from './archiver';
import { IStartOptions } from './interfaces/io.interface';
import { isTokenValid, objectPropertysUndefined } from './utils';
import { API } from 'vk-io';
import logger from './logger';
import { SocketError } from './socket.error';
import { archive_path, download_path } from './config';

const io: IOServer = new IOServer({ serveClient: true });
let is_work: boolean = false;

io.on('connection', (socket: Socket) => {
  socket.on(IO_START, async (options: IStartOptions) => {
    if (is_work) {
      logger("[is_work] -> socket.emit").red();
      return socket.emit(SOCKET_ERROR, {
        data: new SocketError("Скрипт уже запущен!", SOCKET_ERRORS.IS_WORK)
      });
    }
    is_work = true;
    // Время начала работы скрипта
    let start_time = new Date().getTime();

    // Пустой ли объект настроек?
    let start_error = objectPropertysUndefined(options);
    if (start_error) {
      logger(`[start_error] -> Key: ${start_error.key}`).red();
      is_work = false;
      return socket.emit(SOCKET_ERROR, {
        data: new SocketError(UNDEFINED_PROPERTY_MESSAGE_ERROR[start_error.key], SOCKET_ERRORS.UNDEFINED_PROPERTY)
      });
    }
    const { token, peer_id, media_type, archive } = options;

    logger(`[Options] -> ${JSON.stringify(options, undefined, 2)}`).green()

    if (Number.isNaN(Number(peer_id))) {
      logger(`[Number.isNan] -> peer_id`).red();
      return socket.emit(SOCKET_ERROR, {
        data: new SocketError(UNDEFINED_PROPERTY_MESSAGE_ERROR['peer_id'], SOCKET_ERRORS.UNDEFINED_PROPERTY)
      });
    }

    const api: API = new API({ token });

    const isValidToken = await isTokenValid(api);
    logger(`[IsValidToken] -> ${isValidToken}`).white();
    if (!isValidToken) {
      is_work = false;
      return socket.emit(SOCKET_ERROR, {
        data: new SocketError(`Не валидный токен!`, SOCKET_ERRORS.INVALID_TOKEN)
      });
    }

    // Получение ссылок на файлы
    let dump_info = await dumper(api, { media_type, peer_id }, (data) => socket.emit(SOCKET_DUMP, data));
    if (!dump_info.items.length) {
      logger(`[Empty Dump Items] -> Length: 0`).red();
      is_work = false;
      return socket.emit(SOCKET_FINISH, {
        time: new Date().getTime() - start_time,
        message: "В диалоге не найдено вложений!",
        details: "Если это не так, обратитесь к разработчику!",
        data: {
          files_count: 0,
          files_size: 0,
          files_path: download_path,
          archive: false
        }
      });
    }

    // Получение размера файлов
    let urls = dump_info.items.map(x => x.url);
    let files_size = await getFilesSize(urls, (data) => socket.emit(SOCKET_FILES_SIZE, data));

    // Скачивание файлов
    let download_file = await download(dump_info.items, files_size.bytes, (data) => socket.emit(SOCKET_DOWNLOAD, data));

    // Архивация файлов (?)
    if (archive) {
      let zip = await filesToZip(download_file.info.full_file_paths, media_type, (data) => socket.emit(SOCKET_ARCHIVE, data));
      if (zip.error) {
        logger(`[ZipError] -> Message: ${zip.error.message}`).red();
        is_work = false;
        return socket.emit(SOCKET_FINISH, {
          time: new Date().getTime() - start_time,
          message: "Файлы скачаны, но при архивировании произошла ошибка!",
          details: "(Файлы все равно будут доступны)",
          data: {
            files_count: download_file.info.requests_success,
            files_size: download_file.info.downloaded_bytes,
            files_path: download_path,
            archive: false
          }
        });
      }
      logger(`[Finish] -> ${new Date().toLocaleTimeString()}`).white();
      is_work = false;
      return socket.emit(SOCKET_FINISH, {
        time: new Date().getTime() - start_time,
        message: "Файлы скачаны и заархивированы!",
        details: "Спасибо за использование VDD :-)",
        data: {
          files_count: download_file.info.requests_success,
          files_size: download_file.info.downloaded_bytes,
          files_path: download_path,
          archive: {
            path: zip.path,
            filename: zip.filename
          }
        }
      });
    }
    logger(`[Finish] -> ${new Date().toLocaleTimeString()}`).white();
    is_work = false;
    return socket.emit(SOCKET_FINISH, {
      time: new Date().getTime() - start_time,
      message: "Файлы скачаны и сохранены!",
      details: "Спасибо за использование VDD :-)",
      data: {
        files_count: download_file.info.requests_success,
        files_size: download_file.info.downloaded_bytes,
        files_path: download_path,
        archive: false
      }
    });
  });
});

export default io;