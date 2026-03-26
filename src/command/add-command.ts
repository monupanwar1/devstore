import { input, select } from '@inquirer/prompts';
import { Command } from 'commander';

import { setupDocker } from '../service/docker/index.js';
import { getProjectInfo } from '../utils/detect-util.js';
import { logger } from '../utils/logger-util.js';

export function registerAddCommand(program: Command) {
  program
    .command('add <feature>')
    .description('Add feature (docker, ci, etc)')
    .option('-p, --port <port>', 'Port to expose')
    .option('--pm <packageManager>', 'Package manager (npm | pnpm | bun)')
    .action(async (feature: string, options) => {
      try {
        logger.info(`Adding feature: ${feature}`);

        const project = getProjectInfo();

        if (!project) {
          logger.error('No package.json found. Not a Node project.');
          return;
        }

        if (feature !== 'docker') {
          logger.error(`Unknown feature: ${feature}`);
          return;
        }

        let port = options.port ? Number(options.port) : undefined;
        let packageManager = options.pm;

        // 🔥 PORT INPUT (PowerShell safe)
        if (!port || isNaN(port)) {
          const answer = await input({
            message: 'Enter port:',
            default: '3000',
          });

          port = Number(answer);
        }

        // 🔥 PACKAGE MANAGER SELECT (PowerShell safe)
        if (!packageManager) {
          packageManager = await select({
            message: 'Select package manager:',
            choices: [
              { name: 'npm', value: 'npm' },
              { name: 'pnpm', value: 'pnpm' },
              { name: 'bun', value: 'bun' },
            ],
          });
        }

        logger.info(`Port: ${port}`);
        logger.info(`Package Manager: ${packageManager}`);

        await setupDocker(project, port, packageManager);

        logger.success('Docker setup complete');
      } catch (error) {
        logger.error('Something went wrong');
        console.error(error);
      }
    });
}
