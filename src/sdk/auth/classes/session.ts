import { Exclude } from 'class-transformer';

export class Session {
  token: string;

  ttl: number;

  @Exclude()
  __typename: any;
}
