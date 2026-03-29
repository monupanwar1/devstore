import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '../utils/logger-util';

export function registerCleanCommand(program: Command) {
  program
    .command('clean')
    .description('Remove all containers')
    .action(async () => {
      try {
        // 🔹 Step 1: get all container IDs
        const { stdout } = await execa('docker', ['ps', '-aq']);

        if (!stdout) {
          logger.info('No containers to remove');
          return;
        }

        const containerIds = stdout.split('\n').filter(Boolean);

        // 🔹 Step 2: remove containers
        await execa('docker', ['rm', '-f', ...containerIds], {
          stdio: 'inherit',
        });

        logger.success('All containers removed 🧹');
      } catch (error: any) {
        logger.error('Error cleaning containers');

        if (error?.shortMessage) {
          console.error(error.shortMessage);
        }
      }
    });
}
