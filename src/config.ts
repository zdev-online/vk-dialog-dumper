import { join } from "path";

// Папка с архивами
export const archive_path: string = join(__dirname, "..", "archives");
// Папка с скачанными файлами
export const download_path: string = join(__dirname, "..", "downloads");
// Папка с интерфейсом
export const client_path: string = join(__dirname, '..', 'client');
// Порт приложения (Не рекомендую ставить 80, т.к скорее всего он уже занят)
export const app_port: number = 8080;
// Адрес приложения (localhost \ твой локальный IP в сети)
export const app_host: string = "192.168.0.16";
// Тип работы приложения (dev \ prod)
export const app_mode: string = "dev";