const fs = require('fs')
const Discord = require('discord.js')
const { Intents } = require('discord.js')
const voice = require('@discordjs/voice')
require('dotenv').config()
const { bot1, bot2, bot3, bot4, bot5, prefix } = JSON.parse(process.env.secrets)
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL', 'MESSAGE'] })
client.commands = new Map()
client.connections = new Map()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.content.trimLeft().startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    if (!client.commands.has(command)) return

    try {
        await client.commands.get(command).execute(message, args)
    } catch (error) {
        console.error(error)
        await message.channel.send('An error occured')
    }
})

client.once('ready', () => {
    console.log('Ready!')
})

client.login(bot1.token)