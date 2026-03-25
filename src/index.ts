#!/user/bin/env node

import { Command } from 'commander';

const program = new Command();

program.name('version').description('Devops automation CLI').version('1.0.0');

// test

program
  .command('hello')
  .description('test-command')
  .action(() => console.log('Hello from Devstore cli'));

program.parse();
