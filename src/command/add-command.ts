import { Command } from 'commander';
import { getProjectInfo } from '../utils/detect-util.js';
import { logger } from '../utils/logger-util.js';
import { setupDocker } from '../service/docker/index.js';

export function registerAddCommand(program: Command) {
  program
    .command('add <feature>')
    .description('Add feature (docker, ci, etc)')
    .option('-p, --port <port>', 'port number', '3000')
    .action(async (feature: string, options) => {
      try {
        logger.info(`Adding feature: ${feature}`);

        const project = getProjectInfo();

        if (!project) {
          logger.error('No package.json found. Not a Node project.');
          return;
        }

        switch (feature) {
          case 'docker': {
            const port = Number(options.port);

            if (isNaN(port)) {
              logger.error('Invalid port number');
              return;
            }

            logger.info(`Setting up Docker on port ${port}...`);

            await setupDocker(project, port);

            logger.success('Docker setup complete');
            break;
          }

          default:
            logger.error(`Unknown feature: ${feature}`);
        }
      } catch (error) {
        logger.error('Something went wrong');
        console.error(error);
      }
    });
}
