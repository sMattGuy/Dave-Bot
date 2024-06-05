const fs = require('fs');
const getCache = require('./getCache');

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
    if (match.league.name === 'Friendlies Clubs') return;
    pastMatches.push({
      date: match.fixture.date,
      home: match.teams.home.name,
      away: match.teams.away.name,
      venue: match.fixture.venue.name,
      score: [match.goals.home, match.goals.away],
    });
  });

  let setNextMatch = false;
  let setNextClosest = false;
  upcomingMatchesRaw.forEach((match) => {
    if (!setNextMatch && match.fixture.venue.city !== "New York City") {
      upcomingMatches.nextMatch = {
        date: match.fixture.date,
        home: match.teams.home.name,
        away: match.teams.away.name,
        venue: match.fixture.venue.name,
      };
      setNextMatch = true;
    }
    if (!setNextClosest && match.fixture.venue.city === "New York City") {
      upcomingMatches.nextClosest = {
        date: match.fixture.date,
        home: match.teams.home.name,
        away: match.teams.away.name,
        venue: match.fixture.venue.name,
      };
      setNextClosest = true;
    }
  });

  return { pastMatches, upcomingMatches };
};

const getMatchData = async () => {
  let nycCache = await getCache();

    try {
      const fixturesData = nycCache.fixturesData;
      return cleanMatchData(fixturesData);
    } catch (error) {
      console.log(error);
    }
};

module.exports = getMatchData;
