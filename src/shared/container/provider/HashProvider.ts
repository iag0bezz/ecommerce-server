import { hash, compare } from 'bcrypt';
import { randomUUID } from 'node:crypto';

export class HashProvider {
  async hash(content: string): Promise<string> {
    return hash(content, 8);
  }

  async compare(content: string, hash: string): Promise<boolean> {
    return compare(content, hash);
  }

  random(): string {
    return randomUUID();
  }
}
