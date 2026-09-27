import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

// Run an example in a separate process against loopback only, with a synthetic key.
export async function runLive(directory, args, respond, guardMs = 20_000) {
  const requests = [];
  const sockets = new Set();
  const server = createServer((req, res) => {
    let text = '';
    req.on('data', (chunk) => { text += chunk; });
    req.on('end', () => {
      const body = JSON.parse(text);
      requests.push({ path: req.url, authorization: req.headers.authorization, body });
      respond(res, body);
    });
  });
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const env = Object.fromEntries(Object.entries(process.env)
    .filter(([name]) => !/^(TYPESAFE_|NODE_TEST_CONTEXT$)/i.test(name)));
  env.TYPESAFE_API_KEY = 'synthetic-test-key';
  env.TYPESAFE_BASE_URL = `http://127.0.0.1:${server.address().port}`;
  const child = spawn(process.execPath, ['--unhandled-rejections=throw', 'run.mjs', ...args], {
    cwd: fileURLToPath(directory),
    env,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const guard = setTimeout(() => child.kill(), guardMs);
  try {
    const [code, signal] = await once(child, 'close');
    return { code, signal, stdout, stderr, requests };
  } finally {
    clearTimeout(guard);
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  }
}
