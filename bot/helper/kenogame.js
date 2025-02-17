const { Users } = require('../DB/functions/dbObjects.js');
const { EmbedBuilder } = require('@discordjs/builders');

async function process_keno(client){
  const payouts = [10,48,284,2000,9000,20000]
  const winning_numbers = await generate_numbers()
  
  const winners = [];
  let any_players = false

  const currentDate = new Date()
  currentDate.setHours(currentDate.getHours() - 1);

  const users = await Users.findAll()
  
  users.forEach(
    async (user) => {
      const userKenoDate = new Date(user.keno_date)
      if(userKenoDate !== undefined){
        if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
          any_players = true
          const user_numbers = user.keno_numbers.split(",");
          let matches = await count_matches(winning_numbers, user_numbers);
          if(matches >= 5){
            const payout = payouts[matches - 5];
            winners.push([user.user_id,payout]);
            user.karma += payout;
            await user.save()
          }
        }
      }
    }
  );
  if(any_players){
    const numbersEmbed = new EmbedBuilder()
      .setTitle(`This hours Karma Keno numbers are...`)
      .setDescription(`${winning_numbers.toString()}`);
    const message_channel = await client.channels.fetch('119870239298027520').catch(() => {console.log('couldnt print winning numbers')})
    message_channel.send({embeds: [numbersEmbed]});
    winners.forEach(
      async (winner) => {
        const user_dm = await client.users.fetch(winner[0]).catch(() => null);
        if(user_dm){
          await user_dm.send(`Your Karma Keno ticket won! You got ${winner[1]} Karma!`).catch(() => {});
        }
        else{
          console.log('failed to dm user');
        }
      }
    );
  }
  else{
    console.log('no keno this hour')
  }
}

async function generate_numbers(){
  let arr = [];
  while(arr.length < 20){
    let r = Math.floor(Math.random() * 80) + 1;
    if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

async function count_matches(arr1, arr2){
  let matches = 0;
  for(let i=0;i<arr1.length;i++){
    for(let j=0;j<arr2.length;j++){
      if(parseInt(arr1[i]) == parseInt(arr2[j])){
        matches++;
      }
    }
  }
  return matches;
}

module.exports = {process_keno}
