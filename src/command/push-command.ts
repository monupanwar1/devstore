import { Command } from 'commander';
import { pushImage, tagImage } from '../service/docker';
import { logger } from '../utils/logger-util';

export function registerPushCommand(program: Command) {
  program
    .command('push <image>')
    .description('Push image to Docker Hub')
    .action(async (image) => {
      try {
        const username = process.env.DOCKER_USERNAME;

        if (!username) {
          logger.error('Set DOCKER_USERNAME in env');
          return;
        }

        const remoteImage = `${username}/${image}:latest`;

        logger.info(`Tagging ${image} → ${remoteImage}`);
        await tagImage(image, remoteImage);

        logger.info('Pushing to Docker Hub...');
        await pushImage(remoteImage);

        logger.success(`Pushed: ${remoteImage}`);
      } catch (error) {
        logger.error('Failed to push');
      }
    });
}
