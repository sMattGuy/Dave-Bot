const axios = require('axios');

const getTeamStats = async () => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
        params: {
          league: '866',
          season: new Date().getUTCFullYear(),
          team: '1604'
        },
        headers: {
          'x-rapidapi-key': '7d72abfd87msh1e1ee55e26e1abap1c4abejsncb2927f36be6',
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
