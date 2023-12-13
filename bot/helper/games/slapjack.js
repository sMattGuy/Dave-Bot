const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const cardsDeck = require("./slapjackDeck.json");
const getUser = require("../../../backend/firestore/main/getUser");
const { ButtonStyle, ActionRow } = require("discord.js");

exports.playSlapjack = async (int, rematch) => {
  let user = int.user;
  let opp = int.options.getUser("opponent");
  let betAmt = int.options.getNumber("bet");
  let msg;

  const userData = await getUser(user);
  const oppData = await getUser(opp, true);

  if (!oppData) {
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
  if (userData.stats.nut < betAmt) tooBroke = "p1";
  else if (oppData.stats.nut < betAmt) tooBroke = "p2";
  if (tooBroke) {
    const brokeEmbed = new EmbedBuilder().setTitle(
      `${
        tooBroke === "p1"
          ? "You can't afford that wager! Broke ahh!"
          : tooBroke === "p2"
          ? `${oppData.username} can't afford that wager!`
          : "Try something else."
      }`
    );

    return await int.reply({
      embeds: [brokeEmbed],
      ephemeral: true,
    });
  }

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

  msg = await int.reply({
    embeds: [startEmbed],
    components: [startMatchRow],
  });

  const startMatchFilter = (i) => {
    return i.user.id === opp.id;
  };

  const startMatchCollector = msg.createMessageComponentCollector({
    filter: startMatchFilter,
    time: 30000,
  });

  startMatchCollector.on("collect", async (i) => {
    //await i.deferUpdate();
    const acceptEmbed = new EmbedBuilder()
      .setTitle("✋ Start slappin and jackin! 🃏")
      .setDescription(
        `${userData.username} vs ${oppData.username} | Pot: ${betAmt * 2}`
      );
    const declineEmbed = new EmbedBuilder().setTitle(
      `😔 ${oppData.username} is a pussball! 😭`
    );
    if (i.customId === "accept") {
      msg = await i.update({
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
  let turn = 0;
  let activeInt;
  let canSlap = true;
  let stayCount = 0;
  let canHit = true;
  let slapped = [false, false];

  let deck = new Deck();
  let players = [];
  players.push(new Player(user.id, [deck.draw(), deck.draw()]));
  deck = new Deck(players[0].cards);
  players.push(new Player(opp.id, [deck.draw(), deck.draw()]));

  const endGame = async (playersInt) => {
    const checkWin = () => {
      if (players[0].score() > 21 && players[1].score() > 21) {
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
      else winner = 'ERROR';
    }

    const endResult = checkWin();

    const rematchButton = new ButtonBuilder()
      .setCustomId('rematch')
      .setLabel('Rematch')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true);

    const rematchRow = new ActionRowBuilder()
      .addComponents(rematchButton);

    /*const endFields = {
      winner: [{
        name: `Their Hand (${i === 0 ? players[1].score(true) : players[0].score(true)}?)`,
        value: `${
          i === 0 ? getHandString(players[1], true) : getHandString(players[0], true)
        }`,
      },
      {
        name: `Your Hand (${players[i].score()})`,
        value: `${
          i === 0 ? getHandString(players[0]) : getHandString(players[1])
        }`,
      }],
      loser: [{
        name: `Their Hand (${i === 0 ? players[1].score(true) : players[0].score(true)}?)`,
        value: `${
          i === 0 ? getHandString(players[1], true) : getHandString(players[0], true)
        }`,
      },
      {
        name: `Your Hand (${players[i].score()})`,
        value: `${
          i === 0 ? getHandString(players[0]) : getHandString(players[1])
        }`,
      }],
    };*/

    const tieEmbed = new EmbedBuilder()
      .setTitle('♠️ ♥️ Slapjack ♣️ ♦️')
      .setDescription(`${endResult.reason}\nAll wagers were refunded!`)

    const endEmbed = new EmbedBuilder()
      .setTitle(`${endResult.winnerData.username} slapped ${endResult.loserData.username} to death! ✋`)

    /*const loserEmbed = new EmbedBuilder()
      .setTitle(`Your ass got slapped up by ${endResult.winnerData.username}! ✋`)
      .setDescription(`You won test cum!`)*/

    playersInt.forEach(async i => {
      if (endResult.type === 'push') {
        await i.edit({ 
          embeds: [ tieEmbed ],
          components: [ rematchRow ]
         });
      }
      else {
        endEmbed.setDescription(`${endResult.winnerData.username} wins ${betAmt * 2}`)
        await i.edit({ 
          embeds: [ endEmbed ],
          components: [ rematchRow ]
         });
      }
    });
    if (endResult.type === 'push') {
      msg = await msg.editReply({
        embeds: [ endEmbed ]
      });
    }
    else {
      msg = await msg.editReply({
        embeds: [ tieEmbed ]
      });
    }
  }

  const runGame = async (playersInt) => {
    if (stayCount === 2) return endGame(playersInt);
    if (players[turn].score() >= 21) canHit = false;
    if (turn === 0 && players[1].cards.length === 1) canSlap === false;
    else if (turn === 1 && players[0].cards.length === 1) canSlap === false;
    deck = new Deck([...players[0].cards, ...players[1].cards]);

    const gameEmbed = new EmbedBuilder().setTitle("♠️ ♥️ Slapjack ♣️ ♦️");

    const hitButton = new ButtonBuilder()
        .setCustomId('hit')
        .setLabel('HIT')
        .setStyle(ButtonStyle.Primary)
    
    const stayButton = new ButtonBuilder()
        .setCustomId('stay')
        .setLabel('STAY')
        .setStyle(ButtonStyle.Primary)

    const slapButton = new ButtonBuilder()
        .setCustomId('slap')
        .setLabel('SLAP')
        .setStyle(ButtonStyle.Primary)

    const optionsRow = new ActionRowBuilder()
        .addComponents(
            hitButton,
            stayButton,
            slapButton
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
      stayButton.setDisabled(false);
      slapButton.setDisabled(!canSlap || slapped[i]);
      canHit = true;
      if (turn !== i) {
        hitButton.setDisabled(true);
        stayButton.setDisabled(true);
        slapButton.setDisabled(true);
      }
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
        console.log(stayCount)
        let roundDesc = `${!canHit ? `You can only STAY or you will bust!\nTip: Don't STAY too fast or they will know.` : `You can HIT${stayCount === 1 ? ' or STAY' : ', STAY, or SLAP'}`}`;

        if (firstRound) { // this one only for desc
            roundDesc = 'HIT until bust or stay, SLAP their last face-up card away, or only STAY to prevent a slap.';
          }

      if (i !== turn) {
          const otherUsername = i === 0 ? oppData.username : userData.username;
          roundDesc = `🤔 ${otherUsername} is thinking...`
          //roundFields.push({ name: `🤔 ${otherUsername} is thinking...`, value: '\u200b' });
          hitButton.setDisabled(true);
          stayButton.setDisabled(true);
          slapButton.setDisabled(true);
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
        playersInt[i] = await playersInt[i].user.send({
          embeds: [ roundEmbed ],
          components: [ optionsRow ],
          //ephemeral: true,
        });
      }
      else {
        //playersInt[i] = await playersInt[i].editReply({
        playersInt[i] = await playersInt[i].edit({
          embeds: [ roundEmbed ],
          components: [ optionsRow ],
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
          stayCount = 0;
          players[turn] = new Player(players[turn].id, [...players[turn].cards, deck.draw()])
          await runGame(playersInt);
        }
        else if (choice === 'stay') {
          if (!canSlap && didHit) stayCount = 0; // if hit, does not count as stay
          else stayCount++;
          slapped[turn] = false;
          didHit = false;
          canSlap = true;
          turn = turn === 0 ? 1 : 0;
          await runGame(playersInt);
        }
        else if (choice === 'slap') {
          slapped[turn] = true;
          stayCount = 0;
          turn = turn === 0 ? 1 : 0;
          const newHand = [...players[turn].cards];
          newHand.pop();
          console.log(newHand)
          players[turn] = new Player(players[turn].id, newHand);
          await runGame(playersInt);
        }
    });
  };

  //await runGame();
};
