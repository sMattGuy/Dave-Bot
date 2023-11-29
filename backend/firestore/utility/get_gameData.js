const { doc, getDoc } = require("firebase/firestore");
const { db } = require("../../db");

exports.getGameData = async () => {
  const gameDataRef = doc(db, "assets", "gameData");
  const gameDataSnap = await getDoc(gameDataRef);

  return gameDataSnap.data();
};
