// Load environment variables from .env file
require('dotenv').config();

// Export configuration object with environment variables
module.exports = {
    // Discord Bot Configuration
    clientId: process.env.CLIENT_ID,        // Discord Application Client ID
    guildId: process.env.GUILD_ID,          // Discord Server (Guild) ID
    token: process.env.DISCORD_TOKEN,       // Discord Bot Token
    
    // ElevenLabs API Configuration
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY  // ElevenLabs API Key for text-to-speech
}; 