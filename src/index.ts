#!/usr/bin/env node

import { Command } from 'commander';
import { registerInitCommand } from './command/init-command';
import { registerRunCommand } from './command/run-command';

const program = new Command();

program
  .name('devstore')
  .description('Run and share app in one second ')
  .version('1.0.0');

registerInitCommand(program);
registerRunCommand(program);

program.parse(process.argv);
