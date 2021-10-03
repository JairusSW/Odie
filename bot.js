const Discord = require('discord.js')
const { Intents } = require('discord.js')
const undici = require('undici')
const ytdl = require('ytdl-core')
const voice = require('@discordjs/voice')
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL', 'MESSAGE'] })
const { bot1, bot2, bot3, bot4, bot5, prefix } = require('./config.json')
const Weky = require('weky')

client.on('messageCreate', async message => {
    if (message.author.bot) return
    if (!message.content.trimLeft().startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    if (command == 'play') {
        const url = (await ytdl.getInfo(args[0])).formats.find(v => v.mimeType == "audio/webm; codecs=\"opus\"").url
        const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        const stream = (await undici.request(url)).body
        const resource = voice.createAudioResource(stream, {
            inputType: 'webm/opus'
        })
        const player = voice.createAudioPlayer({
            behaviors: {
                noSubscriber: voice.NoSubscriberBehavior.Play
            }
        })
        player.play(resource)
        connection.subscribe(player)
    } else if (command == 'dl' || command == 'download') {
        const url = (await ytdl.getInfo(args[0])).formats.find(v => v.audioQuality == 'AUDIO_QUALITY_MEDIUM').url
        const embed = new Discord.MessageEmbed()
        embed.setTitle('Download')
        embed.setURL(url)
        embed.setColor('#2F3136')
        message.channel.send({ embeds: [embed] })
    } else if (command == 'calculator') {
        await Weky.Calculator({
            message: message,
            embed: {
                title: 'Calculator',
                color: '#5865F2',
                footer: message.author.username,
                timestamp: true,
            },
            disabledQuery: 'Calculator is disabled!',
            invalidQuery: 'The provided equation is invalid!',
            othersMessage: 'Only <@{{author}}> can use the buttons!', 
        });
    } else if (command == 'snake') {
        await Weky.Snake({
            message: message
        })
    }
})

client.on('ready', () => {
    console.log(`We have logged in as ${client.user.tag}!`)
})

client.login(bot1.token)