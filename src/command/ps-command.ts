import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerPsCommand(program: Command) {
  program
    .command('ps')
    .description('List  running containers')
    .action(async (id) => {
      try {
        await execa('docker', ['ps'], {
          stdio: 'inherit',
        });
      } catch (error) {
        logger.error('Error listing container');
      }
    });
}
