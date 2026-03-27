import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerRunCommand(program: Command) {
  program
    .command('run')
    .description('Run docker container')
    .argument('<image>', 'Image name')
    .option('-p, --port <port>', 'Port mapping (e.g.3000:3000)')
    .option('-d, --detach', 'Run in background', true)
    .action(async (image, option) => {
      try {
        const args = ['run'];

        if (option.detach) args.push('-d');

        if (option.port) args.push('-p', option.port);

        args.push(image);

        logger.info(`Running Docker image: ${image}`);

        await execa('docker', args, {
          stdio: 'inherit',
        });

        logger.success('Container started 🚀');
      } catch (error) {
        logger.error('Docker run error');

        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
}
