import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerStopCommand(program: Command) {
  program
    .command('stop')
    .description('Stop container')
    .argument('<id>', 'Container id or name')
    .action(async (id) => {
      try {
        await execa('docker', ['stop', id], {
          stdio: 'inherit',
        });
        logger.success(`Container stopped: ${id}`);
      } catch (error) {
        logger.error('Error stopping container');
      }
    });
}
