// Import required Discord.js modules and ElevenLabs utility
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { generateVoice } = require('../utils/elevenlabs');

// Define available voices
const VOICES = {
    'Rachel': '21m00Tcm4TlvDq8ikWAM',
    'Domi': 'AZnzlk1XvdvUeBnXmlld',
    'Bella': 'EXAVITQu4vr4xnSDxMaL',
    'Antoni': 'ErXwobaYiN019PkySvjV',
    'Elli': 'MF3mGyEYCl7XYWbV9V6O',
    'Josh': 'TxGEqnHWrfWFTfGW9XjX',
    'Arnold': 'VR6AewLTigWG4xSOukaG',
    'Adam': 'pNInz6obpgDQGcFmaJgB',
    'Sam': 'yoZ06aMxZJJ28mfd3POQ',
    'Callum': 'N2lVS1w4EtoT3dr4eOWO',
    'Patrick': 'ODq5zmih8GrVes37Dizd',
    'Harry': 'SOYHLrjzK2X1ezoPC6cr',
    'Lily': 'pFZP5JQG7iQjIQuC4Bku',
    'Thomas': 'v5EtHc0bwj3wkgmDaLxZ',
    'Charlie': 'IKne3meq5aSn9XLyUdCD',
    'George': 'JBFqnCBsd6RMkjVDRZzb',
    'Emily': 'LcfcDJNUP1GQjkzn1xUU',
    'Clyde': '2EiwWnXFnvU5JabPnv8n',
    'Paul': '5Q0t7uMcjvnagumLfvZi',
    'Arthur': 'jsCqWAovK2LkecY7zXl4',
    'Kyle': 'KqV3BtmUUnh4v8V6SXHr'
};

// Export the command module
module.exports = {
    // Define the slash command data
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Generate AI voice from text')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to convert to speech')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('voice')
                .setDescription('The voice to use')
                .setRequired(false)
                .addChoices(
                    ...Object.keys(VOICES).map(voice => ({
                        name: voice,
                        value: voice
                    }))
                )),

    // Command execution handler
    async execute(interaction, client) {
        // Get the text input from the user
        const text = interaction.options.getString('text');
        const voiceName = interaction.options.getString('voice') || 'George'; // Default to George if no voice selected
        
        const voiceChannelId = interaction.member.voice.channelId;
        const voiceChannel = client.channels.cache.get(voiceChannelId);

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }
        
        try {
            // Defer the reply as voice generation might take some time
            await interaction.deferReply();

            const player = createAudioPlayer();

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing!');
            });

            player.on('error', error => {
                return interaction.editReply('There was an error generating the voice.');
            });

            // Generate voice using ElevenLabs API with selected voice
            const audioBuffer = await generateVoice(text, VOICES[voiceName]);

            // Create and play audio
            const resource = createAudioResource(audioBuffer);
            player.play(resource);
            
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            if (!connection) {
                return interaction.editReply('Failed to connect to the voice channel.');
            }

            // Subscribe the connection to the audio player
            const subscription = connection.subscribe(player);

            // Stopped playing audio
            player.on(AudioPlayerStatus.Idle, () => {
                // Clean up
                connection.destroy();
                subscription.unsubscribe();
                return interaction.editReply(`Finished playing: "${text}" with voice ${voiceName}`);
            });
            
        } catch (error) {
            // Log error and notify user if something goes wrong
            console.error('Error generating voice:', error);
            await interaction.editReply('There was an error generating the voice.');
        }
    },
}; 