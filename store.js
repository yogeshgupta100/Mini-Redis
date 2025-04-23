class Store {
    constructor() {
        this.data = new Map();
        this.expirations = new Map();
        this.commandLog = [];
    }

    set(key,value) {
        this.data.set(key,value);
        this.commandLog.push(`SET ${key} ${value}`);
    }

    get(key) {
        return this.data.get(key);
    }

    del(key) {
        this.data.delete(key);
        this.commandLog.push(`DEL ${key}`);
    }

    expire(key,ttl) {
        const expireAt = Date.now() + ttl * 1000;
        this.expirations.set(key,expireAt);
        this.commandLog.push(`EXPIRE ${key} ${ttl}`);
    }

    getAllCommands() {
        return this.commandLog;
    }

    dump() {
        return {
            data: Object.fromEntries(this.data),
            expirations: Object.fromEntries(this.expirations),
        };
    }

    load(snapshot) {
        this.data = new Map(Object.entries(snapshot.data || {}));
        this.expirations = new Map(Object.entries(snapshot.expirations || {}));
    }
        
}

module.exports = Store;