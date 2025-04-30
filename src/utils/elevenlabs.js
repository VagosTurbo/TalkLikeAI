// Import ElevenLabs API key from config
const { elevenLabsApiKey } = require('../config');

/**
 * Generates voice audio from text using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @returns {Promise<Buffer>} - Audio buffer containing the generated voice
 */
async function generateVoice(text) {
    // Make API request to ElevenLabs text-to-speech endpoint
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00TcvDq8ikWAM', {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',          // Request audio in MPEG format
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey   // API authentication
        },
        body: JSON.stringify({
            text: text,                      // Text to convert
            model_id: "eleven_monolingual_v1", // Voice model to use
            voice_settings: {
                stability: 0.5,              // Voice stability (0-1)
                similarity_boost: 0.5        // Voice similarity boost (0-1)
            }
        })
    });

    // Check if the API request was successful
    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    // Convert the audio response to a Buffer
    return Buffer.from(await response.arrayBuffer());
}

// Export the generateVoice function
module.exports = {
    generateVoice
}; 