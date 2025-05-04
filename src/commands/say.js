// Import required Discord.js modules and ElevenLabs utility
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { generateVoice } = require('../utils/elevenlabs');

// Define available voices
const VOICES = {
    'Robert Fico': 'YcndghbEfQRyTRbIwocp',
    'Rytmus': 'QmXCknqEIMbLRX3tAWjP',
    'Separ': 'XtTOMAyVffiwI9YtkkMn',
    'Rachellka': 'XAouT5swI4e8WafLH21y',
    'Restt': 'J5rs348snnmGLpVkaTDx',
    'Boborovský': 'uLtwmHA6LXFyWCuOGK20',
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

// Queue system
const queue = new Map();

// Function to process the queue
async function processQueue(guildId) {
    const serverQueue = queue.get(guildId);
    if (!serverQueue || serverQueue.playing) return;

    if (serverQueue.voiceRecords.length === 0) {
        // Only disconnect when queue is empty
        if (serverQueue.connection) {
            serverQueue.connection.destroy();
            serverQueue.connection = null;
        }
        queue.delete(guildId);
        return;
    }

    serverQueue.playing = true;
    const voiceRecord = serverQueue.voiceRecords[0];

    try {
        const player = createAudioPlayer();
        const audioBuffer = await generateVoice(voiceRecord.text, VOICES[voiceRecord.voiceName]);
        const resource = createAudioResource(audioBuffer);
        
        player.on(AudioPlayerStatus.Playing, () => {
            console.log(`Playing: ${voiceRecord.text} using ${voiceRecord.voiceName} voice`);
        });

        player.on('error', error => {
            console.error('Audio player error:', error);
            voiceRecord.interaction.editReply('There was an error playing the audio.');
            processNext(guildId);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            processNext(guildId);
        });

        player.play(resource);
        serverQueue.player = player;
        
        // Only join voice channel if not already connected
        if (!serverQueue.connection) {
            const connection = joinVoiceChannel({
                channelId: voiceRecord.voiceChannel.id,
                guildId: voiceRecord.guildId,
                adapterCreator: voiceRecord.voiceChannel.guild.voiceAdapterCreator,
            });

            if (!connection) {
                voiceRecord.interaction.editReply('Failed to connect to the voice channel.');
                processNext(guildId);
                return;
            }

            serverQueue.connection = connection;
        }

        // Subscribe the connection to the audio player
        const subscription = serverQueue.connection.subscribe(player);
        serverQueue.subscription = subscription;

    } catch (error) {
        console.error('Error processing queue:', error);
        voiceRecord.interaction.editReply('There was an error processing your request.');
        processNext(guildId);
    }
}

// Function to process next song in queue
function processNext(guildId) {
    const serverQueue = queue.get(guildId);
    if (!serverQueue) return;

    // Clean up current player and subscription
    if (serverQueue.subscription) {
        serverQueue.subscription.unsubscribe();
    }
    if (serverQueue.player) {
        serverQueue.player.stop();
    }

    // Remove the current song
    serverQueue.voiceRecords.shift();
    serverQueue.playing = false;

    // Process next song if available
    if (serverQueue.voiceRecords.length > 0) {
        processQueue(guildId);
    } else {
        // Only disconnect when queue is empty
        if (serverQueue.connection) {
            serverQueue.connection.destroy();
            serverQueue.connection = null;
        }
        queue.delete(guildId);
    }
}

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
        try {
            // Check if the user is in a voice channel
            if (!interaction.member?.voice?.channelId) {
                return interaction.reply({ 
                    content: 'You need to be in a voice channel to use this command!', 
                    ephemeral: true 
                });
            }

            // Get the voice channel
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                return interaction.reply({ 
                    content: 'Could not find your voice channel. Please try again.', 
                    ephemeral: true 
                });
            }

            // Check if the bot has permission to join and speak in the channel
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions.has('Connect') || !permissions.has('Speak')) {
                return interaction.reply({ 
                    content: 'I need permission to join and speak in your voice channel!', 
                    ephemeral: true 
                });
            }

            // Get the text input from the user
            const text = interaction.options.getString('text');
            const voiceName = interaction.options.getString('voice') || 'George'; // Default to George if no voice selected

            // Defer the reply as voice generation might take some time
            await interaction.deferReply();

            // Create or get the server queue
            if (!queue.has(interaction.guild.id)) {
                queue.set(interaction.guild.id, {
                    voiceRecords: [],
                    playing: false,
                    player: null,
                    connection: null,
                    subscription: null
                });
            }

            const serverQueue = queue.get(interaction.guild.id);

            // Add the song to the queue
            serverQueue.voiceRecords.push({
                text,
                voiceName,
                voiceChannel,
                guildId: interaction.guild.id,
                interaction
            });

            // Update the user about their position in the queue
            const position = serverQueue.voiceRecords.length;
            if (position === 1) {
                await interaction.editReply(`Your request is being processed now!`);
            } else {
                await interaction.editReply(`Your request has been added to the queue. Position: ${position}`);
            }

            // Start processing the queue if not already playing
            if (!serverQueue.playing) {
                processQueue(interaction.guild.id);
            }
            
        } catch (error) {
            console.error('Error in say command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: 'There was an error executing this command!', 
                    ephemeral: true 
                });
            } else {
                await interaction.editReply('There was an error executing this command!');
            }
        }
    },
}; 