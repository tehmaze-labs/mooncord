const { SlashCommand } = require('slash-create');
const Discord = require('discord.js')
const pjson = require('../package.json')
const path = require('path')
const core = require('../mooncord')
const fs = require('fs')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            guildIDs: '626717239210672139',
            name: 'info',
            description: 'Send a Description about me.'
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            const description = `Version: ${pjson.version}\n
                Author: ${pjson.author}\n
                Homepage: ${pjson.homepage}\n`
            
            const logopath = path.resolve(__dirname, '../images/logo.png')

            const attachment = new Discord.MessageAttachment(fs.readFileSync(logopath))

            console.log(fs.readFileSync(logopath))

            const infoEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Informations')
                .setAuthor(core.getDiscordClient().user.tag, core.getDiscordClient().user.avatarURL())
                .setDescription(description)
                .attachFiles(attachment)
                .setThumbnail('attachment://logo.png')

            ctx.send({
                content: 'test',
                file: {
                    name: 'logo.png',
                    file: fs.readFile(logopath)
                },
                embeds: [infoEmbed.toJSON()]
            });
        }
        catch (err) {
            console.log(err)
            return "Error!"
        }
    }
}