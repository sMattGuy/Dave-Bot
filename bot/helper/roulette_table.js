const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas');

// 75,65 is top left of grid

async function makeTable(numbers, winning_number){
  const canvas = Canvas.createCanvas(664,310);
  const context = canvas.getContext('2d')
  
  const background = await Canvas.loadImage('./images/roulettetable.png');
  const dave_icon = await Canvas.loadImage('./images/dave.png');
  context.drawImage(background,0,0,canvas.width,canvas.height);

  for(i=0;i<numbers.length;i++){
    let number = numbers[i];
    if(number == 0){
      context.drawImage(dave_icon,20,160,45,64);
    }
    else if(number == -1){
      context.drawImage(dave_icon,20,80,45,64);
    }
    else{
      let x_offset = Math.ceil(number /3) - 1
      let y_offset = number % 3
      if(y_offset == 2){
        y_offset = 1;
      }
      else if(y_offset == 1){
        y_offset = 2;
      }

      let x_position = 66 + (x_offset * 45.75);
      let y_position = 54 + (y_offset * 66);

      context.drawImage(dave_icon,x_position,y_position,45,64);
    }
  }
  
  context.fillStyle = '#edc13e99';
  context.strokeStyle = '#edc13e';

  let x_offset = Math.ceil(winning_number /3) - 1
  let y_offset = winning_number % 3
  if(y_offset == 2){
    y_offset = 1;
  }
  else if(y_offset == 1){
    y_offset = 2;
  }

  let x_position = 66 + (x_offset * 45.75);
  let y_position = 54 + (y_offset * 66);
  
  if(winning_number == 0){
    context.fillRect(20,160,45,64);
  }
  else if(winning_number == -1){
    context.fillRect(20,80,45,64);
  }
  else{
    context.fillRect(x_position,y_position,45,64)
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'keno-ticket.png' });

  return attachment;
}

module.exports = {makeTable}
