let store = {};
let expiryMap = {};

function checkExpiry(key){
    if(expiryMap[key] && Date.now() > expiryMap[key]){
        delete store[key];
        delete expiryMap[key];
    }
}

module.exports = {
    set(key , value){
        store[key] = value;
    },
    get(key){
        checkExpiry(key);
        return store[key];
    },
    del(key){
        delete store[key];
        delete expiryMap[key];
    },
    expire(key,seconds){
        expiryMap[key] = Date.now() + seconds * 1000;
    },
    ttl(key){
        if(!expiryMap[key]){
            return -1;
        }
        const remainingTime = expiryMap[key] - Date.now();
        return remainingTime > 0 ? remainingTime : 0;
    },
    dump(){
        return {store,expiryMap};
    },
    load(data){
        store = data.store || {};
        expiryMap = data.expiryMap || {};
    }
};

