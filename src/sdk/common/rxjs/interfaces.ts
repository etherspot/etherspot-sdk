/**
 * @ignore
 */
export type PlainObject<T extends object, K extends keyof T = keyof T> = {
  [key in K]?: any;
};
