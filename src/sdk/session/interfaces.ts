export interface StoredSession<D = Date> {
  token: string;
  ttl: number;
  expireAt: D;
}

export interface SessionOptions {
  storage?: SessionStorageLike;
}

export interface SessionStorageLike {
  setSession(walletAddress: string, session: StoredSession): Promise<void>;

  getSession(walletAddress: string): Promise<StoredSession>;
}
