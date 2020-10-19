import { flattenData } from './flatten-data';

export const logger = {
  info(message: string): void {
    console.info(message);
    console.log();
  },

  log(label: string, data: any): void {
    console.log(`${label}:`, flattenData(data));
    console.log();
  },

  error(err: any): void {
    console.warn(JSON.stringify(err, null, 2));
    console.error(err);
  },
};
