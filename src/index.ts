import serve_static from 'serve-static'; 
import { createServer, Server } from 'http';


import io from './io.server';
import { app_host, app_mode, app_port, client_path } from './config';
import logger from './logger';
import open from 'open';

const server: Server = createServer((req, res) => serve_static(client_path)(req, res, () => {}));

server.listen(app_port, app_host,() => {
  console.clear();
  const address = `http://${app_host}:${app_port}/`; 
  logger(`Приложение работает по адресу: ${address}`).green();
  logger(`Пытаюсь открыть браузер`).white();
  app_mode != "dev" && open(address).then((_process) => logger("Браузер открыт!").green()).catch((error) => {
    logger(`Не удалось открыть браузер по причине: ${error.message}`).red();
  });
  return io.attach(server);
});