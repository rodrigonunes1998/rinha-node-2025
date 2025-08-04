const { createClient } = require('redis');

const redis = createClient({
  url: 'redis://redis:6379', // host do container
});

redis.on('connect', () => console.log('✅ Conectado ao Redis'));
redis.on('error', (err) => console.error('❌ Erro no Redis:', err));

(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
})();

module.exports = redis;