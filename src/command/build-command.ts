import { Command } from 'commander';
import { execa } from 'execa';
import { getProjectInfo } from '../utils/detect-util';
import { logger } from '../utils/logger-util';

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build docker image')
    .option('-t, --tag <tag>', 'Custom image tag')
    .action(async (option) => {
      try {
        const project = getProjectInfo();

        if (!project) {
          logger.error('No Package.json found');
          return;
        }

        const imageName = option.tag || project.name;

        logger.info(`Building Docker image:${imageName}`);  

        await execa('docker', ['build', '-t', imageName, '.'], {
          stdio: 'inherit',
        });

        logger.success(`Docker image built:${imageName}`);
      } catch (error) {
        logger.error('Docker build error');

        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
}
