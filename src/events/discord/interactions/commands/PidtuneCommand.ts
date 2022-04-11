import {CommandInteraction, MessageAttachment} from "discord.js";
import * as CacheUtil from "../../../../utils/CacheUtil";
import * as path from "path";
import {getDatabase, getMoonrakerClient} from "../../../../Application";
import {LocaleHelper} from "../../../../helper/LocaleHelper";
import {getEntry} from "../../../../utils/CacheUtil";

export class PidtuneCommand {
    protected databaseUtil = getDatabase()
    protected localeHelper = new LocaleHelper()
    protected syntaxLocale = this.localeHelper.getSyntaxLocale()
    protected locale = this.localeHelper.getLocale()
    protected moonrakerClient = getMoonrakerClient()
    protected functionCache = getEntry('function')

    public constructor(interaction: CommandInteraction, commandId: string) {
        if(commandId !== 'pidtune') { return }

        this.execute(interaction)
    }

    protected async execute(interaction: CommandInteraction) {
        const temp = interaction.options.getInteger(this.syntaxLocale.commands.pidtune.options.temperature.name)
        const heater = interaction.options.getString(this.syntaxLocale.commands.pidtune.options.heater.name)

        if(this.functionCache.current_status !== 'ready') {
            await interaction.reply(this.locale.messages.errors.command_idle_only
                .replace(/(\${username})/g, interaction.user.tag))
            return
        }

        await interaction.reply(this.locale.messages.answers.pidtune_start
            .replace(/(\${heater})/g, heater)
            .replace(/(\${temp})/g, temp)
            .replace(/(\${username})/g, interaction.user.tag))

        const gcodeResponse = await this.moonrakerClient.send({"method": "printer.gcode.script", "params": {"script": `PID_CALIBRATE HEATER=${heater} TARGET=${temp}`}})

        if(typeof gcodeResponse.error !== 'undefined') {
            await interaction.editReply(this.locale.messages.errors.pidtune_fail
                .replace(/(\${heater})/g, heater)
                .replace(/(\${reason})/g, gcodeResponse.error.message)
                .replace(/(\${username})/g, interaction.user.tag))
            return
        }

        await interaction.reply(this.locale.messages.answers.pidtune_done
            .replace(/(\${heater})/g, heater)
            .replace(/(\${username})/g, interaction.user.tag))
    }
}