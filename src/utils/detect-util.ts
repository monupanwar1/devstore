import fs from 'fs';
import path from 'node:path';

export function getProjectInfo() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');

  // check
  if (!fs.existsSync(pkgPath)) {
    return null;
  }

  // read
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  return {
    name: pkg.name || 'app',
    hasStartScript: !!pkg.scripts?.start,
    startScript: pkg.scripts?.start || 'node src/index.js',
  };
}
