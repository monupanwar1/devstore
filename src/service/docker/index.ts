import fs from 'fs-extra';
import path from 'path';
import { logger } from '../../utils/logger-util.js';
import { generateDockerfile } from './dockerfile.js';
import { generateDockerIgnore } from './dockerignore.js';

import { exec } from 'child_process';
import { execa } from 'execa';

type ProjectInfo = {
  name: string;
  startScript: string;
};

function detectPackageManager(cwd: string): string {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export async function setupDocker(
  project: ProjectInfo,
  port: number = 3000,
  overridePM?: string,
) {
  const cwd = process.cwd();

  const dockerfilePath = path.join(cwd, 'Dockerfile');
  const dockerignorePath = path.join(cwd, '.dockerignore');

  // ✅ prevent overwrite (Dockerfile)
  if (await fs.pathExists(dockerfilePath)) {
    logger.warn('Dockerfile already exists. Skipping...');
    return;
  }

  // ✅ choose package manager (override > detect)
  const packageManager = overridePM || detectPackageManager(cwd);

  logger.info(`Using package manager: ${packageManager}`);

  // ✅ generate content
  const dockerfile = generateDockerfile(
    project.startScript,
    packageManager,
    port,
  );

  const dockerignore = generateDockerIgnore();

  // ✅ write files
  await fs.writeFile(dockerfilePath, dockerfile);

  // optional: only create ignore if not exists
  if (!(await fs.pathExists(dockerignorePath))) {
    await fs.writeFile(dockerignorePath, dockerignore);
  } else {
    logger.warn('.dockerignore already exists, skipping...');
  }

  logger.success(`Docker setup ready for project: ${project.name}`);
}

export function tagImage(
  localImage: string,
  remoteImage: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`docker tag ${localImage} ${remoteImage}`, (err) => {
      if (err) return reject('Tag failed');
      resolve();
    });
  });
}

export async function pushImage(remoteImage: string): Promise<void> {
  try {
    await execa('docker', ['push', remoteImage], {
      stdio: 'inherit',
    });
  } catch (err) {
    throw new Error('❌ Push failed');
  }
}

export async function pullImage(image: string): Promise<void> {
  await execa('docker', ['pull', image], {
    stdio: 'inherit',
  });
}

// run container
export async function runContainer(
  image: string,
  options: {
    port?: string;
    detach?: boolean;
    name?: string;
  },
): Promise<void> {
  const args: string[] = ['run'];

  if (options.detach) args.push('-d');

  if (options.port) args.push('-p', options.port);

  if (options.name) args.push('--name', options.name);

  args.push(image);

  await execa('docker', args, { stdio: 'inherit' });
}

export async function removeContainerIfExists(name: string): Promise<void> {
  // Step 1: Check if container exists
  const { stdout } = await execa('docker', [
    'ps',
    '-a',
    '--filter',
    `name=^/${name}$`,
    '--format',
    '{{.Names}}',
  ]);

  if (!stdout) {
    // container does not exist → nothing to do
    return;
  }

  // Step 2: Remove container
  await execa('docker', ['rm', '-f', name], {
    stdio: 'inherit',
  });
}