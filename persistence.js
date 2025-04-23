const fs = require('fs');
const path = require('path');

const Store = require('./store');

const DATA_DIR = path.join(__dirname,'data');
const SNAPSHOT_FILE = path.join(DATA_DIR,'rdb.snapshot');
const FULL_AOF_FILE = path.join(DATA_DIR,'appendonly.aof');
const DELTA_AOF_FILE = path.join(DATA_DIR,'commands.delta.aof');

function ensureDataDir(){
    if(!fs.existsSync(DATA_DIR)){
        fs.mkdirSync(DATA_DIR,{recursive:true});
    }
}

function saveSnapshot(store){
    ensureDataDir();
    fs.writeFileSync(SNAPSHOT_FILE,JSON.stringify(store.dump()));

    const aofCommands = store.getAllCommands();
    fs.writeFileSync(FULL_AOF_FILE,aofCommands.join('\n'));

    fs.writeFileSync(DELTA_AOF_FILE,'');
}

function appendToDelta(rawCommand){
    ensureDataDir();
    fs.writeFileSync(DELTA_AOF_FILE,rawCommand+'\n');
}

function loadSnapshot() {
    if (fs.existsSync(SNAPSHOT_FILE)) {
        try {
            const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf8');
            if (raw.trim()) {
                const data = JSON.parse(raw);
                return data;
            } else {
                console.warn('Snapshot file is empty. Skipping load.');
                return {};
            }
        } catch (err) {
            console.error('Failed to load snapshot:', err.message);
            return {};
        }
    } else {
        console.warn('Snapshot file does not exist. Skipping load.');
        return {};
    }
}


function replayDelta(){
    if(!fs.existsSync(DELTA_AOF_FILE)){
        return [];
    }else{
        return fs.readFileSync(DELTA_AOF_FILE,'utf-8').trim().split('\n').filter(Boolean);
    }
}

module.exports = {
    saveSnapshot,
    appendToDelta,
    loadSnapshot,
    replayDelta,
}