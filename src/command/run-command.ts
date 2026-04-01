import { Command } from 'commander';
import {
  pullImage,
  removeContainerIfExists,
  runContainer,
  buildImage,
  pushImage,
  imageExistsLocal,
  imageExistsRemote,
} from '../service/docker';
import { logger } from '../utils/logger-util';
import { execSync } from 'child_process';

// 🔥 Check if port is busy
function isPortBusy(port: number): boolean {
  try {
    execSync(`netstat -ano | findstr :${port}`);
    return true;
  } catch {
    return false;
  }
}

// 🔥 Find available port
function getAvailablePort(startPort: number): number {
  let port = startPort;
  while (isPortBusy(port)) {
    port++;
  }
  return port;
}

// ✅ Validate image name (for push)
function isValidDockerImage(image: string): boolean {
  return /^[a-z0-9]+[._-]?[a-z0-9]+\/[a-z0-9._-]+$/.test(image);
}

// ✅ Safe push (NO login check)
async function safePush(image: string) {
  try {
    await pushImage(image);
    logger.success(`Pushed image: ${image}`);
  } catch (err: any) {
    logger.warn('Push failed (are you logged in?)');
    logger.info('Run: docker login');

    if (err?.shortMessage) {
      console.error(err.shortMessage);
    } else if (err instanceof Error) {
      console.error(err.message);
    }
  }
}

export function registerRunCommand(program: Command) {
  program
    .command('run')
    .description('Run app (smart: local → remote → build)')
    .argument('<image>', 'Image name')
    .option('-p, --port <port>', 'Port mapping (host:container)', '3000:3000')
    .option('--push', 'Push image after build')
    .option('--build', 'Force rebuild image')
    .action(async (image: string, option: any) => {
      try {
        const containerName = image.replace('/', '-');

        // 🔥 PORT HANDLING
        let [hostPort, containerPort] = option.port.split(':').map(Number);

        if (!hostPort || !containerPort) {
          logger.error('Invalid port format. Use 3000:3000');
          process.exit(1);
        }

        const originalPort = hostPort;
        hostPort = getAvailablePort(hostPort);

        if (hostPort !== originalPort) {
          logger.warn(`Port ${originalPort} busy → switching to ${hostPort}`);
        }

        const finalPort = `${hostPort}:${containerPort}`;

        // 🔥 BUILD / FETCH FLOW

        if (option.build) {
          // FORCE BUILD
          logger.info(`Force building image: ${image}`);
          await buildImage(image);

          if (option.push) {
            if (!isValidDockerImage(image)) {
              logger.error('Image must be in format username/image for push');
              process.exit(1);
            }

            logger.info(`Pushing image: ${image}`);
            await safePush(image);
          }
        } else {
          const localExists = await imageExistsLocal(image);

          if (localExists) {
            logger.info(`Using local image: ${image}`);
          } else {
            const remoteExists = await imageExistsRemote(image);

            if (remoteExists) {
              logger.info(`Pulling image: ${image}`);
              await pullImage(image);
            } else {
              logger.info(`Building image: ${image}`);
              await buildImage(image);

              if (option.push) {
                if (!isValidDockerImage(image)) {
                  logger.error(
                    'Image must be in format username/image for push',
                  );
                  process.exit(1);
                }

                logger.info(`Pushing image: ${image}`);
                await safePush(image);
              }
            }
          }
        }

        // 🔥 CLEAN OLD CONTAINER
        logger.info(`Cleaning old container: ${containerName}`);
        await removeContainerIfExists(containerName);

        // 🔥 RUN CONTAINER
        logger.info('Starting container...');
        await runContainer(image, {
          port: finalPort,
          detach: true,
          name: containerName,
        });

        logger.success(`Running at http://localhost:${hostPort} 🚀`);
      } catch (error: any) {
        logger.error('Run failed');

        if (error?.shortMessage) {
          console.error(error.shortMessage);
        } else if (error instanceof Error) {
          console.error(error.message);
        }

        process.exit(1);
      }
    });
}
