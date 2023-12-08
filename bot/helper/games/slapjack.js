const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const cardsDeck = require('./slapjackDeck.json');
const getUser = require('../../../backend/firestore/main/getUser');
const { ButtonStyle } = require('discord.js');

exports.playSlapjack = async (int) => {
    let user = int.user;
    let opp = int.options.getUser('opponent')
    let betAmt = int.options.getNumber('bet')

    const userData = await getUser(user);
    const oppData = await getUser(opp);

    // need a wager check to make sure both players have enough

    const startEmbed = new EmbedBuilder()
        .setTitle(`${userData.username} has challenged ${oppData.username} to Slapjack!
        \nWager: 💦 ${betAmt}`)

    const acceptButton = new ButtonBuilder()
        .setCustomId('accept')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
        .setCustomId('decline')
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger);

    const startMatchRow = new ActionRowBuilder()
        .addComponents(
            acceptButton,
            declineButton
        )

    let msg = await int.reply({
        embeds: [ startEmbed ],
        components: [ startMatchRow ]
    })

    const startMatchFilter = i => {
        return i.user.id === opp.id;
    }

    const startMatchCollector = msg.createMessageComponentCollector({
        filter: startMatchFilter,
        time: 30000
    });

    startMatchCollector.on('collect', async (i) => {
        const acceptEmbed = new EmbedBuilder()
            .setTitle("✋ Start slappin and jackin! 🃏")
            .setDescription(`${userData.username} vs ${oppData.username} | Pot: ${betAmt * 2}`)
        const declineEmbed = new EmbedBuilder()
            .setTitle(`😔 ${oppData.username} is a pussball! 😭`)
        if (i.customId === 'accept') {
            await i.update({
                embeds: [ acceptEmbed ],
                components: []
            });
            // the below should be the rungame function
            // make sure the rest is ephemeral for both players
            int.channel.send({content: 'test p1', ephemeral: true});
            i.channel.send({content: 'test p2', ephemeral: true});
        }
        else {
            await i.update({
                embeds: [ declineEmbed ],
                components: []
            });
        }

        startMatchCollector.stop('collected');
    });

    startMatchCollector.on('end', async (collected, reason) => {
        const timeoutEmbed = new EmbedBuilder()
            .setTitle(`😔 ${oppData.username} didn't respond! 😕`)
    });

    class Deck {
        constructor(used) {
            this.cards = cardsDeck;
            this.used = used || [];
        }
        draw() {
            let cards = [...this.cards];
            for (let i = 0; i < used.length; i++) {
                const removeIndex = cards.findIndex(card => card.value == used[i].value && card.suit == used[i].suit);
                cards.splice(removeIndex, 1);
            }

            return cards[Math.floor(Math.random() * cards.length)];
        }
    }

    class Player {
        constructor(id, cards) {
            this.id = id;
            this.cards = cards
        }
        score() {
            let currScore = 0;
            let aceCount = 0
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].value == 10 || cards[i].value == 'J' || cards[i].value == 'Q' || cards[i].value == 'K') currScore += 10;
                else if (cards[i].value == 'A') aceCount ++;
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

    let firstRound = true;

    let p1 = new Player(user.id);
    let p2 = new Player(opp.id);
    let p1Slap = true;
    let p2Slap = true;

    const runGame = async () => {
        const deck = new Deck()

        const gameEmbed = new EmbedBuilder()
            .setTitle('♠️ ♥️ Slapjack ♣️ ♦️')

        if (firstRound) {
            p1 = new Player(user.id, [deck.draw(), deck.draw()]);
            p2 = new Player(opp.id, [deck.draw(), deck.draw()]);

            const p1Embed = gameEmbed;
            p1Embed.setDescription('HIT until bust or stay, SLAP their last face-up card away, or only STAY to prevent a slap.');
            await int.editReply({
                embeds: [ gameEmbed ]
            });

            const p2Embed = gameEmbed;
            p2Embed.setDescription('HIT until bust or stay, SLAP their last face-up card away, or only STAY to prevent a slap.');
            await opp
        }
    }

    //await runGame();
}