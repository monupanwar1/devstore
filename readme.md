# 🚀 DevStore

> A smart CLI to **run, build, and ship apps with Docker** — effortlessly.

DevStore simplifies Docker workflows by automatically handling image resolution, builds, and container execution with a clean developer experience.

---

## ✨ Features

* ⚡ **Smart Execution Pipeline**

  * Local → Remote → Build (automatic fallback)
* 🔥 **Force Rebuild**

  * Rebuild images anytime using `--build`
* 📦 **Optional Push**

  * Push images to Docker Hub with `--push`
* 🧠 **Auto Port Detection**

  * Avoid conflicts with automatic port switching
* 🧹 **Container Cleanup**

  * Removes old containers before running
* 🛠️ **Project Initialization**

  * Generate Docker setup using `init docker`
* 💡 **Developer-Friendly CLI**

  * Clean logs and predictable behavior

---

## 📦 Installation

### Global install

```bash
npm install -g devstore
```

---

## 🚀 Quick Start (Recommended for Beginners)

```bash
# 1. Initialize Docker setup
devstore init docker

# 2. Run your app
devstore run my-app
```

👉 DevStore will:

* Create a Dockerfile
* Build your app
* Run it automatically

---

## 🚀 Commands

### 🔹 Initialize project (Docker setup)

```bash
devstore init docker
```

Creates a production-ready `Dockerfile` based on your project.

---

### 🔹 Run an application

```bash
devstore run <image>
```

Example:

```bash
devstore run my-app
```

---

### 🔹 Run with custom port

```bash
devstore run my-app -p 4000:3000
```

---

### 🔹 Force rebuild image

```bash
devstore run my-app --build
```

---

### 🔹 Build and push to Docker Hub

```bash
devstore run username/my-app --build --push
```

> ⚠️ Make sure you're logged in:

```bash
docker login
```

---

## 🧠 Execution Flow

DevStore follows a smart execution strategy:

```
1. Check if image exists locally
2. If not → check remote registry (Docker Hub)
3. If not → build image from Dockerfile
4. Optionally push image
5. Run container
```

---

## ⚙️ Options

| Option       | Description                       |
| ------------ | --------------------------------- |
| `-p, --port` | Port mapping (default: 3000:3000) |
| `--build`    | Force rebuild image               |
| `--push`     | Push image to Docker Hub          |

---

## 🧪 Example Output

```bash
ℹ️  Using local image: my-app
ℹ️  Cleaning old container: my-app
ℹ️  Starting container...
⚠️  Port 3000 busy → switching to 3001
✅ Running at http://localhost:3001 🚀
```

---

## ❗ Requirements

* Docker installed and running
* Node.js 18 or higher

---

## 📁 Project Structure

```
src/
 ├── commands/        # CLI commands (init, run)
 ├── service/docker/  # Docker logic (build, run, push)
 ├── utils/           # logger, helpers
```

---

## ⚠️ Common Issues & Fixes

### ❌ Port already in use

```bash
Bind for 0.0.0.0:3000 failed
```

✅ DevStore auto-fixes this by switching ports.

---

### ❌ No Dockerfile found

```bash
failed to read dockerfile
```

✅ Run:

```bash
devstore init docker
```

---

### ❌ Push failed

```bash
docker push error
```

✅ Fix:

```bash
docker login
```

---

## 📌 Notes

* A `Dockerfile` is required for building images
* DevStore can generate one using `init docker`
* Image push requires proper naming (`username/image`)

---

## 🛠️ Roadmap

* [ ] `devstore logs` (view container logs)
* [ ] `devstore stop` (stop running container)
* [ ] Auto-detect frameworks (Next.js, Express)
* [ ] Deployment support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 👨‍💻 Author

**Monu Panwar**

---

## 📄 License

MIT License

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!
