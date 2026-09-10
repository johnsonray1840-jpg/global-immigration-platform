import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {
    let url = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    // Clean any accidental CLI command prefixes if pasted
    if (url.includes('redis-cli')) {
      const match = url.match(/(rediss?:\/\/[^\s'"]+)/);
      if (match) url = match[1];
    }
    // If connecting to Upstash without rediss://, upgrade to rediss:// for TLS
    if (url.includes('upstash.io') && url.startsWith('redis://')) {
      url = url.replace('redis://', 'rediss://');
    }
    try {
      this.client = new Redis(url, {
        tls: url.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
        maxRetriesPerRequest: 3,
      });
      this.client.on('error', (err) => console.error('Redis connection warning:', err.message));
    } catch (err: any) {
      console.error('Failed to initialize Redis client:', err.message);
      this.client = new Redis({ lazyConnect: true });
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
