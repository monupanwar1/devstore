import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerLogsCommand(program: Command) {
  program
    .command('logs')
    .description('view container logs')
    .argument('<id>', 'Container id or name')
    .option('-f, --follow', 'follow logs')
    .action(async (id, option) => {
      try {
        const args = ['logs'];

        if (option.follow) args.push('-f');

        args.push(id);

        logger.info('Logs..');

        await execa('docker', args, {
          stdio: 'inherit',
        });
      } catch (error) {
        logger.error('Error fetching logs');

        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
}
