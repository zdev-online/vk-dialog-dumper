import { IMediaTypes } from "./dumper.interface";

export interface IStartOptions {
  // Токен доступа (С разрешениями сообщения)
  token: string;
  // Тип получаемых медиа
  media_type: IMediaTypes;
  // ID Диалога VK
  peer_id: number;
  // Архивировать после загрузки?
  archive: boolean;
}