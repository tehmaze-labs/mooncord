import { Collection, Message, MessagePayload, TextChannel } from "discord.js"
import * as app from "../Application"
import { DiscordClient } from "../clients/DiscordClient"
import { LocaleHelper } from "./LocaleHelper"

export class NotificationHelper {
    protected databaseUtil = app.getDatabase()
    protected broadcastList = {}
    protected notifyList = []
    protected discordClient: DiscordClient
    protected localeHelper = new LocaleHelper()
    protected locale = this.localeHelper.getLocale()

    protected getEntries() {
        if(!this.databaseUtil.isReady()) { return false }

        this.discordClient = app.getDiscordClient()
        this.broadcastList = this.databaseUtil.getDatabaseEntry('guilds')
        this.notifyList = this.databaseUtil.getDatabaseEntry('notify')

        return true
    }
    
    public broadcastMessage(message) {
        if(!this.getEntries()) { return }

        this.broadcastGuilds(message)
        void this.notifyUsers(message)
    }

    protected async notifyUsers(message) {
        if(this.discordClient === null) { return }
        for(const userId of this.notifyList) {
            const user = await this.discordClient.getClient().users.fetch(userId)

            const channel = user.dmChannel

            if(channel === null) {
                await user.send(message)
                return
            }

            this.broadcastChannels([user.dmChannel], message)
        }
    }

    protected async broadcastGuilds(message) {
        for(const guildId in this.broadcastList) {
            const guildMeta = this.broadcastList[guildId]
            const guild = await this.discordClient.getClient().guilds.fetch(guildId)

            const channels = guild.channels.cache.filter(
                (channel) => {return guildMeta.broadcast_channels.includes(channel.id)})

            this.broadcastChannels(channels, message)
        }
    }

    protected async broadcastChannels(channels,message) {
        for(let channel of channels) {
            if(channel.constructor.name === 'Array') {
                channel = channel[1]
            }
            await this.removeOldStatus(channel)

            await channel.send(message)
        }
    }

    protected async removeOldStatus(channel: TextChannel) {
        if(typeof channel.messages === 'undefined') { return }

        const messages = await channel.messages.fetch({limit: 1})
        const lastMessage = messages.first()

        //if (lastMessage.author.id === this.discordClient.getClient().user.id) { return }
        if (lastMessage.deleted) { return }
        if (lastMessage.embeds.length === 0) { return }
        if (typeof(lastMessage.embeds[0]) === 'undefined') { return }
        if (lastMessage.embeds[0].title !== this.locale.embeds.printjob_printing.title) { return }

        await lastMessage.delete()
    }
}