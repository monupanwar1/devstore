import fs from 'fs-extra';
import path from 'path';
import { logger } from '../../utils/logger-util.js';
import { generateDockerfile } from './dockerfile.js';
import { generateDockerIgnore } from './dockerignore.js';

type ProjectInfo = {
  name: string;
  startScript: string;
};

function detectPackageManager(): string {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('bun.lockb')) return 'bun';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  return 'npm';
}

export async function setupDocker(project: ProjectInfo, port: number = 3000) {
  const cwd = process.cwd();

  const dockerfilePath = path.join(cwd, 'Dockerfile');
  const dockerignorePath = path.join(cwd, '.dockerignore');

  // prevent overwrite
  if (await fs.pathExists(dockerfilePath)) {
    logger.warn('Dockerfile already exists. Skipping...');
    return;
  }

  const packageManager = detectPackageManager();

  logger.info(`Using package manager: ${packageManager}`);

  // generate files
  const dockerfile = generateDockerfile(
    project.startScript,
    packageManager,
    port,
  );

  const dockerignore = generateDockerIgnore();

  // write files
  await fs.writeFile(dockerfilePath, dockerfile);
  await fs.writeFile(dockerignorePath, dockerignore);

  logger.success(`Docker setup ready for project: ${project.name}`);
}
