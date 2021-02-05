export interface StoredSession {
  token: string;
  ttl: number;
  expireAt: Date;
}

export interface SessionOptions {
  storage?: SessionStorageLike;
}

export interface SessionStorageLike {
  setSession(walletAddress: string, session: StoredSession): Promise<void>;

  getSession(walletAddress: string): Promise<StoredSession>;
}
