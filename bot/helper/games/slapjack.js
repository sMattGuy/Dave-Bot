const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const cardsDeck = require("./slapjackDeck.json");
const getUser = require("../../../backend/firestore/main/getUser");
const { ButtonStyle } = require("discord.js");

exports.playSlapjack = async (int) => {
  let user = int.user;
  let opp = int.options.getUser("opponent");
  let betAmt = int.options.getNumber("bet");

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

  let msg = await int.reply({
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
    const acceptEmbed = new EmbedBuilder()
      .setTitle("✋ Start slappin and jackin! 🃏")
      .setDescription(
        `${userData.username} vs ${oppData.username} | Pot: ${betAmt * 2}`
      );
    const declineEmbed = new EmbedBuilder().setTitle(
      `😔 ${oppData.username} is a pussball! 😭`
    );
    if (i.customId === "accept") {
      await i.update({
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
    score() {
      let currScore = 0;
      let aceCount = 0;
      for (let i = 0; i < cards.length; i++) {
        if (
          cards[i].value == 10 ||
          cards[i].value == "J" ||
          cards[i].value == "Q" ||
          cards[i].value == "K"
        )
          currScore += 10;
        else if (cards[i].value == "A") aceCount++;
        else currScore += cards[i].value;
      }

      for (let i = 0; i < aceCount; i++) {
        if (currScore >= 21) currScore += 1;
        else if (currScore + 11 <= 21) currScore += 11;
        else currScore + 1;
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

  let firstRounds = 0;
  let turn = 0;
  let activeInt;

  const runGame = async (playersInt) => {
    const deck = new Deck();
    const players = [];

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

    players.push(new Player(user.id, [deck.draw(), deck.draw()]));
    players.push(new Player(opp.id, [deck.draw(), deck.draw()]));

    for (let i = 0; i < 2; i++) {
      hitButton.setDisabled(false);
      stayButton.setDisabled(false);
      slapButton.setDisabled(false);
      const roundEmbed = gameEmbed;
      const roundFields = [{
          name: "Their Hand",
          value: `${
            i === 0 ? getHandString(players[1], true) : getHandString(players[0], true)
          }`,
        },
        {
          name: "Your Hand:",
          value: `${
            i === 0 ? getHandString(players[0]) : getHandString(players[1])
          }`,
        }];

        let roundDesc = 'put what u want here after first 2 rounds'

        if (firstRounds < 2) { // only for desc right now
            firstRounds ++;
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

      playersInt[i] = await playersInt[i].followUp({
        embeds: [ roundEmbed ],
        components: [ optionsRow ],
        ephemeral: true,
      });

      activeInt = playersInt[turn];
    }

    const roundFilter = roundInt => {
        return roundInt.user.id === players[turn].id;
    }

    const roundCollector = activeInt.createMessageComponentCollector({
        filter: roundFilter,
        time: 30000
    });

    roundCollector.on('collect', async (roundInt) => {
        
    });

    turn = i === 0 ? 1 : 0;
  };

  //await runGame();
};
