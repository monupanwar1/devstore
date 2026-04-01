import { Command } from 'commander';
import { execSync } from 'child_process';
import { logger } from '../utils/logger-util';

// 🔥 Normalize name (image → container)
function getContainerName(input: string): string {
  return input.includes('/') ? input.replace('/', '-') : input;
}

// 🔥 Check if container exists
function containerExists(name: string): boolean {
  try {
    const output = execSync(
      `docker ps -a --filter "name=^${name}$" --format "{{.Names}}"`,
      { encoding: 'utf-8' },
    ).trim();

    return output === name;
  } catch {
    return false;
  }
}

// 🔥 Stop container safely
function stopContainer(name: string) {
  try {
    execSync(`docker stop ${name}`, { stdio: 'inherit' });
  } catch {
    logger.warn(`Container already stopped: ${name}`);
  }
}

// 🔥 Remove container safely
function removeContainer(name: string) {
  try {
    execSync(`docker rm ${name}`, { stdio: 'inherit' });
  } catch {
    logger.warn(`Container already removed: ${name}`);
  }
}

export function registerStopCommand(program: Command) {
  program
    .command('stop')
    .description('Stop and remove container')
    .argument('<name>', 'Image or container name')
    .option('--only-stop', 'Stop without removing')
    .action((input: string, option: any) => {
      try {
        const containerName = getContainerName(input);

        if (!containerExists(containerName)) {
          logger.warn(`Container not found: ${containerName}`);
          process.exit(0);
        }

        logger.info(`Stopping container: ${containerName}`);
        stopContainer(containerName);

        if (!option.onlyStop) {
          logger.info(`Removing container: ${containerName}`);
          removeContainer(containerName);
        }

        logger.success(`Done: ${containerName} 🛑`);
      } catch (error: any) {
        logger.error('Stop failed');

        if (error?.shortMessage) {
          console.error(error.shortMessage);
        } else if (error instanceof Error) {
          console.error(error.message);
        }

        process.exit(1);
      }
    });
}
