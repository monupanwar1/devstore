#!/usr/bin/env node

import { Command } from 'commander';
import { registerAddCommand } from './command/add-command';
import { registerBuildCommand } from './command/build-command';

const program = new Command();

program.name('version').description('Devops automation CLI').version('1.0.0');

registerAddCommand(program);

registerBuildCommand(program);

program.parse(process.argv);
