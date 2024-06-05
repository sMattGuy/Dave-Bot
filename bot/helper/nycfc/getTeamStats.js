const fs = require('fs');
const getCache = require('./getCache');

const getTeamStats = async () => {
    let nycCache = await getCache();

    try {
        return nycCache.statsData;
    } catch (error) {
        console.log(error);
    }
}

module.exports = getTeamStats;
