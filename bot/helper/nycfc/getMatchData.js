const axios = require("axios");

const cleanMatchData = async (data) => {
  const pastMatchesRaw = [];
  const upcomingMatchesRaw = [];

  data.forEach((match) => {
    if (match.fixture.status.short === "FT") pastMatchesRaw.push(match);
    else upcomingMatchesRaw.push(match);
  });

  const pastMatches = [];
  const upcomingMatches = {};

  pastMatchesRaw.forEach((match) => {
    pastMatches.push({
      date: match.fixture.date,
      home: match.teams.home.name,
      away: match.teams.away.name,
      venue: match.fixture.venue.name,
      score: [match.goals.home, match.goals.away],
    });
  });

  let setNextMatch = false;
  upcomingMatchesRaw.forEach((match) => {
    if (!setNextMatch) {
      upcomingMatches.nextMatch = {
        date: match.fixture.date,
        home: match.teams.home.name,
        away: match.teams.away.name,
        venue: match.fixture.venue.name,
      };
    }
    setNextMatch = true;
    if (match.fixture.venue.city === "New York City") {
      upcomingMatches.nextClosest = {
        date: match.fixture.date,
        home: match.teams.home.name,
        away: match.teams.away.name,
        venue: match.fixture.venue.name,
      };
    }
  });

  return { pastMatches, upcomingMatches };
};

const getMatchData = async () => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    params: {
      season: new Date().getUTCFullYear(),
      team: "1604",
    },
    headers: {
      "x-rapidapi-key": "7d72abfd87msh1e1ee55e26e1abap1c4abejsncb2927f36be6",
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const res = await axios.request(options);
    return cleanMatchData(res.data.response);
  } catch (error) {
    console.error(error);
  }
};

module.exports = getMatchData;
