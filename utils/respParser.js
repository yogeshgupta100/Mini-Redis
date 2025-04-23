function parseRESP(buffer) {
    const lines = buffer.toString().split('\r\n');
    const args = [];
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i];
        if (!line) {
            i++;
            continue;
        }
        
        const type = line[0];
        const content = line.slice(1);
        
        switch (type) {
            case '*': // Array
                const arrayLength = parseInt(content);
                for (let j = 0; j < arrayLength; j++) {
                    i += 2; // Skip the $ and the actual content
                    args.push(lines[i]);
                }
                break;
            case '$': // Bulk string
                const stringLength = parseInt(content);
                if (stringLength === -1) {
                    args.push(null);
                } else {
                    i++;
                    args.push(lines[i]);
                }
                break;
            case '+': // Simple string
            case '-': // Error
            case ':': // Integer
                args.push(content);
                break;
        }
        i++;
    }
    
    return args;
}

module.exports = parseRESP;