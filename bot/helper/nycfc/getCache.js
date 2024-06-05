const fs = require('fs');
const path = require('path');

const getCache = async () => {
    try {
        const nycCacheData = fs.readFileSync(path.join(__dirname, 'nycCache.json'), 'utf8');
        const nycCache = JSON.parse(nycCacheData);
        if (Object.keys(nycCache).length === 3) return nycCache;
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = getCache;