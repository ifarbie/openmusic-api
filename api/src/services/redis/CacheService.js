const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    // eslint-disable-next-line no-console
    this._client.on('error', (error) => console.log(error));

    this._client.connect();
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (!result) throw new Error('Cache tidak ditemukan');

    return JSON.parse(result);
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
