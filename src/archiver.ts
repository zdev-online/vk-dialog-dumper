import archiver, { Archiver } from "archiver";
import { createReadStream, createWriteStream, WriteStream } from "fs";
import { basename, join } from "path";
import { archive_path } from "./config";
import { IArchiverResponse, TArhiverProgressCallback } from "./interfaces/archiver.interface";
import logger from "./logger";
import { createDirIfNotExists } from "./utils";

export function filesToZip(files: string[], media_type: string, progress_callback: TArhiverProgressCallback): Promise<IArchiverResponse> {
  return new Promise(async (resolve) => {
    createDirIfNotExists(archive_path);
    const archive_filename: string = `${media_type}s_${new Date().getTime()}.zip`;
    const output: WriteStream = createWriteStream(join(archive_path, archive_filename));
    
    const zip: Archiver = archiver('zip', {
      zlib: {
        level: 9
      }
    });

    // Когда создание архива завершено
    output.on('close', function() {
      return resolve({
        message: "Архивирование завершено!",
        error: null,
        filename: archive_filename,
        path: archive_path
      });
    });
    
    // Когда источник данных - удаляется//перемещается и т.п
    output.on('end', function() {
      return resolve({
        message: "Источник данных - отсутствует!",
        error: null,
        filename: archive_filename,
        path: archive_path
      });
    });

    // Прогресс архивации
    zip.on('progress', ({ fs }) => {
      return progress_callback({
        total: fs.totalBytes,
        processed: fs.processedBytes,
        filename: archive_filename,
        path: archive_path
      });
    });
    
    // Предупреждение или крит.ошибка
    zip.on('warning', function(error) {
      if (error.code === 'ENOENT') {
        logger(`[Архивация] Предупреждение: ${error.message}`).yellow();
      } else {
        logger(`[Архивация] Ошибка: ${error.message}`).red();
        return resolve({
          message: `Ошибка: ${error.message}`,
          error: error,
          filename: archive_filename,
          path: archive_path
        });
      }
    });
    
    // Критическая ошибка
    zip.on('error', function(error) {
      logger(`[Архивация] Ошибка: ${error.message}\n${error.stack}`).red();
      return resolve({
        error,
        message: `Ошибка: ${error.message}`,
        filename: archive_filename,
        path: archive_path
      });
    });
    
    // Запись сжатых файлов в архив
    zip.pipe(output);

    // Добавление файлов в архив
    for (let i = 0; i < files.length; i++) {
      console.log(`[Archiver] File-${i} -> ${files[i]}`);
      zip.append(createReadStream(files[i]), { name: basename(files[i]) });
    }

    // Начать процесс завершения сжатия
    await zip.finalize();
  });
}