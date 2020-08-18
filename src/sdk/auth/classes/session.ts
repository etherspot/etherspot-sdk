import { WithTypename } from '../../common';

export class Session extends WithTypename {
  static TTL_MARGIN = 3000;

  token: string;

  ttl: number;

  expireAt?: Date;

  refresh?(): void {
    const now = new Date();
    this.expireAt = new Date(now.getTime() + this.ttl * 1000);
  }

  verify?(): boolean {
    return this.expireAt.getTime() + Session.TTL_MARGIN > Date.now();
  }
}
