import { Command } from 'commander';
import {
  pullImage,
  removeContainerIfExists,
  runContainer,
} from '../service/docker';
import { logger } from '../utils/logger-util';

export function registerRunCommand(program: Command) {
  program
    .command('run')
    .description('Run docker container (local or remote)')
    .argument('<image>', 'Image name')
    .option('-p, --port <port>', 'Port mapping (e.g. 3000:3000)')
    .option('-d, --detach', 'Run in background', true)
    .action(async (image: string, option: any) => {
      try {
        const isRemote = image.includes('/');

        // 🔥 STEP 1: Pull if remote
        if (isRemote) {
          logger.info(`Pulling image: ${image}`);
          await pullImage(image);
        }

        // 🔥 STEP 2: Container name
        const containerName = image.replace('/', '-');

        // 🔥 STEP 3: REMOVE OLD CONTAINER (THIS IS YOUR ADDITION)
        logger.info(`Cleaning old container (if exists): ${containerName}`);
        await removeContainerIfExists(containerName);

        logger.info(`Running Docker image: ${image}`);

        // 🔥 STEP 4: Run container
        await runContainer(image, {
          port: option.port || '3000:3000',
          detach: option.detach,
          name: containerName,
        });

        logger.success(`Container started: ${containerName} 🚀`);

        // 🌐 URL
        const hostPort = (option.port || '3000:3000').split(':')[0];
        logger.info(`🌐 http://localhost:${hostPort}`);
      } catch (error: any) {
        logger.error('Docker run error');

        if (error?.shortMessage) {
          console.error(error.shortMessage);
        } else if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
}
