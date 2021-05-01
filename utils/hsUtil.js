const Discord = require('discord.js')
const path = require('path')
const fs = require('fs')
const si = require('systeminformation')

const componentHandler = require('./hsComponents')

module.exports.getInformation = async function (component) {
  const img = getImage(component)
  const componentData = componentHandler[component]
  const fields = await componentData.getFields()
  const embed = getDefaultEmbed(img[0], componentData.getTitle())
  if (fields.length !== 0) {
    for (let fieldindex in fields) {
      let field = fields[fieldindex]
      embed.addField(field.name, field.value, field.inline)
    }
  } else {
    embed.setColor('#c90000')
    embed.setDescription(`There are currently no ${componentData.getTitle()} data available`)
  }
  return [img, embed]
}

module.exports.init = async () => {
  setInterval(async () => {
    await si.currentLoad()
  }, 1000)
}

function getImage(component) {
        
  const imgPath = path.resolve(__dirname, `../images/${component}.png`)
  const imgBuffer = fs.readFileSync(imgPath)

  return [`${component}.png`, imgBuffer]
}

function getDefaultEmbed(img,title) {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(title)
    .setThumbnail(`attachment://${img}`)
  return embed
}