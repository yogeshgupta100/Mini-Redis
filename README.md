# Mini Redis Clone

A lightweight, educational clone of Redis built using **Node.js** with support for:
- TCP socket communication (RESP-like protocol)
- Basic `SET` and `GET` commands
- AOF (Append Only File) persistence
- RDB-style snapshot saving
- Dockerized setup for easy deployment

---

## Features

- **In-memory key-value store**
- **Command parsing** for `SET` and `GET`
- **Persistence:**
  - **RDB** snapshot every 10 seconds
  - **AOF** logs all commands and replays on startup
- **Custom TCP server** using Node's `net` module
- **Dockerized** for isolated and portable runtime
