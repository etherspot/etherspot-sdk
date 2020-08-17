import { Synchronized } from '../../common';

export class Session extends Synchronized {
  token: string;

  ttl: number;

  get valid(): boolean {
    return this.synchronizedAt.getTime() + (this.ttl - 5) * 1000 > Date.now();
  }
}
