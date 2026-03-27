import { Command } from 'commander';
import { execa } from 'execa';
import { getProjectInfo } from '../utils/detect-util';
import { logger } from '../utils/logger-util';

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build docker image')
    .argument('[context]', 'Build context (default: .)', '.')
    .option('-t, --tag <tag>', 'Custom image tag')
    .action(async (context, option) => {
      try {
        const project = getProjectInfo();

        if (!project) {
          logger.error('No Package.json found');
          return;
        }

        const imageName = option.tag || project.name;

        logger.info(
          `Building Docker image: ${imageName} (context: ${context})`,
        );

        await execa('docker', ['build', '-t', imageName, context], {
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
