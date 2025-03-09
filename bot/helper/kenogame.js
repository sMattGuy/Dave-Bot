const { Users } = require('../DB/functions/dbObjects.js');
const { EmbedBuilder } = require('@discordjs/builders');

async function process_keno(client){
  const payouts = [10,48,284,2000,9000,20000]
  const winning_numbers = await generate_numbers()
  
  const players = [];
  let any_players = false;

  let winners = [["No one!",0],["No one!",0],["No one!",0]];
  let winner_count = 0;

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 1);

  const users = await Users.findAll();
  
  for(let i=0;i<users.length;i++){
    let user = users[i];  
    const userKenoDate = new Date(user.keno_date);
    if(userKenoDate !== undefined){
      if(currentDate.getHours() == userKenoDate.getHours() && currentDate.getDate() == userKenoDate.getDate()){
        any_players = true;
        const user_numbers = user.keno_numbers.split(",");
        let matches = await count_matches(winning_numbers, user_numbers);
        if(matches >= 5){
          winner_count += 1;
          const payout = payouts[matches - 5];
          players.push([user.user_id,payout,matches]);
          user.karma += payout;
          let username = await client.users.fetch(user.user_id).catch(() => null);
          if(username){
            username = username.username;
          }
          else{
            username = user.user_id;
          }
          if(payout > winners[0][1]){
            winners[2] = winners[1].slice(0,2);
            winners[1] = winners[0].slice(0,2);
            winners[0][0] = username;
            winners[0][1] = payout;
          }
          else if(payout > winners[1][1]){
            winners[2] = winners[1].slice(0,2);
            winners[1][0] = username;
            winners[1][1] = payout;
          }
          else if(payout > winners[2][1]){
            winners[2][0] = username;
            winners[2][1] = payout;
          }
        }
        else{
          players.push([user.user_id,0,matches]);
        }
        user.keno_date = 0;
        await user.save();
      }
    }
  }
  if(any_players){
    const numbersEmbed = new EmbedBuilder()
      .setTitle(`This hours Karma Keno numbers are...`)
      .setDescription(`${winning_numbers.toString()}`)
      .addFields({name:'Results', value:`Of ${players.length} ${players.length==1?'player':'players'}, ${winner_count} won!`})
      .addFields({name:'1st Place', value:winners[0][0], inline:true},{name:'2nd Place', value:winners[1][0], inline:true},{name:'3rd Place', value:winners[2][0], inline:true});
    const message_channel = await client.channels.fetch('119870239298027520').catch(() => {console.log('couldnt print winning numbers')})
    message_channel.send({embeds: [numbersEmbed]});
    for(let i=0;i<players.length;i++){
      let player = players[i];
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
  }
  else{
    console.log(`no keno this hour ${currentDate}`)
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
