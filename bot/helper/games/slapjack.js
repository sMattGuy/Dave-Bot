const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const cardsDeck = require("./slapjackDeck.json");
const getUser = require("../../../backend/firestore/main/getUser");
const { ButtonStyle, ActionRow } = require("discord.js");
const { updateNut } = require("../../../backend/firestore/main/update_nut");

exports.playSlapjack = async (int, rematch, userRematch, oppRematch, betAmtRematch, playersIntRematch, newMsgOG, newRematchCount) => {
  let user;
  let opp;
  let betAmt;
  let msgOG;
  let notifyMsg;
  let newPlayersInt = playersIntRematch || null;
  let rematchCount = 0;

  if (rematch) {
    user = userRematch;
    opp = oppRematch;
    betAmt = betAmtRematch;
    rematchCount = newRematchCount;
    msgOG = newMsgOG
  }
  else {
    user = int.user;
    opp = int.options.getUser("opponent");
    betAmt = int.options.getNumber("bet");
  }

  let userData = await getUser(user);
  let oppData = await getUser(opp, true);

  if (!oppData && !rematch) {
    const noUserEmbed = new EmbedBuilder().setTitle(
      "That player does not exist!"
    );

    return await int.reply({
      embeds: [noUserEmbed],
      ephemeral: true,
    });
  }

  // wager check
  let tooBroke = "";
  if (userData.stats.nut < betAmt || betAmt < 0) tooBroke = "p1";
  else if (oppData.stats.nut < betAmt) tooBroke = "p2";
  if (tooBroke) {
    let brokeEmbed = new EmbedBuilder().setTitle(
      `${
        tooBroke === "p1"
          ? "You can't afford that wager! Broke ahh!"
          : tooBroke === "p2"
          ? `${oppData.username} can't afford that wager!`
          : "Try something else."
      }`
    );

    if (rematch) {
      brokeEmbed.setTitle(
        `🤔 Someone is too broke for that wager!\nStart a new Slapjack with a lower wager. 🤔`
      );
      for (let i = 0; i < 2; i++) {
        return await newPlayersInt[i].edit({
          embeds: [ brokeEmbed ]
        });
      }
      return;
    }

    return await int.reply({
      embeds: [brokeEmbed],
      ephemeral: true,
    });
  }

  if (rematch) {
    await updateNut(user, -betAmt);
    await updateNut(opp, -betAmt);
  }
  else {
  const startEmbed = new EmbedBuilder().setTitle(
    `${userData.username} has challenged ${oppData.username} to Slapjack!\nWager: 💦 ${betAmt}`
  );

  const acceptButton = new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const declineButton = new ButtonBuilder()
    .setCustomId("decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger);

  const startMatchRow = new ActionRowBuilder().addComponents(
    acceptButton,
    declineButton
  );

  msgOG = await int.reply({
    embeds: [startEmbed],
    components: [startMatchRow],
  });

  // challenge dm notification
  const notifyEmbed = new EmbedBuilder()
    .setTitle(`${userData.username} challenged you to Slapjack! Check the chat!`)

  notifyMsg = await opp.send({
    embeds: [ notifyEmbed ]
  });

  const startMatchFilter = (i) => {
    return i.user.id === opp.id;
  };

  const startMatchCollector = msgOG.createMessageComponentCollector({
    filter: startMatchFilter,
    time: 30000,
  });

  startMatchCollector.on("collect", async (i) => {
    //await i.deferUpdate();
    await notifyMsg.delete();
    const acceptEmbed = new EmbedBuilder()
      .setTitle("✋ Start slappin and jackin! 🃏")
      .setDescription(
        `${userData.username} vs ${oppData.username} | Pot: 💦 ${betAmt * 2}`
      );
    const declineEmbed = new EmbedBuilder().setTitle(
      `😔 ${oppData.username} is a pussball! 😭`
    );
    if (i.customId === "accept") {
      // wager check again
      userData = await getUser(user);
      oppData = await getUser(opp);
      let tooBroke = "";
      if (userData.stats.nut < betAmt || betAmt < 0) tooBroke = "p1";
      else if (oppData.stats.nut < betAmt) tooBroke = "p2";
      if (tooBroke) {
        const brokeEmbed = new EmbedBuilder().setTitle(
          `🤔 Someone is too broke for that wager! 🤔`
        );
    
        startMatchCollector.stop("collected");
        return await i.update({
          embeds: [brokeEmbed]
        });
      }
      await updateNut(user, -betAmt);
      await updateNut(opp, -betAmt);
      msgOG = await i.update({
        embeds: [acceptEmbed],
        components: [],
      });
      await runGame([int, i]);
    } else {
      await i.update({
        embeds: [declineEmbed],
        components: [],
      });
    }

    startMatchCollector.stop("collected");
  });

  startMatchCollector.on("end", async (collected, reason) => {
    const timeoutEmbed = new EmbedBuilder().setTitle(
      `😔 ${oppData.username} didn't respond! 😕`
    );
  });
}

  class Deck {
    constructor(used) {
      this.cards = cardsDeck;
      this.used = used || [];
    }
    draw() {
      let cards = [...this.cards];
      for (let i = 0; i < this.used.length; i++) {
        const removeIndex = cards.findIndex(
          (card) =>
            card.value == this.used[i].value && card.suit == this.used[i].suit
        );
        cards.splice(removeIndex, 1);
      }

      return cards[Math.floor(Math.random() * cards.length)];
    }
  }

  class Player {
    constructor(id, cards) {
      this.id = id;
      this.cards = cards;
    }
    score(showing) {
      let currScore = 0;
      let aceCount = 0;
      const myCards = [...this.cards];
      if (showing) myCards.splice(0, 1);

      for (let i = 0; i < myCards.length; i++) {
        if (
          myCards[i].value == 10 ||
          myCards[i].value == "J" ||
          myCards[i].value == "Q" ||
          myCards[i].value == "K"
        )
          currScore += 10;
        else if (myCards[i].value == "A") aceCount++;
        else currScore += myCards[i].value;
      }

      for (let i = 0; i < aceCount; i++) {
        if (currScore >= 21) currScore += 1;
        else if (currScore + 11 <= 21) currScore += 11;
        else currScore += 1;
      }

      return currScore;
    }
  }

  /*let p1 = new Player(user.id);
    let p2 = new Player(opp.id);
    let p1Slap = true;
    let p2Slap = true;*/

  let suitIcons = {
    spades: "♠️",
    hearts: "♥️",
    clubs: "♣️",
    diamonds: "♦️",
  };

  let firstRound = true;
  let turn = 0;//rematchCount % 2;
  let activeInt;
  let canSlap = true;
  let passCount = 0;
  let canHit = true;
  let slapped = [false, false];
  let didHit = false;
  let lastMove = '';

  let deck = new Deck();
  let players = [];
  players.push(new Player(user.id, [deck.draw(), deck.draw()]));
  deck = new Deck(players[0].cards);
  players.push(new Player(opp.id, [deck.draw(), deck.draw()]));

  let rematchAccept = 0;
  const endGame = async (playersInt, timeout) => {
    const checkWin = () => {
      if (timeout) return 'TEST';
      else if (players[0].score() > 21 && players[1].score() > 21) {
        return {
          type: 'push',
          reason: 'You both busted! 💦',
          winnerData: 'N/A',
          loserData: 'N/A',
        }
      }
      else if (players[0].score() === players[1].score()) {
        return {
          type: 'push',
          reason: 'You both tied! 😔',
          winnerData: 'N/A',
          loserData: 'N/A',
        }
      }
      else if (players[0].score() > 21) {
        return {
          type: 'win',
          reason: 'Other player busted!',
          winnerData: oppData,
          loserData: userData,
        }
      }
      else if (players[1].score() > 21) {
        return {
          type: 'win',
          reason: 'Other player busted!',
          winnerData: userData,
          loserData: oppData,
        }
      }
      else if (players[0].score() > players[1].score()) {
        return {
          type: 'win',
          reason: 'Higher Score!',
          winnerData: userData,
          loserData: oppData,
        }
      }
      else if (players[1].score() > players[0].score()) {
        return {
          type: 'win',
          reason: 'Higher Score!',
          winnerData: oppData,
          loserData: userData,
        }
      }
      else return 'ERROR';
    }

    const endResult = checkWin();

    if (endResult === 'TEST') {
      console.log('timeout');
      return;
    }
    if (endResult?.type === 'push') {
      await updateNut(user, betAmt);
      await updateNut(opp, betAmt);
    }
    else {
      await updateNut(endResult.winnerData, betAmt * 2);
    }

    const rematchButton = new ButtonBuilder()
      .setCustomId('rematch')
      .setLabel('Rematch')
      .setStyle(ButtonStyle.Success)
      .setDisabled(false);

    const rematchRow = new ActionRowBuilder()
      .addComponents(rematchButton);

    const getEndHandString = (player) => {
        let handFieldValue = "";
        let handCount = player.cards.length;
        player.cards.forEach((card) => {
          handCount--;
          handFieldValue += `${card.value} ${suitIcons[card.suit]}`;
          if (handCount !== 0) handFieldValue += " | ";
        });
        return handFieldValue;
      };

    let endFields;
    if (endResult.type === 'push') {
      endFields = [
        {
          name: `${userData.username}'s Hand (${players[0].score()})`,
          value: `${
            getEndHandString(players[0])
          }`,
        },
        {
          name: `${oppData.username}'s Hand (${players[1].score()})`,
          value: `${
            getEndHandString(players[1])
          }`,
        }
      ]
    }
    else if (endResult.type === 'win') {
      const winPlayer = user.id === endResult.winnerData.id ? players[0] : players[1];
      const losePlayer = user.id === winPlayer.id ? players[1] : players[0];
      endFields = [
        {
          name: `${endResult.winnerData.username}'s Hand (${winPlayer.score()})`,
          value: `${
            getEndHandString(winPlayer)
          }`,
        },
        {
          name: `${endResult.loserData.username}'s Hand (${losePlayer.score()})`,
          value: `${
            getEndHandString(losePlayer)
          }`,
        }
      ]
    }


    const tieEmbed = new EmbedBuilder()
      .setTitle('♠️ ♥️ Slapjack ♣️ ♦️')
      .setDescription(`${endResult.reason}\nAll wagers were refunded!`);

    const endEmbed = new EmbedBuilder()
      .setTitle(`${endResult.winnerData.username} slapped ${endResult.loserData.username} to death! ✋`)
      .setFields(endFields);

    /*const loserEmbed = new EmbedBuilder()
      .setTitle(`Your ass got slapped up by ${endResult.winnerData.username}! ✋`)
      .setDescription(`You won test cum!`)*/

    const rematchInt = [];
    let firstRematchSent = false;
    for (let i = 0; i < 2; i++) {
      let endInt;
      if (endResult.type === 'push') {
        if (!firstRematchSent) {
          firstRematchSent = true;
          endInt = await playersInt[i].edit({ 
            embeds: [ tieEmbed ],
            components: [ rematchRow ]
           });
           rematchInt.push(endInt);
        }
        else {
          endInt = await playersInt[i].edit({ 
            embeds: [ tieEmbed ],
            components: []
           });
           rematchInt.push(endInt);
        }
      }
      else {
        endEmbed.setDescription(`${endResult.winnerData.username} won 💦 ${betAmt * 2}`)
        if (!firstRematchSent) {
          firstRematchSent = true;
          endInt = await playersInt[i].edit({ 
            embeds: [ endEmbed ],
            components: [ rematchRow ]
           });
           rematchInt.push(endInt);
        }
        else {
          endInt = await playersInt[i].edit({ 
            embeds: [ endEmbed ],
            components: []
           });
           rematchInt.push(endInt);
        }
      }
    };
    if (endResult.type === 'push') {
      msgOG = await msgOG.edit({
        embeds: [ tieEmbed ]
      });
    }
    else {
      msgOG = await msgOG.edit({
        embeds: [ endEmbed ]
      });
    }

    const waitingRematchEmbed = new EmbedBuilder()
      .setTitle('Waiting for other player...')

    const timeoutRematchEmbed = new EmbedBuilder()
      .setTitle('Thanks for playing! 💦 😊')

      // first collector
      let checkId = user.id;

      let rematchFilter = (a) => {
        return a.user.id === checkId;
      }

      let rematchCollector = rematchInt[0].createMessageComponentCollector({
        filter: rematchFilter,
        time: 40000
      });

    rematchCollector.on('collect', async (i) => {
      rematchAccept++;
      if (rematchAccept === 1) {
        rematchButton.setDisabled(true);
        rematchInt[0] = await i.update({
          embeds: [ waitingRematchEmbed ],
          components: [ rematchRow ]
        });
        rematchButton.setDisabled(false);
        rematchInt[1] = await playersInt[1].edit({
          components: [ rematchRow ]
        });
        await rematchCollector.stop('accepted');
      // second collector
      const checkId = opp.id;

      const rematchFilter = a => {
        return a.user.id === checkId;
      }

      rematchCollector = rematchInt[1].createMessageComponentCollector({
        filter: rematchFilter,
        time: 40000
      })

    rematchCollector.on('collect', async (i) => {
      rematchCollector.stop('accepted');
      rematchInt[1] = await i.update({
        embeds: [ waitingRematchEmbed ],
        components: []
      });
      return await this.playSlapjack(null, true, user, opp, betAmt, rematchInt, msgOG ,rematchCount++);
    });
      }
    });
}

  const runGame = async (playersInt) => {
    canHit = true;
    if (passCount === 2) return endGame(playersInt);
    // decide if player can hit
    /*const aces = 0;
    players[turn].cards.forEach(card => {
      if (card.value == 'A') aces++;
    })*/
    if (players[turn].score() >= 21) canHit = false;
    if (turn === 0 && players[1].cards.length === 1) canSlap === false;
    else if (turn === 1 && players[0].cards.length === 1) canSlap === false;
    deck = new Deck([...players[0].cards, ...players[1].cards]);

    const gameEmbed = new EmbedBuilder().setTitle("♠️ ♥️ Slapjack ♣️ ♦️");

    const hitButton = new ButtonBuilder()
        .setCustomId('hit')
        .setLabel('HIT')
        .setStyle(ButtonStyle.Success)
    
    const stayButton = new ButtonBuilder()
        .setCustomId('stay')
        .setLabel('STAY')
        .setStyle(ButtonStyle.Success)

    const slapButton = new ButtonBuilder()
        .setCustomId('slap')
        .setLabel('SLAP')
        .setStyle(ButtonStyle.Danger)

    const passButton = new ButtonBuilder()
        .setCustomId('pass')
        .setLabel('PASS')
        .setStyle(ButtonStyle.Danger)

    const optionsRow = new ActionRowBuilder()
        .addComponents(
            hitButton,
            stayButton,
        )

    const optionsRow2 = new ActionRowBuilder()
        .addComponents(
            slapButton,
            passButton
        )

    const getHandString = (player, hideCard) => {
      let handFieldValue = "";
      let handCount = player.cards.length; // for lines between cards and hiding first card

      player.cards.forEach((card) => {
        handCount--;
        if (handCount === player.cards.length - 1 && hideCard) handFieldValue += ' ❓';
        else handFieldValue += `${card.value} ${suitIcons[card.suit]}`;
        if (handCount !== 0) handFieldValue += " | ";
      });

      return handFieldValue;
    };

    for (let i = 0; i < 2; i++) {
      hitButton.setDisabled(!canHit);
      stayButton.setDisabled(!didHit);
      slapButton.setDisabled(!canSlap || slapped[i]);
      passButton.setDisabled(didHit);

      const roundEmbed = gameEmbed;

      // set their hand display to a number and a '?' or just a '?'
      let theirHand = i === 0 ? players[1].score(true) : players[0].score(true);
      if (theirHand === 0) theirHand = '';
      theirHand += '?';

      const roundFields = [{
          name: `Their Hand (${theirHand})`,
          value: `${
            i === 0 ? getHandString(players[1], true) : getHandString(players[0], true)
          }`,
        },
        {
          name: `Your Hand (${players[i].score()})`,
          value: `${
            i === 0 ? getHandString(players[0]) : getHandString(players[1])
          }`,
        }];

        let roundDesc = '';
        switch (lastMove) {
          case 'stay':
            roundDesc = 'They hit and stayed!'
            break;
          case 'slap':
              roundDesc = 'They slapped your last card!'
              break;
          case 'pass':
              roundDesc = "They passed! If you pass it's game over."
              break;
          default:
            roundDesc = 'HIT until bust or STAY, SLAP their last face-up card away, or PASS to prevent a slap.'
              break;
        }

        if (firstRound) { // this one only for desc
            roundDesc = 'HIT until bust or STAY, SLAP their last face-up card away, or PASS to prevent a slap.';
          }

      if (i !== turn) {
          const otherUsername = i === 0 ? oppData.username : userData.username;
          roundDesc = `🤔 ${otherUsername} is thinking...`
          //roundFields.push({ name: `🤔 ${otherUsername} is thinking...`, value: '\u200b' });
          hitButton.setDisabled(true);
          stayButton.setDisabled(true);
          slapButton.setDisabled(true);
          passButton.setDisabled(true);
      }

      roundEmbed
        .setDescription(
          `${roundDesc}`
        )
        .setFields(roundFields);

      /*const facedownEmbed = new EmbedBuilder()
          .setTitle(`Your Facedown Card: ${players[i].cards.value} ${suitIcons[players[i].cards.suit]}`)*/

      if (firstRound) { // for editreply after followup
        /*await playersInt[i].followUp({
          embeds: [ facedownEmbed ],
          ephemeral: true
        });*/
        //playersInt[i] = await playersInt[i].followUp({
        if (rematch) {
          playersInt[i] = await playersInt[i].edit({
            embeds: [ roundEmbed ],
            components: [ optionsRow, optionsRow2 ],
            //ephemeral: true,
          });
        }
        else {
          playersInt[i] = await playersInt[i].user.send({
            embeds: [ roundEmbed ],
            components: [ optionsRow, optionsRow2 ],
            //ephemeral: true,
          });
        }

      }
      else {
        //playersInt[i] = await playersInt[i].editReply({
        playersInt[i] = await playersInt[i].edit({
          embeds: [ roundEmbed ],
          components: [ optionsRow, optionsRow2 ],
          //ephemeral: true,
        });
      }
    }

    activeInt = playersInt[turn];
    firstRound = false;

    const roundFilter = roundInt => {
        return roundInt.user.id === players[turn].id;
    }

    const roundCollector = activeInt.createMessageComponentCollector({
        filter: roundFilter,
        time: 60000
    });

    roundCollector.on('collect', async (roundInt) => {
        const choice = roundInt.customId;
        roundInt.deferUpdate();
        roundCollector.stop();
        if (choice === 'hit') {
          didHit = true;
          canSlap = false;
          passCount = 0;
          players[turn] = new Player(players[turn].id, [...players[turn].cards, deck.draw()])
          await runGame(playersInt);
        }
        else if (choice === 'stay') {
          lastMove = 'stay';
          if (!canSlap && didHit) passCount = 0; // if hit, does not count as stay
          slapped[turn] = false;
          didHit = false;
          canSlap = true;
          turn = turn === 0 ? 1 : 0;
          await runGame(playersInt);
        }
        else if (choice === 'slap') {
          lastMove = 'slap';
          slapped[turn] = true;
          passCount = 0;
          turn = turn === 0 ? 1 : 0;
          const newHand = [...players[turn].cards];
          newHand.pop();
          players[turn] = new Player(players[turn].id, newHand);
          await runGame(playersInt);
        }
        else if (choice === 'pass') {
          lastMove = 'pass';
          passCount++;
          canSlap = false;
          turn = turn === 0 ? 1 : 0;
          await runGame(playersInt);
        }
    });
  };
  if (rematch) await runGame([newPlayersInt[0], newPlayersInt[1]]);
};
