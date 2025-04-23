# Mini Redis Clone

A lightweight, educational clone of Redis built using **Node.js** with support for:
- TCP socket communication (RESP-like protocol)
- All `SET` , `GET` , `DEL` , `EXPIRE` , `TTL` and `AUTH` commands
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

---

## Run Locally 

### 1. Clone this repo 

```bash
git clone https://github.com/yogeshgupta100/Mini-Redis.git
cd mini-redis
```
### 2. Install dependencies

```bash
npm install
```

### 3. Start the Redis Clone

```bash
node server.js
```

## Run with Docker

### 1. Build the Docker Image

```bash
docker build -t mini-redis .
```

### 2. Run it

```bash
docker-compose up -d --build redis-clone
```

### 3. Test it with redis-cli

```bash
redis-cli -p 6379
> AUTH my-redis-server
> SET num 2
> GET num
"2"
```

## Future Ideas

1. Support for more Redis Data Structures 
2. Pub/Sub Channels
3. Web Interface for monitoring

## License
MIT - for educational and non-commercial use.

## Author
Made with love by `Yogesh Gupta`. Inspired by how Redis actually works.
