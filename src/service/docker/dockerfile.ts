type Runtime = 'node' | 'bun';

function getBaseImage(runtime: Runtime) {
  switch (runtime) {
    case 'bun':
      return 'oven/bun:1';
    case 'node':
    default:
      return 'node:18-alpine';
  }
}

export function generateDockerfile(
  startCommand: string,
  packageManager: string,
  port: number,
) {
  let installCmd = 'npm install';
  let runtime: Runtime = 'node';

  if (packageManager === 'pnpm') {
    installCmd = 'npm install -g pnpm && pnpm install';
  } else if (packageManager === 'bun') {
    installCmd = 'bun install';
    runtime = 'bun';
  }
  const baseImage = getBaseImage(runtime);

  return `
FROM ${baseImage}

WORKDIR /app

COPY package*.json ./

RUN ${installCmd}

COPY . .

EXPOSE ${port}

CMD ["sh", "-c", "${startCommand}"]
`.trim();
}
