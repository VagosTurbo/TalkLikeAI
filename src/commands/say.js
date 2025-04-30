// Import required Discord.js modules and ElevenLabs utility
const { SlashCommandBuilder } = require('discord.js');
const { generateVoice } = require('../utils/elevenlabs');

// Export the command module
module.exports = {
    // Define the slash command data
    data: new SlashCommandBuilder()
        .setName('say')                      // Command name
        .setDescription('Generate AI voice from text')  // Command description
        .addStringOption(option =>           // Add a required text input option
            option.setName('text')
                .setDescription('The text to convert to speech')
                .setRequired(true)),
    
    // Command execution handler
    async execute(interaction) {
        // Get the text input from the user
        const text = interaction.options.getString('text');
        
        try {
            // Defer the reply as voice generation might take some time
            await interaction.deferReply();
            
            // Generate voice using ElevenLabs API
            const audioBuffer = await generateVoice(text);
            
            // TODO: Send the audio buffer back to Discord
            // Currently just sends a success message
            await interaction.editReply('Voice generated successfully!');
        } catch (error) {
            // Log error and notify user if something goes wrong
            console.error('Error generating voice:', error);
            await interaction.editReply('There was an error generating the voice.');
        }
    },
}; 