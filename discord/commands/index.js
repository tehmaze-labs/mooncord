const emergencyStop = require('./emergencyStop')

module.exports.addCommandEvents = async (discordClient) => { await loadSlashCommands(discordClient) }
module.exports.loadSlashCommands = (discordClient) => {}

async function loadSlashCommands(discordClient) {
    console.log(await discordClient.application?.commands.create(emergencyStop.command))
}