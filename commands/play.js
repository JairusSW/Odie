const play = require('play-dl')
const voice = require('@discordjs/voice')
module.exports = {
    name: 'play',
    async execute(message, args) {
        const url = args[0]//(await play.validate(args[0])) ? args[0] : await play.search(args.join(' '))
        const stream = await play.stream(url)
        const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        
        const resource = voice.createAudioResource(stream.stream, {
            inputType: stream.type
        })

        const player = voice.createAudioPlayer({
            behaviors: {
                noSubscriber: voice.NoSubscriberBehavior.Play
            }
        })

        player.play(resource)
        connection.subscribe(player)
    }
}