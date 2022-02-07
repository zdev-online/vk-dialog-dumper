import {
  info_block, info_container, interface_container,
  interface_form, IO_START, SOCKET_ARCHIVE,
  SOCKET_DOWNLOAD, SOCKET_DUMP, SOCKET_ERROR,
  SOCKET_FILES_SIZE, SOCKET_FINISH
} from './constants.js';
import {
  serialize_form, show_error, show_finish_block,
  update_archive_info, update_download_info,
  update_dump_info, update_files_size_info
} from './utils.js';

const socket = io();

document.getElementById(interface_form).addEventListener('submit', (event) => {
  event.preventDefault();
  let start_options = serialize_form(document.querySelector('form'));

  start_options.archive = start_options.archive == 'true';
  start_options.peer_id = Number(start_options.peer_id);

  document.getElementById(interface_container).style.display = 'none';
  document.getElementById(interface_form).style.display = 'none';
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_container).style.display = 'flex';

  return socket.emit(IO_START, start_options);
});

// Информация об ошибках
socket.on(SOCKET_ERROR, ({ data }) => {
  console.error("[SOCKET_ERROR] => \n", JSON.stringify(data, undefined, 2));
  return show_error(data.message);
});

// Информация о получении ссылок
socket.on(SOCKET_DUMP, data => {
  console.debug(JSON.stringify(data, undefined, 2));
  return update_dump_info(data);
});

// Информация о получении размера файлов
socket.on(SOCKET_FILES_SIZE, data => {
  console.debug(JSON.stringify(data, undefined, 2));
  return update_files_size_info(data);
});

// Информация о скачивании файлов
socket.on(SOCKET_DOWNLOAD, data => {
  console.debug(JSON.stringify(data, undefined, 2));
  return update_download_info(data);
});

// Информация архивации
socket.on(SOCKET_ARCHIVE, data => {
  console.debug(JSON.stringify(data, undefined, 2));
  return update_archive_info(data);
});

// Информация завершения
socket.on(SOCKET_FINISH, data => {
  console.debug(JSON.stringify(data, undefined, 2));
  return show_finish_block(data);
});