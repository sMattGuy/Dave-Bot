const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require("discord.js");

let gameActive = true;
let mult = 0;
let defBetTime = 5000; //10000
let betTimeLeft = defBetTime / 1000;
const multAmts = [
    1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.1, 3.4, 3.8, 4.2, 4.6, 4.8, 5.3, 5.8, 6.3, 5.8, 6.4, 7, 7.6, 8.2, 9, 10
]
let roundsPassed = 0;

//setup
let cleanupRound = 20

const toptimer = () => {
  console.log("start top func");
  let roundLength = 0;

  const gameLoop = () => {
    const runInterval = setInterval(() => {
      mult++;
      console.log(`round ${mult}`);
      if (mult === roundLength) {
        clearInterval(runInterval);
        gameActive = false;
        startGame();
      }
    }, 1000);
  };

  const startGame = () => {
    // place bets while gameActive is false
    console.log("betting time");
    gameActive = true;
    roundLength = Math.floor(Math.random() * multAmts.length) + 1;
    console.log(`round length: ${roundLength}`);
    mult = 0;
    setInterval(() => {
        betTimeLeft--;
    }, 1000);
    setTimeout(() => {
      betTimeLeft = defBetTime / 1000;
      gameLoop();
    }, defBetTime);
  };

  setTimeout(() => {
    startGame();
  }, 2000); //5000
};

const playTopTimer = async (interaction) => {
  const user = interaction.user;
  let currMult = mult;
  let firstMsg = true;
  let currBet = 0;
  console.log('first here')

  const sendUpdate = async () => {
    const gameEmbed = new EmbedBuilder().setTitle(`Time the top!\n🕒  x${multAmts[currMult]}  🕒`);
    const betButton = new ButtonBuilder()
        .setCustomId('betButton')
        .setLabel('Confirm Bet')
        .setStyle(ButtonStyle.Danger)
    const quitButton = new ButtonBuilder()
        .setCustomId('quitButton')
        .setLabel('Quit')
        .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(
        betButton,
        quitButton
    )

    let msg;

        if (gameActive) {
            gameEmbed.setDescription(`Round in progress!\nConfirm your bet: 💦 ${currBet}`);
        }
        else (
            gameEmbed.setDescription(`Confirm your bet: 💦 ${currBet}`)
        )
    
        if (firstMsg) {
            firstMsg = false;
            msg = await interaction.reply({
                embeds: [gameEmbed],
                components: [row1],
                ephemeral: true,
              });

            const topBetFilter = i => {
                console.log(i.author)
                if (i.author.id === user.id && parseInt(i.content)) return true;
            }
        
            const topButtonFilter = i => {
                return i.user.id === user.id;
            }
        
            const topBetCollector = interaction.channel.createMessageCollector({
                filter: topBetFilter,
                time: 30000
            })
        
            topBetCollector.on('collect', async i => {
                currBet = Math.floor(parseInt(i.content));
                gameEmbed.setDescription(`Confirm Bet: 💦 ${currBet}`);
                msg = await interaction.editReply({
                    embeds: [gameEmbed],
                    components: [row1]
                })
            })
        }
        else {
            msg = await interaction.editReply({
                embeds: [gameEmbed],
                components: [row1]
              });
        }
  };

  setInterval(async () => {
    if (mult !== currMult) {
        console.log('here')
      currMult = mult;
      await sendUpdate();
    }
  }, 200);
};

module.exports = { toptimer, playTopTimer };
