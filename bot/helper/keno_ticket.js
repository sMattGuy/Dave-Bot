const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas');

GlobalFonts.registerFromPath('./fonts/vga.ttf','Terminal')
GlobalFonts.registerFromPath('./fonts/vgasmall.ttf','TerminalSmall')

const tri_date = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const tri_month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

async function makeTicket(numbers, day, month, date, time){
  const canvas = Canvas.createCanvas(400,350);
  const context = canvas.getContext('2d')
  
  const background = await Canvas.loadImage('./images/karmakenoticket.png');
  context.drawImage(background,0,0,canvas.width,canvas.height);

  context.font = '30px Terminal';
  context.fillStyle = '#000000';

  let numbers_string_top = "";
  let numbers_string_bot = "";
  const numbers_array = numbers.split(',');
  for(i=0;i<numbers_array.length;i++){
    let number = numbers_array[i];
    if(parseInt(number) < 10){
      number = '0'+number;
    }
    
    if(i > 4){
      context.fillText(number,((i-5)*65)+48,155);
    }
    else{
      context.fillText(number,(i*65)+48,125);
    }
  }

  context.font = '24px TerminalSmall';
  const date_line = `${tri_date[day]} ${tri_month[month]}${date} ${time}`;
  context.fillText(date_line,105,215)

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'keno-ticket.png' });

  return attachment;
}

module.exports = {makeTicket}
