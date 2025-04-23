const net = require('net');
const parseRESP = require('./utils/respParser');
const store = require('./store');
const persistence = require('./persistence');

persistence.loadSnapshot();
setInterval(() => {
    persistence.saveSnapshot();
}, 10000);

const server = net.createServer((socket) => {
    let authenticated = false;
    const PASSWORD = 'my-redis-server';

    socket.on('data', (data) => {
        try {
            const args = parseRESP(data);
            const command = args[0]?.toUpperCase();

            if (!command) {
                socket.write('-ERR empty command\r\n');
                return;
            }

            if (command !== 'AUTH' && PASSWORD && !authenticated) {
                socket.write('-NOAUTH Authentication required\r\n');
                return;
            }

            switch (command) {
                case 'AUTH':
                    if (args[1] === PASSWORD) {
                        authenticated = true;
                        socket.write('+OK\r\n');
                    } else {
                        socket.write('-ERR invalid password\r\n');
                    }
                    break;
                case 'SET':
                    if (args.length < 3) {
                        socket.write('-ERR wrong number of arguments for \'set\' command\r\n');
                        return;
                    }
                    store.set(args[1], args[2]);
                    persistence.appendCommand(data.toString());
                    socket.write('+OK\r\n');
                    break;
                case 'GET':
                    if (args.length < 2) {
                        socket.write('-ERR wrong number of arguments for \'get\' command\r\n');
                        return;
                    }
                    const value = store.get(args[1]);
                    if (value !== undefined) {
                        socket.write(`$${value.length}\r\n${value}\r\n`);
                    } else {
                        socket.write('$-1\r\n');
                    }
                    break;
                case 'DEL':
                    if (args.length < 2) {
                        socket.write('-ERR wrong number of arguments for \'del\' command\r\n');
                        return;
                    }
                    store.del(args[1]);
                    persistence.appendCommand(data.toString());
                    socket.write(':1\r\n');
                    break;
                case 'EXPIRE':
                    if (args.length < 3) {
                        socket.write('-ERR wrong number of arguments for \'expire\' command\r\n');
                        return;
                    }
                    store.expire(args[1], parseInt(args[2]));
                    socket.write(':1\r\n');
                    break;
                case 'TTL':
                    if (args.length < 2) {
                        socket.write('-ERR wrong number of arguments for \'ttl\' command\r\n');
                        return;
                    }
                    const ttl = store.ttl(args[1]);
                    socket.write(`:${ttl}\r\n`);
                    break;
                default:
                    socket.write(`-ERR unknown command '${command}'\r\n`);
            }
        } catch (error) {
            socket.write(`-ERR ${error.message}\r\n`);
        }
    });
});

server.listen(6379, '0.0.0.0', () => {
    console.log('Mini-Redis running on port 6379');
});

const aofCommands = persistence.replayAOF();
aofCommands.forEach(raw => {
    const args = parseRESP(Buffer.from(raw));
    if (args[0] === 'SET') store.set(args[1], args[2]);
    if (args[0] === 'GET') store.get(args[1]);
});
