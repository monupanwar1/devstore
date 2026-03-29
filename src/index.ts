#!/usr/bin/env node

import { Command } from 'commander';
import { registerAddCommand } from './command/add-command';
import { registerBuildCommand } from './command/build-command';
import { registerCleanCommand } from './command/clean-command';
import { registerLogsCommand } from './command/logs-command';
import { registerPsCommand } from './command/ps-command';
import { registerPushCommand } from './command/push-command';
import { registerRunCommand } from './command/run-command';
import { registerStopCommand } from './command/stop-command';

const program = new Command();

program.name('version').description('Devops automation CLI').version('1.0.0');

registerAddCommand(program);

registerBuildCommand(program);

registerRunCommand(program);

registerLogsCommand(program);

registerStopCommand(program);

registerPsCommand(program);

registerCleanCommand(program);

registerPushCommand(program);

program.parse(process.argv);
