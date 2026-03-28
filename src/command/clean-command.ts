import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerCleanCommand(program: Command) {
  program
    .command('ps')
    .description('Remove all containers')
    .action(async (id) => {
      try {
        await execa('docker', ['rm', '-f', '$(docker ps -aq)'], {
          stdio: 'inherit',
        });
        logger.success('All containers removed 🧹');
      } catch (error) {
        logger.error('Error cleaning container');
      }
    });
}
