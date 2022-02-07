import { existsSync, mkdirSync } from "fs";
import { API } from "vk-io";
import logger from "./logger";

export const createDirIfNotExists = (dir: string) => existsSync(dir) ? undefined : mkdirSync(dir, { recursive: true });

export const objectPropertysUndefined = (object: object) => {
  for (let key in object) {
    if (typeof object[key] === 'undefined' || !String(object[key]).length) {
      return { key };
    }
  }
  return false;
}

export const isTokenValid = (api: API): Promise<boolean> => {
  return new Promise(async (ok) => {
    const result = await Promise.allSettled([
      api.users.get({}),
      api.groups.getById({})
    ]);

    
    if (result.some(x => x.status == 'fulfilled')) {
      return ok(true);
    } else {
      logger(`${(result[0] as PromiseRejectedResult).reason}`).red();
      return ok(false);
    }
  });
}