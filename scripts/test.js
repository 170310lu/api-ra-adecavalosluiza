const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const prismaCli = path.join(root, 'node_modules', 'prisma', 'build', 'index.js');
const testEnv = {
  ...process.env,
  DATABASE_URL: 'file:./test.db',
  JWT_SECRET: 'test-secret-for-local-suite',
  JWT_EXPIRES_IN: '10m'
};

function run(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env: testEnv,
    stdio: 'inherit'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run([prismaCli, 'generate']);
run([prismaCli, 'db', 'push', '--force-reset']);
run([path.join(root, 'prisma', 'seed.js')]);
run(['--test', 'test/racas.test.js']);