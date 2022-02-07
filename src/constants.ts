export const IO_START = "IO:EVENT:START";

export const SOCKET_ERRORS = {
  UNDEFINED_PROPERTY: "UNDEFINED:PROPERTY",
  ZIP_ARCHIVE_ERROR: "ZIP:ARCHIVE:ERROR",
  EMPTY_DUMP_ITEMS: "EMPTY:DUMP:ITEMS",
  IS_WORK: "IS:WORK",
  INVALID_TOKEN: "INVALID:TOKEN"
}

export const UNDEFINED_PROPERTY_MESSAGE_ERROR = {
  token: `Токен доступа не указан!`,
  media_type: `Тип медиа - не выбран!`,
  peer_id: `ID диалога не указан (Число)!`,
  archive: `Найстрока архивирования - не указана!`
}

export const SOCKET_ERROR = "SOCKET:EVENT:ERROR";
export const SOCKET_DUMP = "SOCKET:EVENT:DUMP";
export const SOCKET_FILES_SIZE = "SOCKET:EVENT:FILES:SIZE";
export const SOCKET_DOWNLOAD = "SOCKET:EVENT:DOWNLOAD";
export const SOCKET_ARCHIVE = "SOCKET:EVENT:ARCHIVE";
export const SOCKET_FINISH = "SOCKET:EVENT:FINISH";