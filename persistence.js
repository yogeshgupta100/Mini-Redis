const fs = require('fs');
const path = require('path');
const store = require('./store');
const AOF_FILE = path.join(__dirname,'data/appendonly.aof');
const SNAPSHOT_FILE = path.join(__dirname,'data/rdb.snapshot');

function appendCommand(command){
    fs.appendFileSync(AOF_FILE,command+'\n');
}

function saveSnapshot(){
    fs.writeFileSync(SNAPSHOT_FILE,JSON.stringify(store.dump()));
}

function loadSnapshot() {
    if (fs.existsSync(SNAPSHOT_FILE)) {
        try {
            const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf8');
            if (raw.trim()) {
                const data = JSON.parse(raw);
                store.load(data);
            } else {
                console.warn('Snapshot file is empty. Skipping load.');
            }
        } catch (err) {
            console.error('Failed to load snapshot:', err.message);
        }
    } else {
        console.warn('Snapshot file does not exist. Skipping load.');
    }
}


function replayAOF(){
    if(fs.existsSync(AOF_FILE)){
        const lines = fs.readFileSync(AOF_FILE,'utf-8').split('\n').filter(Boolean);
        return lines.map(line => line.trim());
    }
    return [];
}

module.exports = {
    appendCommand,
    saveSnapshot,
    loadSnapshot,
    replayAOF,
}