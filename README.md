# Dead Air University

I have X minutes. Teach me something.

Browser-first micro-lessons with seeded courses, quizzes, and a local review
schedule. AI generation is optional and off by default.

Completed production courses:

- Computer Architecture Foundations
- Modern CPU Microarchitecture
- GPU Architecture and Parallel Execution
- Semiconductor Process Foundations
- Photolithography
- Modern Leading-Edge Manufacturing
- Operating Systems Foundations
- Memory, Concurrency, and Scheduling
- Storage, Filesystems, and Kernel Internals
- Networking Foundations
- Transport and Congestion
- Routing and Internet Architecture

## Run it

```text
npm install
npm run dev
```

Then open the app in a browser. No API keys and no account are required.

```text
npm test
npm run typecheck
npm run build
```

## What stays local

Progress, reviews, and custom content live in this browser. A hosted URL is not
sync. Export a JSON archive in Settings to move to another device.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for local, hosted, and grok.me
notes, environment variables, and the acceptance matrix.
