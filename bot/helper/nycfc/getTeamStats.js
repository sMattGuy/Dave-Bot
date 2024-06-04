const axios = require('axios');
const api_token = process.env.RAPIDAPIKEY;
const getTeamStats = async () => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
        params: {
          league: '253',
          season: new Date().getUTCFullYear(),
          team: '1604'
        },
        headers: {
          'x-rapidapi-key': api_token,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      
      try {
          const res = await axios.request(options);
          return res.data.response;
      } catch (error) {
          console.error(error);
      }
}

module.exports = getTeamStats;
