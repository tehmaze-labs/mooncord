const logSymbols = require('log-symbols')
const { SlashCommandBuilder } = require('@discordjs/builders')

const components = require('../../utils/hsComponents')
const loadUtil = require('../../utils/loadUtil')
const locale = require('../../utils/localeUtil')
const variablesUtil = require('../../utils/variablesUtil')

const messageLocale = locale.commands.loadinfo
const syntaxLocale = locale.syntaxlocale.commands.loadinfo

module.exports.command = () => {
    const choices = generateChoices()
    const command = new SlashCommandBuilder()
        .setName(syntaxLocale.command)
        .setDescription(messageLocale.description)
        .addStringOption(component =>
            component.setName(syntaxLocale.options.component.name)
            .setDescription(messageLocale.options.component.description)
            .setRequired(true)
            .addChoices(choices))
    return command.toJSON()
}

module.exports.reply = async (interaction) => {
    try {
        await interaction.deferReply()

        const component = interaction.options.getString(syntaxLocale.options.component.name)

        let answer

        if (component.startsWith('mcu')) {
            answer = await retrieveMCUComponent(component)
        } else {
            answer = await loadUtil.getInformation(component)
        }

        await interaction.editReply(answer)
    } catch (error) {
        console.log(logSymbols.error, `Load Info Command: ${error}`.error)
        await interaction.editReply(locale.errors.command_failed)
    }
}
function generateMCUNoData(mcu, embed) {
    const description = locale.errors.no_data
        .replace(/(\${component})/g, `\`${mcu}\``)
    embed.setDescription(description)
    embed.setColor('#c90000')
    return embed

}
async function retrieveMCUComponent(mcu) {
    const template = loadUtil.getDefaultEmbed('mcu', mcu)
    const embed = template.embeds[0]

    const mcudata = variablesUtil.getMCUList()[mcu]

    if ( typeof(mcudata) === 'undefined' ) { return [template[0], generateMCUNoData(mcu, embed)] }
    if (JSON.stringify(mcudata) === '{}') { return [template[0], generateMCUNoData(mcu, embed)] }

    const mcuload = (mcudata.last_stats.mcu_task_avg + 3 * mcudata.last_stats.mcu_task_stddev) / 0.0025
    const mcuawake = mcudata.last_stats.mcu_awake / 5
    const mcufreq = mcudata.last_stats.freq / Number.parseInt('1000000')

    embed.addField(locale.loadinfo.mcu.chipset, mcudata.mcu_constants.MCU, true)
    embed.addField(locale.loadinfo.mcu.version, mcudata.mcu_version, true)
    embed.addField(locale.loadinfo.mcu.load, mcuload.toFixed(1), true)
    embed.addField(locale.loadinfo.mcu.awake, mcuawake.toFixed(1), true)
    embed.addField(locale.loadinfo.mcu.frequency, `${mcufreq.toFixed(1)} MHz`, true)

    return { embeds: [embed], files: template.files }
}
function generateChoices() {
    console.log('generating choices')
    const componentlist = components.choices()
    const mculist = variablesUtil.getMCUList()
    Object.keys(mculist).forEach(key => {
        componentlist.push({name: key.toUpperCase(), value: key})
    })
    return componentlist
}
