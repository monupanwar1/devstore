import fs from 'fs-extra';
import path from 'path';
import { logger } from '../../utils/logger-util.js';
import { generateDockerfile } from './dockerfile.js';
import { generateDockerIgnore } from './dockerignore.js';

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
