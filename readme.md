# 🚀 DevStore

Run, build, and ship applications with Docker using a single command.

DevStore is a command-line tool designed to simplify Docker workflows for developers. It automatically resolves whether to use a local image, pull from a registry, or build from source—so you can focus on building, not managing containers.

---

## ✨ Key Capabilities

### ⚡ Automated Execution Pipeline

* Uses local images when available
* Falls back to remote registry (Docker Hub)
* Builds images when none exist

### 🔧 Flexible Build & Deployment

* Force rebuild with `--build`
* Push images using `--push`

### 🧠 Reliable Runtime Experience

* Automatically detects and resolves port conflicts
* Cleans up existing containers before starting

### 💡 Simple Developer Experience

* Minimal commands
* Predictable behavior
* Clear terminal output

---

## 📦 Installation

```bash
npm install -g devstore
```

---

## 🚀 Getting Started

Initialize Docker configuration:

```bash
devstore init
```

Run your application:

```bash
devstore run my-app
```

DevStore will:

* Generate a Dockerfile (if missing)
* Build the image (if needed)
* Start the container

---

## 🛠️ Commands

### 🔹 Initialize Docker setup

```bash
devstore init
```

Creates a Dockerfile suitable for your project.

---

### ▶️ Run an application

```bash
devstore run <image>
```

Example:

```bash
devstore run my-app
```

---

### 🔌 Run with custom port mapping

```bash
devstore run my-app -p 4000:3000
```

---

### 🔄 Force rebuild

```bash
devstore run my-app --build
```

---

### 📤 Build and push image

```bash
devstore run username/my-app --build --push
```

> Ensure you are authenticated:

```bash
docker login
```

---

### 🛑 Stop a container

```bash
devstore stop <image>
```

Examples:

```bash
devstore stop my-app
devstore stop username/my-app
```

Stop without removing:

```bash
devstore stop my-app --only-stop
```

---

## 🧠 Execution Model

DevStore follows a deterministic execution flow:

1. Check for local image
2. If not found → check remote registry
3. If not found → build image
4. Optionally push image
5. Run container

---

## ⚙️ Options

| Option      | Description                       |
| ----------- | --------------------------------- |
| -p, --port  | Port mapping (default: 3000:3000) |
| --build     | Force rebuild image               |
| --push      | Push image to Docker Hub          |
| --only-stop | Stop container without removing   |

---

## 🧪 Example Output

```bash
Using local image: my-app
Port 3000 busy → switching to 3001
Cleaning old container: my-app
Starting container...
Running at http://localhost:3001
```

---

## ❗ Requirements

* Docker installed and running
* Node.js 18 or higher

---

## ⚠️ Common Issues

### ❌ Port already in use

DevStore automatically selects the next available port.

---

### ❌ Dockerfile not found

```bash
devstore init docker
```

---

### ❌ Push failed

```bash
docker login
```

---

## 🎯 Design Principles

* Reduce cognitive overhead for Docker workflows
* Provide deterministic and predictable behavior
* Minimize required commands
* Fail gracefully with clear feedback

---

## 👨‍💻 Author

Monu Panwar

---

## 📄 License

MIT
