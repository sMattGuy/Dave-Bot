const { Users } = require('../DB/functions/dbObjects.js');
const { EmbedBuilder } = require('@discordjs/builders');

async function process_keno(client){
  const payouts = [10,48,284,2000,9000,20000]
  const winning_numbers = await generate_numbers()
  
  const players = [];
  let player_count = 0;
  let any_players = false;

  let winners = [{name:"No one!",amount:0},{name:"No one!",amount:0},{name:"No one!",amount:0}];
  let winner_count = 0;

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 1);

  const users = await Users.findAll();
  
  users.forEach(
    async (user) => {
      const userKenoDate = new Date(user.keno_date);
      if(userKenoDate !== undefined){
        if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
          any_players = true;
          player_count += 1;
          const user_numbers = user.keno_numbers.split(",");
          let matches = await count_matches(winning_numbers, user_numbers);
          if(matches >= 5){
            winner_count += 1;
            const payout = payouts[matches - 5];
            players.push([user.user_id,payout,matches]);
            user.karma += payout;
            await user.save();
            let username = await client.users.fetch(user.user_id).catch(() => null);
            if(username){
              username = username.username;
            }
            else{
              username = user.user_id;
            }
            if(payout > winners[0].amount){
              winners[2] = winners[1];
              winners[1] = winners[0];
              winners[0].name = username;
              winners[0].amount = payout;
            }
            else if(payout > winners[1].amount){
              winners[2] = winners[1];
              winners[1].name = username;
              winners[1].amount = payout;
            }
            else if(payout > winners[2].amount){
              winners[2].name = username;
              winners[2].amount = payout;
            }
          }
          else{
            players.push([user.user_id,0,matches]);
          }
        }
      }
    }
  );
  if(any_players){
    const numbersEmbed = new EmbedBuilder()
      .setTitle(`This hours Karma Keno numbers are...`)
      .setDescription(`${winning_numbers.toString()}`)
      .addFields({name:'Results', value:`Of ${player_count} ${player_count==1?'player':'players'}, ${winner_count} won!`})
      .addFields({name:'1st Place', value:winners[0].name, inline:true},{name:'2nd Place', value:winners[1].name, inline:true},{name:'3rd Place', value:winners[2].name, inline:true});
    const message_channel = await client.channels.fetch('119870239298027520').catch(() => {console.log('couldnt print winning numbers')})
    message_channel.send({embeds: [numbersEmbed]});
    players.forEach(
      async (player) => {
        const user_dm = await client.users.fetch(player[0]).catch(() => null);
        if(user_dm){
          if(player[1] > 0){
            await user_dm.send(`Your Karma Keno ticket won with ${player[2]} matches! You got ${player[1]} Karma!`).catch(() => {});
          }
          else{
            await user_dm.send(`Your Karma Keno ticket had ${player[2]} ${player[2]==1?"match":"matches"}! Try again soon!`).catch(() => {});
          }
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
  arr.sort(function(a,b){return a-b});
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
