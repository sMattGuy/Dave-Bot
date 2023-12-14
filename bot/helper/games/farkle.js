const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ActionRow,
} = require("discord.js");
const jizzleTable = new AttachmentBuilder(
  "C:/Programming/Discord Bots/DaveBot/bot/images/farkleTable.png"
);
const { getGameData } = require("../../../backend/firestore/utility/get_gameData");
const { updateNut } = require("../../../backend/firestore/main/update_nut");
const scoringCombinations = require('./farkleCombos.json');
const getUser = require("../../../backend/firestore/main/getUser");
const { updateJizzleTracker } = require("../../../backend/firestore/utility/update_jizzle_tracker");

let startNewGame = false;
let saveInteraction;
let secondGame = false;
let msg;
let endInt = false;
let gameData;

/*const checkNewGame = () => {
  const checkTimer = setInterval(() => {
  if (startNewGame === true) {
    clearInterval(checkTimer);
    console.log('cleared!')
    secondGame = true;
    startNewGame = false;
    playJizzle(saveInteraction);
  }
  else if (endInt) {
    clearInterval(checkTimer)
    console.log('cleared! 2')
  };
}, 200);
}*/

const playJizzle = async (interaction) => {
  if (!secondGame) gameData = await getGameData();
  //checkNewGame();
  saveInteraction = interaction;
  const user = interaction.user;
  let currBet = 0;
  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  //setup
  let score = 0;
  let diceValues = [];
  let keptThisRound = false;
  let roll = 0;
  let maxBet = 50;

  const dice = {
    d1: {
      keep: false,
      val: rollDice(),
    },
    d2: {
      keep: false,
      val: rollDice(),
    },
    d3: {
      keep: false,
      val: rollDice(),
    },
    d4: {
      keep: false,
      val: rollDice(),
    },
    d5: {
      keep: false,
      val: rollDice(),
    },
    d6: {
      keep: false,
      val: rollDice(),
    },
  };

  let startDesc = 'Bet: Send your nut bet below!';
  currBet = interaction.options.getNumber('bet') || 0;
  if (currBet > 0) {
    const userData = await getUser(user);
    if (currBet > userData.stats.nut) currBet = userData.stats.nut;
    if (currBet > maxBet) currBet = maxBet;
    startDesc = `Bet: ${currBet}`;
  }

  const jizzleEmbed = new EmbedBuilder()
    .setTitle(`Jizzle! 🎲💦`)
    .setDescription(`${startDesc}`);

  const startButton = new ButtonBuilder()
    .setCustomId("newGame")
    .setLabel("Start")
    .setStyle(ButtonStyle.Primary);

  const optionsRow = new ActionRowBuilder().addComponents(startButton);

  const rollButton = new ButtonBuilder()
    .setCustomId("roll")
    .setLabel("Roll")
    .setStyle(ButtonStyle.Danger);

  const endTurnButton = new ButtonBuilder()
    .setCustomId("endTurn")
    .setLabel("End Round")
    .setStyle(ButtonStyle.Danger)

  const rollRow = new ActionRowBuilder().addComponents(rollButton, endTurnButton);

  const keep1Button = new ButtonBuilder()
    .setCustomId("keep1")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep2Button = new ButtonBuilder()
    .setCustomId("keep2")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep3Button = new ButtonBuilder()
    .setCustomId("keep3")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep4Button = new ButtonBuilder()
    .setCustomId("keep4")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep5Button = new ButtonBuilder()
    .setCustomId("keep5")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keep6Button = new ButtonBuilder()
    .setCustomId("keep6")
    .setLabel("Keep")
    .setStyle(ButtonStyle.Success);

  const keepRow1 = new ActionRowBuilder().addComponents(
    keep1Button,
    keep2Button,
    keep3Button
  );

  const keepRow2 = new ActionRowBuilder().addComponents(
    keep4Button,
    keep5Button,
    keep6Button
  );

  if (secondGame) {
    msg = await interaction.editReply({
      embeds: [jizzleEmbed],
      components: [optionsRow],
    });
  }
  else {
    msg = await interaction.reply({
      embeds: [jizzleEmbed],
      components: [optionsRow],
    });
  }

  const jizzleBetFilter = (i) => {
    if (i.author.id === user.id && parseInt(i.content)) return true;
  };

  const jizzleBetCollector = interaction.channel.createMessageCollector({
    filter: jizzleBetFilter,
    time: 30000,
  });

  jizzleBetCollector.on("collect", async (i) => {
    if (currBet > 0) {
      jizzleBetCollector.stop();
      return;
    }
    currBet = Math.floor(parseInt(i.content));
    const userData = await getUser(user);
    if (currBet > userData.stats.nut) currBet = userData.stats.nut;
    if (currBet > maxBet) currBet = maxBet;

    jizzleEmbed
      .setTitle(`Jizzle! 🎲💦`)
      .setDescription(`Bet: ${currBet} 💦`);

    msg = await interaction.editReply({
      embeds: [jizzleEmbed],
      components: [optionsRow],
    });

    jizzleBetCollector.stop();
  });

  const jizzleFields = [
    { name: `🎲 ${dice.d1.val}`, value: "ROLL", inline: true },
    { name: `🎲 ${dice.d2.val}`, value: "ROLL", inline: true },
    { name: `🎲 ${dice.d3.val}`, value: "ROLL", inline: true },
    { name: `🎲 ${dice.d4.val}`, value: "ROLL", inline: true },
    { name: `🎲 ${dice.d5.val}`, value: "ROLL", inline: true },
    { name: `🎲 ${dice.d6.val}`, value: "ROLL", inline: true },
  ];

  const jizzleButtonFilter = (i) => {
    return i.user.id === user.id;
  };

  const jizzleButtonCollector = msg.createMessageComponentCollector({
    filter: jizzleButtonFilter,
    idle: 60000,
  });

  jizzleButtonCollector.on("collect", async (i) => {
    //await i.deferUpdate();
    if (i.customId === "newGame") {
      jizzleBetCollector.stop();

      jizzleEmbed
        .setDescription(`Bet: ${currBet} 💦\nPayout: ${roll === 0 ? 'x3' : roll === 1 ? 'x2' : 'x1'} | Score: ${score}`)
        .setFields(jizzleFields);
        

      await i.update({
        embeds: [jizzleEmbed],
        components: [keepRow1, keepRow2, rollRow],
      });
    } else if (
      i.customId === "keep1" ||
      i.customId === "keep2" ||
      i.customId === "keep3" ||
      i.customId === "keep4" ||
      i.customId === "keep5" ||
      i.customId === "keep6"
    ) {
      keptThisRound = true;
      switch (i.customId) {
        case "keep1":
          dice.d1.keep = true;
          keep1Button.setDisabled(true);
          jizzleFields[0].value = 'KEPT';
          break;
        case "keep2":
          dice.d2.keep = true;
          keep2Button.setDisabled(true);
          jizzleFields[1].value = 'KEPT';
          break;
        case "keep3":
          dice.d3.keep = true;
          keep3Button.setDisabled(true);
          jizzleFields[2].value = 'KEPT';
          break;
        case "keep4":
          dice.d4.keep = true;
          keep4Button.setDisabled(true);
          jizzleFields[3].value = 'KEPT';
          break;
        case "keep5":
          dice.d5.keep = true;
          keep5Button.setDisabled(true);
          jizzleFields[4].value = 'KEPT';
          break;
        case "keep6":
          dice.d6.keep = true;
          keep6Button.setDisabled(true);
          jizzleFields[5].value = 'KEPT';
          break;
      }
      await i.update({
        embeds: [jizzleEmbed],
        components: [keepRow1, keepRow2, rollRow],
      });
    } else if (i.customId === "roll") {
      /*if (!keptThisRound) {
        const noKeepEmbed = new EmbedBuilder()
        .setTitle(`Jizzle! 🎲💦`)
        .setDescription(`Bet: ${currBet} 💦 - You cannot roll without atleast 1 keep\nPayout: ${roll === 0 ? 'x3' : roll === 1 ? 'x2' : 'x1'} | Score: ${score}`)
        .setFields(jizzleFields)
        return await i.update({
          embeds: [noKeepEmbed],
          components: [keepRow1, keepRow2, rollRow]
        });
      }
      keptThisRound = false;*/
      roll++;
      if (!dice.d1.keep) {
        dice.d1.val = rollDice();
        jizzleFields[0].name = `🎲 ${dice.d1.val}`;
      }
      if (!dice.d2.keep) {
        dice.d2.val = rollDice();
        jizzleFields[1].name = `🎲 ${dice.d2.val}`;
      }
      if (!dice.d3.keep) {
        dice.d3.val = rollDice();
        jizzleFields[2].name = `🎲 ${dice.d3.val}`;
      }
      if (!dice.d4.keep) {
        dice.d4.val = rollDice();
        jizzleFields[3].name = `🎲 ${dice.d4.val}`;
      }
      if (!dice.d5.keep) {
        dice.d5.val = rollDice();
        jizzleFields[4].name = `🎲 ${dice.d5.val}`;
      }
      if (!dice.d6.keep) {
        dice.d6.val = rollDice();
        jizzleFields[5].name = `🎲 ${dice.d6.val}`;
      }
      Object.keys(dice).forEach(di => {
        if(dice[di].keep && !dice[di].lockin) {
          diceValues.push(dice[di].val);
          dice[di].lockin = true;
        }
      })

      score += calculateScore(diceValues);
      console.log("Score:", score);
      diceValues = [];

      if (roll === 2) {
        rollButton.setDisabled(true);
      }

      // for payout updating
      jizzleEmbed
        .setDescription(`Bet: ${currBet} 💦\nPayout: ${roll === 0 ? 'x3' : roll === 1 ? 'x2' : 'x1'} | Score: ${score}`)

      await i.update({
        embeds: [jizzleEmbed],
        components: [keepRow1, keepRow2, rollRow],
      });
    }
    else if (i.customId === 'endTurn') {
      Object.keys(dice).forEach(di => {
        //ignores keep state for end round and takes all remaining di
        if (!dice[di].lockin) diceValues.push(dice[di].val);
      });

      console.log(diceValues)
      score += calculateScore(diceValues);
      console.log("Final Score:", score);
      diceValues = [];

      jizzleButtonCollector.stop('game over');
    }
  });

  jizzleButtonCollector.on('end', async (collected, reason) => {
      if (reason === 'game over') {
        let winAmt = roll === 0
          ? currBet * 3
          : roll === 1
          ? currBet * 2
          : roll === 2 && score >= gameData.jizzleBeatScore
          ? currBet
          : 0;
        let newGameTitle = '';
        if (score >= gameData.jizzleBeatScore) {
          if (score >= gameData.jizzle5xScore) winAmt = currBet * 5;
          const userUpdated = await updateNut(user, winAmt - currBet);
          await updateJizzleTracker(true);
          newGameTitle = `You won ${winAmt} 💦\nFinal Score: ${score}${score >= gameData.jizzle5xScore ? ' (x5 Payout)' : ''}\nCurrent Nut Stored: ${userUpdated.stats.nut} 💦`;
        }
        else {
          const userUpdated = await updateNut(user, -currBet);
          await updateJizzleTracker(false);
          newGameTitle = `You lost ${currBet} 💦\nFinal Score: ${score}\nCurrent Nut Stored: ${userUpdated.stats.nut} 💦`
        }

        const newGameFilter = i => {
          return i.user.id === user.id;
        }

        /*const newGameCollector = msg.createMessageComponentCollector({
          filter: newGameFilter,
          time: 30000,
        });*/

        const newGameEmbed = new EmbedBuilder()
          .setTitle(`${newGameTitle}`)
          .setDescription("Jizz Again? 💦\n/play jizzle")

        const newGameButton = new ButtonBuilder()
          .setCustomId('NewGame')
          .setLabel('New Game')
          .setStyle(ButtonStyle.Success)

        const newGameRow = new ActionRowBuilder().addComponents(newGameButton);

        await interaction.editReply({
          embeds: [newGameEmbed],
          components: []
          //components: [newGameRow]
        });

        //let tempI;

        /*newGameCollector.on('collect', async i => {
          //tempI = i;
          await i.deferUpdate();
          startNewGame = true;
          newGameCollector.stop();
        })

        newGameCollector.on('end', async (collected, reason) => {
          endInt = true;
          if (!startNewGame) {
            secondGame = false;
            const timeoutEmbed = new EmbedBuilder()
            .setTitle(`You took too long!\nRestart with /play jizzle`)

            return await interaction.editReply({
              embeds: [timeoutEmbed],
              components: []
            });
          }
        })*/
      }
      else {
      //if (tempI?.customId) return;
      secondGame = false;
      if (currBet < maxBet || currBet > maxBet) currBet = maxBet;
      await updateNut(user, -currBet);
      const timeoutEmbed = new EmbedBuilder()
        .setTitle(`You took too long!\nSay goodbye to your hard earned ${currBet} 💦`)

        endInt = true;

        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: []
        });
      }
  })
};

// Function to calculate score
function calculateScore(diceValues) {
  let score = 0;

  while (diceValues.length > 0) {
    const scoreOptions = [];
    Object.keys(scoringCombinations).forEach(combo => {
      let diceCopy = [...diceValues].sort((a, b) => a - b);
      for (let a = 0; a < diceCopy.length; a++) {
        let checkDice = [...diceCopy];
        for (let b = diceCopy.length; b > 0; b--) {
          checkDice = checkDice.slice(0, b);
          if (scoringCombinations[combo].Combination.toString() === checkDice.toString()) {
            scoreOptions.push({combo: scoringCombinations[combo].Combination, score: scoringCombinations[combo].Score});
          }
        }
        diceCopy.unshift(diceCopy[diceCopy.length - 1]);
        diceCopy.pop();
      }
/*
      for (let i = diceCopy.length; i > 0; i--) {
        console.log('new');
        const checkDice = diceCopy.slice(0, i);
        for (let b = 0; b < checkDice.length; b++) {
          console.log('next')
          console.log(checkDice);
          if (scoringCombinations[combo].Combination.toString() === checkDice.toString()) {
            scoreOptions.push({combo: scoringCombinations[combo].Combination, score: scoringCombinations[combo].Score});
          }
          checkDice.unshift(checkDice[checkDice.length - 1]);
          checkDice.pop();
        }
      };*/
    });

    console.log(scoreOptions)
    if (scoreOptions.length > 0) {
      scoreOptions.sort((a, b) => b.score - a.score);
      //console.log(scoreOptions);
      //console.log(diceValues)
  
      const compare = [...scoreOptions[0].combo];
      compare.forEach(compVal => {
        const removeElement = diceValues.indexOf(compVal);
        diceValues.splice(removeElement, 1);
      })
  
      //console.log(diceValues)
      score += scoreOptions[0].score;
    }
    else {
      diceValues = [];
    }
  }

  return score;
}

module.exports = playJizzle;
