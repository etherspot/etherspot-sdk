import { StoredSession, SessionStorageLike } from './interfaces';

export class SessionStorage implements SessionStorageLike {
  private data = new Map<string, StoredSession>();

  async setSession(walletAddress: string, session: StoredSession): Promise<void> {
    this.data.set(walletAddress, session);
  }

  async getSession(walletAddress: string): Promise<StoredSession> {
    return this.data.get(walletAddress) || null;
  }
}
