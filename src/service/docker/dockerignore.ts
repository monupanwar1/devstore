export function generateDockerIgnore() {
  return `
node_modules
npm-debug.log
.git
.gitignore
Dockerfile
.dockerignore
.env
`.trim();
}
