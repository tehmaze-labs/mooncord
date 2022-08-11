import {CommandInteraction} from "discord.js";
import {getDatabase} from "../../../../Application";
import {LocaleHelper} from "../../../../helper/LocaleHelper";
import {PageHelper} from "../../../../helper/PageHelper";
import {EmbedHelper} from "../../../../helper/EmbedHelper";

export class GcodeListCommand {
    protected databaseUtil = getDatabase()
    protected localeHelper = new LocaleHelper()
    protected syntaxLocale = this.localeHelper.getSyntaxLocale()
    protected embedHelper = new EmbedHelper()

    public constructor(interaction: CommandInteraction, commandId: string) {
        if(commandId !== 'listgcodes') { return }

        this.execute(interaction)
    }

    protected async execute(interaction: CommandInteraction) {
        await interaction.deferReply()

        const pageHelper = new PageHelper('gcode_files')
        const pageData = pageHelper.getPage(false, 1)

        const embed = await this.embedHelper.generateEmbed('gcode_files', pageData)

        await interaction.editReply(embed.embed)
    }
}