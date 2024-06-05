const axios = require("axios");
require('dotenv').config();
const fs = require('fs');
const path = require("path");
const getCache = require("./getCache");

const refreshNycData = async () => {
    const apiKey = process.env.RAPIDAPIKEY;

    const optionsFixtures = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      params: {
        season: new Date().getUTCFullYear(),
        team: "1604",
      },
      headers: {
        "x-rapidapi-key": `${apiKey}`,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const optionsStats = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
        params: {
          league: '253',
          season: new Date().getUTCFullYear(),
          team: '1604'
        },
        headers: {
          'x-rapidapi-key': `${apiKey}`,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
  
    try {
      const resFixtures = await axios.request(optionsFixtures); //pass res.data.response to cleanMatchData
      const resStats = await axios.request(optionsStats); //return res.data.response
      const nycData = {
        fixturesData: resFixtures.data.response,
        statsData: resStats.data.response,
        lastRefresh: new Date()
      };
      fs.writeFile(path.join(__dirname, 'nycCache.json'), JSON.stringify(nycData, null, 2), (err) => {
        if (err) throw err;
        console.log('Refreshing NYCFC cache data.');
      });
    } catch (error) {
      console.error(error);
    }
}

const startRefreshNycData = async () => {
    let nycCache = await getCache();
    let lastRefreshTime = new Date(nycCache.lastRefresh);
    let currentTime = new Date();
    let timeDiff = Math.abs(lastRefreshTime.getTime() - currentTime.getTime());
    if (timeDiff > 1800000 || !nycCache) refreshNycData();
    setInterval(() => {
        console.log(1)
        refreshNycData();
        console.log(2)
    }, 3600000);
}

module.exports = startRefreshNycData;