import { input, select } from '@inquirer/prompts';
import { Command } from 'commander';

import { setupDocker } from '../service/docker/index.js';
import { getProjectInfo } from '../utils/detect-util.js';
import { logger } from '../utils/logger-util.js';

type InitOptions = {
  port?: string;
  pm?: 'npm' | 'pnpm' | 'bun';
};

export function registerInitCommand(program: Command) {
  program
    .command('init')
    .description(
      '🚀 Ship it! Add features like Docker, CI, or K8s to your project.',
    )
    .option('-p, --port <port>', 'Port to expose')
    .option('--pm <packageManager>', 'Package manager (npm | pnpm | bun)')
    .action(async (feature: string, options: InitOptions) => {
      try {
        const project = getProjectInfo();

        if (!project) {
          logger.error('No package.json found. Not a Node project.');
          process.exit(1);
        }

        // ✅ PORT
        let port = options.port ? Number(options.port) : undefined;

        if (!port || isNaN(port)) {
          const answer = await input({
            message: 'Enter port:',
            default: '3000',
          });

          port = Number(answer);

          if (isNaN(port)) {
            logger.error('Invalid port');
            process.exit(1);
          }
        }

        // ✅ PACKAGE MANAGER
        let packageManager = options.pm;

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

        if (!['npm', 'pnpm', 'bun'].includes(packageManager)) {
          logger.error('Invalid package manager');
          process.exit(1);
        }

        logger.info(`Port: ${port}`);
        logger.info(`Package Manager: ${packageManager}`);

        await setupDocker(project, port, packageManager);

        logger.success('Docker setup complete 🚀');
      } catch (error) {
        logger.error('Something went wrong');
        console.error(error);
        process.exit(1);
      }
    });
}
